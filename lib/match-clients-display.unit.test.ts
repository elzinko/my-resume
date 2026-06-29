import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sortClientsByRecency,
  truncateClientsForDisplay,
  type MatchClient,
} from './match-clients-display';

const C = (
  client: string,
  startDate: string,
  endDate?: string,
): MatchClient => ({ client, startDate, endDate });

test('sortClientsByRecency: ongoing mission (no endDate) comes first', () => {
  const sorted = sortClientsByRecency([
    C('Old', '2016-04-01', '2019-06-01'),
    C('Ongoing', '2023-01-01'),
    C('Recent', '2022-05-01', '2023-02-01'),
  ]);
  assert.deepEqual(
    sorted.map((c) => c.client),
    ['Ongoing', 'Recent', 'Old'],
  );
});

test('sortClientsByRecency: orders by endDate desc, then startDate desc', () => {
  const sorted = sortClientsByRecency([
    C('A', '2020-01-01', '2020-12-01'),
    C('B', '2023-01-01', '2023-12-01'),
    C('C', '2022-01-01', '2023-02-01'),
  ]);
  assert.deepEqual(
    sorted.map((c) => c.client),
    ['B', 'C', 'A'],
  );
});

test('sortClientsByRecency: deterministic tie-break by client name', () => {
  const sorted = sortClientsByRecency([
    C('Zeta', '2023-01-01', '2023-06-01'),
    C('Alpha', '2023-01-01', '2023-06-01'),
  ]);
  assert.deepEqual(
    sorted.map((c) => c.client),
    ['Alpha', 'Zeta'],
  );
});

test('sortClientsByRecency: does not mutate the input array', () => {
  const input = [C('A', '2016-04-01', '2019-06-01'), C('B', '2023-01-01')];
  const before = input.map((c) => c.client);
  sortClientsByRecency(input);
  assert.deepEqual(
    input.map((c) => c.client),
    before,
  );
});

test('truncateClientsForDisplay: no truncation when under the cap', () => {
  const r = truncateClientsForDisplay(
    [C('A', '2023-01-01', '2023-06-01'), C('B', '2022-01-01', '2022-06-01')],
    6,
  );
  assert.equal(r.hiddenCount, 0);
  assert.equal(r.visible.length, 2);
  assert.deepEqual(r.hidden, []);
});

test('truncateClientsForDisplay: caps and exposes the hidden remainder', () => {
  const clients = [
    C('M1', '2023-10-01', '2023-12-01'),
    C('M2', '2023-05-01', '2023-09-01'),
    C('M3', '2022-05-01', '2023-02-01'),
    C('M4', '2020-08-01', '2020-12-01'),
    C('M5', '2019-10-01', '2020-05-01'),
    C('M6', '2016-04-01', '2019-06-01'),
    C('M7', '2015-09-01', '2017-06-01'),
    C('M8', '2014-01-01', '2015-01-01'),
  ];
  const r = truncateClientsForDisplay(clients, 6);
  assert.equal(r.visible.length, 6);
  assert.equal(r.hiddenCount, 2);
  assert.deepEqual(
    r.visible.map((c) => c.client),
    ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
  );
  assert.deepEqual(
    r.hidden.map((c) => c.client),
    ['M7', 'M8'],
  );
});

test('truncateClientsForDisplay: exactly at the cap shows all', () => {
  const clients = Array.from({ length: 6 }, (_, i) =>
    C(`M${i}`, '2020-01-01', '2020-06-01'),
  );
  const r = truncateClientsForDisplay(clients, 6);
  assert.equal(r.hiddenCount, 0);
  assert.equal(r.visible.length, 6);
});

test('truncateClientsForDisplay: empty list is safe', () => {
  const r = truncateClientsForDisplay([], 6);
  assert.deepEqual(r.visible, []);
  assert.deepEqual(r.hidden, []);
  assert.equal(r.hiddenCount, 0);
});
