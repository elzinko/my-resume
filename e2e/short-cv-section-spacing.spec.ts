import { test, expect, type Page } from '@playwright/test';

/**
 * CV court (`/fr/short`) — rythme vertical RÉGULIER, piloté par des tokens uniques.
 *
 * Deux règles générales (mêmes valeurs web / impression / mobile) :
 *  1. Profil : filet→intro == intro→domaines. Les domaines sont une SOUS-PARTIE
 *     du Profil → espacés comme du body (`--cv-section-body-gap`), pas comme une
 *     section (le `#domains` annule le flex-gap inter-section, le seul écart
 *     visible est le body-gap du wrapper Domain).
 *  2. En-tête : nom→rôle == rôle→âge (source unique `lineGap` sur les 2 lignes).
 */
const OFFER_QS =
  'company=iad&title_fr=Engineering+Manager&subtitle_fr=Tech+Lead&contract=cdi' +
  '&requirement=Leadership:lead,management&requirement=Vue.js:vue.js,nuxt' +
  '&requirement=Node.js:nodejs,nestjs&requirement=TypeScript:typescript' +
  '&requirement=Architecture:architecture,api';

const bbox = (page: Page, sel: string) =>
  page
    .locator(sel)
    .first()
    .evaluate((el: Element) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    });

const ratio = (a: number, b: number) => Math.max(a, b) / Math.min(a, b);

test.describe('CV court — rythme vertical régulier', () => {
  test('Profil : filet→intro == intro→domaines (body-gap unique)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 1600 });
    await page.goto(`/fr/short?${OFFER_QS}`);

    const filet = await bbox(page, '#cv-short-about h2');
    const intro = await bbox(page, '#cv-short-about p');
    const firstDomain = await bbox(page, '#domains .cv-domains-grid h2');

    const filetToIntro = intro.top - filet.bottom;
    const introToDomains = firstDomain.top - intro.bottom;

    expect(filetToIntro, 'filet Profil → intro').toBeGreaterThanOrEqual(6);
    expect(introToDomains, 'intro → 1er domaine').toBeGreaterThanOrEqual(6);
    expect(
      ratio(filetToIntro, introToDomains),
      `body-gap homogène (${Math.round(filetToIntro)}px vs ${Math.round(
        introToDomains,
      )}px)`,
    ).toBeLessThanOrEqual(1.2);
  });

  // @local-only : écarts entre lignes de texte (nom/rôle/âge) grignotés par le
  // débord de glyphe → dépend de la police système (macOS ≠ ubuntu). Le ratio
  // (rythme uniforme) reste vrai partout, mais les valeurs absolues divergent.
  // Exclu de la CI (cf. .github/workflows/e2e.yml).
  test(
    'En-tête : nom→rôle == rôle→âge (rythme uniforme)',
    { tag: '@local-only' },
    async ({ page }) => {
      // Desktop : c'est là que les marges divergeaient (rôle md:mt-3 vs âge md:mt-2).
      await page.setViewportSize({ width: 1024, height: 1400 });
      await page.goto(`/fr/short?${OFFER_QS}`);

      const name = await bbox(page, '[data-cv-id="fullname"]');
      const role = await bbox(page, '[data-cv-id="title"]');
      const age = await bbox(page, '[data-cv-id="age"]');

      const nameToRole = role.top - name.bottom;
      const roleToAge = age.top - role.bottom;

      // En desktop, `/short` rend en typo A4 compacte (`.cv-print-preview` permanent
      // + règles `min-width: 768px`) : les marges inter-lignes retombent à 2px → gaps
      // ~1,6px. Le plancher garde juste des écarts POSITIFS et réels ; le vrai garde-fou
      // est le ratio ci-dessous (rythme uniforme nom→rôle == rôle→âge).
      expect(nameToRole, 'nom → rôle').toBeGreaterThanOrEqual(1);
      expect(roleToAge, 'rôle → âge').toBeGreaterThanOrEqual(1);
      expect(
        ratio(nameToRole, roleToAge),
        `gaps en-tête homogènes (${Math.round(nameToRole)}px vs ${Math.round(
          roleToAge,
        )}px)`,
      ).toBeLessThanOrEqual(1.25);
    },
  );
});
