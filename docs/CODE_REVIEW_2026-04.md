# Revue de code — avril 2026

> Cette revue est **informative**. Aucun fichier de code n'est modifié dans
> cette PR : seul ce document est ajouté. L'objectif est de proposer un plan
> d'action concret, priorisé, avant d'attaquer les refactors.

## TL;DR

| Axe | État actuel | Recommandation |
|---|---|---|
| **Print vs écran** | Chaque composant réimplante `print:text-xs`, `print:mt-…`, `print:flex`, `print:hidden` partout. Double maintenance quasi totale. | Extraire une feuille `@media print` unique + tokens de taille (`--fs-body`, `--fs-body-print`). Supprimer ~90 % des `print:*` dispersés. |
| **Compact vs full** | `CompactCvLayout` duplique la mise en page et la logique de `app/[lang]/page.tsx`. `JobDisplay`, `StudyDisplay`, `ContactDisplay`, `EducationLevel`, `Skill` ont tous un flag `compact`. | Un seul layout paramétré par `variant: 'full' | 'compact' | 'print'` — la plupart des branches `compact` peuvent devenir du CSS. |
| **Données `*.json`** | 2 fichiers FR/EN quasi identiques (2079 lignes chacun), IDs DatoCMS conservés mais inutilisés, doublons de skills/frameworks, `link: ""` partout. | Un seul fichier `cv.json` neutre + overlays `fr.json` / `en.json` ne contenant que les champs textuels. Normalisation des skills dans un dictionnaire. |
| **Design system** | Quelques classes utilitaires dans `globals.css` + tokens couleurs dans `tailwind.config.js`. Pas de composants primitifs partagés (`Section`, `Heading`, `MetaRow`). | Documenter les tokens existants, extraire 4-5 primitives, supprimer les variantes `-compact` dupliquées. |
| **Contenu jobs FR/EN** | Formulations inégales, dates tronquées, bullets parfois absents (Ecocea), répétitions (« scrum »/« Scrum Agility »), fautes ("Creation", "a méthodologie"). | Réécriture ciblée job par job (voir §6). |

---

## 1. Duplication print / écran

### Constat

Dans `JobDisplay.tsx`, `CompactCvLayout.tsx`, `EducationLevel.tsx`,
`StudyDisplay.tsx`, `ContactDisplay.tsx` on trouve systématiquement :

```tsx
className="text-base print:text-sm"
className="mt-10 print:mt-4"
className="space-y-3 print:space-y-2"
className="max-md:hidden print:flex"
```

Résultat : chaque ajustement print réclame un passage manuel dans 10+ endroits,
et on a déjà des divergences (`text-[10px]` vs `text-xs`, `print:text-[8px]`
uniquement dans `JobDisplay`).

### Proposition

1. **Tokens typographiques CSS variables** dans `globals.css` :

   ```css
   :root {
     --fs-section: 1.5rem;   /* h2 écran       */
     --fs-body:    0.875rem; /* texte écran    */
     --fs-meta:    0.75rem;
     --sp-section: 2.5rem;
   }
   @media print {
     :root {
       --fs-section: 1rem;
       --fs-body:    0.75rem;
       --fs-meta:    0.625rem;
       --sp-section: 1rem;
     }
   }
   ```

   puis classes sémantiques : `.cv-h2 { font-size: var(--fs-section); }` etc.
   Une seule source de vérité ; les composants n'écrivent plus `print:*`.

2. **Feuille `print.css` dédiée** (importée dans `layout.tsx`) pour ce qui reste
   (masquages, `@page`, couleurs forcées). Les `print:hidden` locaux peuvent
   disparaître au profit d'attributs sémantiques (`data-print="off"`).

3. **Supprimer `CompactCvLayout` en tant que mise en page séparée** : la version
   « court » devient simplement `variant="compact"` sur le layout principal,
   qui n'émet plus que des classes différentes via CSS modules ou data-attrs.
   Aujourd'hui `CompactCvLayout` (207 lignes) et `app/[lang]/page.tsx`
   réimplémentent grosso modo le même grid 1/3 – 2/3.

### Gain attendu

- ~400-500 lignes de JSX retirées ;
- ajuster le PDF = éditer un seul bloc `@media print` ;
- plus aucune divergence entre les deux versions.

---

## 2. Design system

### Existant

- `tailwind.config.js` définit bien des tokens couleurs sémantiques
  (`cv.section`, `cv.jobs`, `cv.tag-text`, `cv.body-muted`). 👍
- `globals.css` contient quelques utilitaires (`.cv-row-with-side-meta`,
  `.cv-job-description`, `.cv-education-*`).

### Ce qui manque

1. **Doublons `*-compact`** (`cv-study-title`, `cv-study-title-compact`,
   `cv-education-primary`, `cv-education-primary-compact`…) : à remplacer par
   les variables du §1.
