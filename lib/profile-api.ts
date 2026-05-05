import type { Locale } from '../i18n-config';
import { composeCvSnapshot, type CvSources } from './cv-compose';

export const PROFILE_API_SCHEMA_VERSION = 1;

export interface ProfileApiResponse {
  schemaVersion: typeof PROFILE_API_SCHEMA_VERSION;
  lang: Locale;
  profile: unknown;
  about: unknown;
  domains: unknown;
  jobs: unknown;
  studies: unknown;
  projects: unknown;
  hobbies: unknown;
  learnings: unknown;
  skills: unknown;
  techCatalog: unknown;
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
): ProfileApiResponse {
  const snap = composeCvSnapshot(lang, sources);
  return {
    schemaVersion: PROFILE_API_SCHEMA_VERSION,
    lang,
    profile: buildProfileSection(snap),
    about: snap.about,
    domains: snap.allDomainsModels,
    jobs: snap.allJobsModels,
    studies: snap.allStudiesModels,
    projects: snap.allProjectsModels,
    hobbies: snap.allHobbiesModels,
    learnings: snap.allLearningsModels,
    skills: snap.allSkillsModels,
    techCatalog: buildTechCatalogSection(sources, lang),
  };
}
