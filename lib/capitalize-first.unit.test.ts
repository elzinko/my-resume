import test from 'node:test';
import assert from 'node:assert/strict';
import { capitalizeFirstLetter } from './capitalize-first';

test('capitalizeFirstLetter normal string', () => {
  assert.equal(capitalizeFirstLetter('livestreamz'), 'Livestreamz');
});

test('capitalizeFirstLetter empty string', () => {
  assert.equal(capitalizeFirstLetter(''), '');
});

test('capitalizeFirstLetter already capitalized', () => {
  assert.equal(capitalizeFirstLetter('Hello'), 'Hello');
});

test('capitalizeFirstLetter accented first letter', () => {
  assert.equal(capitalizeFirstLetter('\u00e9nergie'), '\u00c9nergie');
});

test('capitalizeFirstLetter single character', () => {
  assert.equal(capitalizeFirstLetter('a'), 'A');
});

test('capitalizeFirstLetter preserves rest of string', () => {
  assert.equal(capitalizeFirstLetter('hELLO wORLD'), 'HELLO wORLD');
});
