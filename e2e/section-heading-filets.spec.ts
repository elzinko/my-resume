import { test, expect } from '@playwright/test';

/**
 * Filets de section alignés à l'impression (CV court, 2 colonnes).
 *
 * Garde-fou du bug récurrent : un titre AVEC libellé ATS (`<h2 flex>` à 2 enfants)
 * était plus haut qu'un titre SANS (`Adéquation poste`) → leurs filets (`border-b`)
 * se désalignaient d'une colonne à l'autre. Corrigé en rendant TOUS les titres
 * en `<h2 flex>` + `leading-none` sur le span ATS (qui n'enfle plus la boîte).
 */
const Q =
  'company=iad&title_fr=Engineering+Manager&subtitle_fr=Tech+Lead' +
  '&requirement=Leadership:lead,management&requirement=TypeScript:typescript' +
  '&requirement=Node.js:nodejs,nestjs';

test.describe('Filets de section — alignement (impression)', () => {
  test.use({ viewport: { width: 1000, height: 1300 } });

  test('CV court : Adéquation et Expérience — filets à la même hauteur', async ({
    page,
  }) => {
    await page.goto(`/fr/short?${Q}`);
    await page.evaluate(() =>
      document.documentElement.classList.add('cv-print-preview'),
    );

    const bottomOf = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((el) => Math.round(el.getBoundingClientRect().bottom));

    const adequation = await bottomOf('#left #job-fit h2');
    const experience = await bottomOf('#main > section h2');

    expect(
      Math.abs(adequation - experience),
      `filet Adéquation (${adequation}) vs Expérience (${experience})`,
    ).toBeLessThanOrEqual(1);
  });
});
