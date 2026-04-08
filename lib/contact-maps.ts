/** Origine fixe pour les itinéraires « depuis chez moi » (gare SNCF). */
export const THOMERY_STATION_ORIGIN =
  'Gare de Thomery, 77810 Thomery, France';

/**
 * Lien Google Maps : recherche gare seule, ou itinéraire gare → lieu de travail si `workAddress` est renseigné.
 */
export function buildContactLocationHref(workAddress?: string | null): string {
  const originQ = encodeURIComponent(THOMERY_STATION_ORIGIN);
  const trimmed = workAddress?.trim();
  if (trimmed) {
    const dest = encodeURIComponent(trimmed);
    return `https://www.google.com/maps/dir/?api=1&origin=${originQ}&destination=${dest}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${originQ}`;
}
