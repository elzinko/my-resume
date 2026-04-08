import test from 'node:test';
import assert from 'node:assert/strict';
import { expandKeywordsForMatch } from './match-catalog';
import type { MatchCatalog } from './match-catalog-schema';

const mockCatalog: MatchCatalog = {
  version: 1,
  generatedAt: '2026-01-01T00:00:00.000Z',
  entries: [
    {
      id: 'fw-node',
      name: 'Node.js',
      matchTokens: ['node.js', 'nodejs'],
    },
  ],
  exampleMatchUrl: '/fr',
};

test('expandKeywordsForMatch adds tokens for known id', () => {
  const out = expandKeywordsForMatch(['fw-node'], mockCatalog);
  assert.ok(out.includes('fw-node'));
  assert.ok(out.includes('node.js'));
  assert.ok(out.includes('nodejs'));
});

test('expandKeywordsForMatch leaves unknown tokens unchanged', () => {
  const out = expandKeywordsForMatch(['react', 'vue'], mockCatalog);
  assert.deepEqual(out, ['react', 'vue']);
});

test('expandKeywordsForMatch respects max length', () => {
  const big: MatchCatalog = {
    ...mockCatalog,
    entries: [
      {
        id: 'a',
        name: 'A',
        matchTokens: ['t1', 't2', 't3', 't4'],
      },
    ],
  };
  const out = expandKeywordsForMatch(['a'], big, 3);
  assert.equal(out.length, 3);
});
