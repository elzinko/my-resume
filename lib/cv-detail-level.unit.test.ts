import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDetailLevel } from './cv-detail-level';

test('parseDetailLevel keeps summary and minimal', () => {
  assert.equal(parseDetailLevel('summary'), 'summary');
  assert.equal(parseDetailLevel('minimal'), 'minimal');
});

test('parseDetailLevel defaults to full', () => {
  assert.equal(parseDetailLevel('full'), 'full');
  assert.equal(parseDetailLevel(null), 'full');
  assert.equal(parseDetailLevel(undefined), 'full');
  assert.equal(parseDetailLevel(''), 'full');
  assert.equal(parseDetailLevel('SUMMARY'), 'full');
  assert.equal(parseDetailLevel('whatever'), 'full');
});
