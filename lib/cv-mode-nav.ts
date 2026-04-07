/**
 * Liens « Version courte » / « Version complète » en préservant offre dynamique (match, custom, offer id).
 */

import { withQuery } from '@/lib/cv-path-utils';

const OFFER_SPECIAL = new Set(['match', 'custom']);

/**
 * Depuis une page offre complète → URL du CV court avec les mêmes paramètres quand c’est pertinent.
 * Depuis la racine `/{lang}` (CV complet), recopie la query sur `/{lang}/short`.
 */
export function shortHrefFromOfferPath(
  pathname: string,
  lang: string,
  searchParams: URLSearchParams,
): string {
  const offerSeg = /^\/(fr|en)\/offer\/([^/]+)\/?$/.exec(pathname || '');
  if (!offerSeg) {
    return withQuery(`/${lang}/short`, searchParams);
  }
  const offerId = offerSeg[2]!;
  if (offerId === 'match' || offerId === 'custom') {
    const q = searchParams.toString();
    return q ? `/${lang}/short?${q}` : `/${lang}/short`;
  }
  if (!OFFER_SPECIAL.has(offerId)) {
    const merged = new URLSearchParams(searchParams);
    merged.set('offer', offerId);
    return withQuery(`/${lang}/short`, merged);
  }
  return withQuery(`/${lang}/short`, searchParams);
}

/**
 * Depuis `/[lang]/short` avec query → retour vers la page offre adaptée, sinon CV complet.
 */
export function fullHrefFromShortPath(
  lang: string,
  searchParams: URLSearchParams,
): string {
  if (searchParams.get('spec')?.trim()) {
    const q = searchParams.toString();
    return q ? `/${lang}/offer/custom?${q}` : `/${lang}/offer/custom`;
  }
  const company = searchParams.get('company')?.trim();
  const hasReq =
    searchParams.getAll('requirement').length > 0 ||
    searchParams.getAll('req').length > 0;
  if (company && hasReq) {
    const q = searchParams.toString();
    return q ? `/${lang}/offer/match?${q}` : `/${lang}/offer/match`;
  }
  const offer = searchParams.get('offer')?.trim();
  if (offer && !company && !hasReq) {
    return `/${lang}/offer/${encodeURIComponent(offer)}`;
  }
  return withQuery(`/${lang}`, searchParams);
}
