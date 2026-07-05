'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fullHrefFromShortPath } from '@/lib/cv-mode-nav';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

/**
 * Sur MOBILE, le CV court ne doit jamais s'AFFICHER : le rendu mobile est unifié
 * (toujours le complet). Le choix court/complet ne se fait qu'à l'IMPRESSION
 * (cf. `MobilePrintChooser`), pas à l'affichage. Cette garde, montée sur
 * `/[lang]/short`, rebascule vers `/[lang]` quand le viewport est mobile.
 *
 * ⚠️ EXEMPTION IMPRESSION — indispensable : le sélecteur d'impression mobile ouvre
 * le PDF court via `/[lang]/short?autoprint=1` (et l'aperçu via `?print=1`) dans un
 * nouvel onglet, souvent mobile. Rediriger ces contextes casserait l'impression du
 * court depuis mobile. On NE redirige donc jamais si `?autoprint=1` ou `?print`.
 *
 * Le seuil `max-width: 767px` = le breakpoint `md` de Tailwind (mobile = < md),
 * cohérent avec le masquage de la bascule court/complet dans la barre mobile.
 * `router.replace` (pas `push`) → pas d'entrée d'historique, query préservée.
 */

// Layout-effect isomorphe : minimise le flash (redirige avant le paint côté
// client) sans warning SSR.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

export default function MobileShortToFullRedirect({ lang }: { lang: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useIsoLayoutEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());

    // Exemption impression : ne jamais voler l'onglet d'impression du court.
    if (sp.get('autoprint') === '1') return;
    if (isCvPrintPreviewQuery(sp)) return;

    if (!window.matchMedia(MOBILE_MEDIA_QUERY).matches) return;

    router.replace(fullHrefFromShortPath(lang, sp));
  }, [searchParams, router, lang]);

  return null;
}
