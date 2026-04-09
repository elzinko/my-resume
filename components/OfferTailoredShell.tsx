import { Suspense } from 'react';
import About from '@/app/[lang]/about';
import Headers from '@/app/[lang]/header';
import Contact from '@/app/[lang]/contact';
import Studies from '@/app/[lang]/studies';
import Skills from '@/app/[lang]/skills';
import Domains from '@/app/[lang]/domains';
import Learnings from '@/app/[lang]/learnings';
import Hobbies from '@/app/[lang]/hobbies';
import Jobs from '@/app/[lang]/jobs';
import Projects from '@/app/[lang]/projects';
import EducationLevel from '@/components/EducationLevel';
import FullCvPrintPreviewEffect from '@/components/FullCvPrintPreviewEffect';
import ContactLocationProvider from '@/components/ContactLocationProvider';
import JobFrameworkDisplayProvider from '@/components/JobFrameworkDisplayProvider';
import { buildContactLocationHref } from '@/lib/contact-maps';
import type { ContactLocationOverlay } from '@/lib/offer-contact-from-params';
import type { EducationLevelContent } from '@/lib/education-level-content';
import type { Locale } from 'i18n-config';
/**
 * Mise en page commune des pages CV « sur mesure » (custom / match).
 * L’adéquation poste (pastilles) est uniquement sous le rôle / coordonnées via `Headers`.
 */
const OFFER_EDUCATION_LEVEL_SECTION_CLASS =
  'mt-10 max-md:mt-0 max-md:order-[20] md:order-[1] print:order-[50] print-preview:hidden print-preview:order-[50]';

export default function OfferTailoredShell({
  lang,
  educationLevel,
  headerContactStrip,
  frameworkDisplayPriorityTokens = [],
  contactLocation,
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
}) {
  const resolvedContact: ContactLocationOverlay =
    contactLocation ?? {
      mapsHref: buildContactLocationHref(),
      isDirections: false,
    };

  return (
    <JobFrameworkDisplayProvider priorityTokens={frameworkDisplayPriorityTokens}>
      <ContactLocationProvider value={resolvedContact} locale={lang}>
        <div className="cv-offer-tailored-shell">
          <Suspense fallback={null}>
            <FullCvPrintPreviewEffect />
          </Suspense>
          {/* @ts-expect-error Server Component */}
          <Headers
            locale={lang}
            offerPrintContactStrip={headerContactStrip}
          />

          <div className="cv-full-cv-print-root">
            <div className="cv-flow-mobile-stack">
              {/* @ts-expect-error Server Component */}
              <About locale={lang} educationLevel={educationLevel} />
              {/* @ts-expect-error Server Component */}
              <Domains locale={lang} />
            </div>

            <div className="cv-page-split max-md:gap-y-10">
              {/**
               * Mobile: `max-md:contents` fait de chaque enfant de #left un
               * item direct de `.cv-page-split` afin de pouvoir intercaler
               * #main (Jobs) AVANT Studies grâce à `max-md:order-*`.
               * Desktop/print: #left redevient un vrai bloc (`md:flex …`).
               */}
              <div
                id="left"
                className="min-w-0 max-md:contents md:order-first md:col-span-1 md:flex md:w-full md:flex-col print:order-first print:col-span-1"
              >
                <div className="cv-print-desktop-sidebar-group w-full max-md:order-[10]">
                  {/* @ts-expect-error Server Component */}
                  <Contact locale={lang} />
                </div>
                <EducationLevel
                  content={educationLevel}
                  sectionClassName={OFFER_EDUCATION_LEVEL_SECTION_CLASS}
                />
                <div className="contents max-md:block max-md:order-[50] print-preview:contents print:contents">
                  {/* @ts-expect-error Server Component */}
                  <Skills locale={lang} sectionId={false} />
                </div>
                <div className="contents max-md:block max-md:order-[40] print-preview:contents print:contents">
                  {/* @ts-expect-error Server Component */}
                  <Studies locale={lang} />
                </div>
                <div className="cv-print-desktop-tail-group max-md:order-[60] md:order-[4]">
                  {/* @ts-expect-error Server Component */}
                  <Projects locale={lang} />
                  {/* @ts-expect-error Server Component */}
                  <Learnings locale={lang} />
                  {/* @ts-expect-error Server Component */}
                  <Hobbies locale={lang} />
                </div>
              </div>
              <div
                id="main"
                className="w-full min-w-0 max-md:order-[30] print:col-span-2 md:col-span-2"
              >
                {/* @ts-expect-error Server Component */}
                <Jobs locale={lang} />
              </div>
            </div>
          </div>
        </div>
      </ContactLocationProvider>
    </JobFrameworkDisplayProvider>
  );
}
