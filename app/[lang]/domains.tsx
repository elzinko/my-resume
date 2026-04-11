import Domain from '@/components/Domain';
import { getCvData } from '@/lib/cv-data';
import { resolveDomainDescription } from '@/lib/cv-contract-text';
import type { ContractType } from '@/data/offers/types';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function domains({
  locale,
  contract,
}: {
  locale: Locale;
  contract?: ContractType;
}) {
  const data: any = await getCvData(locale);
  return (
    <section
      id="domains"
      className="mt-2 print-preview:order-[20] print:order-[20] max-md:!mt-0"
    >
      <div className="cv-domains-grid">
        {data?.allDomainsModels?.map((domain: any) => (
          <Domain
            key={domain.id}
            domain={{
              ...domain,
              description: resolveDomainDescription(domain, contract),
            }}
          />
        ))}
      </div>
    </section>
  );
}
