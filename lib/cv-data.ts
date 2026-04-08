import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import { GraphQLClient } from 'graphql-request';
import type { Locale } from '../i18n-config';
import { CV_AGGREGATE_QUERY } from './cv-data-query';

/**
 * Snapshot CV unifié. Shape conservée à l'identique de l'ancien export DatoCMS
 * pour éviter de toucher tous les consommateurs (jobs.tsx, tech-match, pages…).
 *
 * La source primaire est désormais le trio :
 *   data/cv/cv.json          — données neutres (dates, slugs, refs tech)
 *   data/cv/tech-catalog.json — dictionnaire techno (nom canonique + lien)
 *   data/cv/locales/{lang}.json — textes par locale + libellés UI
 *
 * DatoCMS reste supporté via `CV_DATA_SOURCE=datocms` (mode legacy).
 */
export type CvSnapshot = Record<string, unknown>;

export type CvDataSourceMode = 'local' | 'datocms';

type TechCatalog = Record<string, { name: string; link?: string }>;

type NeutralCv = {
  github: { url: string };
  header: { name: string };
  contact: { phone: string; email: string; location: string };
  jobs: Array<{
    slug: string;
    client: string;
    location?: string;
    startDate: string;
    endDate: string | null;
    tech: string[];
  }>;
  domains: Array<{
    slug: string;
    position: number;
    competencies: string[];
  }>;
  skills: string[];
  studies: Array<{
    slug: string;
    establishment: string;
    location: string;
    startDate: string;
    endDate: string;
  }>;
  projects: Array<{
    slug: string;
    name: string;
    title: string;
    link: string;
    startDate: string;
    endDate: string | null;
    tech: string[];
  }>;
  hobbies: Array<{ slug: string; link?: string }>;
  learnings: Array<{ slug: string; link?: string }>;
};

type LocaleBundle = {
  header: { role: string };
  contact: {
    title: string;
    phoneTitle: string;
    emailTitle: string;
    locationTitle: string;
  };
  about: { title: string; text: string };
  sectionTitles: Record<string, string>;
  educationLevel: Record<string, string>;
  head: {
    url: string;
    name: string;
    locale: string;
    seo: { title: string; description: string };
  };
  jobs: Record<
    string,
    { role: string; description: string; bullets: string[] }
  >;
  domains: Record<string, { name: string; description: string }>;
  studies: Record<string, { name: string }>;
  projects: Record<string, { description: string; bullets: string[] }>;
  hobbies: Array<{ slug: string; name: string }>;
  learnings: Array<{ slug: string; name: string }>;
  ui: Record<string, string>;
};

function resolveDataSource(): CvDataSourceMode {
  const v = (process.env.CV_DATA_SOURCE ?? 'local').toLowerCase();
  if (v === 'datocms' || v === 'dato') return 'datocms';
  return 'local';
}

