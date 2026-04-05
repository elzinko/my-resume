/** Libellé affiché pour un apprentissage : nom CMS, sinon hôte du lien, sinon l’URL. */
export function learningLinkLabel(learning: {
  name?: string | null;
  link?: string | null;
}): string {
  const raw = learning.name?.trim();
  if (raw) return raw;
  const url = learning.link?.trim();
  if (!url) return '';
  try {
    const host = new URL(url).hostname.replace(/^www\./i, '');
    return host || url;
  } catch {
    return url;
  }
}
