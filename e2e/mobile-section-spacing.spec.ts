import { test, expect } from '@playwright/test';

/**
 * Rythme vertical mobile : écart titre→profil proche de l’écart profil→domaines (marges de section homogènes).
 */
test.describe('CV mobile vertical rhythm', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('header→about et about→domains : écarts du même ordre', async ({
    page,
  }) => {
    await page.goto('/fr');

    const headerBlock = page.locator('header .header-content');
    const about = page.locator('#about');
    const domains = page.locator('#domains');

    await expect(headerBlock).toBeVisible();
    await expect(about).toBeVisible();
    await expect(domains).toBeVisible();

    const headerBottom = await headerBlock.evaluate(
      (el) => el.getBoundingClientRect().bottom,
    );
    const aboutTop = await about.evaluate(
      (el) => el.getBoundingClientRect().top,
    );
    const aboutBottom = await about.evaluate(
      (el) => el.getBoundingClientRect().bottom,
    );
    const domainsTop = await domains.evaluate(
      (el) => el.getBoundingClientRect().top,
    );

    const gapHeaderAbout = aboutTop - headerBottom;
    const gapAboutDomains = domainsTop - aboutBottom;

    expect(gapHeaderAbout, 'header → about').toBeGreaterThanOrEqual(12);
    expect(gapAboutDomains, 'about → domains').toBeGreaterThanOrEqual(12);

    const ratio =
      Math.max(gapHeaderAbout, gapAboutDomains) /
      Math.min(gapHeaderAbout, gapAboutDomains);
    expect(
      ratio,
      `Gaps should be similar (${gapHeaderAbout}px vs ${gapAboutDomains}px)`,
    ).toBeLessThanOrEqual(1.55);
  });
});
