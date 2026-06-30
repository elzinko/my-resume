'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { fullHrefFromShortPath } from '@/lib/cv-mode-nav';
import { CV_VIEWPORT_PARAM } from '@/lib/cv-viewport-mobile';

const COPY = {
  fr: {
    before: 'Pour le détail mission par mission, ',
    link: 'voir le CV complet en ligne',
    after: '.',
  },
  en: {
    before: 'For role-by-role detail, ',
    link: 'see the full online résumé',
    after: '.',
  },
} as const;

function linkClassName(): string {
  return 'font-semibold text-cv-jobs underline decoration-pink-300/50 underline-offset-[3px] transition-colors hover:decoration-pink-200/80';
}

/** Lien vers le CV long sous la section expériences (CV court). */
export default function ShortCvOnlineDetailLink({
  lang,
  inline = false,
}: {
  lang: 'fr' | 'en';
  /** `true` : rendu inline (prolonge le pied « +20 ans… »), sans bloc encadré. */
  inline?: boolean;
}) {
  const sp = useSearchParams();
  const queryKey = sp.toString();

  // Origine capturée après le montage : produit un lien ABSOLU (même DNS, repris
  // dynamiquement de la page courante — prod, preview Vercel, etc.) dans le PDF
  // exporté, sans casser l'hydratation. Le rendu serveur reste relatif et laisse
  // Next préfixer le `basePath`.
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const href = useMemo(() => {
    // Reprend les paramètres d'offre de l'URL courante, sans les paramètres
    // d'état d'UI (`print`, `cvViewport`) qui n'ont pas de sens pour le lecteur.
    const params = new URLSearchParams(queryKey);
    params.delete('print');
    params.delete(CV_VIEWPORT_PARAM);
    const relative = fullHrefFromShortPath(lang, params);
    if (!origin) return relative;
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(
      /\/$/,
      '',
    );
    return `${origin}${basePath}${relative}`;
  }, [lang, queryKey, origin]);

  const t = COPY[lang];

  const link = (
    <Link href={href} className={linkClassName()}>
      {t.link}
    </Link>
  );

  // Inline : prolonge le paragraphe du pied (un seul bloc → gagne de la place).
  // CTA « voir le CV complet » légèrement plus grand que le reste du pied (em →
  // relatif : +15 % en vue normale 12px, en aperçu 9px ET en PDF 9px) pour qu'on
  // le remarque, sans régression sur la vue web normale.
  if (inline) {
    return (
      <>
        {' '}
        <span className="text-[1.15em]">
          {t.before}
          {link}
          {t.after}
        </span>
      </>
    );
  }

  return (
    <div className="cv-short-full-cv-hint border-pink-300/45 print:border-pink-300/35 mt-4 border-l-4 bg-pink-300/[0.06] py-2.5 pl-3 pr-2 print:mt-2 print:py-2 print:pl-2.5">
      <p className="m-0 max-w-full text-xs leading-relaxed text-slate-600 print:text-[10px] print:leading-snug">
        {t.before}
        {link}
        {t.after}
      </p>
    </div>
  );
}
