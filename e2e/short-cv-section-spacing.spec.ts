import { test, expect } from '@playwright/test';

/**
 * CV court (`/fr/short`) — rythme vertical STRICTEMENT régulier.
 *
 * Garde-fou du token unique `--cv-section-gap` (flex-gap) : tous les écarts
 * inter-sections doivent être quasi identiques (pas de dérive 8/24/32/40 que
 * produisait l'ancien mix de marges qui se collapsaient). Couvre le mobile, là
 * où la dérive était la plus visible.
 */
const OFFER_QS =
  'company=iad&title_fr=Engineering+Manager&subtitle_fr=Tech+Lead&contract=cdi' +
  '&requirement=Leadership:lead,management&requirement=Vue.js:vue.js,nuxt' +
  '&requirement=Node.js:nodejs,nestjs&requirement=TypeScript:typescript' +
  '&requirement=Architecture:architecture,api';

test.describe('CV court — rythme inter-sections régulier', () => {
  test.use({ viewport: { width: 390, height: 1600 } });

  test('mobile : écarts inter-sections quasi identiques (token unique)', async ({
    page,
  }) => {
    await page.goto(`/fr/short?${OFFER_QS}`);

    const bbox = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom };
        });

    // Deux écarts mesurables sur des paires stables : un au niveau racine
    // (Profil → Domaines) et un dans la colonne gauche (Études → Projets).
    const about = await bbox('#cv-short-about');
    const domains = await bbox('#domains');
    const studies = await bbox('#studies');
    const projects = await bbox('#projects');

    const gapAboutDomains = domains.top - about.bottom;
    const gapStudiesProjects = projects.top - studies.bottom;

    expect(gapAboutDomains, 'Profil → Domaines').toBeGreaterThanOrEqual(12);
    expect(gapStudiesProjects, 'Études → Projets').toBeGreaterThanOrEqual(12);

    // Token unique → écarts quasi égaux (tolérance serrée pour le sous-pixel).
    const ratio =
      Math.max(gapAboutDomains, gapStudiesProjects) /
      Math.min(gapAboutDomains, gapStudiesProjects);
    expect(
      ratio,
      `écarts inter-sections homogènes (${Math.round(
        gapAboutDomains,
      )}px vs ${Math.round(gapStudiesProjects)}px)`,
    ).toBeLessThanOrEqual(1.15);
  });
});
