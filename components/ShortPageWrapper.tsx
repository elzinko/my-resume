'use client';

import { ReactNode } from 'react';
import HeaderToolbar, { HeaderToolbarLabels } from './HeaderToolbar';
import HeaderContent from './HeaderContent';

interface ShortPageWrapperProps {
  children: ReactNode;
  lang: string;
  headerName: string;
  headerRole: string;
  toolbarLabels?: HeaderToolbarLabels;
}

export default function ShortPageWrapper({
  children,
  lang,
  headerName,
  headerRole,
  toolbarLabels,
}: ShortPageWrapperProps) {
  return (
    <>
      <header className="relative z-[70] print:mb-2">
        <div className="print:hidden">
          <HeaderToolbar shortLang={lang} labels={toolbarLabels} />
        </div>
        <HeaderContent name={headerName} role={headerRole} />
      </header>
      {children}
    </>
  );
}
