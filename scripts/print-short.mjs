import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:59593/fr/short';
const out = process.argv[3] || '/tmp/short-print.pdf';
const pngOut = out.replace(/\.pdf$/, '.png');

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
});
await page.screenshot({ path: pngOut, fullPage: true });
await browser.close();
console.log('PDF:', out);
console.log('PNG:', pngOut);
