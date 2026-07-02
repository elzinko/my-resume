import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseEntriesLayout,
  DEFAULT_ENTRIES_LAYOUT,
} from './cv-entries-layout';

test('parseEntriesLayout : stacked (insensible à la casse / espaces)', () => {
  assert.equal(parseEntriesLayout('stacked'), 'stacked');
  assert.equal(parseEntriesLayout('STACKED'), 'stacked');
  assert.equal(parseEntriesLayout('  Stacked  '), 'stacked');
});

test('parseEntriesLayout : défaut inline (absent / vide / inconnu)', () => {
  assert.equal(DEFAULT_ENTRIES_LAYOUT, 'inline');
  assert.equal(parseEntriesLayout('inline'), 'inline');
  assert.equal(parseEntriesLayout(null), 'inline');
  assert.equal(parseEntriesLayout(undefined), 'inline');
  assert.equal(parseEntriesLayout(''), 'inline');
  assert.equal(parseEntriesLayout('whatever'), 'inline');
});
