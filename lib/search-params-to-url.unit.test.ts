import test from 'node:test';
import assert from 'node:assert/strict';
import { recordToURLSearchParams } from './search-params-to-url';

test('recordToURLSearchParams converts key-value record', () => {
  const result = recordToURLSearchParams({ foo: 'bar', baz: 'qux' });
  assert.equal(result.get('foo'), 'bar');
  assert.equal(result.get('baz'), 'qux');
});

test('recordToURLSearchParams excludes undefined values', () => {
  const result = recordToURLSearchParams({ foo: 'bar', baz: undefined });
  assert.equal(result.get('foo'), 'bar');
  assert.equal(result.has('baz'), false);
});

test('recordToURLSearchParams handles empty record', () => {
  const result = recordToURLSearchParams({});
  assert.equal(result.toString(), '');
});

test('recordToURLSearchParams handles undefined input', () => {
  const result = recordToURLSearchParams(undefined);
  assert.equal(result.toString(), '');
});

test('recordToURLSearchParams handles array values', () => {
  const result = recordToURLSearchParams({ tags: ['a', 'b', 'c'] });
  assert.deepEqual(result.getAll('tags'), ['a', 'b', 'c']);
});

test('recordToURLSearchParams excludes empty string values', () => {
  const result = recordToURLSearchParams({ foo: '', bar: 'ok' });
  assert.equal(result.has('foo'), false);
  assert.equal(result.get('bar'), 'ok');
});

test('recordToURLSearchParams excludes empty strings in arrays', () => {
  const result = recordToURLSearchParams({ tags: ['a', '', 'c'] });
  assert.deepEqual(result.getAll('tags'), ['a', 'c']);
});
