import type { JobOffer, MatchRequirement } from '@/data/offers/types';
import type { Locale } from 'i18n-config';
import { decodeOfferSpecParam } from '@/lib/dynamic-offer-spec';

const MAX_REQUIREMENTS = 24;
const MAX_KEYWORDS_PER_REQ = 24;
const MAX_LABEL_LEN = 160;
const MAX_COMPANY_LEN = 120;
const MAX_TITLE_LEN = 200;
const MAX_CV_HEADER_ROLE_LEN = 160;

/** Next.js `searchParams` → `URLSearchParams` (valeurs multiples conservées). */
export function searchParamsRecordToURLSearchParams(
  record: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) sp.append(key, v);
    } else {
      sp.append(key, value);
    }
  }
  return sp;
}

function parseCvHeaderRoleFromSearchParams(
  sp: URLSearchParams,
): { fr: string; en: string } | undefined {
  const single =
    sp.get('cv_role')?.trim().slice(0, MAX_CV_HEADER_ROLE_LEN) ?? '';
  const fr =
    sp.get('cv_role_fr')?.trim().slice(0, MAX_CV_HEADER_ROLE_LEN) || single;
  const en =
    sp.get('cv_role_en')?.trim().slice(0, MAX_CV_HEADER_ROLE_LEN) || single;
  if (!fr && !en) return undefined;
  return { fr: fr || en, en: en || fr };
}

/** Titre sous le nom (header CV) issu de l’offre résolue, pour la locale courante. */
export function pickCvHeaderRole(
  offer: JobOffer | null | undefined,
  lang: Locale,
): string | undefined {
  const r = offer?.cvHeaderRole;
  if (!r) return undefined;
  const s = lang === 'en' ? r.en : r.fr;
  return s.trim() || undefined;
}

/**
 * Une exigence dans l’URL : `Libellé:motcle1,motcle2` (deux-points après le libellé, virgules entre mots-clés).
 */
function parseRequirementToken(raw: string): MatchRequirement | null {
  const decoded = raw.trim();
  if (!decoded) return null;
  const colon = decoded.indexOf(':');
  if (colon < 0) return null;
  const label = decoded.slice(0, colon).trim().slice(0, MAX_LABEL_LEN);
  const kwPart = decoded.slice(colon + 1);
  const keywords = kwPart
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, MAX_KEYWORDS_PER_REQ);
  if (!label || keywords.length === 0) return null;
  return { label, keywords };
}

/**
 * Construit une offre à partir de paramètres GET lisibles (sans base64).
 *
 * Paramètres :
 * - `company` (obligatoire)
 * - `title` ou `title_fr` / `title_en` (sinon `title` = société pour les deux langues)
 * - `requirement` ou `req` : répétable, chaque valeur = `Libellé:mot1,mot2`
 */
export function buildOfferFromQueryParams(
  sp: URLSearchParams,
): JobOffer | null {
  const company = sp.get('company')?.trim().slice(0, MAX_COMPANY_LEN) ?? '';
  if (!company) return null;

  const titleFrom =
    sp.get('title_fr')?.trim() ||
    sp.get('title')?.trim() ||
    sp.get('title_en')?.trim() ||
    '';
  const titleEn =
    sp.get('title_en')?.trim() ||
    sp.get('title')?.trim() ||
    titleFrom ||
    company;
  const titleFr =
    sp.get('title_fr')?.trim() ||
    sp.get('title')?.trim() ||
    titleFrom ||
    company;

  const titleFrSafe = titleFr.slice(0, MAX_TITLE_LEN);
  const titleEnSafe = titleEn.slice(0, MAX_TITLE_LEN);

  const tokens = [
    ...sp.getAll('requirement'),
    ...sp.getAll('req'),
  ].slice(0, MAX_REQUIREMENTS);

  const requirements: MatchRequirement[] = [];
  for (const t of tokens) {
    const req = parseRequirementToken(t);
    if (req) requirements.push(req);
  }
  if (requirements.length === 0) return null;

  const id =
    sp.get('id')?.trim().slice(0, 80) ||
    `match-${company
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 40)}`;

  const cvHeaderRole = parseCvHeaderRoleFromSearchParams(sp);

  return {
    id,
    company,
    title: { fr: titleFrSafe, en: titleEnSafe },
    ...(cvHeaderRole ? { cvHeaderRole } : {}),
    requirements,
  };
}

/**
 * Si `spec` est présent et valide → offre décodée ; sinon → paramètres de requête.
 */
export function resolveOfferFromUrlParams(
  sp: URLSearchParams,
): JobOffer | null {
  const spec = sp.get('spec');
  if (spec?.trim()) {
    const fromSpec = decodeOfferSpecParam(spec);
    if (fromSpec) return fromSpec;
  }
  return buildOfferFromQueryParams(sp);
}
