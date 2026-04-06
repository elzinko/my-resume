import { test, expect } from '@playwright/test';

test.describe('CV title/date rows (mobile)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('job mobile: client seul ligne 1; poste non tronqué; lieu / dates sans ellipsis', async ({
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
    await expect(location).toBeVisible();
    await expect(dates).toBeVisible();

    await expect(role).toContainText('Développeur IOT');
    await expect(location).toContainText('Montereau-sur-le-Jard');
    await expect(meta).toContainText('/');

    const seps = meta.locator('[data-job-meta="sep"]');
    await expect(seps).toHaveCount(1);

    const noHorizontalEllipsis = async (loc: ReturnType<typeof page.locator>) => {
      const overflow = await loc.evaluate((el) =>
        window.getComputedStyle(el).textOverflow,
      );
      expect(overflow, 'no text-overflow ellipsis').not.toBe('ellipsis');
    };
    await noHorizontalEllipsis(role);
    await noHorizontalEllipsis(dates);
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
