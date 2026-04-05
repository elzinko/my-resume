import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1100, height: 800 } });

async function assertToolbarHeightsUniform(page: import('@playwright/test').Page) {
  const bar = page.getByTestId('cv-header-toolbar');
  await expect(bar).toBeVisible();
  const controls = bar.locator('a, button');
  const n = await controls.count();
  expect(n).toBeGreaterThanOrEqual(5);
  const heights: number[] = [];
  for (let i = 0; i < n; i++) {
    const h = await controls
      .nth(i)
      .evaluate((el) => el.getBoundingClientRect().height);
    heights.push(h);
  }
  const min = Math.min(...heights);
  const max = Math.max(...heights);
  expect(
    max - min,
    `Toolbar control heights should match (got px: ${heights.map((h) => h.toFixed(2)).join(', ')})`,
  ).toBeLessThanOrEqual(1);
  /* h-8 = 32px + bordure ~2px selon le moteur */
  expect(min).toBeGreaterThanOrEqual(30);
  expect(max).toBeLessThanOrEqual(40);
}

test.describe('CV header toolbar', () => {
  test('full CV: mode + social icons share one height', async ({ page }) => {
    await page.goto('/fr');
    await assertToolbarHeightsUniform(page);
  });

  test('short CV: same toolbar heights', async ({ page }) => {
    await page.goto('/fr/short');
    await assertToolbarHeightsUniform(page);
  });
});
