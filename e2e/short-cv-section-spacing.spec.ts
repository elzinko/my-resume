import { test, expect, type Page } from '@playwright/test';

/**
 * CV court (`/fr/short`) — rythme vertical RÉGULIER, piloté par des tokens uniques.
 *
 * NB (backlog 0016) : sur un viewport mobile, `/short` rebascule vers le complet
 * (le court ne s'affiche jamais en mobile ; le choix court/complet se fait à
 * l'impression). On mesure donc via `?print=1`, EXEMPTÉ de cette bascule : le court
 * reste rendu dans son régime d'IMPRESSION (que Chrome évalue < 768px) — c'est le
 * rythme A4 canonique, le seul qui compte désormais pour le court. Ce régime est
 * plus DENSE que l'ancien reflow mobile (écarts ~5px au lieu de ~6+) : le vrai
 * garde-fou reste le RATIO (rythme uniforme), le plancher n'assure que des écarts
 * positifs et réels (token `--cv-section-body-gap`, stable inter-OS).
 *
 * Deux règles générales (rythme identique web / impression) :
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
    // `print=1` : exempte le redirect mobile→complet (0016) → le court reste
    // rendu (identique à la vue normale, `.cv-print-preview` permanent).
    await page.goto(`/fr/short?print=1&${OFFER_QS}`);

    const filet = await bbox(page, '#cv-short-about h2');
    const intro = await bbox(page, '#cv-short-about p');
    const firstDomain = await bbox(
      page,
      '.cv-short-page #domains .cv-domains-grid h2',
    );

    const filetToIntro = intro.top - filet.bottom;
    const introToDomains = firstDomain.top - intro.bottom;

    // Régime impression du court (via `?print=1`) : écarts denses (~5px mesurés).
    // Plancher = juste « positif et réel » ; le vrai garde-fou est le ratio ci-dessous.
    expect(filetToIntro, 'filet Profil → intro').toBeGreaterThanOrEqual(4);
    expect(introToDomains, 'intro → 1er domaine').toBeGreaterThanOrEqual(4);
    expect(
      ratio(filetToIntro, introToDomains),
      `body-gap homogène (${Math.round(filetToIntro)}px vs ${Math.round(
        introToDomains,
      )}px)`,
    ).toBeLessThanOrEqual(1.2);
  });

  // Gaps inter-lignes de l'en-tête : DÉTERMINISTES et indépendants de la police → GATÉS
  // en CI (l'ancienne hypothèse « débord de glyphe, macOS ≠ ubuntu » était fausse ;
  // `getBoundingClientRect` mesure la BOÎTE de bloc, pas l'encre du glyphe, et les
  // line-height sont explicites). L'écart = margin-top 0.125rem (2px, styles/globals.css)
  // × zoom (1 avant hydratation, 0.82 après CvZoomSlider) → toujours positif et homogène.
  //
  // DEUX précautions, sinon rouge sur le runner ubuntu (pas en local macOS) :
  //  1. Sélecteurs scopés `.cv-short-page` — ADR-0006 : /short rend 2 arbres DOM en
  //     desktop ; sans scope, `.first()` tombe sur le shell mobile caché → rect 0×0.
  //  2. Les 3 rects mesurés dans UN SEUL `page.evaluate` (atomique). Le zoom du court est
  //     appliqué par JS (CvZoomSlider) après hydratation : 3 mesures séparées peuvent
  //     enjamber ce reflow (nom mesuré à zoom 1, rôle à zoom 0.82) → écart négatif
  //     fantôme (~-6px observé en CI). Une passe synchrone fige un layout cohérent.
  test('En-tête : nom→rôle == rôle→âge (rythme uniforme)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1400 });
    await page.goto(`/fr/short?${OFFER_QS}`);

    const { nameToRole, roleToAge } = await page.evaluate(() => {
      const bottomTop = (s: string) => {
        const r = document.querySelector(s)!.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      };
      const name = bottomTop('.cv-short-page [data-cv-id="fullname"]');
      const role = bottomTop('.cv-short-page [data-cv-id="title"]');
      const age = bottomTop('.cv-short-page [data-cv-id="age"]');
      return {
        nameToRole: role.top - name.bottom,
        roleToAge: age.top - role.bottom,
      };
    });

    expect(nameToRole, 'nom → rôle').toBeGreaterThanOrEqual(1);
    expect(roleToAge, 'rôle → âge').toBeGreaterThanOrEqual(1);
    expect(
      ratio(nameToRole, roleToAge),
      `gaps en-tête homogènes (${Math.round(nameToRole)}px vs ${Math.round(
        roleToAge,
      )}px)`,
    ).toBeLessThanOrEqual(1.25);
  });
});
