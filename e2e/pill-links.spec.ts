import { test, expect } from '@playwright/test';

test.describe('Pill links', () => {
  test.describe('Job Fit section — client badge anchor links', () => {
    test('client pills in Job Fit are <a> elements pointing to mission anchors', async ({
      page,
    }) => {
      await page.goto('/en?contract=cdi');

      const jobFitSection = page.locator('#job-fit');
      await expect(jobFitSection).toBeVisible();

      // Client badge pills (borderless, small) are rendered as <a> tags
      const clientPills = jobFitSection.locator('a[href^="#mission-"]');
      const count = await clientPills.count();
      expect(count).toBeGreaterThan(0);

      // Each pill href must follow the #mission-<slug> pattern
      for (let i = 0; i < count; i++) {
        const href = await clientPills.nth(i).getAttribute('href');
        expect(href).toMatch(/^#mission-[a-z0-9-]+$/);
      }
    });

    test('mission anchor targets exist on the page', async ({ page }) => {
      await page.goto('/en?contract=cdi');

      const jobFitSection = page.locator('#job-fit');
      const clientPills = jobFitSection.locator('a[href^="#mission-"]');
      const count = await clientPills.count();
      expect(count).toBeGreaterThan(0);

      // Collect unique anchor ids referenced by the pills
      const anchorIds = new Set<string>();
      for (let i = 0; i < count; i++) {
        const href = await clientPills.nth(i).getAttribute('href');
        if (href) anchorIds.add(href.slice(1)); // strip leading #
      }

      // Every referenced id must exist as an element on the page
      for (const id of anchorIds) {
        await expect(
          page.locator(`#${CSS.escape(id)}`),
          `Anchor target #${id} should exist`,
        ).toHaveCount(1);
      }
    });
  });

  test.describe('Professional Experience — external client links', () => {
    test('client names in job entries link to external sites', async ({
      page,
    }) => {
      await page.goto('/en?contract=cdi');

      const jobsSection = page.locator('#jobs');
      await expect(jobsSection).toBeVisible();

      // BlaBlaCar should link to blablacar.fr
      const blablaLink = jobsSection.locator(
        'a[href="https://www.blablacar.fr"]',
      );
      await expect(blablaLink).toBeVisible();
      await expect(blablaLink).toHaveAttribute('target', '_blank');
      await expect(blablaLink).toHaveText('BlaBlaCar');

      // Edelia should link to edelia.fr
      const edeliaLink = jobsSection.locator('a[href="https://www.edelia.fr"]');
      await expect(edeliaLink).toBeVisible();
      await expect(edeliaLink).toHaveAttribute('target', '_blank');
      await expect(edeliaLink).toHaveText('Edelia');
    });

    test('external client links open in a new tab (target=_blank)', async ({
      page,
    }) => {
      await page.goto('/en?contract=cdi');

      const jobsSection = page.locator('#jobs');

      // All external links in the jobs section that go to client sites
      // should have target="_blank" and rel="noopener noreferrer"
      const externalLinks = jobsSection.locator(
        'a[target="_blank"][rel="noopener noreferrer"]',
      );
      const count = await externalLinks.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const href = await externalLinks.nth(i).getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);
      }
    });
  });
});
