import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMatchYears } from './format-match-years';

test('formatMatchYears less than 1 year in French', () => {
  assert.equal(formatMatchYears(0.5, 'fr'), '<1 an');
});

test('formatMatchYears less than 1 year in English', () => {
  assert.equal(formatMatchYears(0.3, 'en'), '<1 year');
});

test('formatMatchYears exactly 1 year in French', () => {
  assert.equal(formatMatchYears(1, 'fr'), '1 an');
});

test('formatMatchYears exactly 1 year in English', () => {
  assert.equal(formatMatchYears(1, 'en'), '1 year');
});

test('formatMatchYears multiple years in French', () => {
  assert.equal(formatMatchYears(5, 'fr'), '5 ans');
});

test('formatMatchYears multiple years in English', () => {
  assert.equal(formatMatchYears(5, 'en'), '5 years');
});

test('formatMatchYears rounds to nearest integer', () => {
  assert.equal(formatMatchYears(2.7, 'fr'), '3 ans');
  assert.equal(formatMatchYears(2.3, 'en'), '2 years');
});

test('formatMatchYears zero returns <1', () => {
  assert.equal(formatMatchYears(0, 'fr'), '<1 an');
});

test('formatMatchYears negative returns dash', () => {
  assert.equal(formatMatchYears(-1, 'fr'), '\u2014');
});

test('formatMatchYears NaN returns dash', () => {
  assert.equal(formatMatchYears(NaN, 'en'), '\u2014');
});

test('formatMatchYears Infinity returns dash', () => {
  assert.equal(formatMatchYears(Infinity, 'fr'), '\u2014');
});
