import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareCellSrc,
  compareRows,
  type CompareRow,
} from './dev-renders-compare';

// --- compareCellSrc: build the iframe src for one deployment/base ---

test('compareCellSrc builds full CV web url for fr', () => {
  const row: CompareRow = {
    id: 'full-web',
    label: 'Full — Web',
    variantPath: '',
    mediumQuery: '',
  };
  assert.equal(
    compareCellSrc('https://www.elzinko.fr', 'fr', row),
    'https://www.elzinko.fr/fr',
  );
});

test('compareCellSrc builds short CV print-preview url for en', () => {
  const row: CompareRow = {
    id: 'short-print',
    label: 'Short — Print preview',
    variantPath: '/short',
    mediumQuery: '?print=1',
  };
  assert.equal(
    compareCellSrc('https://preview.example.com', 'en', row),
    'https://preview.example.com/en/short?print=1',
  );
});

test('compareCellSrc strips a trailing slash on the base', () => {
  const row: CompareRow = {
    id: 'full-web',
    label: 'Full — Web',
    variantPath: '',
    mediumQuery: '',
  };
  assert.equal(
    compareCellSrc('http://localhost:3000/', 'fr', row),
    'http://localhost:3000/fr',
  );
});

test('compareCellSrc trims surrounding whitespace on the base', () => {
  const row: CompareRow = {
    id: 'full-web',
    label: 'Full — Web',
    variantPath: '',
    mediumQuery: '',
  };
  assert.equal(
    compareCellSrc('  https://www.elzinko.fr  ', 'fr', row),
    'https://www.elzinko.fr/fr',
  );
});

test('compareCellSrc returns empty string when base is empty', () => {
  const row: CompareRow = {
    id: 'full-web',
    label: 'Full — Web',
    variantPath: '',
    mediumQuery: '',
  };
  assert.equal(compareCellSrc('', 'fr', row), '');
  assert.equal(compareCellSrc('   ', 'fr', row), '');
});

// --- compareRows: the matrix (variant × medium) + mobile ---

test('compareRows lists variant×medium combos plus a mobile row', () => {
  const rows = compareRows();
  const ids = rows.map((r) => r.id);
  assert.deepEqual(ids, [
    'full-web',
    'full-print',
    'short-web',
    'short-print',
    'mobile',
  ]);
});

test('compareRows medium queries are web-empty / print=1', () => {
  const rows = compareRows();
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
  assert.equal(byId['full-web'].variantPath, '');
  assert.equal(byId['full-web'].mediumQuery, '');
  assert.equal(byId['full-print'].mediumQuery, '?print=1');
  assert.equal(byId['short-web'].variantPath, '/short');
  assert.equal(byId['short-print'].variantPath, '/short');
  assert.equal(byId['short-print'].mediumQuery, '?print=1');
});

test('compareRows marks only the mobile row as mobile (full CV, web)', () => {
  const rows = compareRows();
  const mobile = rows.find((r) => r.id === 'mobile');
  assert.ok(mobile);
  assert.equal(mobile?.mobile, true);
  assert.equal(mobile?.variantPath, '');
  assert.equal(mobile?.mediumQuery, '');
  const nonMobile = rows.filter((r) => r.id !== 'mobile');
  assert.ok(nonMobile.every((r) => !r.mobile));
});
