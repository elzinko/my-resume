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
        `| ${j.slug} | ${j.client} | ${j.role} | ${j.startDate} → ${
          j.endDate ?? 'present'
        } | ${j.frameworks.join(', ')} |`,
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
| \`subtitle\` | non | Sous-titre / role affiche sous le nom (FR et EN si seul subtitle fourni) |
| \`subtitle_fr\` | non | Sous-titre affiche cote francais (ex. "Chef de Projet Java Full Stack") |
| \`subtitle_en\` | non | Sous-titre affiche cote anglais (ex. "Java Full Stack Project Manager") |
| \`requirement\` | **oui** (1+) | Repetable. Format : \`Label:keyword1,keyword2\` |
| \`req\` | alias | Alias court pour \`requirement\` |
| \`reqY\` | non | Annees d'experience affichees pour le i-eme requirement (remplace le calcul auto) |
| \`contract\` | non | \`cdi\` ou \`freelance\` -- adapte textes profil/domaines, masque Malt en CDI |
| \`job\` | non | Repetable. Slug d'une mission a mettre en avant (voir catalogue ci-dessous) |
| \`workAddress\` | non | Adresse complete du lieu de travail. Active l'itineraire Google Maps gare -> bureau sur le pictogramme localisation. |
| \`clientAddress\` | alias | Alias court de \`workAddress\`. |
| \`commuteLabel\` | non | Libelle court affiche pres du lieu (ex. "~45 min"). Ignore sans \`workAddress\`. |
| \`commuteMinutes\` | non | Minutes de trajet (numerique). Si fourni sans \`commuteLabel\`, genere "~N min". |
| \`spec\` | non | JSON base64url (remplace les autres params d'offre si present) |
| \`id\` | non | Identifiant interne optionnel |

### Format d'une exigence (\`requirement\`)

Chaque valeur suit le pattern \`Label:keyword1,keyword2\` :

- **Label** (avant \`:\`) : affiche dans le tableau d'adequation.
- **Keywords** (apres \`:\`, separes par des virgules) : matches contre le catalogue du CV.
- **Reference par id** : prefixer par \`@\` un id du catalogue ci-dessous.
  Exemple : \`requirement=Vue.js:@an8YW0VVTf2JuZZZo1W0pw\`

Les mots-cles texte fonctionnent aussi (matching insensible a la ponctuation).

### Calcul automatique des annees d'experience

Pour chaque requirement, le systeme cherche les missions dont les frameworks,
role, description ou puces contiennent un des keywords (matching insensible
a la casse et a la ponctuation : "vuejs" matche "Vue.js").

Les annees affichees = somme des durees des missions matchees (deduplication
par client). Pour maximiser la precision, inclure tous les mots-cles
pertinents (ex : pour Frontend, inclure react,angular,vuejs,ionic,gwt,jsf,
javascript,typescript plutot que juste react).

Si le calcul auto ne convient pas, utiliser \`reqY\` pour forcer une valeur.

### Type de contrat

- \`contract=cdi\` : textes profil et domaines adaptes pour un poste permanent, lien Malt masque.
- \`contract=freelance\` : textes freelance (comportement par defaut).

### Ordre des requirements

**L'ordre des parametres \`requirement\` dans l'URL determine l'ordre d'affichage
dans la section "Adequation poste".** Le LLM doit ordonner les requirements
par pertinence vis-a-vis de l'offre : placer les competences les plus
importantes ou les plus demandees en premier. En mode short (CV court),
seules les **${SHORT_PROFILE_MATCH_MAX} premieres** sont affichees.

Conseil : placer en premier les competences coeur de l'offre (ex. Java pour
un poste Java), puis les competences secondaires (SQL, Docker, etc.).

### Sous-titre du CV

Par defaut, le sous-titre affiche "Developpeur fullstack Senior" (FR) /
"Senior Fullstack Developer" (EN). Pour l'adapter a l'offre, utiliser
\`subtitle_fr\` et/ou \`subtitle_en\` (ou \`subtitle\` pour les deux langues).

Exemple : \`subtitle_fr=Chef+de+Projet+Java+Full+Stack&subtitle_en=Java+Full+Stack+Project+Manager\`

## Vignettes adequation poste

- 1 vignette education (toujours affichee) : "Bac+5" (FR) / "Master's-level" (EN).
- Max **${SHORT_PROFILE_MATCH_MAX}** vignettes technologiques en mode short.
- Pas de limite en mode full (CV complet).
- En mode short, chaque vignette indique le nombre de clients (missions).
- En mode full, la liste detaillee des clients est affichee sous chaque vignette.

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
/fr?company=Entreprise&title=Developpeur+Java+Senior&subtitle_fr=Developpeur+Java+Senior&requirement=Java:java,spring&requirement=Cloud:aws,docker&contract=cdi
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
  "title": "string | { fr: string, en: string } (requis)",
  "requirements": [{ "label": "string", "keywords": ["string"], "experienceYearsOverride?": "number" }],
  "contract": "cdi | freelance (optionnel)",
  "workAddress": "string (optionnel) -- itineraire Google Maps gare -> bureau",
  "commuteLabel": "string (optionnel) -- libelle court affiche pres du lieu",
  "commuteMinutes": "number (optionnel) -- si pas de commuteLabel, genere '~N min'",
  "highlightedJobs": ["slug1", "slug2"],
  "id": "string (optionnel)",
  "url": "string (optionnel)"
}
\`\`\`

> Aliases snake_case acceptes dans le spec JSON : \`experience_years_override\`,
> \`highlighted_jobs\`, \`commute_minutes\`.

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
