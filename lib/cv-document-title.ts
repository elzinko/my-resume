/**
 * Titre de document CV — utilisé pour le `<title>` des pages et le nom
 * des fichiers PDF servis par l'API renders.
 *
 * Format : `cv_nom_court_20260411_14h35` (FR) / `resume_name_short_20260411_14h35` (EN)
 */
export function generateDocumentTitle(
  name: string,
  lang: string,
  mode: 'full' | 'short',
): string {
  const prefix = lang === 'fr' ? 'cv' : 'resume';
  const modeLabel =
    lang === 'fr' ? (mode === 'full' ? 'complet' : 'court') : mode;
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 5).replace(':', 'h');
  const safeName = name.toLowerCase().replace(/\s+/g, '_');
  return `${prefix}_${safeName}_${modeLabel}_${date}_${time}`;
}
