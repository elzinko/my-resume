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
  return (
    <section
      id="domains"
      className="mt-2 print-preview:order-[20] print:order-[20] max-md:!mt-0"
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
