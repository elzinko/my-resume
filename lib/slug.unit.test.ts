import test from 'node:test';
import assert from 'node:assert/strict';
import { slugifyClient } from './slug';

test('slugifyClient normal client name', () => {
  assert.equal(slugifyClient('BlaBlacar'), 'mission-blablacar');
});

test('slugifyClient removes accented characters', () => {
  assert.equal(slugifyClient('Mediapost'), 'mission-mediapost');
  assert.equal(slugifyClient('Mediapost'), 'mission-mediapost');
});

test('slugifyClient handles multi-word with special chars', () => {
  assert.equal(
    slugifyClient('SNCF Reseaux - DGEX Solutions'),
    'mission-sncf-reseaux-dgex-solutions',
  );
});

test('slugifyClient removes diacritics', () => {
  assert.equal(slugifyClient('Mediapost'), 'mission-mediapost');
  assert.equal(
    slugifyClient('SNCF R\u00e9seaux - DGEX Solutions'),
    'mission-sncf-reseaux-dgex-solutions',
  );
});

test('slugifyClient empty string', () => {
  assert.equal(slugifyClient(''), 'mission-');
});
