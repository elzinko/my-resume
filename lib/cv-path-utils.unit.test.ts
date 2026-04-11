import test from 'node:test';
import assert from 'node:assert/strict';
import { stripBasePath, withQuery } from './cv-path-utils';

// --- stripBasePath ---

test('stripBasePath removes basePath prefix', () => {
  assert.equal(stripBasePath('/my-resume/fr', '/my-resume'), '/fr');
});

test('stripBasePath returns / when pathname equals basePath', () => {
  assert.equal(stripBasePath('/my-resume', '/my-resume'), '/');
});

test('stripBasePath returns pathname unchanged when no basePath', () => {
  assert.equal(stripBasePath('/fr/short', ''), '/fr/short');
});

test('stripBasePath returns pathname when basePath does not match', () => {
  assert.equal(stripBasePath('/other/path', '/my-resume'), '/other/path');
});

test('stripBasePath handles deep paths', () => {
  assert.equal(stripBasePath('/my-resume/en/short', '/my-resume'), '/en/short');
});

// --- withQuery ---

test('withQuery appends query string', () => {
  const sp = new URLSearchParams({ print: '1' });
  assert.equal(withQuery('/fr', sp), '/fr?print=1');
});

test('withQuery returns path when query is empty', () => {
  const sp = new URLSearchParams();
  assert.equal(withQuery('/en/short', sp), '/en/short');
});

test('withQuery handles multiple params', () => {
  const sp = new URLSearchParams({ print: '1', offer: 'abc' });
  const result = withQuery('/fr', sp);
  assert.ok(result.startsWith('/fr?'));
  assert.ok(result.includes('print=1'));
  assert.ok(result.includes('offer=abc'));
});

test('withQuery works with object implementing toString', () => {
  const sp = { toString: () => 'custom=value' };
  assert.equal(withQuery('/path', sp), '/path?custom=value');
});

test('withQuery works with object returning empty toString', () => {
  const sp = { toString: () => '' };
  assert.equal(withQuery('/path', sp), '/path');
});
