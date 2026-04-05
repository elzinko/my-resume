#!/usr/bin/env node
/**
 * Encode un fichier JSON d’offre (même schéma que data/offers/*.ts) en paramètre spec base64url.
 *
 * Usage:
 *   node scripts/encode-offer-spec.mjs ./mon-offre.json
 *   # puis ouvrir: /fr/offer/custom?spec=<sortie>
 */
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/encode-offer-spec.mjs <offer.json>');
  process.exit(1);
}

const raw = fs.readFileSync(file, 'utf8');
const json = JSON.stringify(JSON.parse(raw));
const spec = Buffer.from(json, 'utf8').toString('base64url');
process.stdout.write(spec + '\n');
