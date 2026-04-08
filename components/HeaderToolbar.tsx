'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LocaleSwitcher from '@/components/locale-switcher';
import CvModeToggle from '@/components/CvModeToggle';
import { fullHrefFromShortPath } from '@/lib/cv-mode-nav';
import LogoLinkedin from '@/components/LogoLinkedin';
import LogoGithub from '@/components/logoGithub';
import LogoMalt from '@/components/logoMalt';
import LogoPrint from '@/components/logoPrint';
import {
  cvHeaderModeBtn,
  isCvPrintLayoutToolbarEnabled,
  isLocalDevHostname,
} from '@/lib/cv-header-toolbar';
import {
  isFullCvRootPathname,
  localeFromCvPrintPreviewPathname,
  localeFromPathIfRoot,
  shortAutoprintPath,
} from '@/lib/cv-print-routes';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';
import {
  CV_VIEWPORT_MOBILE_VALUE,
  CV_VIEWPORT_PARAM,
} from '@/lib/cv-viewport-mobile';

const rowListClass = 'flex flex-nowrap items-center gap-0.5 [&>li]:shrink-0';

/**
 * Affiche le lien d’aperçu impression : `next dev`, ou `next start` sur localhost,
 * ou si `NEXT_PUBLIC_SHOW_PRINT_PREVIEW=true` (ex. test depuis une IP LAN).
 */
function useCvPrintPreviewToggleVisible(): boolean {
  const fromNodeEnv = isCvPrintLayoutToolbarEnabled();
  const [fromHost, setFromHost] = useState(false);

  useLayoutEffect(() => {
    if (fromNodeEnv) return;
    if (process.env.NEXT_PUBLIC_SHOW_PRINT_PREVIEW === 'true') {
      setFromHost(true);
      return;
    }
    setFromHost(isLocalDevHostname(window.location.hostname));
  }, [fromNodeEnv]);

  return fromNodeEnv || fromHost;
}

/**
 * `next dev` : ouvre la page courante dans une fenêtre ~390×844 pour appliquer les breakpoints `max-md`
 * sans ouvrir les DevTools (le navigateur impose parfois une largeur minimale — redimensionner si besoin).
 */
