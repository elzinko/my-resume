import test from 'node:test';
import assert from 'node:assert/strict';
import { formatJobDatesCompactYears } from './date';

// --- formatJobDatesCompactYears ---

test('formatJobDatesCompactYears with start and end dates', () => {
  assert.equal(formatJobDatesCompactYears('2020-01-15', '2023-06-30', 'Present'), '2020 - 2023');
});

test('formatJobDatesCompactYears with no end date shows ongoing label', () => {
  assert.equal(formatJobDatesCompactYears('2021-03-01', undefined, 'Present'), '2021 - Present');
});

test('formatJobDatesCompactYears with French ongoing label', () => {
  assert.equal(
    formatJobDatesCompactYears('2019-09-01', undefined, "Aujourd'hui"),
    "2019 - Aujourd'hui",
  );
});

test('formatJobDatesCompactYears same year start and end', () => {
  assert.equal(formatJobDatesCompactYears('2023-01-01', '2023-12-31', 'Present'), '2023 - 2023');
});

test('formatJobDatesCompactYears with invalid start falls back to raw strings', () => {
  assert.equal(formatJobDatesCompactYears('not-a-date', '2023-06-30', 'Present'), 'not-a-date - 2023-06-30');
});

test('formatJobDatesCompactYears with invalid start and no end', () => {
  assert.equal(formatJobDatesCompactYears('not-a-date', undefined, 'Present'), 'not-a-date - Present');
});

test('formatJobDatesCompactYears with valid start and invalid end', () => {
  assert.equal(formatJobDatesCompactYears('2020-01-01', 'not-a-date', 'Present'), '2020 - not-a-date');
});
