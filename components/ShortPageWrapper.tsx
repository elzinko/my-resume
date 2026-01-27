'use client';

import { ReactNode } from 'react';
import LocaleSwitcher from './locale-switcher';
import LogoPrint from './logoPrint';
import LogoLinkedin from './LogoLinkedin';
import LogoGithub from './logoGithub';
import LogoMalt from './logoMalt';
import HeaderContent from './HeaderContent';
import Link from 'next/link';

interface ShortPageWrapperProps {
  children: ReactNode;
  lang: string;
  headerName: string;
  headerRole: string;
}

export default function ShortPageWrapper({ children, lang, headerName, headerRole }: ShortPageWrapperProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="print:mb-2">
        <div className="flex flex-row justify-between print:hidden">
          <LocaleSwitcher lang={{ locale: lang } as any} />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-1 rounded bg-blue-600 p-2 text-sm font-medium text-white transition-all hover:bg-blue-700 md:gap-2 md:px-3 md:py-1.5"
              title="Version complète"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="hidden md:inline">Version complète</span>
            </Link>
            <ul className="flex flex-wrap gap-2">
              <li>
                <LogoLinkedin />
              </li>
              <li>
                <LogoGithub />
              </li>
              <li>
                <LogoMalt />
              </li>
              <li>
                <LogoPrint onClick={handlePrint} />
              </li>
            </ul>
          </div>
        </div>
        <HeaderContent name={headerName} role={headerRole} />
      </header>
      {children}
    </>
  );
}
