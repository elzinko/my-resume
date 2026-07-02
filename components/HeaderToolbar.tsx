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
import LocaleSwitcher from '@/components/LocaleSwitcher';
import CvModeToggle from '@/components/CvModeToggle';
import {
  fullHrefFromShortPath,
  shortHrefFromOfferPath,
} from '@/lib/cv-mode-nav';
import { stripBasePath } from '@/lib/cv-path-utils';
import { i18n, type Locale } from 'i18n-config';
import LogoLinkedin from '@/components/LogoLinkedin';
import LogoGithub from '@/components/LogoGithub';
import LogoMalt from '@/components/LogoMalt';
import LogoPrint from '@/components/LogoPrint';
import { safePrint } from '@/lib/safe-print';
import {
  cvHeaderModeBtn,
  isCvPrintLayoutToolbarEnabled,
  isLocalDevHostname,
} from '@/lib/cv-header-toolbar';
import {
  localeFromCvPrintPreviewPathname,
  localeFromPathIfRoot,
} from '@/lib/cv-print-routes';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';
import {
  CV_VIEWPORT_MOBILE_VALUE,
  CV_VIEWPORT_PARAM,
} from '@/lib/cv-viewport-mobile';

const rowListClass = 'flex flex-nowrap items-center gap-0.5 [&>li]:shrink-0';

