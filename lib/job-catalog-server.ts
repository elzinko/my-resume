import 'server-only';

import bundleJson from '@/data/cv/bundle.json';
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

/** Catalogue des missions dérivé de `data/cv/bundle.json` (mémoïsé par process). */
export function getJobCatalog(): JobCatalogEntry[] {
  if (!cachedEntries) {
    const b = bundleJson as {
      fr?: { allJobsModels?: Array<Record<string, unknown>> };
    };
    const jobs = b.fr?.allJobsModels ?? [];
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
