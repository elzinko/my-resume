import test from 'node:test';
import assert from 'node:assert/strict';
import type { JobOffer } from '../data/offers/types';
import {
  jobOfferToMatchHref,
  jobOfferToMatchSearchParams,
} from './offer-to-match-url';

const mockOffer: JobOffer = {
  id: 'test-java',
  company: 'TestCo',
  title: { fr: 'Développeur Java', en: 'Java Developer' },
  requirements: [
    { label: 'Java', keywords: ['java', 'spring'] },
    { label: 'SQL', keywords: ['sql', 'postgresql'] },
  ],
  contract: 'cdi',
};

test('jobOfferToMatchSearchParams includes company, requirements and contract', () => {
  const sp = jobOfferToMatchSearchParams(mockOffer);
  assert.equal(sp.get('company'), 'TestCo');
  assert.ok(sp.getAll('requirement').length > 0);
  assert.equal(sp.get('contract'), 'cdi');
});

test('jobOfferToMatchHref prefixes lang and path', () => {
  const href = jobOfferToMatchHref('en', mockOffer);
  assert.ok(href.startsWith('/en?'));
});
