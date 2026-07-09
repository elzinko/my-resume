import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseEntriesLayout,
  DEFAULT_ENTRIES_LAYOUT,
} from './cv-entries-layout';

test('parseEntriesLayout : inline (insensible à la casse / espaces)', () => {
  assert.equal(parseEntriesLayout('inline'), 'inline');
  assert.equal(parseEntriesLayout('INLINE'), 'inline');
  assert.equal(parseEntriesLayout('  Inline  '), 'inline');
});

test('parseEntriesLayout : défaut stacked (absent / vide / inconnu / stacked)', () => {
  assert.equal(DEFAULT_ENTRIES_LAYOUT, 'stacked');
  assert.equal(parseEntriesLayout('stacked'), 'stacked');
  assert.equal(parseEntriesLayout(null), 'stacked');
  assert.equal(parseEntriesLayout(undefined), 'stacked');
  assert.equal(parseEntriesLayout(''), 'stacked');
  assert.equal(parseEntriesLayout('whatever'), 'stacked');
});
