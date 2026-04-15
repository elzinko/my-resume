import 'server-only';

import experienceJson from '@/data/cv/experience.json';
import localeFrJson from '@/data/cv/locales/fr.json';
import profileJson from '@/data/cv/profile.json';
import techCatalogJson from '@/data/cv/tech-catalog.json';
import { composeCvSnapshot } from '@/lib/cv-compose';
import type {
  Experience,
  LocaleBundle,
  Profile,
  TechCatalog,
} from '@/lib/cv-compose';
import { slugifyClient } from './slug';

export interface JobCatalogEntry {
  slug: string;
  client: string;
  role: string;
  startDate: string;
  endDate: string | null;
  frameworks: string[];
}

let cachedEntries: JobCatalogEntry[] | null = null;

/** Catalogue des missions dérivé des fichiers `data/cv/*.json` (mémoïsé par process). */
export function getJobCatalog(): JobCatalogEntry[] {
  if (!cachedEntries) {
    const fr = composeCvSnapshot('fr', {
      profile: profileJson as Profile,
      techCatalog: techCatalogJson as TechCatalog,
      experience: experienceJson as Experience,
      locale: localeFrJson as LocaleBundle,
    }) as { allJobsModels?: Array<Record<string, unknown>> };
    const jobs = fr.allJobsModels ?? [];
    cachedEntries = jobs.map((j) => {
      const client = (j.client as string) || '';
      const roleObj = j.role as { name?: string } | undefined;
      const role = roleObj?.name || '';
      const startDate = (j.startDate as string) || '';
      const endDate = (j.endDate as string) || null;
      const fws = (j.frameworks as Array<{ name?: string }>) || [];
      return {
        slug: slugifyClient(client).replace(/^mission-/, ''),
        client,
        role,
        startDate: startDate.slice(0, 7), // YYYY-MM
        endDate: endDate ? endDate.slice(0, 7) : null,
        frameworks: fws.map((f) => f.name || '').filter(Boolean),
      };
    });
  }
  return cachedEntries;
}
