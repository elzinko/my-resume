import type { Locale } from '../i18n-config';
import { composeCvSnapshot, type CvSources } from './cv-compose';

export const PROFILE_API_SCHEMA_VERSION = 1;

export const PROFILE_API_SECTIONS = [
  'profile',
  'about',
  'domains',
  'jobs',
  'studies',
  'projects',
  'hobbies',
  'learnings',
  'skills',
  'techCatalog',
] as const;

export type ProfileApiSection = (typeof PROFILE_API_SECTIONS)[number];

const DEFAULT_SECTIONS: readonly ProfileApiSection[] =
  PROFILE_API_SECTIONS.filter((s) => s !== 'techCatalog');

export interface ProfileApiResponse {
  schemaVersion: typeof PROFILE_API_SCHEMA_VERSION;
  lang: Locale;
  profile?: unknown;
  about?: unknown;
  domains?: unknown;
  jobs?: unknown;
  studies?: unknown;
  projects?: unknown;
  hobbies?: unknown;
  learnings?: unknown;
  skills?: unknown;
  techCatalog?: unknown;
}

export class UnknownSectionError extends Error {
  constructor(public readonly section: string) {
    super(`Unknown section: "${section}"`);
    this.name = 'UnknownSectionError';
  }
}

/**
 * Parse a comma-separated `include=` param into a validated list of sections.
 * `null`/empty → default sections (everything except `techCatalog`).
 * Unknown section → throws `UnknownSectionError`.
 */
export function parseIncludeParam(
  raw: string | null | undefined,
): readonly ProfileApiSection[] {
  if (!raw || !raw.trim()) return DEFAULT_SECTIONS;
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return DEFAULT_SECTIONS;
  const valid = new Set<string>(PROFILE_API_SECTIONS);
  const out: ProfileApiSection[] = [];
  const seen = new Set<ProfileApiSection>();
  for (const p of parts) {
    if (!valid.has(p)) throw new UnknownSectionError(p);
    const s = p as ProfileApiSection;
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

type Snapshot = ReturnType<typeof composeCvSnapshot>;

function buildProfileSection(snap: Snapshot): unknown {
  const header = snap.header as { id: string; name: string; role: string };
  const contact = snap.contact as {
    phone: string;
    email: string;
    location: string;
  };
  return {
    id: header.id,
    name: header.name,
    role: header.role,
    contact: {
      phone: contact.phone,
      email: contact.email,
      location: contact.location,
    },
    github: snap.github,
    educationLevel: snap.educationLevel,
  };
}

function buildTechCatalogSection(sources: CvSources, lang: Locale): unknown {
  const entryById = new Map(sources.techCatalog.entries.map((e) => [e.id, e]));
  const pickName = (id: string): string => {
    const e = entryById.get(id);
    if (!e) throw new Error(`profile-api: unknown tech id "${id}"`);
    return lang === 'en' && e.nameEn ? e.nameEn : e.name;
  };
  const skills = sources.techCatalog.skillsOrder.map((id) => {
    const e = entryById.get(id)!;
    return { id, name: pickName(id), link: e.link ?? '' };
  });
  const domains = sources.techCatalog.domains.map((d) => ({
    id: d.id,
    name: d.name,
    description: sources.locale.domains[d.id].description,
    descriptionCdi: sources.locale.domains[d.id].descriptionCdi,
    position: d.position,
    competencies: d.competencyIds.map((id) => ({
      id,
      name: pickName(id),
      link: entryById.get(id)?.link ?? '',
    })),
  }));
  return { skills, domains };
}

/**
 * Build the public `/api/profile` response payload from already-loaded sources.
 * Pure function — no filesystem access — to keep this unit-testable.
 */
export function buildProfileResponse(
  lang: Locale,
  sources: CvSources,
  sections: readonly ProfileApiSection[] = DEFAULT_SECTIONS,
): ProfileApiResponse {
  const snap = composeCvSnapshot(lang, sources);
  const response: ProfileApiResponse = {
    schemaVersion: PROFILE_API_SCHEMA_VERSION,
    lang,
  };
  const want = new Set(sections);
  if (want.has('profile')) response.profile = buildProfileSection(snap);
  if (want.has('about')) response.about = snap.about;
  if (want.has('domains')) response.domains = snap.allDomainsModels;
  if (want.has('jobs')) response.jobs = snap.allJobsModels;
  if (want.has('studies')) response.studies = snap.allStudiesModels;
  if (want.has('projects')) response.projects = snap.allProjectsModels;
  if (want.has('hobbies')) response.hobbies = snap.allHobbiesModels;
  if (want.has('learnings')) response.learnings = snap.allLearningsModels;
  if (want.has('skills')) response.skills = snap.allSkillsModels;
  if (want.has('techCatalog'))
    response.techCatalog = buildTechCatalogSection(sources, lang);
  return response;
}
