---
id: 0021
title: Déplacer/renommer renders/generate.mjs → scripts/generate-renders.mjs
type: chore
priority: P3
version:
status: todo
pr:
created: 2026-07-10
---

# 0021 — Déplacer renders/generate.mjs → scripts/generate-renders.mjs

## Contexte / Problème

`renders/generate.mjs` (script Playwright qui régénère les 16 captures de référence) est
placé hors de la convention `scripts/` (où vivent `argos-capture.mjs`, `encode-offer-spec.mjs`)
et porte un nom peu parlant. Il est co-localisé avec sa sortie et appelé par **chemin absolu**
depuis `app/api/renders/generate/route.ts` (`path.join(process.cwd(), 'renders', 'generate.mjs')`).

## Proposition

Déplacer/renommer vers `scripts/generate-renders.mjs`, mettre à jour l'unique référence dans
`app/api/renders/generate/route.ts`, et adapter le répertoire de sortie (le script écrit
aujourd'hui dans son propre dossier via `import.meta.url` → viser explicitement `renders/`).

## Critères d'acceptation

- [ ] Script déplacé + renommé ; route API mise à jour ; sorties toujours écrites dans `renders/`.
- [ ] `POST /api/renders/generate` régénère bien les 16 captures depuis la page `/dev/renders`.

## Notes / décisions

Issu de la revue globale (PR #160, Partie C). Les binaires `renders/*.png|*.pdf` ont déjà été
dé-trackés (ignorés, conservés en local) dans le même lot.
