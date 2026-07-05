// Capture des rendus du CV pour la revue visuelle (Argos).
// Playwright pur (déjà présent) ; n'importe PAS `@argos-ci` → pas de dépendance
// sur un package non installé. L'upload se fait via `npx @argos-ci/cli` dans le
// workflow. Sert le CV local (BASE_URL, défaut http://localhost:3000).
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = 'screenshots';

// full/short × FR/EN × web/aperçu print — la matrice couverte par le gate.
const TARGETS = [
  { name: 'fr-full-web', path: '/fr', print: false },
  { name: 'fr-full-print', path: '/fr', print: true },
  { name: 'fr-short-web', path: '/fr/short', print: false },
  { name: 'fr-short-print', path: '/fr/short', print: true },
  { name: 'en-full-web', path: '/en', print: false },
  { name: 'en-full-print', path: '/en', print: true },
  { name: 'en-short-web', path: '/en/short', print: false },
  { name: 'en-short-print', path: '/en/short', print: true },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
try {
  for (const t of TARGETS) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 1600 },
    });
    if (t.print) await page.emulateMedia({ media: 'print' });
    await page.goto(`${BASE}${t.path}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    // La barre de nav dev (hors production) ne fait pas partie du CV : on la
    // retire des captures pour un diff visuel stable entre environnements.
    await page.addStyleTag({
      content: '[data-devnav]{display:none !important}',
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${t.name}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Captured ${TARGETS.length} screenshots to ${OUT}/`);
