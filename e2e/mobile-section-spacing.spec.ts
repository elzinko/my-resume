import { test, expect } from '@playwright/test';

/**
 * Rythme vertical mobile : les domaines (Agile/Dev/Ops) sont des SOUS-blocs du
 * Profil, pas des sections sœurs (même intention que le CV court, cf.
 * short-cv-section-spacing). Trois invariants :
 *
 *   1. l'écart au-dessus de CHAQUE titre de domaine est identique
 *      (Profil→Agile == Agile→Dev == Dev→Ops) ;
 *   2. cet écart est du même ordre que l'écart titre→texte d'un domaine
 *      (2 × --cv-section-body-gap ≈ mt-4 = 16px) ;
 *   3. domaines → Adéquation poste reste un écart de SECTION (flex-gap
 *      --cv-section-gap), nettement plus grand — c'est LUI qui marque le
 *      changement de section, pas les titres de domaines.
 *
 * ⚠️ On ne compare PAS header → Profil : sous md, `.cv-full-cv-print-root` porte
 * `mt-20` (80px) de CLEARANCE pour la barre d'outils fixe — un écart volontairement
 * plus grand, pas du rythme de section.
 */
test.describe('CV mobile vertical rhythm', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('domaines = sous-blocs du Profil : écarts uniformes ≈ titre→texte', async ({
    page,
  }) => {
    await page.goto('/fr');

    const about = page.locator('#about');
    const items = page.locator('#domains .cv-domains-grid > div');
    const jobFit = page.locator('#job-fit');

    await expect(about).toBeVisible();
    await expect(items).toHaveCount(3);
    await expect(jobFit).toBeVisible();

    const box = (loc: import('@playwright/test').Locator) =>
      loc.evaluate((el) => {
        const b = el.getBoundingClientRect();
        return { top: b.top, bottom: b.bottom };
      });

    const aboutBox = await box(about);
    const agile = await box(items.nth(0));
    const dev = await box(items.nth(1));
    const ops = await box(items.nth(2));
    const jobFitBox = await box(jobFit);

    // Titres de domaines = haut du wrapper (le margin-top du wrapper porte le
    // body-gap, donc le haut du BORDER-box == haut du titre).
    const aboveAgile = agile.top - aboutBox.bottom;
    const aboveDev = dev.top - agile.bottom;
    const aboveOps = ops.top - dev.bottom;

    // 2. Référence : écart titre→texte du premier domaine (mt-4 de la description).
    const agileTitle = items.nth(0).locator('h2');
    const agileDesc = items.nth(0).locator('p');
    const titleToText =
      (await box(agileDesc)).top - (await box(agileTitle)).bottom;

    const gaps = [aboveAgile, aboveDev, aboveOps];
    for (const gap of gaps) {
      expect(
        gap,
        `gaps mesurés : ${gaps.map(Math.round).join(' / ')}px`,
      ).toBeGreaterThanOrEqual(8);
    }

    // 1. Uniformité entre les trois écarts.
    const spread = Math.max(...gaps) / Math.min(...gaps);
    expect(
      spread,
      `Écarts au-dessus des titres de domaines non uniformes (${gaps
        .map(Math.round)
        .join(' / ')}px)`,
    ).toBeLessThanOrEqual(1.3);

    // 2. Même ordre de grandeur que titre→texte.
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const vsTitle = Math.max(avg, titleToText) / Math.min(avg, titleToText);
    expect(
      vsTitle,
      `Écart au-dessus des domaines (${Math.round(
        avg,
      )}px) trop éloigné de titre→texte (${Math.round(titleToText)}px)`,
    ).toBeLessThanOrEqual(1.35);

    // 3. Le changement de SECTION (domaines → adéquation poste) reste marqué.
    const sectionGap = jobFitBox.top - ops.bottom;
    expect(
      sectionGap,
      `domains → job-fit (${Math.round(
        sectionGap,
      )}px) doit rester > écart de sous-bloc (${Math.round(avg)}px)`,
    ).toBeGreaterThanOrEqual(avg * 1.2);
  });
});