function DevMobilePreviewButton({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const router = useRouter();

  const openMobilePreview = useCallback(() => {
    onNavigate?.();
    const next = new URLSearchParams(searchParams.toString());
    next.set(CV_VIEWPORT_PARAM, CV_VIEWPORT_MOBILE_VALUE);
    const q = next.toString();
    router.push(q ? `${pathname}?${q}` : `${pathname}?${CV_VIEWPORT_PARAM}=${CV_VIEWPORT_MOBILE_VALUE}`);
  }, [pathname, searchParams, router, onNavigate]);

  return (
    <button
      type="button"
      data-testid="cv-dev-mobile-preview"
      className={`${cvHeaderModeBtn} print:hidden`}
      title="Aperçu mobile (même onglet, ?cvViewport=mobile + iframe 390px)"
      aria-label="Ouvrir l’aperçu mobile sur cette page avec le paramètre cvViewport dans l’URL"
      onClick={openMobilePreview}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 md:h-5 md:w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <span className="hidden md:inline">Mobile</span>
    </button>
  );
}

/** Lien « Version complète » depuis `/[lang]/short` : reprend `fullHrefFromShortPath` + query. */
function FullVersionFromShortLink({
  shortLang,
  shortDefaultOfferId,
  onNavigate,
}: {
  shortLang: string;
  shortDefaultOfferId?: string | null;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
  const href = fullHrefFromShortPath(
    shortLang,
    new URLSearchParams(searchParams.toString()),
    { defaultOfferId: shortDefaultOfferId ?? null },
  );
  return (
    <Link
      href={href}
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

function ToolbarIconList({
  onNavigate,
  listClassName = 'flex flex-wrap gap-2',
  onPrint,
  printTitle,
  printAriaLabel,
}: {
  onNavigate?: () => void;
  listClassName?: string;
  onPrint: () => void;
  printTitle: string;
  printAriaLabel: string;
}) {
  const handlePrint = () => {
    onNavigate?.();
    onPrint();
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
        <LogoPrint
          onClick={handlePrint}
          title={printTitle}
          aria-label={printAriaLabel}
        />
      </li>
    </ul>
  );
}

function ModeControl({
  shortLang,
  shortDefaultOfferId,
  onNavigate,
}: {
  shortLang?: string;
  shortDefaultOfferId?: string | null;
  onNavigate?: () => void;
}) {
  if (shortLang) {
    return (
      <FullVersionFromShortLink
        shortLang={shortLang}
        shortDefaultOfferId={shortDefaultOfferId}
        onNavigate={onNavigate}
      />
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

/** CV long, CV court, `/offer/match` & `/offer/custom` : bascule `?print=1`. */
function PrintPreviewToggleLink({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const loc = localeFromCvPrintPreviewPathname(pathname);
  if (!loc) return null;

  const params = new URLSearchParams(sp.toString());
  const active = isCvPrintPreviewQuery(params);

  const next = new URLSearchParams(sp.toString());
  if (active) next.delete('print');
  else next.set('print', '1');
  const q = next.toString();
  const href = q ? `${pathname}?${q}` : pathname;

  const { label, title } =
    loc === 'en'
      ? active
        ? {
            label: 'Normal layout',
            title: 'Exit print-style single-column layout',
          }
        : {
            label: 'Print layout',
            title: 'Preview single-column layout (as when printing)',
          }
      : active
      ? { label: 'Affichage normal', title: "Quitter l'aperçu impression" }
      : {
          label: 'Aperçu impression',
          title: 'Une colonne comme à l’impression (PDF)',
        };

  return (
    <Link
      href={href}
      className={`${cvHeaderModeBtn} print:hidden max-w-[11rem] truncate text-xs font-normal text-slate-500 hover:text-slate-800`}
      title={title}
      onClick={() => onNavigate?.()}
    >
      {label}
    </Link>
  );
}

/**
 * Desktop : langues à gauche, actions à droite.
 * Mobile : barre fixe en haut ; ouvert = langues à gauche, actions + menu à droite (pas de séparateur).
 */
export default function HeaderToolbar({
  shortLang,
  shortDefaultOfferId,
}: {
  shortLang?: string;
  shortDefaultOfferId?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const showPrintPreviewToggle = useCvPrintPreviewToggleVisible();
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const { printTitle, printAriaLabel } = useMemo(() => {
    const fullRoot = isFullCvRootPathname(pathname);
    const loc = localeFromPathIfRoot(pathname);
    if (fullRoot && loc === 'en') {
      return {
        printTitle: 'Export short resume (PDF)',
        printAriaLabel: 'Export short resume as PDF',
      };
    }
    if (fullRoot && loc === 'fr') {
      return {
        printTitle: 'Exporter le CV court (PDF)',
        printAriaLabel: 'Exporter le CV court en PDF',
      };
    }
    return {
      printTitle: 'Imprimer / Exporter en PDF',
      printAriaLabel: 'Imprimer ou exporter en PDF',
    };
  }, [pathname]);

  const runPrint = useCallback(() => {
    const lang = localeFromPathIfRoot(pathname);
    if (lang) {
      window.open(shortAutoprintPath(lang), '_blank', 'noopener,noreferrer');
      return;
    }
    window.print();
  }, [pathname]);

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
        <Suspense fallback={null}>
          <LocaleSwitcher />
        </Suspense>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Suspense fallback={null}>
            <ModeControl
              shortLang={shortLang}
              shortDefaultOfferId={shortDefaultOfferId}
            />
          </Suspense>
          {showPrintPreviewToggle ? (
            <Suspense fallback={null}>
              <PrintPreviewToggleLink />
            </Suspense>
          ) : null}
          {isCvPrintLayoutToolbarEnabled() ? (
            <Suspense fallback={null}>
              <DevMobilePreviewButton />
            </Suspense>
          ) : null}
          <ToolbarIconList
            onPrint={runPrint}
            printTitle={printTitle}
            printAriaLabel={printAriaLabel}
          />
        </div>
      </div>

      {/* Réserve la hauteur : même formule que la barre (safe-area + 2rem + 0.75rem). */}
      <div
        className="w-full shrink-0 md:hidden"
        style={{
          height:
            'calc(max(0.75rem, env(safe-area-inset-top, 0px)) + 2rem + 0.75rem)',
        }}
        aria-hidden
      />

      <div
        className="fixed inset-x-0 top-0 z-[90] flex items-center gap-2 bg-white/90 px-4 pb-3 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 print:hidden md:hidden"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
        }}
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
                : 'pointer-events-none max-w-0 opacity-0')
            }
          >
            <Suspense fallback={null}>
              <LocaleSwitcher onNavigate={close} listClassName={rowListClass} />
            </Suspense>
          </div>

          <div
            className={
              'flex min-w-0 flex-1 items-center justify-end gap-0.5 overflow-hidden transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none ' +
              (open
                ? 'max-w-none opacity-100'
                : 'pointer-events-none max-w-0 opacity-0')
            }
          >
            <Suspense fallback={null}>
              <ModeControl
                shortLang={shortLang}
                shortDefaultOfferId={shortDefaultOfferId}
                onNavigate={close}
              />
            </Suspense>
            {showPrintPreviewToggle ? (
              <Suspense fallback={null}>
                <PrintPreviewToggleLink onNavigate={close} />
              </Suspense>
            ) : null}
            {isCvPrintLayoutToolbarEnabled() ? (
              <Suspense fallback={null}>
                <DevMobilePreviewButton onNavigate={close} />
              </Suspense>
            ) : null}
            <ToolbarIconList
              onNavigate={close}
              listClassName={rowListClass}
              onPrint={runPrint}
              printTitle={printTitle}
              printAriaLabel={printAriaLabel}
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
