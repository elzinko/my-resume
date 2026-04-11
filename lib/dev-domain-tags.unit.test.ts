import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveDevDomainTagsFromSearchParams,
  DEV_PRESETS,
} from '@/lib/dev-domain-tags';

function sp(q: string) {
  return new URLSearchParams(q);
}

test('default when no params', () => {
  const t = resolveDevDomainTagsFromSearchParams(new URLSearchParams());
  assert.deepEqual(t, DEV_PRESETS.default);
});

test('devPreset=java', () => {
  const t = resolveDevDomainTagsFromSearchParams(sp('devPreset=java'));
  assert.deepEqual(t, DEV_PRESETS.java);
});

test('dev_preset snake_case', () => {
  const t = resolveDevDomainTagsFromSearchParams(sp('dev_preset=react'));
  assert.deepEqual(t, DEV_PRESETS.react);
});

test('devTags five valid tokens', () => {
  const t = resolveDevDomainTagsFromSearchParams(
    sp('devTags=java,spring%20boot,microservices,ddd,architecture'),
  );
  assert.equal(t[0], 'Java');
  assert.equal(t[1], 'Spring Boot');
});

test('devTags invalid count falls back', () => {
  const t = resolveDevDomainTagsFromSearchParams(sp('devTags=java,react'));
  assert.deepEqual(t, DEV_PRESETS.default);
});

test('devTags unknown token falls back', () => {
  const t = resolveDevDomainTagsFromSearchParams(sp('devTags=a,b,c,d,e'));
  assert.deepEqual(t, DEV_PRESETS.default);
});

test('devHint react,nodejs picks react preset', () => {
  const t = resolveDevDomainTagsFromSearchParams(sp('devHint=react,nodejs'));
  assert.deepEqual(t, DEV_PRESETS.react);
});

test('explicit devTags beats preset', () => {
  const t = resolveDevDomainTagsFromSearchParams(
    sp('devPreset=java&devTags=python,django,fastapi,ddd,architecture'),
  );
  assert.deepEqual(t, DEV_PRESETS.python);
});
