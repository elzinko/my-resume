import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAboutText, resolveDomainDescription } from './cv-contract-text';

// --- resolveAboutText ---

test('resolveAboutText returns textCdi for cdi contract', () => {
  const about = { text: 'freelance text', textCdi: 'cdi text' };
  assert.equal(resolveAboutText(about, 'cdi'), 'cdi text');
});

test('resolveAboutText returns text for freelance contract', () => {
  const about = { text: 'freelance text', textCdi: 'cdi text' };
  assert.equal(resolveAboutText(about, 'freelance'), 'freelance text');
});

test('resolveAboutText returns text when contract is undefined', () => {
  const about = { text: 'freelance text', textCdi: 'cdi text' };
  assert.equal(resolveAboutText(about, undefined), 'freelance text');
});

test('resolveAboutText falls back to text when cdi but no textCdi', () => {
  const about = { text: 'default text' };
  assert.equal(resolveAboutText(about, 'cdi'), 'default text');
});

test('resolveAboutText returns empty string for null about', () => {
  assert.equal(resolveAboutText(null, 'cdi'), '');
});

test('resolveAboutText returns empty string for undefined about', () => {
  assert.equal(resolveAboutText(undefined, 'freelance'), '');
});

test('resolveAboutText returns empty string when no text fields', () => {
  assert.equal(resolveAboutText({}, 'freelance'), '');
});

// --- resolveDomainDescription ---

test('resolveDomainDescription returns descriptionCdi for cdi contract', () => {
  const domain = { description: 'freelance desc', descriptionCdi: 'cdi desc' };
  assert.equal(resolveDomainDescription(domain, 'cdi'), 'cdi desc');
});

test('resolveDomainDescription returns description for freelance contract', () => {
  const domain = { description: 'freelance desc', descriptionCdi: 'cdi desc' };
  assert.equal(resolveDomainDescription(domain, 'freelance'), 'freelance desc');
});

test('resolveDomainDescription returns description when contract is undefined', () => {
  const domain = { description: 'default desc' };
  assert.equal(resolveDomainDescription(domain, undefined), 'default desc');
});

test('resolveDomainDescription falls back to description when cdi but no descriptionCdi', () => {
  const domain = { description: 'fallback desc' };
  assert.equal(resolveDomainDescription(domain, 'cdi'), 'fallback desc');
});

test('resolveDomainDescription returns empty string for null domain', () => {
  assert.equal(resolveDomainDescription(null, 'cdi'), '');
});

test('resolveDomainDescription returns empty string for undefined domain', () => {
  assert.equal(resolveDomainDescription(undefined), '');
});
