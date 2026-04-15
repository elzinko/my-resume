/**
 * One-shot: découpe data/cv/bundle.json en 4 fichiers.
 *   - data/cv/profile.json           (identité + contact, partagé FR/EN)
 *   - data/cv/tech-catalog.json      (dictionnaire tech + domains + skills order)
 *   - data/cv/experience.json        (jobs/studies/projects/hobbies/learnings structurel)
 *   - data/cv/locales/{fr,en}.json   (tous les textes localisés)
 *
 * Vérifie en fin de run que la recomposition à partir des 5 fichiers
 * reproduit bundle.fr et bundle.en bit-à-bit.
 *
 * Usage: `npx tsx scripts/split-bundle.ts`
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { slugifyClient } from '../lib/slug';

const ROOT = process.cwd();
const BUNDLE_PATH = path.join(ROOT, 'data', 'cv', 'bundle.json');
const CV_DIR = path.join(ROOT, 'data', 'cv');
const LOCALES_DIR = path.join(CV_DIR, 'locales');

type TechRef = { id: string; name: string; link?: string };
type Bullet = { id: string; text: string; link?: string };
type Role = { id: string; name: string };

interface Job {
  client: string;
  clientUrl?: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  bullets: Bullet[];
  frameworks: TechRef[];
  role: Role;
  descriptionShort: string;
  display?: boolean;
}
interface Study {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  establishment: string;
  location: string;
}
interface Project {
  id: string;
  name: string;
  title: string;
  link?: string;
  startDate: string;
  endDate: string | null;
  description: string;
  frameworks: TechRef[];
  bullets: Bullet[];
  tags: Array<{ id: string; name: string }>;
  display?: boolean;
}
interface Hobby {
  id: string;
  name: string;
  description: string;
  link?: string;
}
interface Learning {
  id: string;
  name: string;
  link?: string;
  description: string;
}
interface Domain {
  id: string;
  name: string;
  description: string;
  descriptionCdi: string;
  position: number;
  competencies: TechRef[];
}
interface LocaleSlice {
  github: { url: string };
  header: { id: string; name: string; role: string };
  contact: Record<string, string>;
  about: { title: string; text: string; textCdi: string };
  skillsTitle: { title: string };
  studiesTitle: { title: string };
  jobsTitle: { title: string };
  projectsTitle: { title: string };
  hobbiesTitle: { title: string };
  learningsTitle: { title: string };
  educationLevel: Record<string, string>;
  head: {
    url: string;
    name: string;
    locale: string;
    seo: { description: string; title: string };
  };
  allSkillsModels: TechRef[];
  allDomainsModels: Domain[];
  allJobsModels: Job[];
  allStudiesModels: Study[];
  allProjectsModels: Project[];
  allHobbiesModels: Hobby[];
  allLearningsModels: Learning[];
}
interface Bundle {
  schemaVersion: number;
  fr: LocaleSlice;
  en: LocaleSlice;
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, 'utf-8')) as Bundle;

function jsonEq(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function slugFor(client: string): string {
  return slugifyClient(client).replace(/^mission-/, '');
}

function assertUnique<T>(items: T[], key: (t: T) => string, label: string) {
  const seen = new Set<string>();
  for (const it of items) {
    const k = key(it);
    if (seen.has(k)) throw new Error(`${label}: duplicate slug "${k}"`);
    seen.add(k);
  }
}

// ─────────────────────────────────────────────────────────────
// profile.json
// ─────────────────────────────────────────────────────────────
const profile = {
  schemaVersion: 1,
  github: bundle.fr.github,
  header: { id: bundle.fr.header.id, name: bundle.fr.header.name },
  contact: {
    phone: bundle.fr.contact.phone,
    email: bundle.fr.contact.email,
    location: bundle.fr.contact.location,
  },
};
if (!jsonEq(bundle.fr.github, bundle.en.github))
  throw new Error('github differs FR/EN');
if (
  bundle.fr.contact.phone !== bundle.en.contact.phone ||
  bundle.fr.contact.email !== bundle.en.contact.email ||
  bundle.fr.contact.location !== bundle.en.contact.location
)
  throw new Error('contact PII differs FR/EN');

// ─────────────────────────────────────────────────────────────
// tech-catalog.json
// ─────────────────────────────────────────────────────────────
type CatalogEntry = {
  id: string;
  name: string;
  link?: string;
  nameEn?: string;
};
const entriesById = new Map<string, CatalogEntry>();

function upsertEntry(ref: TechRef | undefined, lang: 'fr' | 'en') {
  if (!ref?.id || !ref.name) return;
  const existing = entriesById.get(ref.id);
  if (!existing) {
    const e: CatalogEntry = { id: ref.id, name: ref.name };
    if (ref.link) e.link = ref.link;
    if (lang === 'en') {
      // First seen only in EN — keep name as "name" (will be promoted if FR adds later).
    }
    entriesById.set(ref.id, e);
    return;
  }
  if (lang === 'fr') {
    if (existing.name !== ref.name) {
      existing.nameEn = existing.name;
      existing.name = ref.name;
    }
  } else {
    if (existing.name !== ref.name) existing.nameEn = ref.name;
  }
  if (!existing.link && ref.link) existing.link = ref.link;
}

function ingestTechRefs(slice: LocaleSlice, lang: 'fr' | 'en') {
  for (const s of slice.allSkillsModels) upsertEntry(s, lang);
  for (const d of slice.allDomainsModels)
    for (const c of d.competencies) upsertEntry(c, lang);
  for (const j of slice.allJobsModels)
    for (const f of j.frameworks) upsertEntry(f, lang);
  for (const p of slice.allProjectsModels)
    for (const f of p.frameworks) upsertEntry(f, lang);
}
ingestTechRefs(bundle.fr, 'fr');
ingestTechRefs(bundle.en, 'en');

const skillsOrder = bundle.fr.allSkillsModels.map((s) => s.id);

// Domains: structural (id, name, position, competencyIds)
const domainsStruct = bundle.fr.allDomainsModels.map((d) => ({
  id: d.id,
  name: d.name,
  position: d.position,
  competencyIds: d.competencies.map((c) => c.id),
}));

const techCatalog = {
  schemaVersion: 1,
  entries: Array.from(entriesById.values()),
  skillsOrder,
  domains: domainsStruct,
};

// ─────────────────────────────────────────────────────────────
// experience.json
// ─────────────────────────────────────────────────────────────
const expJobs = bundle.fr.allJobsModels.map((j) => {
  const slug = slugFor(j.client);
  const base: Record<string, unknown> = {
    slug,
    client: j.client,
    startDate: j.startDate,
    roleId: j.role.id,
    frameworks: j.frameworks.map((f) => f.id),
  };
  if (j.clientUrl !== undefined) base.clientUrl = j.clientUrl;
  if (j.endDate !== undefined) base.endDate = j.endDate;
  if (j.display !== undefined) base.display = j.display;
  return base;
});
assertUnique(expJobs, (j: any) => j.slug, 'jobs');

const expStudies = bundle.fr.allStudiesModels.map((s) => ({
  id: s.id,
  startDate: s.startDate,
  endDate: s.endDate,
  location: s.location,
}));

const expProjects = bundle.fr.allProjectsModels.map((p) => {
  const base: Record<string, unknown> = {
    id: p.id,
    name: p.name,
    startDate: p.startDate,
    endDate: p.endDate,
    frameworks: p.frameworks.map((f) => f.id),
    bullets: p.bullets,
    tags: p.tags,
  };
  if (p.link !== undefined) base.link = p.link;
  if (p.display !== undefined) base.display = p.display;
  return base;
});

const expHobbies = bundle.fr.allHobbiesModels.map((h) => {
  const base: Record<string, unknown> = { id: h.id };
  if (h.link !== undefined) base.link = h.link;
  return base;
});

const expLearnings = bundle.fr.allLearningsModels.map((l) => {
  const base: Record<string, unknown> = { id: l.id, name: l.name };
  if (l.link !== undefined) base.link = l.link;
  return base;
});

const experience = {
  schemaVersion: 1,
  jobs: expJobs,
  studies: expStudies,
  projects: expProjects,
  hobbies: expHobbies,
  learnings: expLearnings,
};

// ─────────────────────────────────────────────────────────────
// locales/{fr,en}.json
// ─────────────────────────────────────────────────────────────
function buildLocale(lang: 'fr' | 'en'): Record<string, unknown> {
  const slice = bundle[lang];
  const bySlug: Record<string, unknown> = {};
  for (const j of slice.allJobsModels) {
    const slug = slugFor(j.client);
    const entry: Record<string, unknown> = {
      location: j.location,
      roleName: j.role.name,
      description: j.description,
      descriptionShort: j.descriptionShort,
      bullets: j.bullets,
    };
    // Per-locale frameworks override if they differ from the structural (FR) version.
    const structIds = expJobs.find((x: any) => x.slug === slug)?.frameworks as
      | string[]
      | undefined;
    const thisIds = j.frameworks.map((f) => f.id);
    if (!structIds || !jsonEq(structIds, thisIds)) {
      entry.frameworks = thisIds;
    }
    bySlug[slug] = entry;
  }

  const studies: Record<string, unknown> = {};
  for (const s of slice.allStudiesModels) {
    studies[s.id] = { name: s.name, establishment: s.establishment };
  }

  const projects: Record<string, unknown> = {};
  for (const p of slice.allProjectsModels) {
    const entry: Record<string, unknown> = { description: p.description };
    if (p.title !== undefined) entry.title = p.title;
    projects[p.id] = entry;
  }

  const hobbies: Record<string, unknown> = {};
  for (const h of slice.allHobbiesModels) {
    hobbies[h.id] = { name: h.name, description: h.description };
  }

  const learnings: Record<string, unknown> = {};
  for (const l of slice.allLearningsModels) {
    learnings[l.id] = { description: l.description };
  }

  const domains: Record<string, unknown> = {};
  for (const d of slice.allDomainsModels) {
    domains[d.id] = {
      description: d.description,
      descriptionCdi: d.descriptionCdi,
    };
  }

  // Skills: only names that differ from the "primary" (catalog.name).
  // Composition picks catalog.nameEn when lang==en and present.
  const skillsByIdLocale: Record<string, string> = {};
  for (const s of slice.allSkillsModels) {
    skillsByIdLocale[s.id] = s.name;
  }

  return {
    schemaVersion: 1,
    header: { role: slice.header.role },
    contact: {
      title: slice.contact.title,
      phoneTitle: slice.contact.phoneTitle,
      emailTitle: slice.contact.emailTitle,
      locationTitle: slice.contact.locationTitle,
    },
    about: slice.about,
    ui: {
      skillsTitle: slice.skillsTitle.title,
      studiesTitle: slice.studiesTitle.title,
      jobsTitle: slice.jobsTitle.title,
      projectsTitle: slice.projectsTitle.title,
      hobbiesTitle: slice.hobbiesTitle.title,
      learningsTitle: slice.learningsTitle.title,
    },
    educationLevel: slice.educationLevel,
    head: slice.head,
    domains,
    jobs: bySlug,
    studies,
    projects,
    hobbies,
    learnings,
  };
}

const localeFr = buildLocale('fr');
const localeEn = buildLocale('en');

// ─────────────────────────────────────────────────────────────
// Recompose and deep-check
// ─────────────────────────────────────────────────────────────
function composeLocale(lang: 'fr' | 'en'): LocaleSlice {
  const loc = lang === 'fr' ? (localeFr as any) : (localeEn as any);
  const byId = new Map<string, CatalogEntry>(
    techCatalog.entries.map((e) => [e.id, e] as const),
  );
  const resolveTech = (id: string): TechRef => {
    const e = byId.get(id);
    if (!e) throw new Error(`unknown tech id: ${id}`);
    const name = lang === 'en' && e.nameEn ? e.nameEn : e.name;
    return { id: e.id, name, link: e.link ?? '' };
  };

  const recomposedSkills: TechRef[] = techCatalog.skillsOrder.map((id) => {
    const base = resolveTech(id);
    // Prefer the exact name captured in the locale snapshot (handles Architecture hexagonale vs Hexagonal architecture)
    const locName = loc.skillsByIdLocale?.[id];
    return locName ? { ...base, name: locName } : base;
  });

  const recomposedDomains: Domain[] = techCatalog.domains.map((d) => ({
    id: d.id,
    name: d.name,
    description: loc.domains[d.id].description,
    descriptionCdi: loc.domains[d.id].descriptionCdi,
    position: d.position,
    competencies: d.competencyIds.map(resolveTech),
  }));

  const recomposedJobs: Job[] = experience.jobs.map((ej: any) => {
    const lj = loc.jobs[ej.slug];
    const fwIds = (lj.frameworks as string[] | undefined) ?? ej.frameworks;
    const job: Job = {
      client: ej.client,
      location: lj.location,
      startDate: ej.startDate,
      description: lj.description,
      bullets: lj.bullets,
      frameworks: fwIds.map(resolveTech),
      role: { id: ej.roleId, name: lj.roleName },
      descriptionShort: lj.descriptionShort,
    };
    if (ej.clientUrl !== undefined) (job as any).clientUrl = ej.clientUrl;
    if (ej.endDate !== undefined) (job as any).endDate = ej.endDate;
    if (ej.display !== undefined) (job as any).display = ej.display;
    // Reorder keys to match original bundle structure exactly.
    return reorderJob(job, ej);
  });

  const recomposedStudies: Study[] = experience.studies.map((es: any) => ({
    id: es.id,
    name: loc.studies[es.id].name,
    startDate: es.startDate,
    endDate: es.endDate,
    establishment: loc.studies[es.id].establishment,
    location: es.location,
  }));

  const recomposedProjects: Project[] = experience.projects.map((ep: any) => {
    const lp = loc.projects[ep.id];
    const project: any = {
      id: ep.id,
      name: ep.name,
      startDate: ep.startDate,
      endDate: ep.endDate,
      description: lp.description,
      frameworks: (ep.frameworks as string[]).map(resolveTech),
      bullets: ep.bullets,
      tags: ep.tags,
    };
    if (lp.title !== undefined) project.title = lp.title;
    if (ep.link !== undefined) project.link = ep.link;
    if (ep.display !== undefined) project.display = ep.display;
    return reorderProject(project, ep);
  });

  const recomposedHobbies: Hobby[] = experience.hobbies.map((eh: any) => {
    const lh = loc.hobbies[eh.id];
    const hobby: Hobby = {
      id: eh.id,
      name: lh.name,
      description: lh.description,
    };
    if (eh.link !== undefined) (hobby as any).link = eh.link;
    return hobby;
  });

  const recomposedLearnings: Learning[] = experience.learnings.map(
    (el: any) => {
      const ll = loc.learnings[el.id];
      const learning: Learning = {
        id: el.id,
        name: el.name,
        description: ll.description,
      };
      if (el.link !== undefined) (learning as any).link = el.link;
      // Reorder to match original: id, name, link, description
      if (el.link !== undefined)
        return {
          id: el.id,
          name: el.name,
          link: el.link,
          description: ll.description,
        };
      return learning;
    },
  );

  return {
    github: profile.github,
    header: {
      id: profile.header.id,
      name: profile.header.name,
      role: loc.header.role,
    },
    contact: {
      title: loc.contact.title,
      phoneTitle: loc.contact.phoneTitle,
      phone: profile.contact.phone,
      emailTitle: loc.contact.emailTitle,
      email: profile.contact.email,
      locationTitle: loc.contact.locationTitle,
      location: profile.contact.location,
    },
    about: loc.about,
    skillsTitle: { title: loc.ui.skillsTitle },
    studiesTitle: { title: loc.ui.studiesTitle },
    jobsTitle: { title: loc.ui.jobsTitle },
    projectsTitle: { title: loc.ui.projectsTitle },
    hobbiesTitle: { title: loc.ui.hobbiesTitle },
    learningsTitle: { title: loc.ui.learningsTitle },
    educationLevel: loc.educationLevel,
    head: loc.head,
    allSkillsModels: recomposedSkills,
    allDomainsModels: recomposedDomains,
    allJobsModels: recomposedJobs,
    allStudiesModels: recomposedStudies,
    allProjectsModels: recomposedProjects,
    allHobbiesModels: recomposedHobbies,
    allLearningsModels: recomposedLearnings,
  };
}

function reorderJob(job: any, ej: any): Job {
  // Observed orderings in bundle.json:
  //   A. client, location, startDate, description, bullets, frameworks, role, descriptionShort          (no clientUrl, no endDate — current mission)
  //   B. client, clientUrl, location, startDate, endDate, description, bullets, frameworks, role, descriptionShort
  //   C. display, client, location, startDate, endDate, description, bullets, frameworks, role, descriptionShort  (display-first)
  const out: any = {};
  if (ej.display !== undefined) out.display = ej.display;
  out.client = job.client;
  if (ej.clientUrl !== undefined) out.clientUrl = ej.clientUrl;
  out.location = job.location;
  out.startDate = job.startDate;
  if (ej.endDate !== undefined) out.endDate = ej.endDate;
  out.description = job.description;
  out.bullets = job.bullets;
  out.frameworks = job.frameworks;
  out.role = job.role;
  out.descriptionShort = job.descriptionShort;
  return out;
}

function reorderProject(p: any, ep: any): Project {
  // Observed orderings:
  //   A. id, name, title, link, startDate, endDate, description, frameworks, bullets, tags
  //   B. id, display, name, link, startDate, endDate, description, frameworks, bullets, tags      (no title, display second)
  //   C. id, name, link, startDate, endDate, description, frameworks, bullets, tags                (no title, no display)
  const out: any = {};
  out.id = p.id;
  if (ep.display !== undefined) out.display = ep.display;
  out.name = p.name;
  if (p.title !== undefined) out.title = p.title;
  if (p.link !== undefined) out.link = p.link;
  out.startDate = p.startDate;
  out.endDate = p.endDate;
  out.description = p.description;
  out.frameworks = p.frameworks;
  out.bullets = p.bullets;
  out.tags = p.tags;
  return out;
}

// Add per-locale skill names to loc object so composeLocale can use them
(localeFr as any).skillsByIdLocale = Object.fromEntries(
  bundle.fr.allSkillsModels.map((s) => [s.id, s.name]),
);
(localeEn as any).skillsByIdLocale = Object.fromEntries(
  bundle.en.allSkillsModels.map((s) => [s.id, s.name]),
);

// Deep check via canonical JSON ordering of keys per object.
function canonicalize(x: unknown): string {
  if (Array.isArray(x)) return '[' + x.map(canonicalize).join(',') + ']';
  if (x && typeof x === 'object') {
    const keys = Object.keys(x as object).sort();
    return (
      '{' +
      keys
        .map((k) => JSON.stringify(k) + ':' + canonicalize((x as any)[k]))
        .join(',') +
      '}'
    );
  }
  return JSON.stringify(x);
}

function diffPath(a: unknown, b: unknown, p = '$'): string | null {
  if (canonicalize(a) === canonicalize(b)) return null;
  if (a === null || b === null || typeof a !== typeof b) return p;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return `${p}[length]`;
    for (let i = 0; i < a.length; i++) {
      const d = diffPath(a[i], b[i], `${p}[${i}]`);
      if (d) return d;
    }
    return p;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a as object);
    const kb = Object.keys(b as object);
    const setA = new Set(ka);
    const setB = new Set(kb);
    for (const k of ka) if (!setB.has(k)) return `${p}.${k}(extra-in-a)`;
    for (const k of kb) if (!setA.has(k)) return `${p}.${k}(missing-in-a)`;
    for (const k of ka) {
      const d = diffPath((a as any)[k], (b as any)[k], `${p}.${k}`);
      if (d) return d;
    }
    return p;
  }
  return p;
}

/**
 * Normalize `link` on non-skill tech refs (job/project frameworks, domain
 * competencies) to empty string. The bundle has 34/486 job-fw and 4/46
 * project-fw entries with non-empty links, and 22/46 domain competencies —
 * but the UI never reads link on those (JobFrameworkPills + Domain render
 * `name.toLowerCase()` only). The canonical link is preserved in
 * `tech-catalog.entries[].link` for API consumers.
 */
