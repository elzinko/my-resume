/**
 * Liens « Version courte » / « Version complète » en préservant offre dynamique (match, custom, offre bundle).
 */

import { getOffer } from '@/data/offers';
import { jobOfferToMatchHref, jobOfferToMatchSearchParams } from '@/lib/offer-to-match-url';
import { withQuery } from '@/lib/cv-path-utils';

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
  const job = getOffer(offerId);
  if (job) {
    const q = jobOfferToMatchSearchParams(job).toString();
    return q ? `/${lang}/short?${q}` : `/${lang}/short`;
  }
  return withQuery(`/${lang}/short`, searchParams);
}

export type FullHrefFromShortOptions = {
  /** Aligné sur `SHORT_CV_OFFER_ID` : URL sans `?offer=` mais CV court contextualisé. */
  defaultOfferId?: string | null;
};

/**
 * Depuis `/[lang]/short` avec query → retour vers la page offre adaptée, sinon CV complet.
 */
export function fullHrefFromShortPath(
  lang: string,
  searchParams: URLSearchParams,
  options?: FullHrefFromShortOptions,
): string {
  if (searchParams.get('spec')?.trim()) {
    return withQuery(`/${lang}`, searchParams);
  }
  const company = searchParams.get('company')?.trim();
  const hasReq =
    searchParams.getAll('requirement').length > 0 ||
    searchParams.getAll('req').length > 0;
  if (company && hasReq) {
    return withQuery(`/${lang}`, searchParams);
  }
  const offer = searchParams.get('offer')?.trim();
  if (offer && !company && !hasReq) {
    const job = getOffer(offer);
    if (job) return jobOfferToMatchHref(lang, job);
    const next = new URLSearchParams(searchParams);
    next.delete('offer');
    return withQuery(`/${lang}`, next);
  }
  const fallback = options?.defaultOfferId?.trim();
  if (fallback && !company && !hasReq) {
    const job = getOffer(fallback);
    if (job) return jobOfferToMatchHref(lang, job);
    return withQuery(`/${lang}`, searchParams);
  }
  return withQuery(`/${lang}`, searchParams);
}
