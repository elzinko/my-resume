'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CV_VIEWPORT_PARAM } from '@/lib/cv-viewport-mobile';

/**
 * Lien « CV en ligne » ajouté au pied des expériences du CV COMPLET, visible
 * UNIQUEMENT à l'impression (PDF + aperçu `?print`) — à l'écran on est déjà sur la
 * version web, le lien n'a pas de sens. Il pointe vers la version web de la MÊME
 * page (interactive, à jour, qui déplie plus de contenu que le PDF figé : toutes
 * les technos via « … », détails des missions, etc.).
 *
 * Pendant du CV court ({@link ShortCvOnlineDetailLink}) qui, lui, pointe court → complet.
 */
const COPY = {
  fr: {
    before: 'Version interactive et à jour : ',
    link: 'CV en ligne',
    after: '.',
  },
  en: {
    before: 'Interactive, up-to-date version: ',
    link: 'online résumé',
    after: '.',
  },
} as const;

export default function FullCvOnlineLink({ lang }: { lang: 'fr' | 'en' }) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const queryKey = sp.toString();

  // Origine capturée au montage → lien ABSOLU (même DNS que la page courante :
  // prod, preview Vercel…) dans le PDF exporté, sans casser l'hydratation.
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const href = useMemo(() => {
    // On garde les paramètres d'offre, on retire les paramètres d'état d'UI qui
    // n'ont pas de sens pour le lecteur en ligne (`print`, `autoprint`, viewport).
    const params = new URLSearchParams(queryKey);
    params.delete('print');
    params.delete('autoprint');
    params.delete(CV_VIEWPORT_PARAM);
    const qs = params.toString();
    const relative = qs ? `${pathname}?${qs}` : pathname;
    if (!origin) return relative;
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(
      /\/$/,
      '',
    );
    return `${origin}${basePath}${relative}`;
  }, [pathname, queryKey, origin]);

  const t = COPY[lang];

  // Print-only : masqué à l'écran (vue web = déjà en ligne), affiché en PDF ET en
  // aperçu `?print` (WYSIWYG : l'aperçu doit montrer ce que le PDF contiendra).
  return (
    <span className="hidden print-preview:inline print:inline">
      {' '}
      {t.before}
      <Link
        href={href}
        className="font-semibold text-cv-jobs underline decoration-pink-300/50 underline-offset-[3px]"
      >
        {t.link}
      </Link>
      {t.after}
    </span>
  );
}
