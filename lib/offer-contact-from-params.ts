import type { JobOffer } from '@/data/offers/types';
import { buildContactLocationHref } from '@/lib/contact-maps';

const MAX_WORK_ADDRESS_LEN = 500;
const MAX_COMMUTE_LABEL_LEN = 80;

function trimWork(s: string | null | undefined): string | undefined {
  if (!s) return undefined;
  const t = s.trim().slice(0, MAX_WORK_ADDRESS_LEN);
  return t || undefined;
}

function trimLabel(s: string | null | undefined): string | undefined {
  if (!s) return undefined;
  const t = s.trim().slice(0, MAX_COMMUTE_LABEL_LEN);
  return t || undefined;
}

function commuteFromMinutesParam(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const n = Number(raw.trim().replace(',', '.'));
  if (!Number.isFinite(n) || n < 0) return undefined;
  const rounded = Math.round(n);
  return `~${rounded} min`;
}

export type ContactLocationOverlay = {
  mapsHref: string;
  commuteLabel?: string;
  /** `true` si le lien est un itinéraire vers un lieu de travail. */
  isDirections: boolean;
};

/**
 * Lieu de travail et durée affichée : champs optionnels sur l’offre (JSON spec) ou paramètres GET
 * `workAddress` / `clientAddress`, `commuteLabel`, `commuteMinutes`.
 */
export function contactLocationFromOfferAndQuery(
  offer: JobOffer | null,
  sp: URLSearchParams,
): ContactLocationOverlay {
  const work =
    trimWork(offer?.workAddress) ||
    trimWork(sp.get('workAddress')) ||
    trimWork(sp.get('clientAddress'));

  const commuteLabel =
    trimLabel(offer?.commuteLabel) ||
    trimLabel(sp.get('commuteLabel')) ||
    commuteFromMinutesParam(sp.get('commuteMinutes'));

  const mapsHref = buildContactLocationHref(work);
  return {
    mapsHref,
    ...(commuteLabel && work ? { commuteLabel } : {}),
    isDirections: Boolean(work),
  };
}
