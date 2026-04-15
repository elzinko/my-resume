import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import type { Locale } from '../i18n-config';
import {
  composeCvSnapshot,
  type CvSources,
  type Experience,
  type LocaleBundle,
  type Profile,
  type TechCatalog,
} from './cv-compose';

export type CvSnapshot = Record<string, unknown>;

const CV_DIR = path.join(process.cwd(), 'data', 'cv');

async function readJson<T>(p: string): Promise<T> {
  const raw = await readFile(p, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function loadCvSources(locale: Locale): Promise<CvSources> {
  const [profile, techCatalog, experience, localeBundle] = await Promise.all([
    readJson<Profile>(path.join(CV_DIR, 'profile.json')),
    readJson<TechCatalog>(path.join(CV_DIR, 'tech-catalog.json')),
    readJson<Experience>(path.join(CV_DIR, 'experience.json')),
    readJson<LocaleBundle>(path.join(CV_DIR, 'locales', `${locale}.json`)),
  ]);
  return { profile, techCatalog, experience, locale: localeBundle };
}

export async function getCvData(locale: Locale): Promise<CvSnapshot> {
  const sources = await loadCvSources(locale);
  return composeCvSnapshot(locale, sources);
}
