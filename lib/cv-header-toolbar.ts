/** Barre d’outils CV : boutons carrés compacts, repose lisible (pas « disabled »), survol en couleur. */

/**
 * Bascule « aperçu impression » : réservé au dev local (pas les déploiements prod).
 * Préférer le hook {@link useCvPrintPreviewToggleVisible} côté client : il couvre aussi
 * `next start` sur localhost et `NEXT_PUBLIC_SHOW_PRINT_PREVIEW` (accès LAN, etc.).
 */
export function isCvPrintLayoutToolbarEnabled(): boolean {
  return process.env.NODE_ENV === 'development';
}

const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function isLocalDevHostname(hostname: string): boolean {
  return LOCAL_DEV_HOSTS.has(hostname);
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/** Icônes (LinkedIn, GitHub, Malt, impression) — h-8 w-8, fond clair, pictogrammes gris neutres. */
const iconShell = `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-400/40 bg-white text-slate-600 shadow-sm transition-all duration-200 ease-out ${focusRing}`;

const iconHoverNeutral =
  'hover:border-slate-500/55 hover:bg-slate-50 hover:text-neutral-900';

export const cvHeaderIconBtn = {
  linkedin: `${iconShell} hover:border-[#0A66C2]/45 hover:bg-[#0A66C2]/8 hover:text-[#0A66C2]`,
  github: `${iconShell} ${iconHoverNeutral}`,
  malt: `${iconShell} group hover:border-slate-500/55 hover:bg-slate-50`,
  print: `${iconShell} ${iconHoverNeutral}`,
} as const;

/** Bascule version CV — même hauteur que les icônes. */
const modeShell = `inline-flex h-8 items-center gap-1 rounded-md border border-slate-400/40 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 ease-out md:gap-2 md:px-3 md:text-sm ${focusRing}`;

export const cvHeaderModeBtn = `${modeShell} ${iconHoverNeutral}`;

/**
 * Même enveloppe h-8 w-8 que les icônes sociales ; le drapeau est inscrit en h-4 w-4 (md h-5 w-5) au centre.
 */
export const cvHeaderLocaleSwitchBtn = `inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-blue-500/45 bg-blue-50/90 shadow-sm transition-all duration-200 ease-out ${focusRing} hover:border-blue-600/60 hover:bg-blue-100 hover:shadow-sm active:scale-[0.96] motion-reduce:active:scale-100`;
