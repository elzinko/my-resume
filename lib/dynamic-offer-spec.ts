import type { JobOffer, MatchRequirement } from '@/data/offers/types';

const MAX_SPEC_CHARS = 12_000;
const MAX_REQUIREMENTS = 24;
const MAX_KEYWORDS_PER_REQ = 24;
const MAX_LABEL_LEN = 160;
const MAX_COMPANY_LEN = 120;
const MAX_TITLE_LEN = 200;
const MAX_CV_HEADER_ROLE_LEN = 160;

function utf8ToBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUtf8(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
  const padded = b64 + '='.repeat(pad);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function trimStr(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  const t = v.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function normalizeRequirement(raw: unknown): MatchRequirement | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const label = trimStr(o.label, MAX_LABEL_LEN);
  if (!label) return null;
  const kwRaw = o.keywords;
  if (!Array.isArray(kwRaw)) return null;
  const keywords = kwRaw
    .map((k) => trimStr(k, 64).toLowerCase())
    .filter(Boolean)
    .slice(0, MAX_KEYWORDS_PER_REQ);
  if (keywords.length === 0) return null;
  return { label, keywords };
}

/**
 * Valide et normalise un objet JSON en {@link JobOffer} (pour URL dynamique ou scripts LLM).
 */
export function parseJobOfferFromUnknown(raw: unknown): JobOffer | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;

  const company = trimStr(o.company, MAX_COMPANY_LEN);
  if (!company) return null;

  let titleFr = '';
  let titleEn = '';
  if (typeof o.title === 'string') {
    titleFr = trimStr(o.title, MAX_TITLE_LEN);
    titleEn = titleFr;
  } else if (o.title && typeof o.title === 'object') {
    const t = o.title as Record<string, unknown>;
    titleFr = trimStr(t.fr, MAX_TITLE_LEN) || trimStr(t.en, MAX_TITLE_LEN);
    titleEn = trimStr(t.en, MAX_TITLE_LEN) || titleFr;
  }
  if (!titleFr) return null;

  let cvHeaderRole: { fr: string; en: string } | undefined;
  if (o.cvHeaderRole && typeof o.cvHeaderRole === 'object') {
    const c = o.cvHeaderRole as Record<string, unknown>;
    const cfr = trimStr(c.fr, MAX_CV_HEADER_ROLE_LEN);
    const cen = trimStr(c.en, MAX_CV_HEADER_ROLE_LEN);
    if (cfr || cen) cvHeaderRole = { fr: cfr || cen, en: cen || cfr };
  } else if (typeof o.cv_role === 'string') {
    const r = trimStr(o.cv_role, MAX_CV_HEADER_ROLE_LEN);
    if (r) cvHeaderRole = { fr: r, en: r };
  }

  const reqRaw = o.requirements;
  if (!Array.isArray(reqRaw) || reqRaw.length === 0) return null;
  const requirements: MatchRequirement[] = [];
  for (const r of reqRaw.slice(0, MAX_REQUIREMENTS)) {
    const req = normalizeRequirement(r);
    if (req) requirements.push(req);
  }
  if (requirements.length === 0) return null;

  const id =
    trimStr(o.id, 80) ||
    `custom-${company.toLowerCase().replace(/\s+/g, '-').slice(0, 40)}`;

  return {
    id,
    company,
    title: { fr: titleFr, en: titleEn },
    ...(cvHeaderRole ? { cvHeaderRole } : {}),
    url: typeof o.url === 'string' ? trimStr(o.url, 500) : undefined,
    requirements,
  };
}

/**
 * Décode le paramètre d’URL `spec` (JSON UTF-8 en base64url).
 */
export function decodeOfferSpecParam(spec: string | null): JobOffer | null {
  if (!spec || typeof spec !== 'string') return null;
  const trimmed = spec.trim();
  if (!trimmed || trimmed.length > MAX_SPEC_CHARS) return null;
  try {
    const json = base64UrlToUtf8(trimmed);
    const data = JSON.parse(json) as unknown;
    return parseJobOfferFromUnknown(data);
  } catch {
    return null;
  }
}

/**
 * Encode une offre en chaîne base64url (navigateur ou Node avec Buffer).
 * Utile pour construire l’URL `/{lang}/offer/custom?spec=…` depuis un script ou un LLM.
 */
export function encodeOfferSpecParam(offer: JobOffer): string {
  const json = JSON.stringify(offer);
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(json, 'utf8').toString('base64url');
  }
  return utf8ToBase64Url(json);
}