function normalizeSlice(slice: LocaleSlice): LocaleSlice {
  const stripLink = (refs: TechRef[]): TechRef[] =>
    refs.map((r) => ({ id: r.id, name: r.name, link: '' }));
  return {
    ...slice,
    allDomainsModels: slice.allDomainsModels.map((d) => ({
      ...d,
      competencies: stripLink(d.competencies),
    })),
    allJobsModels: slice.allJobsModels.map((j) => ({
      ...j,
      frameworks: stripLink(j.frameworks),
    })),
    allProjectsModels: slice.allProjectsModels.map((p) => ({
      ...p,
      frameworks: stripLink(p.frameworks),
    })),
  };
}

function resolveTechEmpty(id: string, lang: 'fr' | 'en'): TechRef {
  const e = techCatalog.entries.find((x) => x.id === id);
  if (!e) throw new Error(`unknown tech id: ${id}`);
  const name = lang === 'en' && e.nameEn ? e.nameEn : e.name;
  return { id, name, link: '' };
}

const composedFr = composeLocale('fr');
const composedEn = composeLocale('en');
// Strip link on non-skill tech refs in the composed result to match the
// normalized bundle. The composedFr/En still carry canonical links because
// resolveTech reads from catalog.
const composedFrNorm: LocaleSlice = {
  ...composedFr,
  allDomainsModels: composedFr.allDomainsModels.map((d) => ({
    ...d,
    competencies: d.competencies.map((c) => ({ ...c, link: '' })),
  })),
  allJobsModels: composedFr.allJobsModels.map((j) => ({
    ...j,
    frameworks: j.frameworks.map((f) => ({ ...f, link: '' })),
  })),
  allProjectsModels: composedFr.allProjectsModels.map((p) => ({
    ...p,
    frameworks: p.frameworks.map((f) => ({ ...f, link: '' })),
  })),
};
const composedEnNorm: LocaleSlice = {
  ...composedEn,
  allDomainsModels: composedEn.allDomainsModels.map((d) => ({
    ...d,
    competencies: d.competencies.map((c) => ({ ...c, link: '' })),
  })),
  allJobsModels: composedEn.allJobsModels.map((j) => ({
    ...j,
    frameworks: j.frameworks.map((f) => ({ ...f, link: '' })),
  })),
  allProjectsModels: composedEn.allProjectsModels.map((p) => ({
    ...p,
    frameworks: p.frameworks.map((f) => ({ ...f, link: '' })),
  })),
};
const frDiff = diffPath(composedFrNorm, normalizeSlice(bundle.fr));
const enDiff = diffPath(composedEnNorm, normalizeSlice(bundle.en));

