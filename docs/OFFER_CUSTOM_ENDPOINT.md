# CV personnalisé par offre (URLs dynamiques)

La racine `/{lang}` (page CV complète) accepte des **query params** qui activent le bloc **« adéquation avec le poste »**. Tout passe par `/{lang}?...` — il n'y a pas d'offres statiques.

---

## 1. Endpoint simple (paramètres GET lisibles) — recommandé

**À utiliser pour un lien lisible, partageable, facile à construire à la main ou par un LLM.**

```http
GET /{lang}?company=...&title=...&requirement=Libellé:mot1,mot2&requirement=...
```

| Paramètre     | Obligatoire            | Description                                       |
| ------------- | ---------------------- | ------------------------------------------------- |
| `company`     | **oui**                | Nom de l’entreprise                               |
| `title`       | non                    | Intitulé du poste (FR et EN si seul titre fourni) |
| `title_fr`    | non                    | Titre affiché côté français                       |
| `title_en`    | non                    | Titre affiché côté anglais                        |
| `requirement` | **oui** (au moins une) | Répéter le paramètre pour chaque ligne d’exigence |
| `req`         | (alias)                | Même format que `requirement`                     |
| `reqY`        | non                    | Répétable : années d’exp. affichées pour la **même ligne** que le *i*-ème `requirement` / `req` (remplace le calcul auto) |
| `contract`    | non                    | `cdi` ou `freelance` — masque le lien Malt en CDI |
| `id`          | non                    | Identifiant interne (sinon dérivé de `company`)   |
| `spec`        | non                    | Si présent et décodable (cf. §2), remplace les autres paramètres d’offre |

### Format d’une exigence (`requirement` / `req`)

Une valeur = **`Libellé:motcle1,motcle2,motcle3`**

- Option **parallèle** : pour la *i*-ème valeur de `requirement` / `req`, un *i*-ème `reqY` (nombre, virgule ou point décimal) fixe les **années affichées** pour cette ligne (prioritaire sur la somme calculée à partir des missions du CV).
- Un **deux-points** `:` sépare le libellé (affiché dans le tableau) de la liste de mots-clés.
- Les mots-clés sont séparés par des **virgules** (sans espace obligatoire).
- Les espaces dans le libellé sont possibles via encodage URL (`+` ou `%20`).
- **Référence par id** (recommandé pour les LLM) : un segment égal à un **id** présent dans le CV (issu de `data/cv/bundle.json`) (`bundle.json` : skills ou frameworks de mission), ou préfixé par **`@`**, est résolu vers les `matchTokens` dérivés du catalogue et utilisé aussi pour un **match direct** sur `frameworks[].id` des missions. Exemple : `requirement=Vue.js:@an8YW0VVTf2JuZZZo1W0pw` (encoder `@` en `%40` dans l’URL si besoin).

### Exemples d’URL

```text
/fr?company=Safran&title=Chef+de+projet+Java&requirement=Java+EE:java,jee,jsf&requirement=SQL:postgresql,sql

/en?company=Acme&title=Engineer&requirement=Java:java,spring&requirement=Cloud:aws,docker
```

Avec **`NEXT_PUBLIC_BASE_PATH`** : préfixer tout le chemin
`{basePath}/fr?...`

---

## 2. Endpoint compact (`spec` base64)

Pour les très nombreuses exigences ou génération JSON automatique, on passe le même payload via `spec` sur la même route :

```http
GET /{lang}?spec={base64url}
```

- **`spec`** : JSON UTF-8 de l’offre, encodé en **base64url**.

### Schéma JSON (`spec` décodé)

| Champ          | Type                        | Obligatoire |
| -------------- | --------------------------- | ----------- |
| `company`      | string                      | oui         |
| `title`        | string ou `{ "fr", "en" }`  | oui         |
| `requirements` | `[{ "label", "keywords", "experienceYearsOverride?" }]` | oui         |
| `contract`     | `"cdi"` ou `"freelance"`    | non         |
| `id`, `url`    | string                      | non         |

### Encodage

```bash
npm run encode-offer-spec -- path/to/offer.json
```

```ts
import { encodeOfferSpecParam } from '@/lib/dynamic-offer-spec';
const url = `https://example.com/fr?spec=${encodeURIComponent(
  encodeOfferSpecParam(offer),
)}`;
```

