import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:60738';
const OUT = path.dirname(new URL(import.meta.url).pathname);

const b = await chromium.launch();

async function screenshot(url, filename, opts = {}) {
  const ctx = await b.newContext({
    viewport: opts.viewport || { width: 1280, height: 900 },
    deviceScaleFactor: opts.dpr || 2,
  });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  if (opts.waitMs) await p.waitForTimeout(opts.waitMs);
  await p.screenshot({ path: path.join(OUT, filename), fullPage: true });
  console.log(`  screenshot: ${filename}`);
  await ctx.close();
}

async function pdf(url, filename, opts = {}) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.emulateMedia({ media: 'print' });
  // Trigger beforeprint to activate cv-print-preview
  await p.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await p.waitForTimeout(300);
  await p.pdf({
    path: path.join(OUT, filename),
    preferCSSPageSize: !opts.chromeMargins,
    printBackground: true,
    ...(opts.chromeMargins ? { format: 'A4', margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' } } : {}),
  });
  const buf = fs.readFileSync(path.join(OUT, filename));
  const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`  pdf: ${filename} (${pages} pages)`);
  await ctx.close();
}

console.log('=== Generating renders ===');

// FR Full
console.log('\n[FR Full CV]');
await screenshot(`${BASE}/fr`, 'fr-full-screen.png');
await screenshot(`${BASE}/fr?print=1`, 'fr-full-print-preview.png');
await pdf(`${BASE}/fr`, 'fr-full-print.pdf');

// FR Short
console.log('\n[FR Short CV]');
await screenshot(`${BASE}/fr/short`, 'fr-short-screen.png');
await screenshot(`${BASE}/fr/short?print=1`, 'fr-short-print-preview.png');
await pdf(`${BASE}/fr/short`, 'fr-short-print.pdf');
await pdf(`${BASE}/fr/short`, 'fr-short-print-chrome.pdf', { chromeMargins: true });

// EN Full
console.log('\n[EN Full CV]');
await screenshot(`${BASE}/en`, 'en-full-screen.png');
await screenshot(`${BASE}/en?print=1`, 'en-full-print-preview.png');
await pdf(`${BASE}/en`, 'en-full-print.pdf');

// EN Short
console.log('\n[EN Short CV]');
await screenshot(`${BASE}/en/short`, 'en-short-screen.png');
await screenshot(`${BASE}/en/short?print=1`, 'en-short-print-preview.png');
await pdf(`${BASE}/en/short`, 'en-short-print.pdf');
await pdf(`${BASE}/en/short`, 'en-short-print-chrome.pdf', { chromeMargins: true });

// Mobile
console.log('\n[Mobile]');
await screenshot(`${BASE}/fr`, 'fr-full-mobile.png', { viewport: { width: 390, height: 844 }, dpr: 2 });
await screenshot(`${BASE}/en`, 'en-full-mobile.png', { viewport: { width: 390, height: 844 }, dpr: 2 });

await b.close();
console.log('\n✅ All renders generated.');
