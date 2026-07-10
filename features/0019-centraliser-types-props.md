---
id: 0019
title: Centraliser les types de données et homogénéiser le typage des props
type: refactor
priority: P2
version:
status: todo
pr:
created: 2026-07-10
---

# 0019 — Centraliser les types de données et homogénéiser les props

## Contexte / Problème

Les types vivent à 3 endroits (inline composant / `lib/` / `data/`) sans foyer unique :

- `CompactCvData` (`components/CompactCvLayout.tsx`) **redéclare à la main** des formes déjà
  exportées ailleurs (`JobData` de `JobDisplay`, `StudyData` de `StudyDisplay`, `ContactData`
  de `ContactDisplay`) et finit par `projects: any[]`.
- Le typage des props est fait de **3 façons** : `interface XProps` nommée (×25), objet inline
  anonyme `}: { … }` (×9), aucune (×5).

## Proposition

1. Faire **composer** `CompactCvData` à partir des types déjà exportés (`JobData`,
   `StudyData`, `ContactData`, `JobFramework`) au lieu de les dupliquer ; supprimer les `any[]`.
2. Choisir **un foyer unique** de types partagés (p. ex. `lib/cv-types.ts` ou `data/`) et
   y déplacer les types de données réutilisés.
3. Homogénéiser les **9 composants** à props inline anonymes vers une `interface XProps` nommée.

## Critères d'acceptation

- [ ] `CompactCvData` composé depuis les types existants, plus aucun `any[]`.
- [ ] Les 9 composants inline passent à une `interface XProps` nommée.
- [ ] `npx tsc --noEmit` vert ; aucun changement de rendu (4 rendus).

## Notes / décisions

Issu de la revue globale (PR #160, Partie C). `common/types/` a été supprimé (mort) — ne pas
le recréer sans usage réel ; préférer `lib/`.
