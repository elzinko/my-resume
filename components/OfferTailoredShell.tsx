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
import type { ContractType } from '@/data/offers/types';
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
  subtitleOverride,
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
  /** Surcharge du sous-titre (rôle) dans l'en-tête. */
  subtitleOverride?: string;
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
          />

          <div className="cv-full-cv-print-root">
            <div className="mb-2 print-preview:order-[10] max-md:contents print:order-[10]">
              {/* @ts-expect-error Server Component */}
              <About
                locale={lang}
                educationLevel={educationLevel}
                contract={contract}
              />
              {/* @ts-expect-error Server Component */}
              <Domains locale={lang} contract={contract} />
            </div>
            {/* Adéquation poste : niveau de formation + compétences techniques */}
            <Suspense fallback={null}>
              <JobFitSection
                lang={lang}
                educationLevel={educationLevel}
                variant="full"
              />
            </Suspense>
            {/* Coordonnées : après Adéquation poste, même placement que le CV court. */}
            {headerContactStrip.email && (
              <section className="cv-mobile-section-mt print-preview:order-[30] print:order-[30]">
                <div className="border-b pb-1">
                  <h2 className="min-w-0 text-2xl font-semibold text-rose-300">
                    {lang === 'fr' ? 'Coordonnées' : 'Contact'}
                  </h2>
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
            <Jobs locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Studies locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Projects locale={lang} />
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