2. **Pas de primitives React réutilisables**. Chaque section redéfinit son
   `<h2 className="border-b pb-1 text-2xl font-semibold text-cv-…">`.
   Extraire :
   - `<Section title accent="jobs|section|tag">` — rend la `h2` + `border-b` + spacing.
   - `<MetaRow left right />` — remplace les `cv-row-with-side-meta` manuels.
   - `<Pill tone="framework|skill">` (Pill existe déjà mais n'est pas utilisé partout).
   - `<DateRange start end present />` — centralise `formatDates` + fallback "Présent".
3. **Typographie non documentée**. Un fichier `docs/DESIGN_SYSTEM.md` listerait
   les tokens, les 4 tailles (`section/title/body/meta`), les couleurs par
   rôle (`profil`, `jobs`, `skills`, `muted`) et les primitives.
4. **Iconographie SVG inline** : les chemins des icônes (menu, grid, …) sont
   dupliqués dans `HeaderToolbar.tsx`. Extraire dans `components/icons/`
   ou utiliser `lucide-react` (déjà léger en tree-shaking).

---

## 3. Données : `data/cv/*.json`

### Problèmes observés

1. **Deux langues = deux fichiers quasi miroirs** (2079 lignes chacun). Tous
   les IDs, tableaux de frameworks, dates, liens sont **strictement
   identiques** ; seules les chaînes textuelles diffèrent (titres, rôles,
   descriptions, bullets).
2. **IDs DatoCMS conservés mais jamais utilisés** (`"id": "82627329"` etc.).
   Vérifié rapidement :
   - `bullets[].id`, `skills[].id`, `frameworks[].id`, `domains[].id` servent
     uniquement de `key` React ; on peut utiliser l'index ou le `name`
     slugifié.
   - Seul `slugifyClient(job.client)` est utilisé comme ancre DOM.
3. **`link: ""` omniprésent** (~70 % des frameworks). Champ optionnel,
   à rendre optionnel dans le JSON (`link?: string`) et supprimer les vides.
4. **Redondance skills/frameworks**. `Typescript`, `React`, `Spring Boot`,
   `Kubernetes`, `Docker`, `AWS`… sont listés textuellement dans chaque job.
   Un `id` différent par occurrence (`82456019` vs `82456019`) mais aucune
   garantie de cohérence (casse variable : `typescript` / `Typescript`,
   `Spring Boot` / `spring`, `Java 7/8/11/17`).
5. **Incohérences textuelles** :
   - `fr.json` ligne 391 : « dans le cadre de **a** méthodologie SAFe ».
   - `fr.json` ligne 304 : « **Creation** d'un nouveau service java ».
   - `fr.json` ligne 300 : double espace avant « pour une application ».
   - `en.json` ligne 1208 : description **en français** sur Mediametrie.
6. **Clés « titres » dispersées** : `skillsTitle.title`, `jobsTitle.title`,
   `projectsTitle.title`… héritage direct du schéma DatoCMS. Un seul objet
   `titles` serait plus clair.

### Refonte proposée

Structure cible (`data/cv/`) :

```
data/cv/
├── cv.json              # structure neutre, pas de texte localisable
├── locales/
│   ├── fr.json          # uniquement les strings
│   └── en.json
└── tech-catalog.json    # dictionnaire normalisé des techs
```

**`tech-catalog.json`** (un seul enregistrement par techno, ID stable,
link canonique) :

```json
{
  "typescript":  { "name": "TypeScript",  "link": "https://www.typescriptlang.org/" },
  "react":       { "name": "React",       "link": "https://react.dev/" },
  "spring-boot": { "name": "Spring Boot", "link": "https://spring.io/projects/spring-boot" },
  "kubernetes":  { "name": "Kubernetes",  "link": "https://kubernetes.io/" }
}
```

**`cv.json`** (neutre) :

```json
{
  "header": { "name": "Thomas Couderc" },
  "contact": { "phone": "+33661412725", "email": "thomas.couderc@gmail.com" },
  "jobs": [
    {
      "slug": "jpb-systeme",
      "client": "JPB Système",
      "location": "Montereau-sur-le-Jard",
      "startDate": "2024-06-10",
      "endDate":   "2025-08-31",
      "tech": ["vue", "typescript", "python", "aws", "aws-lambda", "iot-hub"]
    }
  ]
}
```

**`locales/fr.json`** :

```json
{
  "header":   { "role": "Développeur fullstack" },
  "jobs": {
    "jpb-systeme": {
      "role": "Développeur IoT",
      "description": "Développements fullstack IoT sur le produit Keyvibe (startup Keyprod).",
      "bullets": [
        "Conception et mise en œuvre d'un mécanisme de détection multi-seuils sur Raspberry Pi 3/4 (Python, Node.js).",
        "Intégration Ethernet + MQTT vers AWS IoT Core et Lambda : chaîne temps-réel fiable et scalable."
      ]
    }
  }
}
```

### Gains

| Avant | Après |
|---|---|
| 2 × 2079 lignes | ~1 × 900 lignes structure + ~2 × 400 lignes texte |
| Drift FR/EN possible | Impossible par construction (clés absentes = erreur de build) |
| IDs DatoCMS partout | `slug` stable lisible |
| `link: ""` x 150 | Aucun |

Ce schéma reste **compatible avec l'export DatoCMS** : le script
`export:datocms` ferait le split automatiquement (un passage par locale +
fusion des parts neutres).

### Si on garde DatoCMS comme source de vérité

Option plus légère : garder un seul fichier mais introduire une **normalisation
post-export** dans `scripts/export-datocms.ts` qui :
1. Fusionne les parties neutres (dates, slugs, technos) dans un objet racine ;
2. Ne conserve que les champs textuels dans les branches `fr`/`en` ;
3. Nettoie les `link: ""` et dédoublonne les technos par slug.

---

## 4. Architecture code

### Petits points faciles

- `components/framework.tsx.backup` — à supprimer.
- `app/[lang]/page.tsx` : tous les `{/* @ts-expect-error Server Component */}`
  ne sont plus nécessaires depuis Next 14 (les composants async sont typés).
- `components/CompactCvLayout.tsx:199` : concaténation FR/EN en dur
  (`en développement fullstack et DevOps`) dans le texte anglais → bug i18n.
- `components/JobDisplay.tsx:85` : `presentLabel = 'Présent'` par défaut côté
  composant → fuite de langue. À passer systématiquement depuis la page.
- `components/CvModeToggle.tsx` et `ModeControl` dans `HeaderToolbar.tsx`
  dupliquent la logique « switch full/compact ». Un seul composant suffit.
- `lib/cv-data.ts` : `CvSnapshot = Record<string, unknown>` puis cast partout.
  Il existe `CV_AGGREGATE_QUERY` — on peut générer le type avec
  `graphql-codegen` (ou au minimum écrire une interface à la main).
- Les `data: any` dans `generateMetadata` (`app/[lang]/page.tsx:39`,
  `short/page.tsx`, etc.) à typer.
- `components/HeaderToolbar.tsx:186` : `aria-label` **en français** quelle
  que soit la locale.

### Points de refactor plus structurants

1. **Adapter pattern pour DatoCMS vs local** — `lib/cv-data.ts` mélange
   I/O et résolution de mode. Découper en `sources/local.ts`,
   `sources/datocms.ts`, `index.ts` qui choisit.
2. **`JobFrameworkPills` (284 lignes)** — beaucoup de JS pour un problème de
   « masquer après 2 lignes ». À tester : `line-clamp-2` + un bouton
   « voir plus » purement CSS (`details/summary`) ; ou, si JS nécessaire,
   sortir la mesure dans un hook `useLineClampOverflow`.
3. **`lib/tech-match-core.ts` + `MatchOfferClient.tsx`** : la comparaison offre
   ↔ CV peut partager la normalisation de technos avec le `tech-catalog.json`
   du §3 (évite les heuristiques de casse/alias).

---

## 5. Contenu jobs — proposition de réécriture

> Objectif : phrases denses, format homogène, un verbe d'action par bullet,
> max 3 bullets. Les propositions ci-dessous sont à valider avec toi avant
> d'être appliquées dans les JSON.

### JPB Système (2024-06 → 2025-08) — Développeur IoT

- **FR description** : « Développements fullstack IoT sur le produit Keyvibe
  (startup Keyprod) : acquisition temps réel et remontée cloud. »
- **EN description** : « Fullstack IoT development on the Keyvibe product
  (Keyprod startup): real-time acquisition and cloud telemetry. »
- Bullets :
  1. FR « Détection multi-seuils de production sur Raspberry Pi 3/4
     (Python, Node.js) — analyse temps réel des états machine. » /
     EN « Multi-threshold production detection on Raspberry Pi 3/4
     (Python, Node.js) — real-time machine state analysis. »
  2. FR « Chaîne Ethernet → MQTT → AWS IoT Core → Lambda :
     faible latence, montée en charge, DHCPD configuré. » /
     EN idem.

### BlablaCar (2023-10 → 2023-12) — Full Stack

- Description actuelle OK ; corriger « Creation » → « Création » et le
  double espace.
- Bullets resserrés :
  - « Nouveau microservice de remboursement (Spring Boot). »
  - « Onglet Zendesk de remboursement en React intégré au back-office. »

### Smartch (2023-05 → 2023-09) — Backend

- `bullets: ["cicd"]` est trop pauvre. Proposer :
  - « API GraphQL Kotlin/Ktor avec persistance Exposed (Postgres). »
  - « Architecture hexagonale + pipelines CI/CD. »
- EN description « Sass platform » → « SaaS e-learning platform ».

### SNCF Réseaux / OSRD (2022-05 → 2023-02) — System Architect

- Reformuler la description FR (fauté : « de a méthodologie ») :
  « Stratégie de croissance et de qualité sur le projet open source OSRD
  (SAFe). Pilotage du backlog technique transverse. »
- Bullets « SAFe / Opensource / Railway » à enrichir :
  1. « Accompagnement SAFe de 4 équipes sur un produit open source ferroviaire. »
  2. « Backlog technique transverse : observabilité, build, releases. »
  3. « Contributions Rust / Python sur le cœur du simulateur. »

### LeBonCoin (2021-08 → 2022-05) — Backend

- Bullets actuels trop laconiques. Proposition :
  1. « Refonte du moteur de paiement : architecture hexagonale en monorepo Go. »
  2. « Event-driven via Kafka ; observabilité Datadog/ELK. »
  3. « Conception d'un wallet interne (POC + spikes). »

### Celsius Energy (2020-12 → 2021-08) — Full Stack

- Description OK.
- Bullets : « contributed in designing » → « Designed » ; normaliser la voix
  active et supprimer « used Scrum team specific implementation » (boilerplate).

### RelevanC (2020-08 → 2020-12) — Full Stack

- Description OK ; bullets trop secs.
- Proposer : « Bootstrap Java 11 / Spring Boot + JHipster », « Architecture
  hexagonale », « Déploiement GCP ».

### Ecocea (2019-10 → 2020-05) — DevOps

- **Bullets vides** aujourd'hui (`"bullets": []`). À combler :
  - « Modernisation de la software factory (Jenkins → GitLab CI). »
  - « Industrialisation du build WebSphere Commerce (Gradle, Docker). »
  - « Accompagnement équipes React sur la partie front. »

### Edelia (2016-04 → 2019-06) — Full Stack

- 3 bullets déjà bons ; juste uniformiser la typographie (« Fullstack »
  vs « Full stack » — choisir).
- Framework list contient **62 entrées** : à réduire aux 10-15 les plus
  parlantes (sinon c'est du bruit pour un CV).

### JCDecaux / Lotsys / Mediametrie / Thales

- Missions anciennes (2012-2016) : passer à **1 bullet max** chacune, ou
  les regrouper dans une section « Expériences antérieures » (le
  `CompactCvLayout` le fait déjà via « Other clients : … »). Recommandé pour
  le CV long aussi.
- **Bug** : `en.json:1208` → description en français pour Mediametrie.
  Traduire : *"Design and development of APIs for an audience measurement
  system."*
- Framework list Edelia / Mediametrie : pareil, couper.

---

## 6. Plan d'action proposé (priorisé)

| # | Effort | Impact | Action |
|---|---|---|---|
| 1 | S | 🟢 | Supprimer `components/framework.tsx.backup`, typer `CvSnapshot` proprement, retirer `@ts-expect-error` obsolètes. |
| 2 | S | 🟢 | Corriger les coquilles FR/EN et bugs i18n (Mediametrie EN, `aria-label` toolbar, texte français dans layout EN). |
| 3 | M | 🟢🟢 | Introduire `docs/DESIGN_SYSTEM.md` + tokens CSS variables + `@media print` centralisée. |
| 4 | M | 🟢🟢 | Remplacer les variantes `*-compact` par des tokens ; supprimer les `print:*` dispersés. |
| 5 | M | 🟢🟢 | Extraire primitives `<Section>`, `<MetaRow>`, `<DateRange>`. Réduire `CompactCvLayout` à un `<CvLayout variant="compact" />`. |
| 6 | L | 🟢🟢 | Refonte données : `cv.json` + `locales/{fr,en}.json` + `tech-catalog.json`. Adapter `export:datocms`. |
| 7 | M | 🟢 | Réécriture contenus jobs (§5). Idéalement après #6 pour limiter les diffs. |
| 8 | S | 🟡 | Simplifier `JobFrameworkPills` (CSS clamp + `details`). |

**Ordre suggéré** : 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Les étapes 3-5 peuvent
chacune faire l'objet d'une PR dédiée (diffs petits et testables).

---

## Annexe — méthode

Revue effectuée à partir de l'état du worktree `busy-mahavira` au
2026-04-07. Aucun code n'a été modifié. Les chiffres de lignes
proviennent de `wc -l`. Les bugs signalés ont été observés directement
dans `data/cv/{fr,en}.json`, `components/*.tsx`, `app/[lang]/page.tsx`,
`components/HeaderToolbar.tsx`, `components/CompactCvLayout.tsx`,
`styles/globals.css`, `tailwind.config.js`.
