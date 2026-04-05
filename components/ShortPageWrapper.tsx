'use client';

import { ReactNode } from 'react';
import HeaderToolbar from './HeaderToolbar';
import HeaderContent from './HeaderContent';

interface ShortPageWrapperProps {
  children: ReactNode;
  lang: string;
  headerName: string;
  headerRole: string;
}

export default function ShortPageWrapper({
  children,
  lang,
  headerName,
  headerRole,
}: ShortPageWrapperProps) {
  return (
    <>
      <header className="relative z-[70] print:mb-2">
        <div className="print:hidden">
          <HeaderToolbar shortLang={lang} />
        </div>
        <HeaderContent name={headerName} role={headerRole} />
      </header>
      {children}
    </>
  );
}
