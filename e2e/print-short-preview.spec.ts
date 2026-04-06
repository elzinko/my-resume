import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Génère des captures pleine page avec le média CSS `print` (comme Ctrl+P).
 * Sortie : ./print-previews/short-{fr|en}-print.png
 *
 * Lancer : npm run print:preview:short
 * (équivalent avec pnpm : pnpm print:preview:short)
 */
const outDir = path.join(process.cwd(), 'print-previews');

test.beforeAll(() => {
  fs.mkdirSync(outDir, { recursive: true });
});

for (const lang of ['fr', 'en'] as const) {
  test(`short CV /${lang}/short — capture @media print`, async ({ page }) => {
    await page.goto(`/${lang}/short`, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({
      path: path.join(outDir, `short-${lang}-print.png`),
      fullPage: true,
    });
  });
}
