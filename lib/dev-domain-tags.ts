/**
 * Tags du domaine **Dev** : exactement 5 pastilles, une ligne.
 *
 * Paramètres d’URL (snake_case accepté en alternative) :
 * - `devTags` / `dev_tags` : 5 libellés séparés par des virgules, chacun dans la allowlist (insensible à la casse).
 * - `devPreset` / `dev_preset` : clé parmi {@link DEV_PRESET_KEYS}.
 * - `devHint` / `dev_hint` : mots-clés séparés par des virgules → choix du preset le mieux noté.
 *
 * Priorité : `devTags` valides → `devPreset` → `devHint` → preset `default`.
 */

export const DEV_DOMAIN_ID = '78726111';

export type DevTagFive = readonly [string, string, string, string, string];

/** Compétences Dev du bundle (référence affichage + orthographe « Typescript » historique). */
const BUNDLE_DEV_LABELS: readonly string[] = [
  'Java',
  'Spring Boot',
  'Typescript',
  'Python',
  'Go',
  'Vue.js',
  'React',
  'Angular',
  'microservices',
  'DDD',
  'Architecture',
];

/**
 * Presets : exactement 5 entrées. Clés en minuscules pour `devPreset=`.
 */
export const DEV_PRESETS: Record<string, DevTagFive> = {
  default: ['Java', 'TypeScript', 'React', 'DDD', 'Architecture'],
  java: ['Java', 'Spring Boot', 'microservices', 'DDD', 'Architecture'],
  react: ['React', 'Node.js', 'TypeScript', 'DDD', 'Architecture'],
  vue: ['Vue.js', 'TypeScript', 'Node.js', 'DDD', 'Architecture'],
  angular: ['Angular', 'TypeScript', 'RxJS', 'DDD', 'Architecture'],
  python: ['Python', 'Django', 'FastAPI', 'DDD', 'Architecture'],
  go: ['Go', 'microservices', 'Kubernetes', 'DDD', 'Architecture'],
};

/** Clés exposées (doc / outils). */
export const DEV_PRESET_KEYS = Object.freeze(Object.keys(DEV_PRESETS));

const EXTRA_ALLOWLIST = [
  'Node.js',
  'TypeScript',
  'Django',
  'FastAPI',
  'RxJS',
  'Flask',
  'Kubernetes',
] as const;

/** Libellés canoniques (affichage) indexés en minuscules pour validation `devTags`. */
function buildCanonicalMap(): Map<string, string> {
  const m = new Map<string, string>();
  /** Dernier gagne (presets / extras écrasent le bundle pour orthographe préférée). */
  const add = (label: string) => {
    const k = label.trim().toLowerCase();
    m.set(k, label.trim());
  };
  for (const t of BUNDLE_DEV_LABELS) add(t);
  for (const row of Object.values(DEV_PRESETS)) {
    for (const t of row) add(t);
  }
  for (const t of EXTRA_ALLOWLIST) add(t);
  // synonymes → canonique
  const syn: [string, string][] = [
    ['nodejs', 'Node.js'],
    ['node.js', 'Node.js'],
    ['node', 'Node.js'],
    ['ts', 'TypeScript'],
  ];
  for (const [alias, target] of syn) {
    const canon = m.get(target.toLowerCase()) ?? target;
    m.set(alias, canon);
  }
  return m;
}

const CANONICAL = buildCanonicalMap();

export function devTagAllowlistLabels(): string[] {
  return Array.from(new Set(CANONICAL.values())).sort((a, b) =>
    a.localeCompare(b, 'fr'),
  );
}

function getParam(sp: URLSearchParams, a: string, b: string): string | null {
  const v = sp.get(a) ?? sp.get(b);
  if (v == null || v.trim() === '') return null;
  return v;
}

function parseExplicitFive(sp: URLSearchParams): DevTagFive | null {
  const raw = getParam(sp, 'devTags', 'dev_tags');
  if (!raw) return null;
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length !== 5) return null;
  const resolved: string[] = [];
  for (const p of parts) {
    const c = CANONICAL.get(p.toLowerCase());
    if (!c) return null;
    resolved.push(c);
  }
  return resolved as unknown as DevTagFive;
}

function presetFromKey(sp: URLSearchParams): DevTagFive | null {
  const key = getParam(sp, 'devPreset', 'dev_preset')?.toLowerCase();
  if (!key) return null;
  return DEV_PRESETS[key] ?? null;
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

function presetFromHint(sp: URLSearchParams): DevTagFive | null {
  const raw = getParam(sp, 'devHint', 'dev_hint');
  if (!raw) return null;
  const keywords = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (keywords.length === 0) return null;

  let bestKey = 'default';
  let bestScore = -1;
  for (const key of Object.keys(DEV_PRESETS)) {
    const tags = DEV_PRESETS[key];
    const sc = scorePreset(tags, keywords);
    if (sc > bestScore) {
      bestScore = sc;
      bestKey = key;
    }
  }
  if (bestScore <= 0) return DEV_PRESETS.default;
  return DEV_PRESETS[bestKey] ?? DEV_PRESETS.default;
}

/**
 * Résout les 5 tags affichés pour le bloc Dev à partir des query params courants.
 */
export function resolveDevDomainTagsFromSearchParams(
  sp: URLSearchParams,
): DevTagFive {
  return (
    parseExplicitFive(sp) ??
    presetFromKey(sp) ??
    presetFromHint(sp) ??
    DEV_PRESETS.default
  );
}

export function isDevDomainId(id: string | undefined): boolean {
  return id === DEV_DOMAIN_ID;
}
