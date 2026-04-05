/** Première lettre en majuscule, reste inchangé (ex. livestreamz → Livestreamz). */
export function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
