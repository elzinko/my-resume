import type { JobOffer } from '@/data/offers/types';

/**
 * Représente une offre du bundle (`data/offers`) comme paramètres GET sur `/{lang}`
 * (la route `/offer/match` n'existe plus : la racine accepte les mêmes query params).
 */
export function jobOfferToMatchSearchParams(
  offer: JobOffer,
): URLSearchParams {
  const sp = new URLSearchParams();
  sp.set('company', offer.company);
  sp.set('title_fr', offer.title.fr);
  sp.set('title_en', offer.title.en);
  for (const r of offer.requirements) {
    const label = (r.shortLabel || r.label).trim();
    const kw = r.keywords.join(',');
    if (label && kw) sp.append('requirement', `${label}:${kw}`);
  }
  const wa = offer.workAddress?.trim();
  if (wa) sp.set('workAddress', wa);
  const cl = offer.commuteLabel?.trim();
  if (cl) sp.set('commuteLabel', cl);
  return sp;
}

export function jobOfferToMatchHref(lang: string, offer: JobOffer): string {
  const q = jobOfferToMatchSearchParams(offer).toString();
  return q ? `/${lang}?${q}` : `/${lang}`;
}
