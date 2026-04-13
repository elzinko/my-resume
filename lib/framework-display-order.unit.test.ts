import test from 'node:test';
import assert from 'node:assert/strict';
import {
  flattenRequirementKeywordsForDisplay,
  sortJobFrameworksForDisplay,
} from './framework-display-order';
import type { JobOffer } from '@/data/offers/types';

test('flattenRequirementKeywordsForDisplay preserves order and dedupes', () => {
  const offer: JobOffer = {
    id: 'x',
    company: 'A',
    title: { fr: 't', en: 't' },
    requirements: [
      { label: 'A', keywords: ['react', 'node'] },
      { label: 'B', keywords: ['react', 'vue'] },
    ],
  };
  assert.deepEqual(flattenRequirementKeywordsForDisplay(offer), [
    'react',
    'node',
    'vue',
  ]);
});

test('sortJobFrameworksForDisplay leaves order when no priority tokens', () => {
  const fws = [
    { id: '1', name: 'Rust' },
    { id: '2', name: 'Go' },
  ];
  assert.deepEqual(sortJobFrameworksForDisplay(fws, []), fws);
});

test('sortJobFrameworksForDisplay puts matching techs first in token order', () => {
  const fws = [
    { id: 'a', name: 'Docker' },
    { id: 'b', name: 'React' },
    { id: 'c', name: 'Node.js' },
  ];
  const sorted = sortJobFrameworksForDisplay(fws, ['react', 'nodejs']);
  assert.deepEqual(
    sorted.map((x) => x.name),
    ['React', 'Node.js', 'Docker'],
  );
});

test('sortJobFrameworksForDisplay matches by framework id', () => {
  const fws = [
    { id: 'fw-vue', name: 'Vue.js' },
    { id: 'fw-react', name: 'React' },
  ];
  const sorted = sortJobFrameworksForDisplay(fws, ['fw-react']);
  assert.deepEqual(
    sorted.map((x) => x.id),
    ['fw-react', 'fw-vue'],
  );
});
