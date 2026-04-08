/**
 * Tags du domaine **Ops** : exactement 5 pastilles, une ligne.
 *
 * Un seul « nuage » cible par contexte client : **AWS** (défaut), **GCP** ou **Azure**.
 *
 * Paramètres d’URL (snake_case accepté) :
 * - `opsTags` / `ops_tags` : 5 libellés séparés par des virgules (allowlist).
 * - `opsCloud` / `ops_cloud` : `aws` | `gcp` | `azure` — choisit la liste à afficher.
 * - `opsPreset` / `ops_preset` : alias de `opsCloud` (mêmes clés).
 * - `opsHint` / `ops_hint` : mots-clés → preset le mieux noté (ex. `amazon`, `google`).
 *
 * Priorité : `opsTags` valides → `opsCloud` / `opsPreset` → `opsHint` → preset **aws**.
 */

export const OPS_DOMAIN_ID = '78855347';

export type OpsTagFive = readonly [string, string, string, string, string];

/** Compétences Ops du bundle (orthographe affichage corrigée pour GCP / Azure). */
const BUNDLE_OPS_LABELS: readonly string[] = [
  'Docker',
  'Kubernetes',
  'Terraform',
  'Helm',
  'AWS',
  'GCP',
  'Azure',
];

/**
 * Trois listes « un nuage » : Docker / K8s / Terraform en commun + le fournisseur + Helm.
 */
export const OPS_PRESETS: Record<string, OpsTagFive> = {
  aws: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Helm'],
  gcp: ['Docker', 'Kubernetes', 'Terraform', 'GCP', 'Helm'],
  azure: ['Docker', 'Kubernetes', 'Terraform', 'Azure', 'Helm'],
};

export const OPS_CLOUD_KEYS = Object.freeze(
  Object.keys(OPS_PRESETS) as (keyof typeof OPS_PRESETS)[],
);

function getParam(sp: URLSearchParams, a: string, b: string): string | null {
  const v = sp.get(a) ?? sp.get(b);
  if (v == null || v.trim() === '') return null;
  return v;
}

function buildCanonicalMap(): Map<string, string> {
  const m = new Map<string, string>();
  const add = (label: string) => {
    const k = label.trim().toLowerCase();
    m.set(k, label.trim());
  };
  for (const t of BUNDLE_OPS_LABELS) add(t);
  for (const row of Object.values(OPS_PRESETS)) {
    for (const t of row) add(t);
  }
  const syn: [string, string][] = [
    ['google', 'GCP'],
    ['google cloud', 'GCP'],
    ['googlecloud', 'GCP'],
    ['amazon', 'AWS'],
    ['amazon web services', 'AWS'],
    ['microsoft azure', 'Azure'],
    ['ms azure', 'Azure'],
  ];
  for (const [alias, target] of syn) {
    const canon = m.get(target.toLowerCase()) ?? target;
    m.set(alias.toLowerCase(), canon);
  }
  return m;
}

const CANONICAL = buildCanonicalMap();

export function opsTagAllowlistLabels(): string[] {
  return Array.from(new Set(CANONICAL.values())).sort((a, b) =>
    a.localeCompare(b, 'fr'),
  );
}

function parseExplicitFive(sp: URLSearchParams): OpsTagFive | null {
  const raw = getParam(sp, 'opsTags', 'ops_tags');
  if (!raw) return null;
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length !== 5) return null;
  const resolved: string[] = [];
  for (const p of parts) {
    const c = CANONICAL.get(p.toLowerCase());
    if (!c) return null;
    resolved.push(c);
  }
  return resolved as unknown as OpsTagFive;
}

function normalizeTechToken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function tagMatchesKeyword(tag: string, kw: string): boolean {
  const tl = tag.toLowerCase();
  const kl = kw.toLowerCase();
  if (tl.includes(kl) || kl.includes(tl)) return true;
  const tn = normalizeTechToken(tag);
  const kn = normalizeTechToken(kw);
  return tn.includes(kn) || kn.includes(tn);
}

function scorePreset(tags: readonly string[], keywords: string[]): number {
  let s = 0;
  for (const kw of keywords) {
    for (const t of tags) {
      if (tagMatchesKeyword(t, kw)) s += 1;
    }
  }
  return s;
}

function cloudFromParams(sp: URLSearchParams): OpsTagFive | null {
  const raw =
    getParam(sp, 'opsCloud', 'ops_cloud') ??
    getParam(sp, 'opsPreset', 'ops_preset');
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return OPS_PRESETS[key] ?? null;
}

function cloudBoostFromKeyword(kw: string): Partial<Record<keyof typeof OPS_PRESETS, number>> {
  const k = kw.toLowerCase();
  const out: Partial<Record<keyof typeof OPS_PRESETS, number>> = {};
  if (k.includes('google') || k === 'gcp' || k.includes('gcp')) out.gcp = 5;
  if (k.includes('amazon') || k === 'aws' || k.includes('aws')) out.aws = 5;
  if (k.includes('azure') || k.includes('microsoft')) out.azure = 5;
  return out;
}

function presetFromHint(sp: URLSearchParams): OpsTagFive | null {
  const raw = getParam(sp, 'opsHint', 'ops_hint');
  if (!raw) return null;
  const keywords = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (keywords.length === 0) return null;

  const boosts: Record<keyof typeof OPS_PRESETS, number> = {
    aws: 0,
    gcp: 0,
    azure: 0,
  };
  for (const kw of keywords) {
    const b = cloudBoostFromKeyword(kw);
    for (const key of Object.keys(b) as (keyof typeof OPS_PRESETS)[]) {
      boosts[key] += b[key] ?? 0;
    }
  }

  let bestKey: keyof typeof OPS_PRESETS = 'aws';
  let bestScore = -1;
  for (const key of Object.keys(OPS_PRESETS) as (keyof typeof OPS_PRESETS)[]) {
    const tags = OPS_PRESETS[key];
    const sc = scorePreset(tags, keywords) + boosts[key];
    if (sc > bestScore) {
      bestScore = sc;
      bestKey = key;
    }
  }
  if (bestScore <= 0) return OPS_PRESETS.aws;
  return OPS_PRESETS[bestKey];
}

export function resolveOpsDomainTagsFromSearchParams(
  sp: URLSearchParams,
): OpsTagFive {
  return (
    parseExplicitFive(sp) ??
    cloudFromParams(sp) ??
    presetFromHint(sp) ??
    OPS_PRESETS.aws
  );
}

export function isOpsDomainId(id: string | undefined): boolean {
  return id === OPS_DOMAIN_ID;
}
