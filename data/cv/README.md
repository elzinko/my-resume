# Données CV (export DatoCMS)

Le site charge le CV via `getCvData` (`lib/cv-data.ts`). Deux modes sont possibles, pilotés par une variable d’environnement :

| Mode               | Variable                         | Comportement                                                                                             |
| ------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Local** (défaut) | `CV_DATA_SOURCE=local` ou absent | Lecture de fichiers sous `data/cv/` (JSON par défaut, ou YAML si `CV_LOCAL_FORMAT=yaml`).                |
| **DatoCMS live**   | `CV_DATA_SOURCE=datocms`         | Une requête GraphQL par rendu (même schéma que l’export) ; exige `DATOCMS_API_URL` et `DATOCMS_API_KEY`. |

En mode local, `CV_LOCAL_FORMAT` vaut `json` par défaut (`fr.json`, `en.json`). Avec `CV_LOCAL_FORMAT=yaml` (ou `yml`), les fichiers attendus sont `fr.yaml` / `en.yaml`.

## Mettre à jour le contenu depuis DatoCMS

1. Configurer `DATOCMS_API_URL` et `DATOCMS_API_KEY` (fichier `.env` à la racine du repo, non versionné).
2. Exécuter :

```bash
npm run export:datocms
```

Le script charge `.env` via `dotenv`, interroge l’API **Content Delivery** (même schéma que l’app historique) et réécrit `data/cv/fr.json` et `data/cv/en.json`.

3. Commiter les JSON si tu veux des builds **sans** accès Dato (CI, clone nu). Dans ce cas, laisse le mode par défaut (`local`) pour `next build`.

4. Alternative sans fichiers : définir `CV_DATA_SOURCE=datocms` au build ; le site interroge alors Dato à chaque génération de page (pas besoin d’exporter des JSON, mais les secrets Dato doivent être présents).

## Modifier le contenu à la main

Tu peux éditer directement les JSON (ou YAML en mode `CV_LOCAL_FORMAT=yaml`) : la structure correspond à la réponse GraphQL définie dans `lib/cv-data-query.ts` (`CV_AGGREGATE_QUERY`).

### Projets : masquer une entrée sans la supprimer

Sur un élément de `allProjectsModels`, tu peux ajouter **`"display": false`** pour qu’il ne s’affiche pas sur le site (les champs `frameworks`, `description`, etc. restent dans le JSON pour référence ou export futur). Sans ce champ ou avec `true`, le projet est affiché.

### Titre d’affichage vs nom technique

- **`name`** : identifiant / nom de dépôt (ex. `shopify-plugin-product-assistant`).
- **`title`** (optionnel) : libellé affiché dans le CV (ex. `Shopify assistant`). S’il est absent, le site utilise `name` avec une majuscule sur la première lettre.

## CI (GitHub Actions)

Le workflow Pages exécute `npm run export:datocms` avant `next build` pour régénérer les JSON à partir des secrets `DATOCMS_API_URL` et `DATOCMS_API_KEY`. Si l’export échoue, vérifie que ces secrets sont bien configurés.
