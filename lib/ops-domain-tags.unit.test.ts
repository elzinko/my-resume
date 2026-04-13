import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveOpsDomainTagsFromSearchParams,
  OPS_PRESETS,
} from '@/lib/ops-domain-tags';

function sp(q: string) {
  return new URLSearchParams(q);
}

test('default aws when no params', () => {
  const t = resolveOpsDomainTagsFromSearchParams(new URLSearchParams());
  assert.deepEqual(t, OPS_PRESETS.aws);
});

test('opsCloud=gcp', () => {
  const t = resolveOpsDomainTagsFromSearchParams(sp('opsCloud=gcp'));
  assert.deepEqual(t, OPS_PRESETS.gcp);
});

test('ops_cloud snake_case', () => {
  const t = resolveOpsDomainTagsFromSearchParams(sp('ops_cloud=azure'));
  assert.deepEqual(t, OPS_PRESETS.azure);
});

test('opsPreset alias', () => {
  const t = resolveOpsDomainTagsFromSearchParams(sp('opsPreset=gcp'));
  assert.deepEqual(t, OPS_PRESETS.gcp);
});

test('opsTags five valid tokens', () => {
  const t = resolveOpsDomainTagsFromSearchParams(
    sp('opsTags=Docker,Kubernetes,Terraform,AWS,Helm'),
  );
  assert.equal(t[3], 'AWS');
});

test('opsHint google picks gcp', () => {
  const t = resolveOpsDomainTagsFromSearchParams(sp('opsHint=google'));
  assert.deepEqual(t, OPS_PRESETS.gcp);
});

test('explicit opsTags beats opsCloud', () => {
  const t = resolveOpsDomainTagsFromSearchParams(
    sp('opsCloud=aws&opsTags=Docker,Kubernetes,Terraform,GCP,Helm'),
  );
  assert.equal(t[3], 'GCP');
});
