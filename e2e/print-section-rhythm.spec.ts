import { test, expect } from '@playwright/test';

/**
 * Rythme inter-sections uniforme à l'IMPRESSION (CV long, flux linéaire).
 *
 * Filet de régression du bug my-resume#108 : un `padding-top: 1rem` parasite
 * sur `.cv-print-jobs-group` ajoutait ~1rem d'écart AVANT « Expérience », cassant
 * le rythme vertical régulier obtenu via le `gap` flex de `.cv-full-cv-print-root`.
 *
 * Invariante : l'écart vertical avant chaque titre de section
 * (`top(<h2> de la section i)` − `bottom(bloc i-1)`) doit être identique d'une
 * section à l'autre (tolérance 4px). On ordonne les enfants par position réelle
 * car `.cv-full-cv-print-root` réordonne ses items via `order` en flex.
 *
 * On ne compare que des blocs « section » consécutifs (un `<section>` ou le
 * groupe `.cv-print-jobs-group`) : le bloc d'intro (À propos / Compétences) n'est
 * pas une section-pair et son écart au premier titre est légitimement différent.
 */

async function sectionGaps(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const root = document.querySelector('.cv-full-cv-print-root');
    if (!root) throw new Error('.cv-full-cv-print-root introuvable');

    const isSectionBlock = (el: Element) =>
      el.tagName.toLowerCase() === 'section' ||
      el.classList.contains('cv-print-jobs-group');

    // Ordonner les enfants par position verticale réelle (flex `order`).
    const blocks = Array.from(root.children)
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(({ rect }) => rect.height > 0)
      .sort((a, b) => a.rect.top - b.rect.top);

    const gaps: { label: string; gap: number }[] = [];
    for (let i = 1; i < blocks.length; i++) {
      const prev = blocks[i - 1];
      const cur = blocks[i];
      if (!isSectionBlock(prev.el) || !isSectionBlock(cur.el)) continue;
      const h2 = cur.el.querySelector('h2');
      if (!h2) continue;
      const gap = h2.getBoundingClientRect().top - prev.rect.bottom;
      gaps.push({ label: (h2.textContent || '').trim().slice(0, 24), gap });
    }
    return gaps;
  });
}

async function assertUniformRhythm(
  page: import('@playwright/test').Page,
  path: string,
) {
  await page.goto(path);
  await page.emulateMedia({ media: 'print' });

  const gaps = await sectionGaps(page);
  expect(
    gaps.length,
    'au moins 3 écarts inter-sections à mesurer',
  ).toBeGreaterThanOrEqual(3);

  const values = gaps.map((g) => g.gap);
  const spread = Math.max(...values) - Math.min(...values);
  expect(
    spread,
    `rythme inter-sections uniforme (${path}) — écarts: ${gaps
      .map((g) => `${g.label}=${g.gap.toFixed(1)}`)
      .join(', ')}`,
  ).toBeLessThanOrEqual(4);

  await page.emulateMedia({ media: 'screen' });
}

test.describe('Rythme inter-sections uniforme (impression)', () => {
  test.use({ viewport: { width: 1200, height: 900 } });

  test('CV long FR : écarts avant chaque titre identiques', async ({
    page,
  }) => {
    await assertUniformRhythm(page, '/fr');
  });

  test('CV long EN : écarts avant chaque titre identiques', async ({
    page,
  }) => {
    await assertUniformRhythm(page, '/en');
  });
});
