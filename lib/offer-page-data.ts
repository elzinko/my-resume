import type { JobOffer } from '@/data/offers/types';
import { flattenRequirementKeywordsForDisplay } from '@/lib/framework-display-order';
import {
  contactLocationFromOfferAndQuery,
  type ContactLocationOverlay,
} from '@/lib/offer-contact-from-params';

export function offerPriorityTokensAndContact(
  offer: JobOffer | null,
  sp: URLSearchParams,
): { priorityTokens: string[]; contactLocation: ContactLocationOverlay } {
  const priorityTokens = offer
    ? flattenRequirementKeywordsForDisplay(offer)
    : [];
  const contactLocation = contactLocationFromOfferAndQuery(offer, sp);
  return { priorityTokens, contactLocation };
}