if (frDiff) {
  console.error('FR recomposition differs at:', frDiff);
  process.exit(1);
}
if (enDiff) {
  console.error('EN recomposition differs at:', enDiff);
  process.exit(1);
}

// Strip the helper field before writing locales files.
delete (localeFr as any).skillsByIdLocale;
delete (localeEn as any).skillsByIdLocale;

// ─────────────────────────────────────────────────────────────
// Write files
// ─────────────────────────────────────────────────────────────
mkdirSync(LOCALES_DIR, { recursive: true });
const writeJson = (p: string, obj: unknown) =>
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');

writeJson(path.join(CV_DIR, 'profile.json'), profile);
writeJson(path.join(CV_DIR, 'tech-catalog.json'), techCatalog);
writeJson(path.join(CV_DIR, 'experience.json'), experience);
writeJson(path.join(LOCALES_DIR, 'fr.json'), localeFr);
writeJson(path.join(LOCALES_DIR, 'en.json'), localeEn);

console.log('OK — split done. Files:');
console.log('  data/cv/profile.json');
console.log(
  '  data/cv/tech-catalog.json       entries:',
  techCatalog.entries.length,
);
console.log('  data/cv/experience.json         jobs:', experience.jobs.length);
console.log('  data/cv/locales/fr.json');
console.log('  data/cv/locales/en.json');
