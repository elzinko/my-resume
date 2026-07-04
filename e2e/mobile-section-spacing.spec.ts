import { test, expect } from '@playwright/test';

/**
 * Rythme vertical mobile : les écarts entre sections EN FLUX (Profil → Domaines →
 * Adéquation poste) sont du même ordre (marges de section homogènes).
 *
 * ⚠️ On ne compare PAS header → Profil : sous md, `.cv-full-cv-print-root` porte
 * `mt-20` (80px) de CLEARANCE pour la barre d'outils fixe — un écart volontairement
 * plus grand, pas du rythme de section. Le comparer au gap inter-section (~24px)
 * donnait un faux positif (ratio ~3,2). On mesure donc deux gaps inter-section
 * consécutifs, qui doivent rester homogènes.
 */
test.describe('CV mobile vertical rhythm', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('about→domains et domains→adéquation : écarts du même ordre', async ({
    page,
  }) => {
    await page.goto('/fr');

    const about = page.locator('#about');
    const domains = page.locator('#domains');
    const jobFit = page.locator('#job-fit');

    await expect(about).toBeVisible();
    await expect(domains).toBeVisible();
    await expect(jobFit).toBeVisible();

    const bottom = (loc: import('@playwright/test').Locator) =>
      loc.evaluate((el) => el.getBoundingClientRect().bottom);
    const top = (loc: import('@playwright/test').Locator) =>
      loc.evaluate((el) => el.getBoundingClientRect().top);

    const aboutBottom = await bottom(about);
    const domainsTop = await top(domains);
    const domainsBottom = await bottom(domains);
    const jobFitTop = await top(jobFit);

    const gapAboutDomains = domainsTop - aboutBottom;
    const gapDomainsJobFit = jobFitTop - domainsBottom;

    expect(gapAboutDomains, 'about → domains').toBeGreaterThanOrEqual(12);
    expect(gapDomainsJobFit, 'domains → job-fit').toBeGreaterThanOrEqual(12);

    const ratio =
      Math.max(gapAboutDomains, gapDomainsJobFit) /
      Math.min(gapAboutDomains, gapDomainsJobFit);
    expect(
      ratio,
      `Gaps should be similar (${gapAboutDomains}px vs ${gapDomainsJobFit}px)`,
    ).toBeLessThanOrEqual(1.55);
  });
});
