import { test, expect } from '@playwright/test';

test.describe('Mobile header menu', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('hamburger opens one-line toolbar strip; toggle closes', async ({
    page,
  }) => {
    await page.goto('/fr');
    const trigger = page.getByTestId('cv-mobile-menu-toggle');
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(page.locator('#cv-mobile-nav')).toBeVisible();
    await expect(page.getByRole('dialog', { name: /menu/i })).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
