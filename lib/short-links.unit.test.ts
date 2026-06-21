import test from 'node:test';
import assert from 'node:assert/strict';
import { cvOfferTarget, resolveShortLink, SHORT_LINKS } from './short-links';

test('cvOfferTarget encodes company, title, subtitle and requirements', () => {
  const target = cvOfferTarget({
    company: 'Resilience',
    titleFr: 'Développeur fullstack Kotlin',
    subtitleFr: 'Backend Kotlin · Java',
    contract: 'freelance',
    requirements: ['Kotlin:kotlin', 'Java:java'],
  });
  assert.ok(target.startsWith('/fr?'));
  const sp = new URLSearchParams(target.slice('/fr?'.length));
  assert.equal(sp.get('company'), 'Resilience');
  assert.equal(sp.get('title_fr'), 'Développeur fullstack Kotlin');
  assert.equal(sp.get('subtitle_fr'), 'Backend Kotlin · Java');
  assert.equal(sp.get('contract'), 'freelance');
  assert.deepEqual(sp.getAll('requirement'), ['Kotlin:kotlin', 'Java:java']);
});

test('cvOfferTarget omits contract when not provided', () => {
  const target = cvOfferTarget({
    company: 'X',
    titleFr: 'T',
    subtitleFr: 'S',
    requirements: ['Kotlin:kotlin'],
  });
  const sp = new URLSearchParams(target.slice('/fr?'.length));
  assert.equal(sp.get('contract'), null);
});

test('resolveShortLink resolves a known slug', () => {
  const target = resolveShortLink('/resilience');
  assert.ok(target);
  assert.ok(target!.includes('company=Resilience'));
});

test('resolveShortLink is case-insensitive and tolerates trailing slash', () => {
  assert.equal(resolveShortLink('/Resilience'), SHORT_LINKS.resilience);
  assert.equal(resolveShortLink('/resilience/'), SHORT_LINKS.resilience);
});

test('resolveShortLink returns null for unknown or empty paths', () => {
  assert.equal(resolveShortLink('/unknown'), null);
  assert.equal(resolveShortLink('/'), null);
  assert.equal(resolveShortLink(''), null);
  assert.equal(resolveShortLink('/fr'), null);
});

test('resolveShortLink target points at the French CV with requirements', () => {
  const target = resolveShortLink('/resilience')!;
  const sp = new URLSearchParams(target.slice('/fr?'.length));
  assert.equal(
    sp.get('subtitle_fr'),
    'Développeur fullstack Kotlin · Java · Spring Boot',
  );
  assert.ok(sp.getAll('requirement').some((r) => r.startsWith('Kotlin:')));
  assert.equal(sp.getAll('requirement').length, 6);
});
