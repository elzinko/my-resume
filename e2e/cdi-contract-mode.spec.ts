import { test, expect } from '@playwright/test';

test.describe('CDI contract mode', () => {
  const CDI_ABOUT_TEXT =
    'Agile fullstack engineer with 20 years of experience';
  const DEFAULT_ABOUT_TEXT =
    'I am an agile fullstack consultant passionate about open source';

  test('CDI-specific summary text appears with ?contract=cdi', async ({
    page,
  }) => {
    await page.goto('/en?contract=cdi');

    // Page loads correctly with the candidate name visible
    await expect(page.getByText('Thomas Couderc')).toBeVisible();

    // The Summary section exists
    const summarySection = page.locator('#about');
    await expect(summarySection).toBeVisible();
    await expect(
      summarySection.getByRole('heading', { name: 'Summary' }),
    ).toBeVisible();

    // CDI-specific text is rendered inside the Summary section
    await expect(summarySection.getByText(CDI_ABOUT_TEXT)).toBeVisible();

    // The default freelance text should NOT be present
    await expect(summarySection.getByText(DEFAULT_ABOUT_TEXT)).toHaveCount(0);
  });

  test('Professional Experience section exists in CDI mode', async ({
    page,
  }) => {
    await page.goto('/en?contract=cdi');

    await expect(
      page.getByRole('heading', { name: 'Professional Experience' }),
    ).toBeVisible();
  });

  test('CDI text is absent when no contract param is set', async ({ page }) => {
    await page.goto('/en');

    // Page loads correctly
    await expect(page.getByText('Thomas Couderc')).toBeVisible();

    // The Summary section shows the default freelance text
    const summarySection = page.locator('#about');
    await expect(summarySection.getByText(DEFAULT_ABOUT_TEXT)).toBeVisible();

    // CDI-specific text must NOT appear
    await expect(summarySection.getByText(CDI_ABOUT_TEXT)).toHaveCount(0);
  });
});
