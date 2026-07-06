import Domain from '@/components/Domain';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { getCvData } from '@/lib/cv-data';
import { resolveDomainDescription, type CvMode } from '@/lib/cv-contract-text';
import type { ContractType } from '@/data/offers/types';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function domains({
  locale,
  contract,
  mode,
}: {
  locale: Locale;
  contract?: ContractType;
  mode?: CvMode;
}) {
  const data: any = await getCvData(locale);
  // Mobile : les domaines sont des SOUS-blocs du Profil, pas une section sœur
  // (même logique que le CV court, cf. CompactCvLayout `#domains`). Le margin-top
  // négatif remplace le flex-gap inter-section (--cv-section-gap) par un body-gap :
  // avec le body-gap propre au premier wrapper Domain, l'écart au-dessus d'« Agile »
  // = 2 × --cv-section-body-gap (16px) = l'écart titre→texte et l'écart entre
  // domaines (row-gap + body-gap). `max-md:mb-0` posé côté About pour ne pas
  // fausser ce calcul.
  return (
    <section
      id="domains"
      className="mt-2 print-preview:order-[20] print:order-[20] max-md:!mt-[calc(var(--cv-section-body-gap)-var(--cv-section-gap))]"
    >
      {/* Ancre de section « Compétences / Skills » réservée à l'impression :
          à l'écran ce titre est porté par la sidebar `skills.tsx` (donc pas de
          doublon) ; en PDF la sidebar est masquée, et ce titre donne aux ATS
          l'anchor « Skills » juste au-dessus des compétences (tags Agile/Dev/Ops). */}
      <div className="mb-2 hidden">
        <SectionHeadingAts
          section="skills"
          locale={locale}
          title={data?.skillsTitle?.title}
          accent="section"
          className="min-w-0"
        />
      </div>
      <div className="cv-domains-grid">
        {data?.allDomainsModels?.map((domain: any) => (
          <Domain
            key={domain.id}
            domain={{
              ...domain,
              description: resolveDomainDescription(domain, contract, mode),
            }}
          />
        ))}
      </div>
    </section>
  );
}
