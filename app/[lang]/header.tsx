import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import HeaderDesktopContactStrip from '@/components/HeaderDesktopContactStrip';
import ShortHeaderJobFitPills from '@/components/ShortHeaderJobFitPills';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React, { Suspense } from 'react';

export default async function Header({
  locale,
  offerPrintContactStrip,
}: {
  locale: Locale;
  /** Pages offre : bandeau coordonnées sous le rôle uniquement en aperçu `?print`. */
  offerPrintContactStrip?: {
    email: string;
    phone: string;
    location: string;
  };
}) {
  const data: any = await getCvData(locale);
  const defaultOfferId = process.env.SHORT_CV_OFFER_ID?.trim() || null;

  return (
    <header className="relative z-[70] print:mb-2">
      <div className="print:hidden">
        <HeaderToolbar />
      </div>

      <HeaderContent
        name={data?.header?.name}
        role={data?.header?.role}
        afterRole={
          offerPrintContactStrip ? (
            <div className="hidden w-full print-preview:block">
              <HeaderDesktopContactStrip
                email={offerPrintContactStrip.email}
                phone={offerPrintContactStrip.phone}
                location={offerPrintContactStrip.location}
                locale={locale}
              />
            </div>
          ) : undefined
        }
        belowRole={
          <Suspense fallback={null}>
            <ShortHeaderJobFitPills
              lang={locale}
              defaultOfferId={defaultOfferId}
            />
          </Suspense>
        }
      />
    </header>
  );
}
