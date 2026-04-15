import type { Locale } from '../i18n-config';

export type TechRef = { id: string; name: string; link: string };

export interface TechCatalogEntry {
  id: string;
  name: string;
  link?: string;
  nameEn?: string;
}

export interface TechCatalog {
  schemaVersion: number;
  entries: TechCatalogEntry[];
  skillsOrder: string[];
  domains: Array<{
    id: string;
    name: string;
    position: number;
    competencyIds: string[];
  }>;
}

export interface Profile {
  schemaVersion: number;
  github: { url: string };
  header: { id: string; name: string };
  contact: { phone: string; email: string; location: string };
}

export interface ExperienceJob {
  slug: string;
  client: string;
  clientUrl?: string;
  startDate: string;
  endDate?: string;
  display?: boolean;
  roleId: string;
  frameworks: string[];
}

export interface ExperienceStudy {
  id: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface ExperienceProject {
  id: string;
  name: string;
  link?: string;
  startDate: string;
  endDate: string | null;
  frameworks: string[];
  bullets: Array<{ id: string; text: string; link?: string }>;
  tags: Array<{ id: string; name: string }>;
  display?: boolean;
}

export interface ExperienceHobby {
  id: string;
  link?: string;
}

export interface ExperienceLearning {
  id: string;
  name: string;
  link?: string;
}

export interface Experience {
  schemaVersion: number;
  jobs: ExperienceJob[];
  studies: ExperienceStudy[];
  projects: ExperienceProject[];
  hobbies: ExperienceHobby[];
  learnings: ExperienceLearning[];
}

export interface LocaleBundle {
  schemaVersion: number;
  header: { role: string };
  contact: {
    title: string;
    phoneTitle: string;
    emailTitle: string;
    locationTitle: string;
  };
  about: { title: string; text: string; textCdi: string };
  ui: {
    skillsTitle: string;
    studiesTitle: string;
    jobsTitle: string;
    projectsTitle: string;
    hobbiesTitle: string;
    learningsTitle: string;
  };
  educationLevel: Record<string, string>;
  head: {
    url: string;
    name: string;
    locale: string;
    seo: { description: string; title: string };
  };
  domains: Record<string, { description: string; descriptionCdi: string }>;
  jobs: Record<
    string,
    {
      location: string;
      roleName: string;
      description: string;
      descriptionShort: string;
      bullets: Array<{ id: string; text: string; link?: string }>;
      frameworks?: string[];
    }
  >;
  studies: Record<string, { name: string; establishment: string }>;
  projects: Record<string, { description: string; title?: string }>;
  hobbies: Record<string, { name: string; description: string }>;
  learnings: Record<string, { description: string }>;
}

export interface CvSources {
  profile: Profile;
  techCatalog: TechCatalog;
  experience: Experience;
  locale: LocaleBundle;
}

/**
 * Compose the 4 data files into the legacy `bundle[locale]` shape consumed by
 * every server component of the CV. Field order matches the original bundle
 * (assertions in `scripts/split-bundle.ts` guarantee bit-for-bit equivalence
 * up to the intentionally dropped `.link` on non-skill tech refs).
 */
export function composeCvSnapshot(
  lang: Locale,
  { profile, techCatalog, experience, locale }: CvSources,
): Record<string, unknown> {
  const entryById = new Map<string, TechCatalogEntry>(
    techCatalog.entries.map((e) => [e.id, e]),
  );
  const resolveTech = (id: string): TechRef => {
    const e = entryById.get(id);
    if (!e) throw new Error(`cv-compose: unknown tech id "${id}"`);
    const name = lang === 'en' && e.nameEn ? e.nameEn : e.name;
    return { id, name, link: e.link ?? '' };
  };
  const resolveTechNoLink = (id: string): TechRef => ({
    ...resolveTech(id),
    link: '',
  });

  const allSkillsModels = techCatalog.skillsOrder.map(resolveTech);

  const allDomainsModels = techCatalog.domains.map((d) => ({
    id: d.id,
    name: d.name,
    description: locale.domains[d.id].description,
    descriptionCdi: locale.domains[d.id].descriptionCdi,
    position: d.position,
    competencies: d.competencyIds.map(resolveTechNoLink),
  }));

  const allJobsModels = experience.jobs.map((ej) => {
    const lj = locale.jobs[ej.slug];
    if (!lj)
      throw new Error(`cv-compose: locale missing job "${ej.slug}" (${lang})`);
    const fwIds = lj.frameworks ?? ej.frameworks;
    const out: Record<string, unknown> = {};
    if (ej.display !== undefined) out.display = ej.display;
    out.client = ej.client;
    if (ej.clientUrl !== undefined) out.clientUrl = ej.clientUrl;
    out.location = lj.location;
    out.startDate = ej.startDate;
    if (ej.endDate !== undefined) out.endDate = ej.endDate;
    out.description = lj.description;
    out.bullets = lj.bullets;
    out.frameworks = fwIds.map(resolveTechNoLink);
    out.role = { id: ej.roleId, name: lj.roleName };
    out.descriptionShort = lj.descriptionShort;
    return out;
  });

  const allStudiesModels = experience.studies.map((es) => {
    const ls = locale.studies[es.id];
    if (!ls) throw new Error(`cv-compose: locale missing study "${es.id}"`);
    return {
      id: es.id,
      name: ls.name,
      startDate: es.startDate,
      endDate: es.endDate,
      establishment: ls.establishment,
      location: es.location,
    };
  });

  const allProjectsModels = experience.projects.map((ep) => {
    const lp = locale.projects[ep.id];
    if (!lp) throw new Error(`cv-compose: locale missing project "${ep.id}"`);
    const out: Record<string, unknown> = {};
    out.id = ep.id;
    if (ep.display !== undefined) out.display = ep.display;
    out.name = ep.name;
    if (lp.title !== undefined) out.title = lp.title;
    if (ep.link !== undefined) out.link = ep.link;
    out.startDate = ep.startDate;
    out.endDate = ep.endDate;
    out.description = lp.description;
    out.frameworks = ep.frameworks.map(resolveTechNoLink);
    out.bullets = ep.bullets;
    out.tags = ep.tags;
    return out;
  });

  const allHobbiesModels = experience.hobbies.map((eh) => {
    const lh = locale.hobbies[eh.id];
    if (!lh) throw new Error(`cv-compose: locale missing hobby "${eh.id}"`);
    const out: Record<string, unknown> = {
      id: eh.id,
      name: lh.name,
      description: lh.description,
    };
    if (eh.link !== undefined) out.link = eh.link;
    return out;
  });

  const allLearningsModels = experience.learnings.map((el) => {
    const ll = locale.learnings[el.id];
    if (!ll) throw new Error(`cv-compose: locale missing learning "${el.id}"`);
    const out: Record<string, unknown> = {
      id: el.id,
      name: el.name,
    };
    if (el.link !== undefined) out.link = el.link;
    out.description = ll.description;
    return out;
  });

  return {
    github: profile.github,
    header: {
      id: profile.header.id,
      name: profile.header.name,
      role: locale.header.role,
    },
    contact: {
      title: locale.contact.title,
      phoneTitle: locale.contact.phoneTitle,
      phone: profile.contact.phone,
      emailTitle: locale.contact.emailTitle,
      email: profile.contact.email,
      locationTitle: locale.contact.locationTitle,
      location: profile.contact.location,
    },
    about: locale.about,
    skillsTitle: { title: locale.ui.skillsTitle },
    studiesTitle: { title: locale.ui.studiesTitle },
    jobsTitle: { title: locale.ui.jobsTitle },
    projectsTitle: { title: locale.ui.projectsTitle },
    hobbiesTitle: { title: locale.ui.hobbiesTitle },
    learningsTitle: { title: locale.ui.learningsTitle },
    educationLevel: locale.educationLevel,
    head: locale.head,
    allSkillsModels,
    allDomainsModels,
    allJobsModels,
    allStudiesModels,
    allProjectsModels,
    allHobbiesModels,
    allLearningsModels,
  };
}
