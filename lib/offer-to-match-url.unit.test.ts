import test from 'node:test';
import assert from 'node:assert/strict';
import { getOffer } from '../data/offers';
import { jobOfferToMatchHref, jobOfferToMatchSearchParams } from './offer-to-match-url';

test('jobOfferToMatchSearchParams includes company and requirements', () => {
  const offer = getOffer('safran-java-fullstack');
  assert.ok(offer);
  const sp = jobOfferToMatchSearchParams(offer!);
  assert.equal(sp.get('company'), 'Safran');
  assert.ok(sp.getAll('requirement').length > 0);
});

test('jobOfferToMatchHref prefixes lang and path', () => {
  const offer = getOffer('safran-ia-factory');
  assert.ok(offer);
  const href = jobOfferToMatchHref('en', offer!);
  assert.ok(href.startsWith('/en/offer/match?'));
});
