# CV personnalisé par offre (URLs dynamiques)

Pages qui affichent le bloc **« adéquation avec le poste »** sans ajouter un fichier dans `data/offers/`.

Les offres **prédéfinies** restent inchangées :

- `/{lang}/offer/safran-java-fullstack`
- `/{lang}/offer/safran-ia-factory`
- … (voir `data/offers/`)

---

## 1. Endpoint simple (paramètres GET lisibles) — recommandé

**À utiliser pour un lien lisible, partageable, facile à construire à la main ou par un LLM.**

```http
GET /{lang}/offer/match?company=...&title=...&requirement=Libellé:mot1,mot2&requirement=...
```

| Paramètre     | Obligatoire            | Description                                       |
| ------------- | ---------------------- | ------------------------------------------------- |
| `company`     | **oui**                | Nom de l’entreprise                               |
| `title`       | non                    | Intitulé du poste (FR et EN si seul titre fourni) |
| `title_fr`    | non                    | Titre affiché côté français                       |
| `title_en`    | non                    | Titre affiché côté anglais                        |
| `requirement` | **oui** (au moins une) | Répéter le paramètre pour chaque ligne d’exigence |
| `req`         | (alias)                | Même format que `requirement`                     |
| `id`          | non                    | Identifiant interne (sinon dérivé de `company`)   |

### Format d’une exigence (`requirement` / `req`)

Une valeur = **`Libellé:motcle1,motcle2,motcle3`**

- Un **deux-points** `:` sépare le libellé (affiché dans le tableau) de la liste de mots-clés.
- Les mots-clés sont séparés par des **virgules** (sans espace obligatoire).
- Les espaces dans le libellé sont possibles via encodage URL (`+` ou `%20`).

### Exemples d’URL

```text
/fr/offer/match?company=Safran&title=Chef+de+projet+Java&requirement=Java+EE:java,jee,jsf&requirement=SQL:postgresql,sql

/en/offer/match?company=Acme&title=Engineer&requirement=Java:java,spring&requirement=Cloud:aws,docker
```

Avec **`NEXT_PUBLIC_BASE_PATH`** : préfixer tout le chemin  
`{basePath}/fr/offer/match?...`

### Option avancée sur la même route

Si `spec=` est présent **et** décodable comme JSON base64url valide, il **remplace** les autres paramètres (même schéma que la section 2). Utile pour des offres très longues.

---

## 2. Endpoint compact (`spec` base64) — `/offer/custom`

Pour les très nombreuses exigences ou génération JSON automatique :

```http
GET /{lang}/offer/custom?spec={base64url}
```

- **`spec`** : JSON UTF-8 de l’offre, encodé en **base64url**.

Même rendu que `/offer/match` une fois l’offre résolue.

### Schéma JSON (`spec` décodé)

| Champ          | Type                        | Obligatoire |
| -------------- | --------------------------- | ----------- |
| `company`      | string                      | oui         |
| `title`        | string ou `{ "fr", "en" }`  | oui         |
| `requirements` | `[{ "label", "keywords" }]` | oui         |
| `id`, `url`    | string                      | non         |

### Encodage

```bash
npm run encode-offer-spec -- path/to/offer.json
```

```ts
import { encodeOfferSpecParam } from '@/lib/dynamic-offer-spec';
const url = `https://example.com/fr/offer/custom?spec=${encodeURIComponent(
  encodeOfferSpecParam(offer),
)}`;
```

---

## Comportement commun

- Paramètres manquants ou invalides : message d’aide ou d’erreur sur la page.
- Offre valide : même mise en page que `/offer/{id}` (profil, domaines, matching, colonnes CV).

## Limites

Plafonds sur longueurs, nombre d’exigences et de mots-clés : `lib/dynamic-offer-spec.ts`, `lib/query-offer-params.ts`.

## Hébergement statique (ex. GitHub Pages)

Pas de `POST` : tout passe par des **GET** avec query string. Les URLs longues peuvent être limitées par le navigateur (~2k caractères) ; au-delà, préférer `spec` sur `/offer/custom` ou réduire le nombre d’exigences.

## Fichiers utiles

| Fichier                            | Rôle                                                     |
| ---------------------------------- | -------------------------------------------------------- |
| `lib/query-offer-params.ts`        | Parse `company`, `title*`, `requirement` / `req`, `spec` |
| `lib/dynamic-offer-spec.ts`        | JSON ↔ base64url                                         |
| `app/[lang]/offer/match/page.tsx`  | Page paramètres lisibles                                 |
| `app/[lang]/offer/custom/page.tsx` | Page `spec` uniquement                                   |
| `components/MatchOfferClient.tsx`  | Résolution côté client + affichage                       |

### Prompt court pour un LLM

> Construis une URL GET vers `https://<site>/{fr|en}/offer/match` avec : `company`, `title` (optionnel), et pour chaque compétence du poste un paramètre `requirement=Libellé:mot1,mot2` (répéter `requirement` plusieurs fois). Les mots-clés servent à matcher le CV (frameworks, rôle, description des missions).
