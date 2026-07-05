import { getJobCatalog } from '@/lib/job-catalog-server';
import { SHORT_PROFILE_MATCH_MAX } from '@/lib/short-offer-match';

/**
 * Markdown du guide LLM, partage entre la route publique `/api/llm-guide`
 * (Content-Type text/markdown, pour les agents) et la page dev
 * `/{lang}/dev/llm-guide` (lecture humaine, avec la nav dev).
 */
export function buildLlmGuideMarkdown(): string {
  const jobCatalog = getJobCatalog();
  const jobSlugs = jobCatalog.map((j) => `\`${j.slug}\``).join(', ');

  const markdown = `# CV Dynamique -- Guide LLM

> Document auto-genere. Point d'entree pour les agents LLM : decrit tous les
> endpoints publics et les parametres URL pour personnaliser le CV.

## Points d'entree

| Endpoint | Methode | Description |
| -------- | ------- | ----------- |
| \`/api/llm-guide\` | GET | Ce guide (Markdown). Point d'entree recommande pour tout agent LLM. |
| \`/api/profile\` | GET | Donnees structurees JSON du profil + catalogue techno complet. |
| \`/api/openapi.yaml\` | GET | Specification OpenAPI 3.1 de l'API \`/api/profile\`. |
| \`/{lang}\` | GET | CV HTML complet. FR: \`/fr\`, EN: \`/en\`. |
| \`/{lang}/short\` | GET | CV HTML court (1 page). |
| \`/\` | GET | Redirige vers \`/{lang}\` selon la locale du navigateur. |

Base URL production : \`https://www.elzinko.fr\`

---

## API Profile (\`/api/profile\`)

Endpoint JSON en lecture seule, sans authentification (CORS ouvert).
Retourne le snapshot complet du profil : identite, contact, experiences,
etudes, projets, competences, et le catalogue canonique des technologies
(\`techCatalog\` avec ids + noms + liens).

\`\`\`
GET /api/profile?lang=fr|en
\`\`\`

| Parametre | Requis | Description |
| --------- | ------ | ----------- |
| \`lang\` | non | \`fr\` (defaut) ou \`en\`. |

Toutes les sections sont toujours presentes : \`profile\`, \`about\`, \`domains\`,
\`jobs\`, \`studies\`, \`projects\`, \`hobbies\`, \`learnings\`, \`skills\`,
\`techCatalog\`.

### Specification OpenAPI

La spec formelle de cette API est disponible a \`/api/openapi.yaml\`
(OpenAPI 3.1, YAML). Elle decrit le schema complet de la reponse JSON, les
codes d'erreur et les types de chaque champ.

### Recuperer les ids du catalogue techno

Le parametre \`requirement\` (voir plus bas) accepte \`@id\` pour referencer une
techno precise. Les ids sont disponibles dans \`techCatalog.skills\` et
\`techCatalog.domains[].competencies\` de la reponse \`/api/profile\`.

> Le matching texte (mots-cles separes par des virgules) fonctionne aussi
> sans avoir a charger le catalogue. Le passage par id n'est utile que pour
> de la desambiguisation (ex. distinguer \`Vue\` de \`Vue.js\`).

---

## CV HTML -- Formats disponibles

| Format | URL | Description |
| ------ | --- | ----------- |
| CV complet | \`/{lang}\` | FR: \`/fr\`, EN: \`/en\` -- toutes les sections |
| CV court | \`/{lang}/short\` | 1 page -- profil, domaines, experience recente |

## CV HTML -- Parametres de personnalisation

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
| \`edu\` | non | \`1\` ou \`true\` → affiche la pastille de niveau de formation (« Bac+5 » FR / « Master's-level » EN). Masquee par defaut. |
| \`contract\` | non | \`cdi\` ou \`freelance\` -- adapte textes profil/domaines, masque Malt en CDI |
| \`detail\` | non | Niveau de detail des experiences : \`full\` (defaut), \`summary\` (accroche seule, sans les details), \`minimal\` (aucune description). Pilote l'ecran ET le PDF. |
| \`photo\` | non | Affiche la photo de profil (avatar a gauche du nom). \`1\` pour afficher (masquee par defaut). |
| \`age\` | non | Affiche l'age sous le role (calcule depuis la date de naissance). \`0\` pour masquer (affiche par defaut). |
| \`job\` | non | Repetable. Slug d'une mission a mettre en avant sur le CV court. **L'ordre des \`job\` = ordre d'affichage** du bloc "mises en avant" (voir liste ci-dessous) |
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
- **Reference par id** : prefixer par \`@\` un id du catalogue techno.
  Ids disponibles via \`/api/profile\` -> \`techCatalog\`.
  Exemple : \`requirement=Vue.js:@an8YW0VVTf2JuZZZo1W0pw\`

Les mots-cles texte fonctionnent aussi (matching insensible a la
ponctuation) et suffisent dans la plupart des cas.

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

### Presentation du CV (photo, age, niveau de detail)

Ces parametres controlent la mise en forme, independamment de l'offre. Ils
s'appliquent a l'ecran **et** au PDF imprime (le rendu PDF suit le choix).

- \`detail\` : densite des experiences.
  - \`full\` (defaut) : accroche + description detaillee + puces.
  - \`summary\` : accroche seule -- utile pour un CV synthetique tenant sur moins de pages.
  - \`minimal\` : titre / poste / dates / technos uniquement, sans aucune description.
- \`photo=1\` : affiche la photo de profil (masquee par defaut). A eviter pour les
  candidatures passant par un ATS (parsing), a privilegier pour un envoi direct.
- \`age=0\` : masque l'age (affiche par defaut sous le role).

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

- 1 vignette education **optionnelle** (opt-in via \`edu=1\` ou \`showEducation: true\` dans le spec JSON) : "Bac+5" (FR) / "Master's-level" (EN).
- Max **${SHORT_PROFILE_MATCH_MAX}** vignettes technologiques en mode short.
- Pas de limite en mode full (CV complet).
- En mode short, chaque vignette indique le nombre de clients (missions).
- En mode full, la liste detaillee des clients est affichee sous chaque vignette.

## Slugs de missions (parametre \`job\`)

> ${jobCatalog.length} missions disponibles. Utiliser le slug dans le parametre
> \`job\` (repetable) pour mettre en avant une mission sur le CV court.

${jobSlugs}

> Details complets de chaque mission (client, role, dates, frameworks) :
> \`/api/profile?lang=fr\` -> tableau \`jobs\`.

### Mise en avant de missions (parametre \`job\`)

Sur le **CV court** (\`/{lang}/short\`), les missions listees via \`job\` sont affichees en detail
(description, puces, frameworks) **dans l'ordre fourni** -- pas forcement chronologique. Toutes les
autres missions visibles sont regroupees sous une rubrique **"Autres experiences"** compressee
(client, role, periode).

#### Adapter la mise en avant a l'offre (instruction agent)

Comme pour l'ordre des \`requirement\`, **c'est a l'agent de choisir QUELLES missions mettre en avant
et DANS QUEL ORDRE, en fonction de l'offre a laquelle il repond.** Le CV ne reordonne rien tout seul :
il respecte strictement l'ordre des \`job\` recus.

1. Lire l'offre : intitule, missions, competences cles, secteur, seniorite.
2. Selectionner les 2 a 4 missions les plus probantes pour CETTE offre (slugs dans
   \`jobs[].slug\` de \`/api/profile\`, ou liste ci-dessus).
3. Les passer en parametres \`job\` **par pertinence decroissante** : la mission la plus convaincante
   en premier. **Cet ordre = ordre d'affichage** du bloc "mises en avant".
4. Ne rien faire pour le reste : les missions non listees basculent automatiquement sous
   "Autres experiences".

Exemples d'ordre selon le poste vise (memes slugs, ordre different) :

| Offre visee | Ordre \`job\` suggere |
| ----------- | ------------------- |
| Engineering Manager / management | \`job=matiere-web\` (direction d'agence, encadrement) en tete |
| Backend / Java | une mission backend en tete (\`job=jpb-systeme\`, \`job=sncf-reseaux-dgex-solutions\`...) |
| Freelance React / frontend | une mission front en tete (\`job=blablacar\`, \`job=smartch\`...) |

Regles complementaires :

- Identifiant accepte : le \`slug\` (\`jobs[].slug\`), le slug prefixe \`mission-...\`, ou le nom brut du client.
- \`highlightedJobs\` dans le \`spec\` suit la meme semantique d'ordre ; les \`job\` de l'URL priment.
- Sans aucun \`job\` (ni \`highlightedJobs\`), le CV court garde son comportement par defaut
  (missions recentes en chronologique).

Exemple (poste de management -> Matiere Web en tete, ordre non chronologique) :
\`\`\`
/fr/short?company=Acme&title=Engineering+Manager&requirement=Management:management,leadership&job=matiere-web&job=jpb-systeme&job=blablacar
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

### CV synthetique avec photo (envoi direct)

\`\`\`
/fr?company=Entreprise&requirement=Java:java,spring&detail=summary&photo=1
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
  "showEducation": "boolean (optionnel) -- affiche la pastille « Bac+5 / Master's-level »",
  "id": "string (optionnel)",
  "url": "string (optionnel)"
}
\`\`\`

> \`highlightedJobs\` suit la **meme semantique d'ordre** que le parametre \`job\` repete :
> l'ordre du tableau = ordre d'affichage des missions mises en avant sur le CV court, le
> reste etant regroupe sous "Autres experiences". Si des parametres \`job\` sont aussi
> presents dans l'URL, ils ont la priorite sur \`highlightedJobs\` du \`spec\`.

> Aliases snake_case acceptes dans le spec JSON : \`experience_years_override\`,
> \`highlighted_jobs\`, \`commute_minutes\`, \`show_education\`.

## Prompt rapide (generation d'URL de CV personnalise)

> Construis une URL GET vers \`/{fr|en}\` avec \`company\`, \`title\` (optionnel),
> et pour chaque competence un parametre \`requirement=Label:keyword1,keyword2\`
> (repeter \`requirement\`). Les mots-cles texte suffisent dans la plupart des
> cas (matching insensible a la ponctuation). Pour la desambiguisation, fetch
> \`/api/profile\` pour obtenir les ids et utiliser \`requirement=Label:@id\`.
> Ajoute \`contract=cdi\` pour un poste permanent.

## Recapitulatif pour agents LLM

1. **Decouverte** : commence par \`/api/llm-guide\` (ce document).
2. **Donnees structurees** : utilise \`/api/profile?lang=fr\` pour lire le profil complet en JSON (incluant le catalogue techno avec ids).
3. **Spec formelle** : consulte \`/api/openapi.yaml\` pour le schema de la reponse JSON.
4. **Personnalisation du CV** : construis une URL \`/{lang}?company=...&requirement=...\` en suivant les sections ci-dessus.
`;

  return markdown;
}
