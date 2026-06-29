/** Barre d’outils CV : boutons carrés compacts, repose lisible (pas « disabled »), survol en couleur. */

/**
 * Bascule « aperçu impression » : visible en dev local ET sur les déploiements de
 * PREVIEW Vercel (review de chaque PR), mais JAMAIS en production. Vercel préfixe
 * automatiquement la variable système pour le navigateur sur prod+preview :
 * `NEXT_PUBLIC_VERCEL_ENV` vaut 'preview' sur un preview deploy, 'production' en
 * prod (et est absente en local → c'est le check NODE_ENV/localhost qui prend le relais).
 * Préférer le hook {@link useCvPrintPreviewToggleVisible} côté client : il couvre aussi
 * `next start` sur localhost et `NEXT_PUBLIC_SHOW_PRINT_PREVIEW` (accès LAN, etc.).
 */
export function isCvPrintLayoutToolbarEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
  );
}

const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function isLocalDevHostname(hostname: string): boolean {
  return LOCAL_DEV_HOSTS.has(hostname);
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/** Icônes (LinkedIn, GitHub, Malt, impression) — taille pilotée par --cv-toolbar-btn. */
const iconShell = `inline-flex h-[var(--cv-toolbar-btn)] w-[var(--cv-toolbar-btn)] shrink-0 items-center justify-center rounded-md border border-slate-400/40 bg-white text-slate-600 shadow-sm transition-all duration-200 ease-out ${focusRing}`;

const iconHoverNeutral =
  'hover:border-slate-500/55 hover:bg-slate-50 hover:text-neutral-900';

// Mobile : pas de survol → on applique la couleur « active » (de marque) PAR DÉFAUT
// via `max-md:` (les icônes ne restent pas grises faute de hover).
const iconMobileNeutral =
  'max-md:border-slate-500/55 max-md:bg-slate-50 max-md:text-neutral-900';

export const cvHeaderIconBtn = {
  linkedin: `${iconShell} hover:border-[#0A66C2]/45 hover:bg-[#0A66C2]/8 hover:text-[#0A66C2] max-md:border-[#0A66C2]/45 max-md:bg-[#0A66C2]/8 max-md:text-[#0A66C2]`,
  github: `${iconShell} ${iconHoverNeutral} ${iconMobileNeutral}`,
  malt: `${iconShell} group hover:border-slate-500/55 hover:bg-slate-50 max-md:border-slate-500/55 max-md:bg-slate-50`,
  print: `${iconShell} ${iconHoverNeutral} ${iconMobileNeutral}`,
} as const;

/** Bascule version CV — même hauteur que les icônes. */
const modeShell = `inline-flex h-[var(--cv-toolbar-btn)] items-center gap-1 rounded-md border border-slate-400/40 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 ease-out md:gap-2 md:px-3 md:text-sm ${focusRing}`;

export const cvHeaderModeBtn = `${modeShell} ${iconHoverNeutral}`;

/**
 * Même enveloppe h-8 w-8 que les icônes sociales ; le drapeau est inscrit en h-4 w-4 (md h-5 w-5) au centre.
 */
export const cvHeaderLocaleSwitchBtn = `inline-flex h-[var(--cv-toolbar-btn)] w-[var(--cv-toolbar-btn)] shrink-0 items-center justify-center overflow-hidden rounded-md border border-blue-500/45 bg-blue-50/90 shadow-sm transition-all duration-200 ease-out ${focusRing} hover:border-blue-600/60 hover:bg-blue-100 hover:shadow-sm active:scale-[0.96] motion-reduce:active:scale-100`;
