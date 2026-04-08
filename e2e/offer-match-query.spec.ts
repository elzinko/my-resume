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
    await expect(
      page.locator('#profile-match').getByText('JPB Système').first(),
    ).toBeVisible();
  });

  test('offer/match → version courte conserve les paramètres GET', async ({
    page,
  }) => {
    const q =
      'company=TestCo&title=Developer&requirement=Java:java,spring&requirement=SQL:sql';
    await page.goto(`/fr/offer/match?${q}`);
    await expect(page.locator('#profile-match')).toBeVisible();
    await page.getByRole('link', { name: /Version courte/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/short\?/);
    const u = new URL(page.url());
    expect(u.searchParams.get('company')).toBe('TestCo');
    expect(u.searchParams.getAll('requirement').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  test('CV court : ?offer=<id> affiche l’adéquation (mode condensé)', async ({
    page,
  }) => {
    await page.goto('/fr/short?offer=safran-ia-factory');
    await expect(page.locator('#profile-match')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Adéquation avec le poste/i }),
    ).toBeVisible();
    await expect(
      page.locator('#profile-match .cv-match-requirement-card'),
    ).toHaveCount(3);
    const matchSection = page.locator('#profile-match');
    await expect(matchSection.getByText('Python', { exact: true })).toBeVisible();
    await expect(matchSection.getByText('React', { exact: true })).toBeVisible();
    await expect(
      matchSection.getByText('AWS / Cloud', { exact: true }),
    ).toBeVisible();
  });

  test('CV court : paramètres company + requirement affichent l’adéquation (condensé)', async ({
    page,
  }) => {
    const q = new URLSearchParams({
      company: 'Padoa',
      title: 'Developpeur Fullstack Confirme (CDI ou Freelance)',
      requirement: 'React:react',
    });
    q.append('requirement', 'Node.js:nodejs');
    q.append('requirement', 'TypeScript:typescript');
    await page.goto(`/fr/short?${q.toString()}`);
    await expect(page.locator('#profile-match')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Adéquation avec le poste/i }),
    ).toBeVisible();
    await expect(
      page.locator('#profile-match .cv-match-requirement-card'),
    ).toHaveCount(3);
  });
});