---

## Comportement commun

- Paramètres manquants ou invalides : message d’aide ou d’erreur sur la page.
- Offre valide : même mise en page que la page CV racine (profil, domaines, matching, colonnes CV).
- Sans paramètre d’offre : `/{lang}` rend simplement le CV neutre.

## Limites

Plafonds sur longueurs, nombre d’exigences et de mots-clés : `lib/dynamic-offer-spec.ts`, `lib/query-offer-params.ts`.

## Hébergement statique (ex. GitHub Pages)

Pas de `POST` : tout passe par des **GET** avec query string. Les URLs longues peuvent être limitées par le navigateur (~2k caractères) ; au-delà, préférer `spec` base64 ou réduire le nombre d’exigences.

## Catalogue pour agents / LLM (source unique `bundle.json`)

Il n’y a **plus** de fichier public `match-catalog.json`. Le catalogue est la **liste des technos** obtenue en parcourant `data/cv/bundle.json` :

- `fr.allSkillsModels` et `en.allSkillsModels` (couples `id` / `name`) ;
- pour chaque locale, chaque `allJobsModels[].frameworks[]` (même chose).

Les entrées sont fusionnées par `id` ; le nom canonique et les `matchTokens` suivent `lib/match-catalog-schema.ts` (`deriveMatchTokensFromName`).

**Workflow suggéré** pour un LLM (accès au dépôt ou au fichier bundle) :

1. Lire `data/cv/bundle.json` et constuire la liste des `id` (et noms) comme ci-dessus, ou réutiliser la logique exportée par `buildMatchCatalogFromBundle` dans `lib/match-catalog-from-bundle.ts`.
2. Choisir les `id` ou mots-clés texte pertinents pour chaque exigence du poste.
3. Construire soit des URLs `/{lang}?...&requirement=Libellé:@id`, soit un JSON d’offre complet + `npm run encode-offer-spec` → `/{lang}?spec=…`.

Le matching côté CV utilise en plus une **correspondance assouplie** sur la ponctuation / espaces (`nodejs` vs `node.js` dans les textes), et un match **par id** sur les frameworks des missions.

Sans accès au dépôt, tu peux encore t’appuyer sur des **mots-clés texte** après le `:` dans chaque `requirement`, sans id catalogue.

## Fichiers utiles

| Fichier                             | Rôle                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| `data/cv/bundle.json`               | Source CV `fr` / `en` **et** base du catalogue de match   |
| `lib/match-catalog-from-bundle.ts`  | Agrège skills + frameworks (fr+en) → `MatchCatalog`       |
| `lib/match-catalog-server.ts`       | Mémoïse le catalogue dérivé du bundle (server-only)       |
| `lib/match-catalog.ts`              | Expansion des mots-clés + enrichissement des offres       |
| `lib/match-catalog-schema.ts`       | Types + `deriveMatchTokensFromName`                       |
| `lib/tech-match-core.ts`            | Match par id framework, texte strict puis assoupli        |
| `lib/query-offer-params.ts`         | Parse `company`, `title*`, `requirement` / `req`, `spec`  |
| `lib/dynamic-offer-spec.ts`         | JSON ↔ base64url + enrichissement catalogue               |
| `app/[lang]/page.tsx`               | Page CV unifiée (CV neutre + variantes offre via query)   |
| `lib/offer-to-match-url.ts`         | Offre bundle → query `/{lang}?…`                          |
| `components/ShortHeaderJobFitPills.tsx` | Pastilles adéquation sous le rôle (même logique que `useShortOfferMatchData`) |
| `lib/match-display-types.ts`          | Types `MatchEntry` / `MatchDisplayData` pour le calcul de match   |

### Prompt court pour un LLM

> Lis `data/cv/bundle.json` (skills + frameworks des missions, fr et en) pour obtenir les `id`. Construis une URL GET vers `https://<site>/{fr|en}` avec `company`, `title` (optionnel), et pour chaque compétence un paramètre `requirement=Libellé:@id` (répéter `requirement`). Sinon utilise des mots-clés texte séparés par des virgules après le `:` ; compléter avec `spec` base64 si l’URL devient trop longue.
