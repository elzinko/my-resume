import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMatchEntries,
  jobMatchesRequirement,
  type JobForMatching,
} from '@/lib/tech-match-core';
import type { MatchRequirement } from '@/data/offers/types';

const baseJob = (): JobForMatching => ({
  client: 'Acme',
  startDate: '2020-01-01',
  endDate: '2021-01-01',
  frameworks: [],
});

test('jobMatchesRequirement matches framework id', () => {
  const job: JobForMatching = {
    ...baseJob(),
    frameworks: [{ id: 'an8YW0VVTf2JuZZZo1W0pw', name: 'Vue.js' }],
  };
  assert.equal(jobMatchesRequirement(job, ['an8YW0VVTf2JuZZZo1W0pw']), true);
  assert.equal(jobMatchesRequirement(job, ['other-id']), false);
});

test('jobMatchesRequirement loose match links nodejs to node.js in text', () => {
  const job: JobForMatching = {
    ...baseJob(),
    frameworks: [],
    bullets: [{ id: '1', text: 'Stack Node.js et monitoring.' }],
  };
  assert.equal(jobMatchesRequirement(job, ['nodejs']), true);
});

test('jobMatchesRequirement strict match on framework name', () => {
  const job: JobForMatching = {
    ...baseJob(),
    frameworks: [{ id: 'x', name: 'React' }],
  };
  assert.equal(jobMatchesRequirement(job, ['react']), true);
});

test('buildMatchEntries uses experienceYearsOverride when set', () => {
  const jobs: JobForMatching[] = [
    {
      ...baseJob(),
      client: 'Acme',
      frameworks: [{ id: 'fw1', name: 'Rust' }],
    },
  ];
  const requirements: MatchRequirement[] = [
    {
      label: 'Autre stack',
      keywords: ['zznotfound'],
      experienceYearsOverride: 7,
    },
  ];
  const entries = buildMatchEntries(requirements, jobs);
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.totalYears, 7);
  assert.equal(entries[0]!.yearsFromOverride, true);
  assert.equal(entries[0]!.matchedClients.length, 0);
});
