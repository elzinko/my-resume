import { test, expect } from '@playwright/test';

test.describe('Offer match (query params)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('readable GET params render profile match section', async ({ page }) => {
    const q =
      'company=TestCo&title=Developer&requirement=Java:java,spring&requirement=SQL:sql';
    await page.goto(`/fr/offer/match?${q}`);
    const pills = page.getByTestId('header-job-fit-pills');
    await expect(pills).toBeVisible();
    await expect(pills.getByText('Java', { exact: true })).toBeVisible();
  });

  test('requirement avec @id catalogue matche une mission (Vue.js)', async ({
    page,
  }) => {
    const q =
      'company=Padoa&title=Dev&requirement=Vue.js%3A%40an8YW0VVTf2JuZZZo1W0pw';
    await page.goto(`/fr/offer/match?${q}`);
    const pills = page.getByTestId('header-job-fit-pills');
    await expect(pills).toBeVisible();
    await expect(pills.getByText('Vue.js', { exact: true })).toBeVisible();
  });

  test('offer/match → version courte conserve les paramètres GET', async ({
    page,
  }) => {
    const q =
      'company=TestCo&title=Developer&requirement=Java:java,spring&requirement=SQL:sql';
    await page.goto(`/fr/offer/match?${q}`);
    await expect(page.getByTestId('header-job-fit-pills')).toBeVisible();
    /** Barre mobile : menu ouvert ; cibler le 2ᵉ lien (le 1ᵉʳ est dans la barre `md:` masquée). */
    await page.getByTestId('cv-mobile-menu-toggle').click();
    await page.locator('a[title="Version courte"]').last().click();
    await expect(page).toHaveURL(/\/fr\/short\?/);
    const u = new URL(page.url());
    expect(u.searchParams.get('company')).toBe('TestCo');
    expect(u.searchParams.getAll('requirement').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  test('CV court : ?offer=<id> charge sans section #profile-match (adéquation en en-tête uniquement)', async ({
    page,
  }) => {
    await page.goto('/fr/short?offer=safran-ia-factory');
    await expect(page.locator('#profile-match')).toHaveCount(0);
    await expect(page.locator('#domains')).toBeVisible();
  });

  test('CV court : paramètres company + requirement — pas de #profile-match dans le corps', async ({
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
    await expect(page.locator('#profile-match')).toHaveCount(0);
  });
});
