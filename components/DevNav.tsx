'use client';

import React, { useEffect, useState } from 'react';

/**
 * Barre de navigation dev DISCRÈTE vers les pages internes du projet.
 *
 * Rendue par le layout CV UNIQUEMENT hors production (`VERCEL_ENV !== 'production'`,
 * décidé côté serveur → absente du DOM en prod). Jamais imprimée (`print:hidden`,
 * `print-preview:hidden`), ni dans les iframes (vignettes de `/dev/renders`,
 * stories de `/dev/components`) : elle se démonte quand `window.self !== window.top`.
 *
 * UN SEUL composant, toujours EN HAUT, deux rendus selon le viewport :
 * - `md+` : barre pleine largeur en haut (badge + liens toujours visibles ; le
 *   zoom du CV court vient se placer à droite, cf. `CvZoomSlider`).
 * - `< md` : pastille en haut à gauche, alignée sur la rangée de la barre
 *   d'outils CV mobile (zone libre à gauche du burger). Le badge d'environnement
 *   sert de bouton : replié = badge seul, déplié = badge + les mêmes liens.
 *   Quand le menu CV mobile est OUVERT (sélecteur de langue à gauche), la barre
 *   s'efface via `:has()` pour ne pas le recouvrir.
 *
 * Le badge d'environnement dépend du hostname (client-only) : LOCAL (pas de
 * déploiement) / STAGING (staging.elzinko.fr) / PREVIEW (*.vercel.app).
 */
type EnvBadge = 'LOCAL' | 'STAGING' | 'PREVIEW';

function resolveEnvBadge(hostname: string): EnvBadge {
  const localHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
  if (localHosts.includes(hostname)) return 'LOCAL';
  if (hostname === 'staging.elzinko.fr') return 'STAGING';
  return 'PREVIEW';
}

export default function DevNav({ lang }: { lang: string }) {
  // Défaut LOCAL → identique au premier rendu client ; corrigé en effect pour
  // éviter tout mismatch d'hydratation (le hostname n'existe pas au SSR).
  const [badge, setBadge] = useState<EnvBadge>('LOCAL');
  // Masquée dans les iframes : les vignettes de /dev/renders (onglets Live et
  // Comparer) et les stories iframe de /dev/components embarquent les pages CV —
  // la barre dev n'y a rien à faire. Détection client-only (SSR : visible).
  const [inIframe, setInIframe] = useState(false);
  // < md : liens repliés derrière le badge (le viewport mobile est compté).
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setBadge(resolveEnvBadge(window.location.hostname));
    setInIframe(window.self !== window.top);
  }, []);

  if (inIframe) return null;

  const linkClass =
    'text-slate-300 no-underline hover:text-teal-300 transition-colors';
  const badgeClass =
    'rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide text-teal-300';

  return (
    <nav
      data-devnav
      aria-label="Navigation dev (hors production)"
      // Toujours EN HAUT. Desktop (md+) : barre pleine largeur. Mobile : pastille
      // en haut à gauche, hauteur alignée sur les boutons de la barre CV mobile
      // (`--cv-toolbar-btn`, même padding-top safe-area que `HeaderToolbar`).
      className="fixed left-3 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[100] flex h-[var(--cv-toolbar-btn)] items-center gap-3 rounded-md border border-slate-700 bg-slate-900/90 px-2.5 text-xs font-medium shadow-lg backdrop-blur-sm print-preview:hidden print:hidden md:inset-x-0 md:top-0 md:h-10 md:rounded-none md:border-x-0 md:border-t-0 md:px-4 md:shadow-md"
    >
      {/* Menu CV mobile ouvert (sélecteur de langue à gauche) → on s'efface
          plutôt que de le recouvrir. Dev-only, borné mobile. */}
      {/* Sans guillemets dans le sélecteur (`true` est un identifiant CSS valide) :
          React échappe `"` en `&quot;` au SSR → mismatch d'hydratation sinon. */}
      <style>{`@media (max-width: 767px){body:has(#cv-menu-toggle[aria-expanded=true]) [data-devnav]{display:none}}`}</style>

      {/* < md : le badge est le bouton qui déplie/replie les liens. */}
      <button
        type="button"
        className="flex items-center gap-1 md:hidden"
        aria-expanded={open}
        aria-controls="devnav-links"
        aria-label={open ? 'Replier la navigation dev' : 'Navigation dev'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={badgeClass}>{badge}</span>
        <svg
          className={`h-3 w-3 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* md+ : badge simple (les liens sont toujours visibles). */}
      <span className={`hidden md:inline-block ${badgeClass}`}>{badge}</span>

      <div
        id="devnav-links"
        className={`items-center gap-3 md:flex ${open ? 'flex' : 'hidden'}`}
      >
        <a className={linkClass} href={`/${lang}/dev/renders`}>
          Renders
        </a>
        <a className={linkClass} href={`/${lang}/dev/components`}>
          Components
        </a>
        <a className={linkClass} href={`/${lang}/dev/llm-guide`}>
          LLM guide
        </a>
      </div>
    </nav>
  );
}
