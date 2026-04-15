import test from 'node:test';
import assert from 'node:assert/strict';
import type { CvSources } from './cv-compose';
import profileJson from '../data/cv/profile.json';
import techCatalogJson from '../data/cv/tech-catalog.json';
import experienceJson from '../data/cv/experience.json';
import localeFrJson from '../data/cv/locales/fr.json';
import localeEnJson from '../data/cv/locales/en.json';
import {
  buildProfileResponse,
  parseIncludeParam,
  PROFILE_API_SCHEMA_VERSION,
  PROFILE_API_SECTIONS,
  UnknownSectionError,
} from './profile-api';

const sourcesFr = {
  profile: profileJson,
  techCatalog: techCatalogJson,
  experience: experienceJson,
  locale: localeFrJson,
} as unknown as CvSources;

const sourcesEn = {
  profile: profileJson,
  techCatalog: techCatalogJson,
  experience: experienceJson,
  locale: localeEnJson,
} as unknown as CvSources;

test('parseIncludeParam — null/empty returns default (all except techCatalog)', () => {
  const def = parseIncludeParam(null);
  assert.equal(def.includes('techCatalog'), false);
  assert.equal(def.includes('profile'), true);
  assert.equal(def.length, PROFILE_API_SECTIONS.length - 1);
  assert.deepEqual(parseIncludeParam(''), def);
  assert.deepEqual(parseIncludeParam('   '), def);
});

test('parseIncludeParam — comma-separated list, trims & deduplicates', () => {
  assert.deepEqual(parseIncludeParam('profile, jobs , profile'), [
    'profile',
    'jobs',
  ]);
});

test('parseIncludeParam — throws UnknownSectionError for unknown section', () => {
  assert.throws(
    () => parseIncludeParam('profile,not_a_section'),
    (err) => {
      assert.ok(err instanceof UnknownSectionError);
      assert.equal((err as UnknownSectionError).section, 'not_a_section');
      return true;
    },
  );
});

test('buildProfileResponse — defaults: schemaVersion, lang, no techCatalog', () => {
  const r = buildProfileResponse('fr', sourcesFr);
  assert.equal(r.schemaVersion, PROFILE_API_SCHEMA_VERSION);
  assert.equal(r.lang, 'fr');
  assert.ok(r.profile, 'profile present');
  assert.ok(r.about, 'about present');
  assert.ok(r.skills, 'skills present');
  assert.ok(r.jobs, 'jobs present');
  assert.equal(r.techCatalog, undefined, 'techCatalog opt-in');
});

test('buildProfileResponse — include=profile returns only profile + envelope', () => {
  const r = buildProfileResponse('fr', sourcesFr, ['profile']);
  const keys = Object.keys(r).sort();
  assert.deepEqual(keys, ['lang', 'profile', 'schemaVersion']);
});

test('buildProfileResponse — include=techCatalog activates it', () => {
  const r = buildProfileResponse('fr', sourcesFr, ['techCatalog']);
  assert.ok(r.techCatalog, 'techCatalog present');
  const tc = r.techCatalog as { skills: unknown[]; domains: unknown[] };
  assert.ok(Array.isArray(tc.skills));
  assert.ok(Array.isArray(tc.domains));
  assert.ok(tc.skills.length > 0);
});

test('buildProfileResponse — profile section shape (no contact titles)', () => {
  const r = buildProfileResponse('fr', sourcesFr, ['profile']);
  const p = r.profile as {
    name: string;
    role: string;
    contact: Record<string, unknown>;
    github: { url: string };
    educationLevel: Record<string, string>;
  };
  assert.equal(typeof p.name, 'string');
  assert.ok(p.name.length > 0);
  assert.equal(typeof p.role, 'string');
  assert.ok(p.role.length > 0);
  assert.deepEqual(
    Object.keys(p.contact).sort(),
    ['email', 'location', 'phone'],
    'contact has no title fields',
  );
  assert.equal(typeof p.github.url, 'string');
  assert.ok(p.educationLevel.title);
});

test('buildProfileResponse — profile.role is localized (fr vs en)', () => {
  const fr = buildProfileResponse('fr', sourcesFr, ['profile']);
  const en = buildProfileResponse('en', sourcesEn, ['profile']);
  const roleFr = (fr.profile as { role: string }).role;
  const roleEn = (en.profile as { role: string }).role;
  assert.notEqual(roleFr, roleEn, 'fr and en roles differ');
});

test('buildProfileResponse — jobs/projects/etc are arrays of objects', () => {
  const r = buildProfileResponse('fr', sourcesFr);
  for (const key of [
    'domains',
    'jobs',
    'studies',
    'projects',
    'hobbies',
    'learnings',
    'skills',
  ] as const) {
    const v = (r as Record<string, unknown>)[key];
    assert.ok(Array.isArray(v), `${key} is array`);
    assert.ok((v as unknown[]).length > 0, `${key} non-empty`);
  }
});

test('buildProfileResponse — about shape matches spec', () => {
  const r = buildProfileResponse('fr', sourcesFr, ['about']);
  const a = r.about as Record<string, unknown>;
  assert.ok(a.title, 'about.title');
  assert.ok(a.text, 'about.text');
  assert.ok(a.textCdi, 'about.textCdi');
});

test('buildProfileResponse — techCatalog skills have non-empty links where catalog has them', () => {
  const r = buildProfileResponse('fr', sourcesFr, ['techCatalog']);
  const tc = r.techCatalog as {
    skills: Array<{ id: string; name: string; link: string }>;
  };
  const withLink = tc.skills.filter((s) => s.link);
  assert.ok(withLink.length > 0, 'at least one skill has a link in catalog');
});
