import test from 'node:test';
import assert from 'node:assert/strict';
import { fullHrefFromShortPath } from './cv-mode-nav';

test('fullHrefFromShortPath preserves company + requirement params', () => {
  const sp = new URLSearchParams({
    company: 'Acme',
    requirement: 'Java:java',
  });
  const href = fullHrefFromShortPath('fr', sp);
  assert.ok(href.startsWith('/fr?'));
  assert.ok(href.includes('company=Acme'));
  assert.ok(href.includes('requirement='));
});

test('fullHrefFromShortPath preserves spec param', () => {
  const sp = new URLSearchParams({ spec: 'abc123' });
  const href = fullHrefFromShortPath('en', sp);
  assert.ok(href.startsWith('/en?'));
  assert.ok(href.includes('spec=abc123'));
});

test('fullHrefFromShortPath no params returns root', () => {
  const sp = new URLSearchParams();
  assert.equal(fullHrefFromShortPath('fr', sp), '/fr');
});

test('fullHrefFromShortPath preserves arbitrary query', () => {
  const sp = new URLSearchParams({ foo: '1' });
  assert.equal(fullHrefFromShortPath('fr', sp), '/fr?foo=1');
});
