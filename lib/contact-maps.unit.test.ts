import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContactLocationHref, THOMERY_STATION_ORIGIN } from './contact-maps';

test('buildContactLocationHref without work address points to search', () => {
  const href = buildContactLocationHref();
  assert.ok(href.includes('google.com/maps/search'));
  assert.ok(href.includes(encodeURIComponent(THOMERY_STATION_ORIGIN)));
  assert.ok(!href.includes('/dir/'));
});

test('buildContactLocationHref with work address uses directions', () => {
  const href = buildContactLocationHref('75001 Paris');
  assert.ok(href.includes('google.com/maps/dir'));
  assert.ok(href.includes('destination='));
  assert.ok(href.includes('origin='));
});
