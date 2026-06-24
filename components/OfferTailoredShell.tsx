import { Suspense } from 'react';
import About from '@/app/[lang]/about';
import Headers from '@/app/[lang]/header';
import Studies from '@/app/[lang]/studies';
import Domains from '@/app/[lang]/domains';
import Learnings from '@/app/[lang]/learnings';
import Hobbies from '@/app/[lang]/hobbies';
import Jobs from '@/app/[lang]/jobs';
import Projects from '@/app/[lang]/projects';
import JobFitSection from '@/components/JobFitSection';
import FullCvPrintPreviewEffect from '@/components/FullCvPrintPreviewEffect';
import ContactLocationProvider from '@/components/ContactLocationProvider';
import JobFrameworkDisplayProvider from '@/components/JobFrameworkDisplayProvider';
import { buildContactLocationHref } from '@/lib/contact-maps';
import type { ContactLocationOverlay } from '@/lib/offer-contact-from-params';
import type { EducationLevelContent } from '@/lib/education-level-content';
import ContactDisplay from '@/components/ContactDisplay';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import type { ContractType } from '@/data/offers/types';
import type { CvMode } from '@/lib/cv-contract-text';
import type { DetailLevel } from '@/lib/cv-detail-level';
import type { Locale } from 'i18n-config';
/**
 * Mise en page commune des pages CV « sur mesure » (custom / match).
 * Layout unifié : une seule colonne linéaire (identique à l'aperçu `?print=1`).
 * L'adéquation poste (pastilles) est uniquement sous le rôle / coordonnées via `Headers`.
 */

export default function OfferTailoredShell({
  lang,
  educationLevel,
  headerContactStrip,
  frameworkDisplayPriorityTokens = [],
  contactLocation,
  hideMalt,
  contract,
  mode,
  subtitleOverride,
  showEducationLevel = false,
  showPhoto = false,
  showAge = false,
  detailLevel = 'full',
}: {
  lang: Locale;
  educationLevel: EducationLevelContent;
  /** Coordonnées pour le bandeau sous le rôle en aperçu `?print` uniquement. */
  headerContactStrip: {
    email: string;
    phone: string;
    location: string;
  };
  /** Mots-clés / ids pour trier les pastilles techno par pertinence offre. */
  frameworkDisplayPriorityTokens?: string[];
  /** Lien Maps / itinéraire et durée affichée (optionnel). */
  contactLocation?: ContactLocationOverlay;
  /** Masquer le lien Malt (ex. offre CDI). */
  hideMalt?: boolean;
  /** Type de contrat : adapte les textes Profil et Domaines. */
  contract?: ContractType;
  /** Mode CV (`teaching` pour la variante enseignement). Affiche les missions/projets `displayMode=mode` et utilise les textes `*Teaching`. */
  mode?: CvMode;
  /** Surcharge du sous-titre (rôle) dans l'en-tête. */
  subtitleOverride?: string;
  /** Affiche la pastille « Bac+5 / Master's-level » dans la section adéquation. */
  showEducationLevel?: boolean;
  /** Afficher la photo de profil (param `?photo=1`). */
  showPhoto?: boolean;
  /** Afficher l'âge sous le rôle (param `?age=0` pour masquer). */
  showAge?: boolean;
  /** Niveau de détail des expériences (param `?detail=`). */
  detailLevel?: DetailLevel;
}) {
  const resolvedContact: ContactLocationOverlay = contactLocation ?? {
    mapsHref: buildContactLocationHref(),
    isDirections: false,
  };

  return (
    <JobFrameworkDisplayProvider
      priorityTokens={frameworkDisplayPriorityTokens}
    >
      <ContactLocationProvider value={resolvedContact} locale={lang}>
        <div className="cv-offer-tailored-shell">
          <Suspense fallback={null}>
            <FullCvPrintPreviewEffect />
          </Suspense>
          {/* @ts-expect-error Server Component */}
          <Headers
            locale={lang}
            offerPrintContactStrip={headerContactStrip}
            hideMalt={hideMalt}
            subtitleOverride={subtitleOverride}
            showPhoto={showPhoto}
            showAge={showAge}
          />

          <div className="cv-full-cv-print-root">
            <div className="mb-2 print-preview:order-[10] print:order-[10] max-md:contents">
              {/* @ts-expect-error Server Component */}
              <About
                locale={lang}
                educationLevel={educationLevel}
                contract={contract}
                mode={mode}
              />
              {/* @ts-expect-error Server Component */}
              <Domains locale={lang} contract={contract} mode={mode} />
            </div>
            {/* Adéquation poste : niveau de formation + compétences techniques */}
            <Suspense fallback={null}>
              <JobFitSection
                lang={lang}
                educationLevel={educationLevel}
                variant="full"
                showEducationLevel={showEducationLevel}
              />
            </Suspense>
            {/* Coordonnées : après Adéquation poste, même placement que le CV court. */}
            {headerContactStrip.email && (
              <section className="cv-mobile-section-mt print-preview:order-[30] print:order-[30]">
                <div className="border-b pb-1">
                  <SectionHeadingAts
                    section="contact"
                    locale={lang}
                    title={lang === 'fr' ? 'Coordonnées' : 'Contact'}
                    className="min-w-0 text-2xl font-semibold text-rose-300"
                  />
                </div>
                <ContactDisplay
                  contact={{
                    emailTitle: 'Email',
                    email: headerContactStrip.email,
                    phoneTitle: lang === 'fr' ? 'Téléphone' : 'Phone',
                    phone: headerContactStrip.phone,
                    locationTitle: lang === 'fr' ? 'Localisation' : 'Location',
                    location: headerContactStrip.location,
                  }}
                  cvShortInlineRows
                  showLabels={false}
                  locale={lang}
                />
              </section>
            )}
            {/* @ts-expect-error Server Component */}
            <Jobs locale={lang} mode={mode} detailLevel={detailLevel} />
            {/* @ts-expect-error Server Component */}
            <Studies locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Projects locale={lang} mode={mode} />
            {/* @ts-expect-error Server Component */}
            <Learnings locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Hobbies locale={lang} />
          </div>
        </div>
      </ContactLocationProvider>
    </JobFrameworkDisplayProvider>
  );
}
