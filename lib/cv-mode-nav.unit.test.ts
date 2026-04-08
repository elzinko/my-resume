import test from 'node:test';
import assert from 'node:assert/strict';
import { fullHrefFromShortPath } from './cv-mode-nav';

test('fullHrefFromShortPath uses defaultOfferId → /offer/match?…', () => {
  const sp = new URLSearchParams();
  const href = fullHrefFromShortPath('fr', sp, {
    defaultOfferId: 'safran-java-fullstack',
  });
  assert.ok(href.startsWith('/fr/offer/match?'));
  assert.ok(href.includes('company=Safran'));
});

test('fullHrefFromShortPath explicit offer= beats defaultOfferId', () => {
  const sp = new URLSearchParams({ offer: 'safran-ia-factory' });
  const href = fullHrefFromShortPath('fr', sp, {
    defaultOfferId: 'safran-java-fullstack',
  });
  assert.ok(href.startsWith('/fr/offer/match?'));
  assert.ok(href.includes('company=Safran'));
  assert.ok(
    href.includes('IA+Factory') ||
      href.includes('IA%20Factory') ||
      href.includes('D%C3%A9veloppeur'),
  );
});

test('fullHrefFromShortPath match query ignores defaultOfferId', () => {
  const sp = new URLSearchParams({
    company: 'Acme',
    requirement: 'Java:java',
  });
  const href = fullHrefFromShortPath('en', sp, {
    defaultOfferId: 'safran-java-fullstack',
  });
  assert.ok(href.startsWith('/en/offer/match?'));
});

test('fullHrefFromShortPath no fallback returns root with query', () => {
  const sp = new URLSearchParams({ foo: '1' });
  assert.equal(fullHrefFromShortPath('fr', sp), '/fr?foo=1');
});