async function readJson<T>(...segments: string[]): Promise<T> {
  const filePath = path.join(process.cwd(), ...segments);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function resolveTech(slug: string, catalog: TechCatalog) {
  const entry = catalog[slug];
  return {
    id: slug,
    name: entry?.name ?? slug,
    link: entry?.link ?? '',
  };
}

function mergeSnapshot(
  cv: NeutralCv,
  loc: LocaleBundle,
  catalog: TechCatalog,
): CvSnapshot {
  const allJobsModels = cv.jobs.map((job) => {
    const textBundle = loc.jobs[job.slug] ?? {
      role: '',
      description: '',
      bullets: [],
    };
    return {
      client: job.client,
      location: job.location ?? '',
      startDate: job.startDate,
      endDate: job.endDate,
      description: textBundle.description,
      bullets: textBundle.bullets.map((text, i) => ({
        id: `${job.slug}-b${i}`,
        text,
      })),
      frameworks: job.tech.map((slug) => resolveTech(slug, catalog)),
      role: { id: `${job.slug}-role`, name: textBundle.role },
    };
  });

  const allDomainsModels = cv.domains.map((domain) => {
    const text = loc.domains[domain.slug] ?? { name: '', description: '' };
    return {
      id: domain.slug,
      name: text.name,
      description: text.description,
      position: domain.position,
      competencies: domain.competencies.map((slug) => resolveTech(slug, catalog)),
    };
  });

  const allSkillsModels = cv.skills.map((slug) => resolveTech(slug, catalog));

  const allStudiesModels = cv.studies.map((study) => {
    const text = loc.studies[study.slug] ?? { name: '' };
    return {
      id: study.slug,
      name: text.name,
      startDate: study.startDate,
      endDate: study.endDate,
      establishment: study.establishment,
      location: study.location,
    };
  });

  const allProjectsModels = cv.projects.map((project) => {
    const text = loc.projects[project.slug] ?? { description: '', bullets: [] };
    return {
      id: project.slug,
      name: project.name,
      title: project.title,
      link: project.link,
      startDate: project.startDate,
      endDate: project.endDate,
      description: text.description,
      frameworks: project.tech.map((slug) => resolveTech(slug, catalog)),
      bullets: text.bullets.map((t, i) => ({ id: `${project.slug}-b${i}`, text: t })),
      tags: [],
    };
  });

  const allHobbiesModels = loc.hobbies.map((h) => {
    const neutral = cv.hobbies.find((x) => x.slug === h.slug);
    return { id: h.slug, name: h.name, link: neutral?.link ?? '' };
  });

  const allLearningsModels = loc.learnings.map((l) => {
    const neutral = cv.learnings.find((x) => x.slug === l.slug);
    return { id: l.slug, name: l.name, link: neutral?.link ?? '' };
  });

  return {
    github: cv.github,
    header: { id: 'header', name: cv.header.name, role: loc.header.role },
    contact: {
      title: loc.contact.title,
      phoneTitle: loc.contact.phoneTitle,
      phone: cv.contact.phone,
      emailTitle: loc.contact.emailTitle,
      email: cv.contact.email,
      locationTitle: loc.contact.locationTitle,
      location: cv.contact.location,
    },
    about: loc.about,
    skillsTitle: { title: loc.sectionTitles.skills },
    studiesTitle: { title: loc.sectionTitles.studies },
    jobsTitle: { title: loc.sectionTitles.jobs },
    projectsTitle: { title: loc.sectionTitles.projects },
    hobbiesTitle: { title: loc.sectionTitles.hobbies },
    learningsTitle: { title: loc.sectionTitles.learnings },
    educationLevel: loc.educationLevel,
    head: loc.head,
    ui: loc.ui,
    allSkillsModels,
    allDomainsModels,
    allJobsModels,
    allStudiesModels,
    allProjectsModels,
    allHobbiesModels,
    allLearningsModels,
  };
}

async function getCvDataFromLocal(locale: Locale): Promise<CvSnapshot> {
  const [cv, loc, catalog] = await Promise.all([
    readJson<NeutralCv>('data', 'cv', 'cv.json'),
    readJson<LocaleBundle>('data', 'cv', 'locales', `${locale}.json`),
    readJson<TechCatalog>('data', 'cv', 'tech-catalog.json'),
  ]);
  return mergeSnapshot(cv, loc, catalog);
}

async function getCvDataFromDatocms(locale: Locale): Promise<CvSnapshot> {
  const url = process.env.DATOCMS_API_URL;
  const token = process.env.DATOCMS_API_KEY;
  if (!url || !token) {
    throw new Error(
      'CV_DATA_SOURCE=datocms requires DATOCMS_API_URL and DATOCMS_API_KEY',
    );
  }
  const client = new GraphQLClient(url, {
    headers: { authorization: `Bearer ${token}` },
  });
  const data = await client.request(CV_AGGREGATE_QUERY, { lang: locale });
  return data as CvSnapshot;
}

export async function getCvData(locale: Locale): Promise<CvSnapshot> {
  if (resolveDataSource() === 'datocms') {
    return getCvDataFromDatocms(locale);
  }
  return getCvDataFromLocal(locale);
}
