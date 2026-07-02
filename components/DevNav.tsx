'use client';

import React, { useEffect, useState } from 'react';

/**
 * Barre de navigation dev DISCRÈTE vers les pages internes du projet.
 *
 * Rendue par le layout CV UNIQUEMENT hors production (`VERCEL_ENV !== 'production'`,
 * décidé côté serveur → absente du DOM en prod). Jamais imprimée (`print:hidden`,
 * `print-preview:hidden`).
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

  useEffect(() => {
    setBadge(resolveEnvBadge(window.location.hostname));
  }, []);

  const linkClass =
    'text-slate-300 no-underline hover:text-teal-300 transition-colors';

  return (
    <nav
      aria-label="Navigation dev (hors production)"
      className="fixed bottom-3 right-3 z-50 flex items-center gap-3 rounded-md border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm print-preview:hidden print:hidden"
    >
      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide text-teal-300">
        {badge}
      </span>
      <a className={linkClass} href={`/${lang}/dev/renders`}>
        Renders
      </a>
      <a className={linkClass} href={`/${lang}/dev/components`}>
        Components
      </a>
      <a className={linkClass} href="/api/llm-guide">
        LLM guide
      </a>
    </nav>
  );
}
