import { test, expect } from '@playwright/test';

/**
 * Invariant FONDAMENTAL du CV court : il DOIT tenir sur 1 SEULE page A4 à
 * l'impression (c'est sa raison d'être). Ce test est le filet de régression :
 * toute densification future (espacement inter-sections, police, contenu, pastilles)
 * qui ferait déborder sur une 2e page le fait échouer AVANT le merge.
 *
 * On rend le VRAI PDF via `page.pdf` en respectant le `@page` CSS du projet
 * (`preferCSSPageSize` → `size: A4` + les marges de `@page short`), puis on compte
 * les objets page dans le flux PDF. Déterministe et indépendant de l'OS (même moteur
 * Chromium en local et en CI) → NON marqué `@local-only`, donc gaté par la CI e2e.
 *
 * `page.pdf()` n'est disponible que sur Chromium (le projet ne teste que Desktop
 * Chrome) — cohérent avec le pipeline d'impression réel (moteur du navigateur).
 */
function countPdfPages(pdf: Buffer): number {
  // Chromium écrit un objet `/Type /Page` par page (et un `/Type /Pages` pour le
  // nœud racine, exclu par `[^s]`). Robuste pour les PDF générés par Chromium.
  const s = pdf.toString('latin1');
  return (s.match(/\/Type\s*\/Page[^s]/g) || []).length;
}

test.describe('CV court — tient sur 1 page A4 (impression)', () => {
  for (const lang of ['fr', 'en'] as const) {
    test(`/${lang}/short : le PDF fait exactement 1 page`, async ({ page }) => {
      await page.goto(`/${lang}/short`);
      // Stabilise le layout avant l'export : polices chargées + fit des pastilles
      // (JobFrameworkPills / domaines mesurent en useLayoutEffect).
      await page.evaluate(() => (document as Document).fonts.ready);
      await page.waitForTimeout(400);

      const pdf = await page.pdf({
        preferCSSPageSize: true,
        printBackground: true,
      });
      const pages = countPdfPages(pdf);

      expect(
        pages,
        `le CV court /${lang}/short doit tenir sur 1 page A4 (rendu : ${pages})`,
      ).toBe(1);
    });
  }
});
