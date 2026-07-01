/**
 * Lance l'impression APRÈS stabilisation de la mise en page : polices web chargées
 * (`document.fonts.ready`) + un cycle de paint (2 × `requestAnimationFrame`).
 *
 * Le CV court est calibré au pixel pour tenir sur **1 page A4** ; imprimer avant
 * que les polices / le zoom / la classe `.cv-print-preview` soient stabilisés
 * produit une mise en page un poil trop haute → **une 2ᵉ page parasite**. Un
 * `window.print()` immédiat (bouton de la toolbar) tombait dans ce piège alors
 * que ⌘P, déclenché une fraction de seconde plus tard, voyait le layout stabilisé.
 *
 * Source unique partagée par le bouton imprimer (`HeaderToolbar`) et
 * l'auto-impression (`ShortAutoprint`).
 *
 * @param onAfterPrint appelé une fois `window.print()` déclenché (ex. pour
 *   consommer le paramètre `?autoprint=1` de l'URL et éviter qu'il ne persiste).
 * @returns une fonction d'annulation (à appeler au cleanup d'un effet React).
 */
export function safePrint(onAfterPrint?: () => void): () => void {
  let cancelled = false;
  let printed = false;

  const doPrint = () => {
    if (cancelled || printed) return;
    printed = true;
    window.print();
    onAfterPrint?.();
  };

  document.fonts.ready.then(() => {
    if (cancelled) return;
    requestAnimationFrame(() => requestAnimationFrame(doPrint));
  });

  // Filet de sécurité si `fonts.ready` traîne (polices lentes / déjà en cache).
  const fallback = window.setTimeout(doPrint, 2000);

  return () => {
    cancelled = true;
    window.clearTimeout(fallback);
  };
}
