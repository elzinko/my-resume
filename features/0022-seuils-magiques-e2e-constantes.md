---
id: 0022
title: Extraire les seuils magiques des tests e2e en constantes nommées
type: refactor
priority: P3
version:
status: todo
pr:
created: 2026-07-10
---

# 0022 — Seuils magiques des tests e2e → constantes nommées

## Contexte / Problème

Plusieurs tests e2e s'appuient sur des **nombres magiques** heuristiques, fragiles par nature
et non documentés :

- `e2e/print-layout.spec.ts:28` — `expect(mainW).toBeGreaterThan(leftW * 1.45)`
- `e2e/mobile-section-spacing.spec.ts:79` — `... > maxIntra * 1.4`
- `e2e/short-cv-section-spacing.spec.ts` — `ratio(...) <= 1.2`
- `e2e/header-toolbar.spec.ts` — hauteur bouton `30–40px`

Acceptables comme filets « détecter un basculement de layout », mais opaques.

## Proposition

Extraire ces seuils en **constantes nommées** en tête de spec (ou un module partagé) avec un
commentaire « pourquoi ce ratio » (ex. `const MAIN_COL_MIN_RATIO = 1.45; // colonne missions ≈ 2/3`).

## Critères d'acceptation

- [ ] Les seuils numériques des specs concernées sont nommés + commentés.
- [ ] Suite e2e toujours verte (comportement inchangé, juste plus lisible).

## Notes / décisions

Issu de la revue globale (PR #160, Partie C). Amélioration de lisibilité, pas de changement de
couverture. `dev-components.spec.ts` reste `@local-only` (hors CI).
