import { test, expect } from '@playwright/test';

/**
 * Storybook léger : screenshot par section CV isolée.
 * Filet anti-régression visuel : modifier un composant ne doit casser
 * QUE sa story (pas l'ensemble des layouts).
 *
 * Régénérer les baselines après une modif intentionnelle :
 *   npx playwright test e2e/dev-components.spec.ts --update-snapshots
 */

const STORIES = [
  'header',
  'header-toolbar',
  'header-content',
  'header-content-with-contact',
  'header-contact-strip',
  'about',
  'contact',
  'skills',
  'domains',
  'education-level',
  'profile-education-badge',
  'studies-default',
  'studies-condensed',
  'studies-narrow',
  'hobbies',
  'hobbies-narrow',
  'projects',
  'projects-narrow',
  'projects-short',
  'jobs',
  'jobs-short',
] as const;

const LANGS = ['fr', 'en'] as const;

for (const lang of LANGS) {
  test.describe(`dev/components ${lang}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/${lang}/dev/components`, { waitUntil: 'networkidle' });
    });

    for (const id of STORIES) {
      test(`story ${id}`, async ({ page }) => {
        const card = page.locator(`[data-story="${id}"]`);
        await expect(card).toBeVisible();
        await expect(card).toHaveScreenshot(`${lang}-${id}.png`, {
          maxDiffPixelRatio: 0.01,
        });
      });
    }
  });
}
