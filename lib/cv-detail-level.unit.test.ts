import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRIEF_DETAIL_LEVEL,
  jobDetailLevelAt,
  parseDetailLevel,
  parseDetailedJobs,
} from './cv-detail-level';

test('parseDetailLevel keeps summary and minimal', () => {
  assert.equal(parseDetailLevel('summary'), 'summary');
  assert.equal(parseDetailLevel('minimal'), 'minimal');
});

test('parseDetailLevel defaults to full', () => {
  assert.equal(parseDetailLevel('full'), 'full');
  assert.equal(parseDetailLevel(null), 'full');
  assert.equal(parseDetailLevel(undefined), 'full');
  assert.equal(parseDetailLevel(''), 'full');
  assert.equal(parseDetailLevel('SUMMARY'), 'full');
  assert.equal(parseDetailLevel('whatever'), 'full');
});

test('parseDetailedJobs : entier >= 0, sinon null', () => {
  assert.equal(parseDetailedJobs('0'), 0);
  assert.equal(parseDetailedJobs('3'), 3);
  assert.equal(parseDetailedJobs(null), null);
  assert.equal(parseDetailedJobs(undefined), null);
  assert.equal(parseDetailedJobs(''), null);
  assert.equal(parseDetailedJobs('-1'), null);
  assert.equal(parseDetailedJobs('2.5'), null);
  assert.equal(parseDetailedJobs('abc'), null);
});

test('jobDetailLevelAt : seuil par index, full puis bref', () => {
  // Sans seuil → niveau global partout.
  assert.equal(jobDetailLevelAt(0, 'full', null), 'full');
  assert.equal(jobDetailLevelAt(9, 'full', null), 'full');
  // Seuil = 2 → index 0,1 au niveau global ; à partir de 2 en bref.
  assert.equal(jobDetailLevelAt(0, 'full', 2), 'full');
  assert.equal(jobDetailLevelAt(1, 'full', 2), 'full');
  assert.equal(jobDetailLevelAt(2, 'full', 2), BRIEF_DETAIL_LEVEL);
  assert.equal(jobDetailLevelAt(5, 'full', 2), BRIEF_DETAIL_LEVEL);
  // Seuil = 0 → tout en bref.
  assert.equal(jobDetailLevelAt(0, 'full', 0), BRIEF_DETAIL_LEVEL);
  // Le niveau global est respecté sous le seuil (ex. summary).
  assert.equal(jobDetailLevelAt(0, 'summary', 2), 'summary');
});
