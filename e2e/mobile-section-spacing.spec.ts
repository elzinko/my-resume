import { test, expect } from '@playwright/test';

/**
 * Rythme vertical mobile du bloc « Profil + domaines » (CV COMPLET).
 *
 * Intention (cf. docs/cv-rendering-rules.md §3.2) : Agile/Dev/Ops sont des SOUS-titres
 * GROUPÉS sous le Profil, pas des sections sœurs. Sur mobile, le rythme doit être
 * UNIFORME dans tout le bloc : « fin du texte précédent → titre de domaine » ==
 * « titre → texte » (⇒ Profil + domaines perçus comme un seul bloc), et rester
 * NETTEMENT plus petit que l'écart vers la vraie section suivante (Adéquation), qui,
 * lui, sépare les sections.
 *
 * Remplace l'ancien garde-fou (qui exigeait about→domains ≈ domains→adéquation) :
 * cette homogénéité « domaine = section » était justement le bug — les domaines
 * paraissaient des sections à part. Cf. fix « domaines groupés sur mobile ».
 *
 * Garde-fou print : le groupement est posé en `@media screen` → à l'impression les
 * domaines restent en 3 colonnes avec leur espacement print (le groupement mobile ne
 * doit JAMAIS fuiter dans le PDF, même rendu <768px — cf. régression photo).
 */
test.describe('CV mobile — bloc Profil + domaines groupé', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('rythme interne uniforme, séparation nette avant la section suivante', async ({
    page,
  }) => {
    await page.goto('/fr');

    const { intra, toNextSection } = await page.evaluate(() => {
      const round = (n: number) => Math.round(n);
      const grid = document.querySelector('#domains .cv-domains-grid')!;
      const domains = [...grid.children];
      const about = document.querySelector('#about')!;
      const summaryP = [...about.querySelectorAll('p')].pop()!;

      // Écarts INTERNES au bloc, alternés : (texte précédent → titre) puis (titre → texte).
      const intra: number[] = [];
      let prevBottom = summaryP.getBoundingClientRect().bottom;
      domains.forEach((d) => {
        const title = d.querySelector('h2')!;
        const desc = d.querySelector('p.cv-job-description')!;
        const pills = d.querySelector('div.flex.flex-wrap');
        intra.push(round(title.getBoundingClientRect().top - prevBottom));
        intra.push(
          round(
            desc.getBoundingClientRect().top -
              title.getBoundingClientRect().bottom,
          ),
        );
        prevBottom = (pills ?? desc).getBoundingClientRect().bottom;
      });

      const jobFit = document.querySelector('#job-fit')!;
      const toNextSection = round(
        jobFit.getBoundingClientRect().top -
          document.querySelector('#domains')!.getBoundingClientRect().bottom,
      );
      return { intra, toNextSection };
    });

    const maxIntra = Math.max(...intra);
    const minIntra = Math.min(...intra);

    // 1) UNIFORME : tous les écarts internes ~ égaux (tolérance sous-pixel / police).
    expect(
      maxIntra - minIntra,
      `écarts internes homogènes (${intra.join(', ')})`,
    ).toBeLessThanOrEqual(6);

    // 2) GROUPÉ : les écarts internes restent resserrés (pas un rythme de section).
    expect(maxIntra, 'écarts internes resserrés (groupé)').toBeLessThanOrEqual(
      22,
    );

    // 3) SÉPARATION : la vraie section suivante est nettement plus loin que le rythme interne.
    expect(
      toNextSection,
      `domaines → section suivante nettement plus grand (${toNextSection} vs ~${maxIntra})`,
    ).toBeGreaterThan(maxIntra * 1.4);
  });

  test('impression : le groupement mobile ne fuite pas (domaines en 3 colonnes)', async ({
    page,
  }) => {
    // Largeur < md ET média print : reproduit le pire cas (PDF à marges @page larges).
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto('/fr');
    await page.emulateMedia({ media: 'print' });

    const { rowGap, domainsMarginTop, titleTops } = await page.evaluate(() => {
      const grid = document.querySelector('#domains .cv-domains-grid')!;
      const domainsSection = document.querySelector('#domains')!;
      return {
        rowGap: parseFloat(getComputedStyle(grid).rowGap) || 0,
        domainsMarginTop:
          parseFloat(getComputedStyle(domainsSection).marginTop) || 0,
        titleTops: [...grid.querySelectorAll('h2')].map((h) =>
          Math.round(h.getBoundingClientRect().top),
        ),
      };
    });

    // En print, le groupement mobile (row-gap = body-gap, #domains mt = -section-gap)
    // NE doit PAS s'appliquer : row-gap nul et marge non négative.
    expect(rowGap, 'row-gap print = 0 (pas le groupement mobile)').toBeLessThan(
      4,
    );
    expect(
      domainsMarginTop,
      '#domains margin-top print non négatif (pas de remontée mobile)',
    ).toBeGreaterThanOrEqual(0);
    // 3 titres alignés = 3 colonnes.
    expect(
      Math.max(...titleTops) - Math.min(...titleTops),
      `titres alignés en 3 colonnes (${titleTops.join(', ')})`,
    ).toBeLessThanOrEqual(3);

    await page.emulateMedia({ media: 'screen' });
  });
});
