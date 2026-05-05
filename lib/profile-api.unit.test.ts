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
  PROFILE_API_SCHEMA_VERSION,
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

test('buildProfileResponse — returns schemaVersion, lang, and all sections', () => {
  const r = buildProfileResponse('fr', sourcesFr);
  assert.equal(r.schemaVersion, PROFILE_API_SCHEMA_VERSION);
  assert.equal(r.lang, 'fr');
  assert.ok(r.profile, 'profile present');
  assert.ok(r.about, 'about present');
  assert.ok(r.skills, 'skills present');
  assert.ok(r.jobs, 'jobs present');
  assert.ok(r.techCatalog, 'techCatalog present');
});

test('buildProfileResponse — techCatalog has skills and domains arrays', () => {
  const r = buildProfileResponse('fr', sourcesFr);
  const tc = r.techCatalog as { skills: unknown[]; domains: unknown[] };
  assert.ok(Array.isArray(tc.skills));
  assert.ok(Array.isArray(tc.domains));
  assert.ok(tc.skills.length > 0);
});

test('buildProfileResponse — profile section shape (no contact titles)', () => {
  const r = buildProfileResponse('fr', sourcesFr);
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
  const fr = buildProfileResponse('fr', sourcesFr);
  const en = buildProfileResponse('en', sourcesEn);
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
  const r = buildProfileResponse('fr', sourcesFr);
  const a = r.about as Record<string, unknown>;
  assert.ok(a.title, 'about.title');
  assert.ok(a.text, 'about.text');
  assert.ok(a.textCdi, 'about.textCdi');
});

test('buildProfileResponse — techCatalog skills have non-empty links where catalog has them', () => {
  const r = buildProfileResponse('fr', sourcesFr);
  const tc = r.techCatalog as {
    skills: Array<{ id: string; name: string; link: string }>;
  };
  const withLink = tc.skills.filter((s) => s.link);
  assert.ok(withLink.length > 0, 'at least one skill has a link in catalog');
});
