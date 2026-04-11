/**
 * Liens "Version courte" / "Version complete" en preservant les parametres d'offre dynamique (query params).
 */

import { withQuery } from '@/lib/cv-path-utils';

/**
 * Depuis la page CV complete -> URL du CV court avec les memes parametres.
 */
export function shortHrefFromOfferPath(
  pathname: string,
  lang: string,
  searchParams: URLSearchParams,
): string {
  return withQuery(`/${lang}/short`, searchParams);
}

/**
 * Depuis `/[lang]/short` avec query -> retour vers le CV complet avec les memes parametres.
 */
export function fullHrefFromShortPath(
  lang: string,
  searchParams: URLSearchParams,
): string {
  return withQuery(`/${lang}`, searchParams);
}
