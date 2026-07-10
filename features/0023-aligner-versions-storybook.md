---
id: 0023
title: Aligner les versions @storybook/* sur storybook@10.4.6
type: chore
priority: P3
version:
status: todo
pr:
created: 2026-07-10
---

# 0023 — Aligner les versions @storybook/\*

## Contexte / Problème

Léger drift de versions Storybook dans `package.json` : `storybook@10.4.6` mais
`@storybook/addon-a11y`, `@storybook/nextjs`, `@storybook/react` en `10.3.5`. Sans impact
fonctionnel connu, mais incohérent.

## Proposition

Bumper les trois `@storybook/*` en `10.4.6` pour s'aligner sur `storybook`, régénérer
`package-lock.json` (`npm install`) et vérifier le build (`npm run build-storybook`).

## Critères d'acceptation

- [ ] `storybook` et `@storybook/*` sur la même version.
- [ ] `package-lock.json` synchronisé (gate `nextjs.yml` vert).
- [ ] `npm run build-storybook` OK ; les 15 stories rendent.

## Notes / décisions

Issu de la revue globale (PR #160, Partie C). Nécessite un `npm install` (réseau) + vérif
build — laissé hors du lot de nettoyage sûr pour cette raison.
