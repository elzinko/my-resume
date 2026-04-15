# Données CV

## Découpage en 4 fichiers

La source de vérité est répartie en **4 fichiers + un fichier par locale** :

| Fichier                              | Rôle                                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile.json`                       | Identité + contact (PII partagée FR/EN)                                                                                                      |
| `tech-catalog.json`                  | Dictionnaire canonique des technologies (`entries`), ordre des skills (`skillsOrder`), domaines structurels (id/name/position/competencyIds) |
| `experience.json`                    | Structure des missions/études/projets/hobbies/learnings (par **ids** vers `tech-catalog`)                                                    |
| `locales/fr.json`, `locales/en.json` | Tous les textes localisés (titres UI, descriptions, bullets, rôles par mission…)                                                             |

L'app compose ces fichiers au runtime en mémoire pour produire le snapshot attendu par les composants, via [`lib/cv-compose.ts`](../../lib/cv-compose.ts) et [`lib/cv-data.ts`](../../lib/cv-data.ts).

## Catalogue match (LLM / URLs d'offre)

Les ids et libellés utilisés pour `requirement=…:@id` viennent désormais du tech-catalog (`tech-catalog.json`) et des frameworks présents dans `experience.json`. Voir [`lib/match-catalog-server.ts`](../../lib/match-catalog-server.ts).

## Script de migration

`scripts/split-bundle.ts` a servi à générer ces fichiers une seule fois depuis l'ancien `bundle.json`. Il est conservé pour référence historique — il n'a plus vocation à être exécuté.
