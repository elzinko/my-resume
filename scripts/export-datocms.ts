/**
 * Exporte le contenu DatoCMS vers data/cv/{fr,en}.json (Content Delivery API).
 * Prérequis : DATOCMS_API_URL, DATOCMS_API_KEY (fichier .env en local ou CI).
 */
import { config } from 'dotenv';

config();

import { writeFile, mkdir, readFile } from 'fs/promises';
import path from 'path';
import { GraphQLClient } from 'graphql-request';
import { CV_AGGREGATE_QUERY } from '../lib/cv-data-query';
import { i18n } from '../i18n-config';

async function main() {
  const url = process.env.DATOCMS_API_URL;
  const token = process.env.DATOCMS_API_KEY;
  if (!url || !token) {
    console.error(
      'Missing DATOCMS_API_URL or DATOCMS_API_KEY. Load .env or export variables before running.',
    );
    process.exit(1);
  }

  const client = new GraphQLClient(url, {
    headers: { authorization: `Bearer ${token}` },
  });

  const outDir = path.join(process.cwd(), 'data', 'cv');
  await mkdir(outDir, { recursive: true });

  for (const lang of i18n.locales) {
    const data = (await client.request(CV_AGGREGATE_QUERY, {
      lang,
    })) as Record<string, unknown>;
    const outFile = path.join(outDir, `${lang}.json`);
    try {
      const prev = JSON.parse(await readFile(outFile, 'utf-8')) as Record<
        string,
        unknown
      >;
      if (prev.educationLevel && typeof prev.educationLevel === 'object') {
        data.educationLevel = prev.educationLevel;
      }
    } catch {
      /* fichier absent ou JSON invalide : pas de bloc à préserver */
    }
    await writeFile(outFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Wrote', outFile);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
