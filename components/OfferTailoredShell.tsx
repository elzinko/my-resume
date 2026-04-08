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
export default function OfferTailoredShell({
  lang,
  educationLevel,
  frameworkDisplayPriorityTokens = [],
  contactLocation,
}: {
  lang: Locale;
  educationLevel: EducationLevelContent;
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
        <>
          {/* @ts-expect-error Server Component */}
          <Headers locale={lang} />

          <div className="cv-full-cv-print-root">
            <div className="cv-flow-mobile-stack">
              {/* @ts-expect-error Server Component */}
              <About locale={lang} educationLevel={educationLevel} />
              {/* @ts-expect-error Server Component */}
              <Domains locale={lang} />
            </div>

            <div className="cv-page-split">
              <div
                id="left"
                className="flex w-full min-w-0 flex-col print:order-first print:col-span-1 md:order-first md:col-span-1"
              >
                <div className="cv-print-desktop-sidebar-group hidden md:hidden">
                  {/* @ts-expect-error Server Component */}
                  <Contact locale={lang} sectionId={false} />
                </div>
                <EducationLevel content={educationLevel} />
                {/* @ts-expect-error Server Component */}
                <Skills locale={lang} sectionId={false} />
                {/* @ts-expect-error Server Component */}
                <Studies locale={lang} />
                <div className="cv-print-desktop-tail-group max-md:order-[4] md:order-[4]">
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
                className="w-full min-w-0 print:col-span-2 md:col-span-2"
              >
                {/* @ts-expect-error Server Component */}
                <Jobs locale={lang} />
              </div>
            </div>
          </div>
        </>
      </ContactLocationProvider>
    </JobFrameworkDisplayProvider>
  );
}
