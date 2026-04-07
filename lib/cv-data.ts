import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import type { Locale } from '../i18n-config';

/**
 * Snapshot JSON par locale (contenu de `bundle.fr` / `bundle.en`).
 * Typage volontairement souple ; les pages ciblent leurs clés.
 */
export type CvSnapshot = Record<string, unknown>;

const BUNDLE_PATH = path.join(process.cwd(), 'data', 'cv', 'bundle.json');

async function getCvDataFromLocal(locale: Locale): Promise<CvSnapshot> {
  const raw = await readFile(BUNDLE_PATH, 'utf-8');
  const bundle = JSON.parse(raw) as Record<string, unknown>;
  const data = bundle[locale];
  if (!data || typeof data !== 'object') {
    throw new Error(
      `data/cv/bundle.json: clé manquante ou invalide pour la locale "${locale}"`,
    );
  }
  return data as CvSnapshot;
}

export async function getCvData(locale: Locale): Promise<CvSnapshot> {
  return getCvDataFromLocal(locale);
}