/**
 * Affiche le lien d’aperçu impression : `next dev`, **preview Vercel** (review par
 * PR), `next start` sur localhost, ou si `NEXT_PUBLIC_SHOW_PRINT_PREVIEW=true` (ex.
 * test depuis une IP LAN). Jamais en production.
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
    router.push(
      q
        ? `${pathname}?${q}`
        : `${pathname}?${CV_VIEWPORT_PARAM}=${CV_VIEWPORT_MOBILE_VALUE}`,
    );
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
  onNavigate,
}: {
  shortLang: string;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
  const href = fullHrefFromShortPath(
    shortLang,
    new URLSearchParams(searchParams.toString()),
  );
  return (
    <Link
      href={href}
      className={`${cvHeaderModeBtn} print:hidden`}
      title="Affichage PDF (A4) — cliquer pour la version web complète"
      aria-label="Affichage PDF (A4) — basculer vers la version web complète"
      onClick={() => onNavigate?.()}
    >
      {/* Icône = mode COURANT (vue PDF / A4) → document. Desktop : icône seule
          (infobulle). Mobile : + libellé court. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </Link>
  );
}

function ToolbarIconList({
  onNavigate,
  listClassName = 'flex flex-wrap gap-2',
  onPrint,
  printTitle,
  printAriaLabel,
  hideMalt,
}: {
  onNavigate?: () => void;
  listClassName?: string;
  onPrint: () => void;
  printTitle: string;
  printAriaLabel: string;
  hideMalt?: boolean;
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
      {!hideMalt && (
        <li>
          <LogoMalt onNavigate={onNavigate} />
        </li>
      )}
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
  onNavigate,
}: {
  shortLang?: string;
  onNavigate?: () => void;
}) {
  if (shortLang) {
    return (
      <FullVersionFromShortLink shortLang={shortLang} onNavigate={onNavigate} />
    );
  }
  return <CvModeToggle onNavigate={onNavigate} />;
}

/** CV long ou CV court : bascule `?print=1`. */
function PrintPreviewToggleLink({ onNavigate }: { onNavigate?: () => void }) {
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

  // Icône SEULE (œil = aperçu), pas de texte. Active (?print=1) → vert : override
  // `!` sur la couleur/fond de `cvHeaderModeBtn` (comme les `print:!flex` existants
  // → fiable quel que soit l'ordre Tailwind). `label` → `aria-label`.
  const activeCls = active
    ? '!bg-green-50 !text-green-600 hover:!bg-green-100 hover:!text-green-700'
    : '';

  return (
    <Link
      href={href}
      className={`${cvHeaderModeBtn} px-2 print:hidden ${activeCls}`}
      title={title}
      aria-label={label}
      onClick={() => onNavigate?.()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        {/* Œil = « aperçu ». Même glyphe actif/inactif : seule la couleur change. */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </Link>
  );
}

/**
 * Sélecteur d'impression mobile : le CV n'a pas de bascule court/complet visible
 * en mobile → au clic sur imprimer, on demande QUEL PDF. Chaque choix ouvre la
 * route canonique (`/[lang]` ou `/[lang]/short`) avec `?autoprint=1` dans un
 * nouvel onglet (cf. `CvAutoprint`) → PDF strictement identique au desktop.
 * Rendu sous `<Suspense>` (lit `useSearchParams`).
 */
function MobilePrintChooser({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const pathForLogic = stripBasePath(
    pathname,
    process.env.NEXT_PUBLIC_BASE_PATH || '',
  );
  const seg = pathForLogic.split('/')[1];
  const lang: Locale = i18n.locales.includes(seg as Locale)
    ? (seg as Locale)
    : i18n.defaultLocale;

  const { fullHref, shortHref } = useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString() ?? '');
    sp.set('autoprint', '1');
    return {
      fullHref: fullHrefFromShortPath(lang, sp),
      shortHref: shortHrefFromOfferPath(pathForLogic, lang, sp),
    };
  }, [searchParams, lang, pathForLogic]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isEn = lang === 'en';
  const t = isEn
    ? {
        title: 'Print CV',
        full: 'Full CV',
        fullSub: 'several pages',
        short: 'Short CV',
        shortSub: '1 page',
        cancel: 'Cancel',
      }
    : {
        title: 'Imprimer le CV',
        full: 'CV complet',
        fullSub: 'plusieurs pages',
        short: 'CV court',
        shortSub: '1 page',
        cancel: 'Annuler',
      };

  const optionClass =
    'flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-slate-800 active:bg-slate-50';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      data-testid="cv-mobile-print-chooser"
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 p-4 print:hidden md:hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-center text-base font-semibold text-slate-800">
          {t.title}
        </h2>
        <div className="flex flex-col gap-2">
          <a
            href={fullHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={optionClass}
          >
            <span className="font-medium">{t.full}</span>
            <span className="text-sm text-slate-500">{t.fullSub}</span>
          </a>
          <a
            href={shortHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={optionClass}
          >
            <span className="font-medium">{t.short}</span>
            <span className="text-sm text-slate-500">{t.shortSub}</span>
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl px-4 py-2 text-sm text-slate-500 active:bg-slate-50"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

/**
 * Desktop : langues à gauche, actions à droite.
 * Mobile : barre fixe en haut ; ouvert = langues à gauche, actions + menu à droite (pas de séparateur).
 */
export default function HeaderToolbar({
  shortLang,
  hideMalt,
}: {
  shortLang?: string;
  hideMalt?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [printChooserOpen, setPrintChooserOpen] = useState(false);
  const titleId = useId();
  const showPrintPreviewToggle = useCvPrintPreviewToggleVisible();
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const { printTitle, printAriaLabel } = useMemo(() => {
    const loc = localeFromPathIfRoot(pathname);
    if (loc === 'en') {
      return {
        printTitle: 'Print / Export as PDF',
        printAriaLabel: 'Print or export as PDF',
      };
    }
    return {
      printTitle: 'Imprimer / Exporter en PDF',
      printAriaLabel: 'Imprimer ou exporter en PDF',
    };
  }, [pathname]);

  // `safePrint` attend `document.fonts.ready` + un cycle de paint avant
  // `window.print()` : sans ça, un clic immédiat imprimait le CV court avant
  // stabilisation du layout → une 2ᵉ page parasite (⌘P, plus tardif, ne l'avait
  // pas). Même garde-fou que l'auto-impression (cf. `ShortAutoprint`).
  const runPrint = useCallback(() => {
    safePrint();
  }, []);

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
            <ModeControl shortLang={shortLang} />
          </Suspense>
          {showPrintPreviewToggle && (
            <Suspense fallback={null}>
              <PrintPreviewToggleLink />
            </Suspense>
          )}
          <ToolbarIconList
            onPrint={runPrint}
            printTitle={printTitle}
            printAriaLabel={printAriaLabel}
            hideMalt={hideMalt}
          />
        </div>
      </div>

      {/* Réserve la hauteur : même formule que la barre (safe-area + 2rem + 0.75rem). */}
      <div
        className="w-full shrink-0 md:hidden"
        style={{
          height:
            'calc(max(0.75rem, env(safe-area-inset-top, 0px)) + 2.5rem + 0.75rem)',
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
            {/* Mobile : ni bascule court/complet (ModeControl) ni œil aperçu —
                on ne switche pas de vue en mobile. Le choix court/complet se fait
                au moment d'imprimer (popup). Ces contrôles restent sur desktop. */}
            <ToolbarIconList
              onNavigate={close}
              listClassName={rowListClass}
              // Mobile : pas de bascule court/complet → on demande quel PDF imprimer.
              onPrint={() => setPrintChooserOpen(true)}
              printTitle={printTitle}
              printAriaLabel={printAriaLabel}
              hideMalt={hideMalt}
            />
          </div>
        </div>

        <button
          type="button"
          id="cv-menu-toggle"
          data-cv-id="menu"
          data-testid="cv-mobile-menu-toggle"
          className="relative inline-flex h-[var(--cv-toolbar-btn)] w-[var(--cv-toolbar-btn)] shrink-0 items-center justify-center rounded-md border border-slate-400/40 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls="cv-mobile-nav"
          aria-haspopup="dialog"
          aria-label={open ? 'Fermer le menu' : 'Menu'}
          onClick={toggle}
        >
          {open ? (
            <svg
              className="h-[var(--cv-toolbar-icon)] w-[var(--cv-toolbar-icon)]"
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
              className="h-[var(--cv-toolbar-icon)] w-[var(--cv-toolbar-icon)]"
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

      <Suspense fallback={null}>
        <MobilePrintChooser
          open={printChooserOpen}
          onClose={() => setPrintChooserOpen(false)}
        />
      </Suspense>
    </>
  );
}
