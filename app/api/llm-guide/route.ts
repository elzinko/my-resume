import { NextResponse } from 'next/server';
import { getMatchCatalog } from '@/lib/match-catalog-server';
import { getJobCatalog } from '@/lib/job-catalog-server';
import { SHORT_PROFILE_MATCH_MAX } from '@/lib/short-offer-match';

export const dynamic = 'force-dynamic';

/**
 * GET /api/llm-guide
 *
 * Public endpoint serving a self-contained Markdown guide for LLM agents.
 * Includes the dynamically-generated tech catalog from bundle.json,
 * customization instructions, constraints, and URL templates.
 */
export async function GET() {
  const catalog = getMatchCatalog();
  const catalogRows = catalog.entries
    .map((e) => `| ${e.id} | ${e.name} | ${e.matchTokens.join(', ')} |`)
    .join('\n');

  const jobCatalog = getJobCatalog();
  const jobRows = jobCatalog
    .map(
      (j) =>
        `| ${j.slug} | ${j.client} | ${j.role} | ${j.startDate} → ${j.endDate ?? 'present'} | ${j.frameworks.join(', ')} |`,
    )
    .join('\n');

  const markdown = `# CV Dynamique -- Guide LLM

> Document auto-genere. Contient toutes les informations necessaires pour
> personnaliser le CV via des parametres URL, sans autre source.

## Formats disponibles

| Format | URL | Description |
| ------ | --- | ----------- |
| CV complet | \`/{lang}\` | FR: \`/fr\`, EN: \`/en\` -- toutes les sections |
| CV court | \`/{lang}/short\` | 1 page -- profil, domaines, experience recente |

## Parametres de personnalisation

\`\`\`
GET /{lang}?company=<nom>&requirement=<Label:kw1,kw2>[&...]
\`\`\`

| Parametre | Requis | Description |
| --------- | ------ | ----------- |
| \`company\` | **oui** | Nom de l'entreprise |
| \`title\` | non | Intitule du poste (FR et EN si seul titre fourni) |
| \`title_fr\` | non | Titre affiche cote francais |
| \`title_en\` | non | Titre affiche cote anglais |
| \`requirement\` | **oui** (1+) | Repetable. Format : \`Label:keyword1,keyword2\` |
| \`req\` | alias | Alias court pour \`requirement\` |
| \`reqY\` | non | Annees d'experience affichees pour le i-eme requirement (remplace le calcul auto) |
| \`contract\` | non | \`cdi\` ou \`freelance\` -- adapte textes profil/domaines, masque Malt en CDI |
| \`job\` | non | Repetable. Slug d'une mission a mettre en avant (voir catalogue ci-dessous) |
| \`spec\` | non | JSON base64url (remplace les autres params d'offre si present) |
| \`id\` | non | Identifiant interne optionnel |

### Format d'une exigence (\`requirement\`)

Chaque valeur suit le pattern \`Label:keyword1,keyword2\` :

- **Label** (avant \`:\`) : affiche dans le tableau d'adequation.
- **Keywords** (apres \`:\`, separes par des virgules) : matches contre le catalogue du CV.
- **Reference par id** : prefixer par \`@\` un id du catalogue ci-dessous.
  Exemple : \`requirement=Vue.js:@an8YW0VVTf2JuZZZo1W0pw\`

Les mots-cles texte fonctionnent aussi (matching insensible a la ponctuation).

### Type de contrat

- \`contract=cdi\` : textes profil et domaines adaptes pour un poste permanent, lien Malt masque.
- \`contract=freelance\` : textes freelance (comportement par defaut).

## Vignettes adequation poste

- 1 vignette education (toujours affichee) : "Bac+5" (FR) / "Master's-level" (EN).
- Max **${SHORT_PROFILE_MATCH_MAX}** vignettes technologiques en mode short.
- Pas de limite en mode full (CV complet).

## Catalogue de technologies disponibles

> ${catalog.entries.length} technologies. Genere depuis \`data/cv/bundle.json\`.

| ID | Nom | Tokens de matching |
| -- | --- | ------------------ |
${catalogRows}

## Catalogue des missions

> ${jobCatalog.length} missions. Genere depuis \`data/cv/bundle.json\`.
> Utiliser le slug dans le parametre \`job\` pour mettre en avant une mission sur le CV court.

| Slug | Client | Role | Periode | Frameworks |
| ---- | ------ | ---- | ------- | ---------- |
${jobRows}

### Mise en avant de missions (parametre \`job\`)

Le parametre \`job\` est repetable. Il accepte le slug de la mission (colonne "Slug" ci-dessus).
Sur le CV court, les missions mises en avant sont affichees avec tous les details (description,
puces, frameworks). Les missions intermediaires non selectionnees sont compressees en une ligne
(client + dates uniquement), preservant la continuite de la timeline.

Exemple :
\`\`\`
/fr/short?company=Thales&requirement=Java:java&job=jpb-systeme&job=celsius-energy&job=thales-communications
\`\`\`

## Exemples d'URLs

### CV adapte poste CDI Java/Cloud

\`\`\`
/fr?company=Entreprise&title=Developpeur+Java+Senior&requirement=Java:java,spring&requirement=Cloud:aws,docker&contract=cdi
\`\`\`

### CV adapte mission freelance React

\`\`\`
/fr?company=Client&title=Dev+Frontend&requirement=React:react,nextjs&requirement=TypeScript:typescript&contract=freelance
\`\`\`

### CV court avec parametres

\`\`\`
/fr/short?company=Entreprise&requirement=Java:java&requirement=SQL:sql&contract=cdi
\`\`\`

### Reference par id catalogue

\`\`\`
/fr?company=Padoa&title=Dev&requirement=Vue.js:%40an8YW0VVTf2JuZZZo1W0pw
\`\`\`

## Format compact base64

Pour les offres complexes, encoder le JSON en base64url et passer via \`spec\` :

\`\`\`
GET /{lang}?spec=<base64url>
\`\`\`

Schema JSON decode :

\`\`\`json
{
  "company": "string (requis)",
  "title": "string | { fr: string, en: string }",
  "requirements": [{ "label": "string", "keywords": ["string"], "experienceYearsOverride?": "number" }],
  "contract": "cdi | freelance (optionnel)",
  "highlightedJobs": ["slug1", "slug2"] ,
  "id": "string (optionnel)",
  "url": "string (optionnel)"
}
\`\`\`

## Prompt rapide

> Lis le catalogue ci-dessus pour obtenir les ids. Construis une URL GET
> vers \`/{fr|en}\` avec \`company\`, \`title\` (optionnel), et pour chaque
> competence un parametre \`requirement=Label:@id\` (repeter \`requirement\`).
> Sinon utilise des mots-cles texte separes par des virgules apres le \`:\`.
> Ajoute \`contract=cdi\` pour un poste permanent.
`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
