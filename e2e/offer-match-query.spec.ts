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

  test('requirement avec @id catalogue matche une mission (Vue.js)', async ({
    page,
  }) => {
    const q =
      'company=Padoa&title=Dev&requirement=Vue.js%3A%40an8YW0VVTf2JuZZZo1W0pw';
    await page.goto(`/fr/offer/match?${q}`);
    await expect(page.locator('#profile-match')).toBeVisible();
    await expect(page.getByTestId('match-offer-invalid')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Vue.js' })).toBeVisible();
    await expect(page.locator('#profile-match').getByText('JPB Système')).toBeVisible();
  });

  test('CV court : ?offer=<id> réutilise le même bloc adéquation que les pages offre', async ({
    page,
  }) => {
    await page.goto('/fr/short?offer=safran-ia-factory');
    await expect(page.locator('#profile-match')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Adéquation avec le poste' }),
    ).toBeVisible();
  });
});
