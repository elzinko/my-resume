'use client';

import React, { useCallback, useEffect, useId, useState } from 'react';
import Link from 'next/link';
import LocaleSwitcher from '@/components/locale-switcher';
import CvModeToggle from '@/components/CvModeToggle';
import LogoLinkedin from '@/components/LogoLinkedin';
import LogoGithub from '@/components/logoGithub';
import LogoMalt from '@/components/logoMalt';
import LogoPrint from '@/components/logoPrint';
import { cvHeaderModeBtn } from '@/lib/cv-header-toolbar';

const rowListClass =
  'flex flex-nowrap items-center gap-0.5 [&>li]:shrink-0';

function ToolbarIconList({
  onNavigate,
  listClassName = 'flex flex-wrap gap-2',
}: {
  onNavigate?: () => void;
  listClassName?: string;
}) {
  const handlePrint = () => {
    onNavigate?.();
    window.print();
  };

  return (
    <ul className={listClassName}>
      <li>
        <LogoLinkedin onNavigate={onNavigate} />
      </li>
      <li>
        <LogoGithub onNavigate={onNavigate} />
      </li>
      <li>
        <LogoMalt onNavigate={onNavigate} />
      </li>
      <li>
        <LogoPrint onClick={handlePrint} />
      </li>
    </ul>
  );
}

function ModeControl({
  shortLang,
  onNavigate,
}: {
  shortLang?: string;
  onNavigate?: () => void;
}) {
  if (shortLang) {
    return (
      <Link
        href={`/${shortLang}`}
        className={`${cvHeaderModeBtn} print:hidden`}
        title="Version complète"
        onClick={() => onNavigate?.()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 md:h-5 md:w-5"
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
    );
  }
  return (
    <CvModeToggle
      labels={{
        full: 'Version complète',
        compact: 'Version courte',
      }}
      onNavigate={onNavigate}
    />
  );
}

/**
 * Desktop : langues à gauche, actions à droite.
 * Mobile : barre fixe en haut ; ouvert = langues à gauche | séparateur | actions + menu à droite.
 */
export default function HeaderToolbar({ shortLang }: { shortLang?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <>
      <div
        className="hidden print:hidden md:flex md:w-full md:flex-row md:items-center md:justify-between"
        data-testid="cv-header-toolbar"
      >
        <LocaleSwitcher />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ModeControl shortLang={shortLang} />
          <ToolbarIconList />
        </div>
      </div>

      {/* Réserve la hauteur : la barre mobile est en position fixed */}
      <div className="h-12 w-full shrink-0 md:hidden" aria-hidden />

      <div
        className="fixed inset-x-0 top-0 z-[90] flex min-h-12 items-center gap-2 bg-white/90 px-4 pb-1.5 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 print:hidden md:hidden"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div
          id="cv-mobile-nav"
          role={open ? 'dialog' : undefined}
          aria-modal={open || undefined}
          aria-labelledby={open ? titleId : undefined}
          aria-hidden={!open}
          className="flex min-w-0 flex-1 items-center gap-2 border-0 bg-transparent p-0 shadow-none outline-none ring-0"
        >
          <span id={titleId} className="sr-only">
            Menu
          </span>

          <div
            className={
              'flex shrink-0 items-center overflow-hidden transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none ' +
              (open
                ? 'max-w-[9rem] opacity-100'
                : 'max-w-0 opacity-0 pointer-events-none')
            }
          >
            <LocaleSwitcher
              onNavigate={close}
              listClassName={rowListClass}
            />
          </div>

          <div
            className={
              'h-5 w-px shrink-0 bg-slate-200 transition-opacity duration-200 ' +
              (open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0')
            }
            aria-hidden
          />

          <div
            className={
              'flex min-w-0 flex-1 items-center justify-end gap-0.5 overflow-hidden transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none ' +
              (open
                ? 'max-w-none opacity-100'
                : 'max-w-0 opacity-0 pointer-events-none')
            }
          >
            <ModeControl shortLang={shortLang} onNavigate={close} />
            <ToolbarIconList
              onNavigate={close}
              listClassName={rowListClass}
            />
          </div>
        </div>

        <button
          type="button"
          data-testid="cv-mobile-menu-toggle"
          className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-400/40 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls="cv-mobile-nav"
          aria-haspopup="dialog"
          aria-label={open ? 'Fermer le menu' : 'Menu'}
          onClick={toggle}
        >
          {open ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
