import { test, expect } from '@playwright/test';

test.describe('CV title/date rows (mobile)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('job mobile: client ligne 1; poste + dates visibles; lieu sr-only; descriptions sans ellipsis', async ({
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
    const location = meta.locator('[data-job-meta="location"]');
    const dates = meta.locator('[data-job-meta="dates"]');
    await expect(role).toBeVisible();
    await expect(dates).toBeVisible();
    await expect(location).toContainText('Montereau-sur-le-Jard');
    const locationBox = await location.boundingBox();
    expect(
      locationBox && locationBox.width <= 2 && locationBox.height <= 2,
      'location is screen-reader-only (no layout footprint)',
    ).toBeTruthy();

    await expect(role).toContainText('Développeur IOT');

    const seps = meta.locator('[data-job-meta="sep"]');
    await expect(seps).toHaveCount(0);

    const metaLine = job.getByTestId('job-meta-mobile-line');
    await expect(metaLine).toBeVisible();
    const visibleInLine = await metaLine.evaluate((el) =>
      Array.from(el.children).filter((c) => {
        const r = c.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      }).length,
    );
    expect(
      visibleInLine,
      'ligne mobile : poste + dates (2 nœuds visibles dans le flex)',
    ).toBe(2);

    const sameRow = await metaLine.evaluate((el) => {
      const kids = Array.from(el.children).filter((c) => {
        const r = c.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      });
      if (kids.length < 2) return false;
      const tops = kids.map((k) => k.getBoundingClientRect().top);
      return Math.max(...tops) - Math.min(...tops) <= 4;
    });
    expect(sameRow, 'poste et dates sur la même rangée (baseline)').toBeTruthy();

    const noHorizontalEllipsis = async (loc: ReturnType<typeof page.locator>) => {
      const overflow = await loc.evaluate((el) =>
        window.getComputedStyle(el).textOverflow,
      );
      expect(overflow, 'no text-overflow ellipsis').not.toBe('ellipsis');
    };
    await noHorizontalEllipsis(role);
    await noHorizontalEllipsis(dates);
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
