import { test, expect } from '@playwright/test';

test.describe('Offer match (query params)', () => {
  test('readable GET params render profile match section', async ({ page }) => {
    const q =
      'company=TestCo&title=Developer&requirement=Java:java,spring&requirement=SQL:sql';
    await page.goto(`/fr/offer/match?${q}`);
    await expect(page.locator('#profile-match')).toBeVisible();
    await expect(page.getByTestId('match-offer-invalid')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Java' })).toBeVisible();
  });

  test('cv_role overrides headline under name', async ({ page }) => {
    const q =
      'company=TestCo&title=Dev&requirement=Java:java&cv_role=Architecte+senior+cible';
    await page.goto(`/fr/offer/match?${q}`);
    await expect(
      page.locator('header .header-content').getByRole('paragraph'),
    ).toHaveText('Architecte senior cible');
  });
});
