import { test, expect } from '@playwright/test';

/**
 * Grille 3 colonnes (domaines) + split 1/3 + 2/3 (#left / #main) :
 * le bord gauche de la 2ᵉ colonne domaine (Dev) doit coïncider avec #main.
 */
test.describe('CV desktop column alignment', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  async function expectDevAlignedWithMain(
    page: import('@playwright/test').Page,
  ) {
    const devCol = page.locator('#domains .cv-domains-grid > *').nth(1);
    const main = page.locator('#main');

    await expect(devCol).toBeVisible();
    await expect(main).toBeVisible();

    const devX = Math.round(
      await devCol.evaluate((el) => el.getBoundingClientRect().left),
    );
    const mainX = Math.round(
      await main.evaluate((el) => el.getBoundingClientRect().left),
    );

    expect(
      Math.abs(devX - mainX),
      `Dev column left (${devX}px) should match #main left (${mainX}px)`,
    ).toBeLessThanOrEqual(2);
  }

  async function expectAgileAlignedWithLeft(
    page: import('@playwright/test').Page,
  ) {
    const agileCol = page.locator('#domains .cv-domains-grid > *').first();
    const left = page.locator('#left');

    await expect(agileCol).toBeVisible();
    await expect(left).toBeVisible();

    const aX = Math.round(
      await agileCol.evaluate((el) => el.getBoundingClientRect().left),
    );
    const lX = Math.round(
      await left.evaluate((el) => el.getBoundingClientRect().left),
    );

    expect(
      Math.abs(aX - lX),
      `First domain left (${aX}px) should match #left left (${lX}px)`,
    ).toBeLessThanOrEqual(2);
  }

  test('CV complet : Dev ↔ #main, Agile ↔ #left', async ({ page }) => {
    await page.goto('/fr');
    await expectDevAlignedWithMain(page);
    await expectAgileAlignedWithLeft(page);
  });

  test('CV court : Dev ↔ #main, Agile ↔ #left', async ({ page }) => {
    await page.goto('/fr/short');
    await expectDevAlignedWithMain(page);
    await expectAgileAlignedWithLeft(page);
  });
});
