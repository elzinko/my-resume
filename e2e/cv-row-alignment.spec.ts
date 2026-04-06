import { test, expect } from '@playwright/test';

test.describe('CV title/date rows (mobile)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('job mobile: ligne 1 client seul; ligne 2 poste / ville / dates (alignement bas)', async ({
    page,
  }) => {
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
    const rb = await dates.evaluate((el) => el.getBoundingClientRect().bottom);
    expect(
      Math.abs(lb - rb),
      `Bottom edges should align (left=${lb}, right=${rb})`,
    ).toBeLessThanOrEqual(2);

    await expect(meta).toContainText('/');

    /** Les « / » : même marge à gauche et à droite entre les boîtes de texte (symétrie). */
    const seps = meta.locator('[data-job-meta="sep"]');
    await expect(seps).toHaveCount(2);

    const rects = await meta.evaluate((row) => {
      const role = row.querySelector('[data-job-meta="role"]');
      const loc = row.querySelector('[data-job-meta="location"]');
      const dates = row.querySelector('[data-job-meta="dates"]');
      const s = row.querySelectorAll('[data-job-meta="sep"]');
      if (!role || !loc || !dates || s.length !== 2) return null;
      const r = (el: Element) => el.getBoundingClientRect();
      return {
        role: r(role),
        loc: r(loc),
        dates: r(dates),
        sep0: r(s[0]!),
        sep1: r(s[1]!),
      };
    });
    expect(rects, 'geometry for job meta row').not.toBeNull();
    if (!rects) return;

    const sep0Cx = (rects.sep0.left + rects.sep0.right) / 2;
    const gapLeft0 = sep0Cx - rects.role.right;
    const gapRight0 = rects.loc.left - sep0Cx;
    expect(
      Math.abs(gapLeft0 - gapRight0),
      `Sep1 centered between role and location (L=${gapLeft0}, R=${gapRight0})`,
    ).toBeLessThanOrEqual(8);

    const sep1Cx = (rects.sep1.left + rects.sep1.right) / 2;
    const gapLeft1 = sep1Cx - rects.loc.right;
    const gapRight1 = rects.dates.left - sep1Cx;
    expect(
      Math.abs(gapLeft1 - gapRight1),
      `Sep2 centered between location and dates (L=${gapLeft1}, R=${gapRight1})`,
    ).toBeLessThanOrEqual(8);
  });

  test('job mobile: bouton détail déplie texte long ou puces', async ({ page }) => {
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

  test('header: titre sous Thomas Couderc selon la locale', async ({ page }) => {
    await page.goto('/fr');
    await expect(page.locator('.header-content p').first()).toHaveText(
      'Développeur full stack senior',
    );
    await page.goto('/en');
    await expect(page.locator('.header-content p').first()).toHaveText(
      'Senior Fullstack Developer',
    );
  });

  test('job tablet (~820px): méta mobile visible (< lg, colonne main étroite)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 800 });
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

  test('project row: title and dates share bottom edge', async ({ page }) => {
    await page.goto('/fr');
    const row = page
      .locator('#projects li')
      .first()
      .locator('section .cv-row-with-side-meta')
      .first();
    await expect(row).toBeVisible();
    const left = row.locator('span').first();
    const right = row.locator('span').nth(1);
    const lb = await left.evaluate((el) => el.getBoundingClientRect().bottom);
    const rb = await right.evaluate((el) => el.getBoundingClientRect().bottom);
    expect(Math.abs(lb - rb)).toBeLessThanOrEqual(2);
  });
});
