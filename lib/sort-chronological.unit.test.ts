import test from 'node:test';
import assert from 'node:assert/strict';
import { sortChronologicalDesc, byEndThenStart } from './sort-chronological';

test('sortChronologicalDesc sorts in descending order', () => {
  const items = [
    { date: '2020-01-01' },
    { date: '2023-06-15' },
    { date: '2018-03-10' },
  ];
  const sorted = sortChronologicalDesc(items, (i) => i.date);
  assert.deepEqual(sorted, [
    { date: '2023-06-15' },
    { date: '2020-01-01' },
    { date: '2018-03-10' },
  ]);
});

test('sortChronologicalDesc handles null sort keys', () => {
  const items = [
    { date: '2020-01-01' },
    { date: null as string | null },
    { date: '2023-06-15' },
  ];
  const sorted = sortChronologicalDesc(items, (i) => i.date);
  assert.equal(sorted[0].date, '2023-06-15');
  assert.equal(sorted[1].date, '2020-01-01');
  assert.equal(sorted[2].date, null);
});

test('sortChronologicalDesc does not mutate original array', () => {
  const items = [{ date: '2020-01-01' }, { date: '2023-06-15' }];
  const sorted = sortChronologicalDesc(items, (i) => i.date);
  assert.notEqual(items, sorted);
  assert.equal(items[0].date, '2020-01-01');
});

test('byEndThenStart returns endDate when present', () => {
  assert.equal(byEndThenStart({ startDate: '2020-01', endDate: '2023-06' }), '2023-06');
});

test('byEndThenStart returns startDate when no endDate', () => {
  assert.equal(byEndThenStart({ startDate: '2020-01' }), '2020-01');
});

test('byEndThenStart returns empty string for null/undefined input', () => {
  assert.equal(byEndThenStart(null), '');
  assert.equal(byEndThenStart(undefined), '');
});

test('byEndThenStart returns empty string for non-object', () => {
  assert.equal(byEndThenStart('string'), '');
  assert.equal(byEndThenStart(42), '');
});

test('byEndThenStart returns empty string when no dates', () => {
  assert.equal(byEndThenStart({}), '');
});

test('sortChronologicalDesc with byEndThenStart sorts jobs correctly', () => {
  const jobs = [
    { startDate: '2018-01', endDate: '2020-06' },
    { startDate: '2023-01' },                       // ongoing, no endDate
    { startDate: '2020-07', endDate: '2022-12' },
  ];
  const sorted = sortChronologicalDesc(jobs, byEndThenStart);
  assert.equal(sorted[0].startDate, '2023-01');    // ongoing sorted by startDate
  assert.equal(sorted[1].endDate, '2022-12');
  assert.equal(sorted[2].endDate, '2020-06');
});
