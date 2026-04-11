# Données CV

## Fichier unique `bundle.json`

La source de vérité est **`bundle.json`** à la racine de ce dossier :

```json
{
  "schemaVersion": 1,
  "fr": { ... },
  "en": { ... }
}
```

Chaque clé `fr` / `en` contient le même schéma qu’auparavant (missions, compétences, etc.). L’app lit ce fichier via [`lib/cv-data.ts`](../../lib/cv-data.ts) selon la locale de la page.

## Catalogue match (LLM / URLs d’offre)

Les ids et libellés utilisés pour `requirement=…:@id` sont ceux du CV dans **`bundle.json`** : l’app agrège `allSkillsModels` et les `frameworks` de chaque mission (`allJobsModels`), en fusionnant **fr** et **en** (voir `lib/match-catalog-from-bundle.ts`). Il n’y a plus de fichier `match-catalog.json` à générer.
