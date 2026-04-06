import { test, expect } from '@playwright/test';

test.describe('Short CV locale', () => {
  test('switching FR from EN keeps /short path', async ({ page }) => {
    await page.goto('/en/short');
    await expect(page).toHaveURL(/\/en\/short/);
    await page.getByTestId('cv-header-toolbar').getByTestId('locale-switch').click();
    await expect(page).toHaveURL(/\/fr\/short/);
  });

  test('switching EN from FR keeps /short path', async ({ page }) => {
    await page.goto('/fr/short');
    await expect(page).toHaveURL(/\/fr\/short/);
    await page.getByTestId('cv-header-toolbar').getByTestId('locale-switch').click();
    await expect(page).toHaveURL(/\/en\/short/);
  });
});
