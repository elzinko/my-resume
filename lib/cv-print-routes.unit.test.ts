import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isFullCvRootPathname,
  isShortCvPathname,
  localeFromCvPrintPreviewPathname,
  isCvPrintPreviewPathname,
  localeFromPathIfRoot,
  shortAutoprintPath,
} from './cv-print-routes';

// --- isFullCvRootPathname ---

test('isFullCvRootPathname returns true for /fr', () => {
  assert.equal(isFullCvRootPathname('/fr'), true);
});

test('isFullCvRootPathname returns true for /en', () => {
  assert.equal(isFullCvRootPathname('/en'), true);
});

test('isFullCvRootPathname returns false for /fr/short', () => {
  assert.equal(isFullCvRootPathname('/fr/short'), false);
});

test('isFullCvRootPathname returns false for /de (unknown locale)', () => {
  assert.equal(isFullCvRootPathname('/de'), false);
});

test('isFullCvRootPathname returns false for null', () => {
  assert.equal(isFullCvRootPathname(null), false);
});

test('isFullCvRootPathname returns false for empty string', () => {
  assert.equal(isFullCvRootPathname(''), false);
});

test('isFullCvRootPathname returns false for root /', () => {
  assert.equal(isFullCvRootPathname('/'), false);
});

// --- isShortCvPathname ---

test('isShortCvPathname returns true for /fr/short', () => {
  assert.equal(isShortCvPathname('/fr/short'), true);
});

test('isShortCvPathname returns true for /en/short', () => {
  assert.equal(isShortCvPathname('/en/short'), true);
});

test('isShortCvPathname returns false for /fr', () => {
  assert.equal(isShortCvPathname('/fr'), false);
});

test('isShortCvPathname returns false for /fr/other', () => {
  assert.equal(isShortCvPathname('/fr/other'), false);
});

test('isShortCvPathname returns false for null', () => {
  assert.equal(isShortCvPathname(null), false);
});

// --- localeFromCvPrintPreviewPathname ---

test('localeFromCvPrintPreviewPathname returns fr for /fr', () => {
  assert.equal(localeFromCvPrintPreviewPathname('/fr'), 'fr');
});

test('localeFromCvPrintPreviewPathname returns en for /en', () => {
  assert.equal(localeFromCvPrintPreviewPathname('/en'), 'en');
});

test('localeFromCvPrintPreviewPathname returns fr for /fr/short', () => {
  assert.equal(localeFromCvPrintPreviewPathname('/fr/short'), 'fr');
});

test('localeFromCvPrintPreviewPathname returns null for /fr/other', () => {
  assert.equal(localeFromCvPrintPreviewPathname('/fr/other'), null);
});

test('localeFromCvPrintPreviewPathname returns null for null', () => {
  assert.equal(localeFromCvPrintPreviewPathname(null), null);
});

test('localeFromCvPrintPreviewPathname returns null for empty string', () => {
  assert.equal(localeFromCvPrintPreviewPathname(''), null);
});

test('localeFromCvPrintPreviewPathname returns null for /de/short', () => {
  assert.equal(localeFromCvPrintPreviewPathname('/de/short'), null);
});

// --- isCvPrintPreviewPathname ---

test('isCvPrintPreviewPathname returns true for /fr', () => {
  assert.equal(isCvPrintPreviewPathname('/fr'), true);
});

test('isCvPrintPreviewPathname returns true for /en/short', () => {
  assert.equal(isCvPrintPreviewPathname('/en/short'), true);
});

test('isCvPrintPreviewPathname returns false for /fr/other', () => {
  assert.equal(isCvPrintPreviewPathname('/fr/other'), false);
});

test('isCvPrintPreviewPathname returns false for null', () => {
  assert.equal(isCvPrintPreviewPathname(null), false);
});

// --- localeFromPathIfRoot ---

test('localeFromPathIfRoot returns fr for /fr', () => {
  assert.equal(localeFromPathIfRoot('/fr'), 'fr');
});

test('localeFromPathIfRoot returns en for /en', () => {
  assert.equal(localeFromPathIfRoot('/en'), 'en');
});

test('localeFromPathIfRoot returns null for /fr/short', () => {
  assert.equal(localeFromPathIfRoot('/fr/short'), null);
});

test('localeFromPathIfRoot returns null for null', () => {
  assert.equal(localeFromPathIfRoot(null), null);
});

// --- shortAutoprintPath ---

test('shortAutoprintPath returns correct path for fr', () => {
  const result = shortAutoprintPath('fr');
  assert.ok(result.endsWith('/fr/short?autoprint=1'));
});

test('shortAutoprintPath returns correct path for en', () => {
  const result = shortAutoprintPath('en');
  assert.ok(result.endsWith('/en/short?autoprint=1'));
});
