import { test, expect } from '@playwright/test';

test.describe('CV title/date rows (mobile)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('job mobile: ligne 1 client seul; ligne 2 poste et dates (alignement bas)', async ({
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

    const roleText = await role.textContent();
    const datesText = await dates.textContent();
    expect(roleText?.trim().length ?? 0).toBeGreaterThan(0);
    expect(datesText?.trim().length ?? 0).toBeGreaterThan(0);
  });

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

  test('header: subtitle matches CV locale (fr.json / en.json)', async ({
    page,
  }) => {
    await page.goto('/fr');
    await expect(page.locator('.header-content p').first()).toHaveText(
      'Développeur fullstack',
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
