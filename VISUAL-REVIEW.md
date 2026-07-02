# Revue visuelle (Argos) — gate de merge

## But

Un **diff visuel avant/après** du CV, **sur demande**, qui **bloque le merge** tant qu'il
n'est pas validé. Complète les snapshots pixel composant et l'assertion e2e (fiche 0018).

## Comment ça marche

- **Sur demande** : label `visual` sur une PR, ou « Run workflow » (workflow_dispatch).
  PAS à chaque commit (coût CI).
- Le workflow build + sert le CV, capture les rendus (full/short × FR/EN × web/aperçu print,
  cf. `scripts/argos-capture.mjs`) et les envoie à **Argos**.
- Argos compare à la **baseline** (main) et poste un **check GitHub** : le diff avant/après
  est consultable et s'**approuve/rejette** dans l'UI Argos.
- Via **branch protection** (check requis), le squash+merge reste **bloqué** tant que le
  diff n'est pas approuvé. La baseline se met à jour au merge sur `main`.

## Mise en place (à faire UNE fois — actions manuelles)

1. Créer le projet sur https://app.argos-ci.com, le lier à ce repo, installer l'app GitHub Argos.
2. Secret repo (Settings → Secrets and variables → Actions) : `ARGOS_TOKEN` (fourni par Argos).
3. Branch protection (Settings → Branches → `main`) : rendre le check **Argos** requis pour merger.
4. (Optionnel) ajuster les routes capturées dans `scripts/argos-capture.mjs`.

## Usage

Sur une PR prête (après la revue de code) : pose le label **`visual`** → le workflow tourne →
approuve le diff dans Argos → le check passe → le merge est débloqué.

> Le script utilise Playwright (déjà présent) sans importer `@argos-ci` : l'upload passe par
> `npx @argos-ci/cli` dans le workflow. Si tu préfères l'intégration `@argos-ci/playwright`
> (screenshots taggés directement dans des specs), installe-la et remplace le script.
