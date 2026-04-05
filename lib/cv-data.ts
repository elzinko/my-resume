import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import { GraphQLClient } from 'graphql-request';
import { parse as parseYaml } from 'yaml';
import type { Locale } from '../i18n-config';
import { CV_AGGREGATE_QUERY } from './cv-data-query';

/**
 * Snapshot JSON exporté par `npm run export:datocms` (une entrée par locale),
 * ou réponse équivalente lue en direct depuis DatoCMS si `CV_DATA_SOURCE=datocms`.
 * Typage volontairement souple ; les pages ciblent leurs clés.
 */
export type CvSnapshot = Record<string, unknown>;

export type CvDataSourceMode = 'local' | 'datocms';

function resolveDataSource(): CvDataSourceMode {
  const v = (process.env.CV_DATA_SOURCE ?? 'local').toLowerCase();
  if (v === 'datocms' || v === 'dato') return 'datocms';
  return 'local';
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

async function getCvDataFromLocal(locale: Locale): Promise<CvSnapshot> {
  const format = (process.env.CV_LOCAL_FORMAT ?? 'json').toLowerCase();
  const ext = format === 'yaml' || format === 'yml' ? 'yaml' : 'json';
  const filePath = path.join(process.cwd(), 'data', 'cv', `${locale}.${ext}`);
  const raw = await readFile(filePath, 'utf-8');
  if (ext === 'yaml') {
    return parseYaml(raw) as CvSnapshot;
  }
  return JSON.parse(raw) as CvSnapshot;
}

export async function getCvData(locale: Locale): Promise<CvSnapshot> {
  if (resolveDataSource() === 'datocms') {
    return getCvDataFromDatocms(locale);
  }
  return getCvDataFromLocal(locale);
}
