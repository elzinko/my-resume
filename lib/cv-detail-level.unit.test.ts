import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDetailLevel, parseMaxJobShown } from './cv-detail-level';

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

test('parseMaxJobShown : entier >= 1, sinon null', () => {
  assert.equal(parseMaxJobShown('1'), 1);
  assert.equal(parseMaxJobShown('10'), 10);
  assert.equal(parseMaxJobShown('0'), null);
  assert.equal(parseMaxJobShown(null), null);
  assert.equal(parseMaxJobShown(undefined), null);
  assert.equal(parseMaxJobShown(''), null);
  assert.equal(parseMaxJobShown('-3'), null);
  assert.equal(parseMaxJobShown('2.5'), null);
  assert.equal(parseMaxJobShown('abc'), null);
});
