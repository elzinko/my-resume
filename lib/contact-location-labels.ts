/** Libellés accessibilité pour le lien lieu / itinéraire (FR / EN). */
export function contactLocationLinkTitle(
  locale: string,
  isDirections: boolean,
): string {
  if (locale === 'en') {
    return isDirections
      ? 'Open directions from Thomery station to workplace'
      : 'Thomery station on Google Maps';
  }
  return isDirections
    ? 'Ouvrir l’itinéraire Gare de Thomery → lieu de travail'
    : 'Voir la gare de Thomery sur la carte';
}
