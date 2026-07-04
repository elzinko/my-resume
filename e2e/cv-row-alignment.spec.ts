import { test, expect } from '@playwright/test';

test.describe('CV title/date rows (mobile)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  // @local-only : compare des bords BAS de textes alignés sur la baseline
  // (`items-baseline`) → dépend des métriques de glyphes, donc de la police
  // système (macOS ≠ ubuntu). Exclu de la CI (cf. .github/workflows/e2e.yml).
  test(
    'job mobile: ligne 1 client seul; ligne 2 poste et dates (alignement bas)',
    { tag: '@local-only' },
    async ({ page }) => {
      await page.goto('/fr');
      const job = page.locator('#jobs li').first().locator('div[id]');
      const row1 = job.locator('> .cv-row-with-side-meta').first();
      const meta = job.getByTestId('job-meta-mobile');
      await expect(row1).toBeVisible();
      await expect(meta).toBeVisible();

      const row1Date = row1.locator('span').nth(1);
      await expect(row1Date).toBeHidden();

      const role = meta.locator('[data-job-meta="role"]');
      const dates = meta.locator('[data-job-meta="dates"]');
      await expect(role).toBeVisible();
      await expect(dates).toBeVisible();
      const lb = await role.evaluate((el) => el.getBoundingClientRect().bottom);
      const rb = await dates.evaluate(
        (el) => el.getBoundingClientRect().bottom,
      );
      expect(
        Math.abs(lb - rb),
        `Bottom edges should align (left=${lb}, right=${rb})`,
      ).toBeLessThanOrEqual(2);

      const roleText = await role.textContent();
      const datesText = await dates.textContent();
      expect(roleText?.trim().length ?? 0).toBeGreaterThan(0);
      expect(datesText?.trim().length ?? 0).toBeGreaterThan(0);
    },
  );

  test('job mobile: bouton détail déplie texte long ou puces', async ({
    page,
  }) => {
    await page.goto('/fr');
    const firstJob = page.locator('#jobs li').first().locator('div[id]');
    const toggle = firstJob.getByTestId('job-detail-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText('Plus de détails');
    await toggle.click();
    await expect(toggle).toHaveText('Masquer les détails');
    await toggle.click();
    await expect(toggle).toHaveText('Plus de détails');
  });

  test('header: subtitle matches CV locale (bundle fr / en)', async ({
    page,
  }) => {
    await page.goto('/fr');
    await expect(page.locator('.header-content p').first()).toHaveText(
      'Développeur fullstack Senior',
    );
    await page.goto('/en');
    await expect(page.locator('.header-content p').first()).toHaveText(
      'Senior Fullstack Developer',
    );
  });

  test('job below md breakpoint: mobile meta row visible', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto('/fr');
    const meta = page
      .locator('#jobs li')
      .first()
      .locator('div[id]')
      .getByTestId('job-meta-mobile');
    await expect(meta).toBeVisible();
  });

  test('job large desktop (≥lg): méta mobile masquée', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.goto('/fr');
    const meta = page
      .locator('#jobs li')
      .first()
      .locator('div[id]')
      .getByTestId('job-meta-mobile');
    await expect(meta).toBeHidden();
  });

  test('project row: title and year share the first row, detail below', async ({
    page,
  }) => {
    await page.goto('/fr');
    // CV complet unifié : une SEULE section projets, entrées en grille `.cv-entry`
    // (`'title year' / 'detail detail'`, align-items: baseline). Sous md, le titre
    // et l'année sont sur la 1ʳᵉ ligne (année collée à droite), le détail sur la 2ᵉ.
    const entry = page
      .locator('section[data-cv-section="projects"] li.cv-entry')
      .first();
    const title = entry.locator('.cv-entry-title');
    const year = entry.locator('.cv-entry-year');
    const detail = entry.locator('.cv-entry-detail');
    await expect(title).toBeVisible();
    await expect(year).toBeVisible();

    const box = (loc: import('@playwright/test').Locator) =>
      loc.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      });

    const t = await box(title);
    const y = await box(year);

    // Titre (16px) et année (14px) partagent la MÊME ligne (alignés sur la
    // baseline) : leurs plages verticales se chevauchent nettement.
    expect(
      y.top,
      `year top (${y.top}) should sit within the title row (${t.top}–${t.bottom})`,
    ).toBeLessThan(t.bottom);
    expect(
      y.bottom,
      'year bottom should sit within the title row',
    ).toBeGreaterThan(t.top);

    // Le détail est sur la ligne SUIVANTE (2ᵉ ligne de la grille), sous le titre.
    if (await detail.count()) {
      const d = await box(detail);
      expect(
        d.top,
        `detail top (${d.top}) should be below the title row (bottom ${t.bottom})`,
      ).toBeGreaterThanOrEqual(t.bottom - 1);
    }
  });
});
