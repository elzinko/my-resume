import { test, expect } from '@playwright/test';

/**
 * En @media print, la grille du CV COURT est en 3 colonnes : sans print:col-span-2
 * sur #main, les missions ne font qu’1/3 de la largeur. On valide via emulateMedia('print').
 *
 * ⚠️ Le CV COMPLET (`/fr`) n'a plus de split `#main`/`#left` : unifié en une seule
 * colonne linéaire (`.cv-full-cv-print-root`). L'ancien cas « CV complet » a été retiré
 * (cf. e2e/cv-column-alignment.spec.ts, même bascule).
 */
test.describe('Print layout', () => {
  test.use({ viewport: { width: 1200, height: 900 } });

  test('CV court : #main nettement plus large que #left (print)', async ({
    page,
  }) => {
    await page.goto('/fr/short');
    await page.emulateMedia({ media: 'print' });
    const { mainW, leftW } = await page.evaluate(() => {
      const main = document.querySelector('#main');
      const left = document.querySelector('#left');
      return {
        mainW: main?.getBoundingClientRect().width ?? 0,
        leftW: left?.getBoundingClientRect().width ?? 0,
      };
    });
    expect(leftW, 'colonne gauche').toBeGreaterThan(64);
    expect(mainW, 'colonne missions').toBeGreaterThan(leftW * 1.45);
    await page.emulateMedia({ media: 'screen' });
  });
});
