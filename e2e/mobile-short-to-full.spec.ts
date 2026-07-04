import { test, expect } from '@playwright/test';

/**
 * Backlog job-app 0016 — sur MOBILE, le CV court ne s'AFFICHE jamais : la route
 * `/[lang]/short` rebascule vers `/[lang]` (affichage mobile unifié = complet).
 * L'IMPRESSION reste indépendante (sélecteur `MobilePrintChooser`) : les contextes
 * `?autoprint=1` et `?print` sont EXEMPTÉS du redirect, sinon on casserait
 * l'impression du court depuis mobile.
 *
 * On teste 4 invariants : redirect mobile (+ query préservée), pas de redirect
 * desktop, exemption `?print`, et exemption `?autoprint` (l'impression part bien
 * depuis /short, pas depuis le complet).
 */

const MOBILE = { width: 390, height: 840 };
const DESKTOP = { width: 1200, height: 900 };

test.describe('Mobile : /short → /complet', () => {
  test.use({ viewport: MOBILE });

  test('mobile : /fr/short rebascule vers /fr', async ({ page }) => {
    await page.goto('/fr/short');
    await expect(page).toHaveURL(/\/fr(\?.*)?$/);
  });

  test('mobile : la query est préservée à la bascule', async ({ page }) => {
    await page.goto('/fr/short?company=Acme&title_fr=Lead');
    await expect(page).toHaveURL(/\/fr\?.*company=Acme/);
    await expect(page).toHaveURL(/title_fr=Lead/);
    await expect(page).not.toHaveURL(/\/short/);
  });

  test('mobile : ?print=1 est EXEMPTÉ (reste sur /short, aperçu impression)', async ({
    page,
  }) => {
    await page.goto('/fr/short?print=1');
    // Laisse le temps à un éventuel redirect de se produire, puis vérifie qu'il
    // n'a PAS eu lieu.
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/fr\/short/);
  });

  test('mobile : ?autoprint=1 imprime bien le COURT (pas le complet)', async ({
    page,
  }) => {
    // Stub d'impression : enregistre la route active au moment du print.
    await page.addInitScript(() => {
      (window as unknown as { __printedAt: string | null }).__printedAt = null;
      window.print = () => {
        (window as unknown as { __printedAt: string | null }).__printedAt =
          location.pathname;
      };
    });
    await page.goto('/fr/short?autoprint=1');
    await page.waitForFunction(
      () =>
        (window as unknown as { __printedAt: string | null }).__printedAt !==
        null,
    );
    const printedAt = await page.evaluate(
      () => (window as unknown as { __printedAt: string | null }).__printedAt,
    );
    expect(printedAt).toMatch(/\/fr\/short$/);
  });
});

test.describe('Desktop : /short reste /short', () => {
  test.use({ viewport: DESKTOP });

  test('desktop : /fr/short ne rebascule pas', async ({ page }) => {
    await page.goto('/fr/short');
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/fr\/short/);
  });
});
