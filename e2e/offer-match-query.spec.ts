import { test, expect } from '@playwright/test';

/**
 * Sur le CV complet, l'adéquation poste issue des paramètres d'offre est rendue par
 * la section BODY `#job-fit` (`JobFitSection`, pastilles `match`) — il n'y a pas de
 * bandeau de pastilles dans l'en-tête (l'ancien `data-testid="header-job-fit-pills"`
 * n'a jamais été branché sur une page). On valide donc le rendu dans `#job-fit`.
 */
test.describe('Offer match (query params)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('readable GET params render profile match section', async ({ page }) => {
    const q =
      'company=TestCo&title=Developer&requirement=Java:java,spring&requirement=SQL:sql';
    await page.goto(`/fr?${q}`);
    const jobFit = page.locator('#job-fit');
    await expect(jobFit).toBeVisible();
    await expect(jobFit.getByText('Java', { exact: true })).toBeVisible();
  });

  test('requirement avec @id catalogue matche une mission (Vue.js)', async ({
    page,
  }) => {
    const q =
      'company=Padoa&title=Dev&requirement=Vue.js%3A%40an8YW0VVTf2JuZZZo1W0pw';
    await page.goto(`/fr?${q}`);
    const jobFit = page.locator('#job-fit');
    await expect(jobFit).toBeVisible();
    await expect(jobFit.getByText('Vue.js', { exact: true })).toBeVisible();
  });

  test('racine offre → version courte conserve les paramètres GET', async ({
    page,
  }) => {
    // La bascule court/complet est DESKTOP-only (cf. HeaderToolbar : « ni bascule
    // court/complet … Ces contrôles restent sur desktop »). En mobile, on ne
    // switche pas de vue (le choix se fait à l'impression, nouvel onglet). On
    // valide donc la conservation des params sur le vrai lien : `CvModeToggle`,
    // même onglet, dans la barre desktop.
    await page.setViewportSize({ width: 1280, height: 900 });
    const q =
      'company=TestCo&title=Developer&requirement=Java:java,spring&requirement=SQL:sql';
    await page.goto(`/fr?${q}`);
    await expect(page.locator('#job-fit')).toBeVisible();
    await page
      .locator('[data-testid="cv-header-toolbar"] a[href*="/short"]')
      .first()
      .click();
    await expect(page).toHaveURL(/\/fr\/short\?/);
    const u = new URL(page.url());
    expect(u.searchParams.get('company')).toBe('TestCo');
    expect(u.searchParams.getAll('requirement').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  test('CV court : company + requirement charge sans section #profile-match (adéquation en en-tête uniquement)', async ({
    page,
  }) => {
    const q = new URLSearchParams({
      company: 'TestCo',
      title: 'Développeur Java',
      requirement: 'Java:java,spring',
    });
    await page.goto(`/fr/short?${q.toString()}`);
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
