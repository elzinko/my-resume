'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { fullHrefFromShortPath } from '@/lib/cv-mode-nav';

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
  return 'font-medium text-cv-jobs underline decoration-pink-300/50 underline-offset-[3px] transition-colors hover:decoration-pink-200/80';
}

/** Lien vers le CV long sous la section expériences (CV court). */
export default function ShortCvOnlineDetailLink({
  lang,
}: {
  lang: 'fr' | 'en';
}) {
  const sp = useSearchParams();
  const queryKey = sp.toString();
  const href = useMemo(
    () => fullHrefFromShortPath(lang, new URLSearchParams(queryKey)),
    [lang, queryKey],
  );

  const t = COPY[lang];

  return (
    <div className="cv-short-full-cv-hint mt-4 border-l-4 border-pink-300/45 bg-pink-300/[0.06] py-2.5 pl-3 pr-2 print:mt-2 print:border-pink-300/35 print:py-2 print:pl-2.5">
      <p className="m-0 max-w-full text-xs leading-relaxed text-slate-600 print:text-[10px] print:leading-snug">
        {t.before}
        <Link href={href} className={linkClassName()}>
          {t.link}
        </Link>
        {t.after}
      </p>
    </div>
  );
}
