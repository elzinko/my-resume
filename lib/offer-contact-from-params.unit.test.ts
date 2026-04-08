import test from 'node:test';
import assert from 'node:assert/strict';
import { contactLocationFromOfferAndQuery } from './offer-contact-from-params';
import type { JobOffer } from '@/data/offers/types';

const baseOffer = (): JobOffer => ({
  id: 'x',
  company: 'Acme',
  title: { fr: 'Dev', en: 'Dev' },
  requirements: [{ label: 'JS', keywords: ['react'] }],
});

test('contactLocationFromOfferAndQuery uses search workAddress for directions', () => {
  const sp = new URLSearchParams();
  sp.set('workAddress', '75001 Paris');
  const r = contactLocationFromOfferAndQuery(baseOffer(), sp);
  assert.equal(r.isDirections, true);
  assert.ok(r.mapsHref.includes('/dir/'));
  assert.ok(r.mapsHref.includes('destination='));
});

test('contactLocationFromOfferAndQuery commuteMinutes formats label when work set', () => {
  const sp = new URLSearchParams();
  sp.set('workAddress', 'Paris');
  sp.set('commuteMinutes', '42');
  const r = contactLocationFromOfferAndQuery(baseOffer(), sp);
  assert.equal(r.commuteLabel, '~42 min');
});

test('offer workAddress and commuteLabel from JobOffer', () => {
  const offer: JobOffer = {
    ...baseOffer(),
    workAddress: 'Lyon',
    commuteLabel: '~1 h',
  };
  const r = contactLocationFromOfferAndQuery(offer, new URLSearchParams());
  assert.equal(r.isDirections, true);
  assert.equal(r.commuteLabel, '~1 h');
});
