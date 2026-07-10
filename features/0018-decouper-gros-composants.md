---
id: 0018
title: Découper HeaderToolbar (602 l.) et CompactCvLayout (434 l.)
type: refactor
priority: P2
version:
status: todo
pr:
created: 2026-07-10
---

# 0018 — Découper HeaderToolbar et CompactCvLayout

## Contexte / Problème

Deux composants dérogent à la convention d'extraction déjà en place dans le repo (les
`*Display` délèguent à des sous-unités, la logique part en hooks/`lib/`) :

- `components/HeaderToolbar.tsx` — **602 lignes**, dont ~70 % de code avant l'`export
default` (ligne 411) : logique de menu (open/close, `usePathname`), construction des
  liens, contrôles print/locale, le tout mélangé au rendu de la barre.
- `components/CompactCvLayout.tsx` — **434 lignes** : composition root qui orchestre 2
  modes de layout (featured/chrono) + duplication mobile/grille dans un JSX ~340 l.

Seuil-signal identifié pendant la revue globale : ≈ **250 lignes**.

## Proposition

Appliquer la convention existante : extraire des **sous-composants** (par section /
par mode de layout) et sortir la logique en **hooks `lib/`**. POC : commencer par
`HeaderToolbar` (concerns les plus enchevêtrés : menu, liens, contrôles).

## Critères d'acceptation

- [ ] `HeaderToolbar` et `CompactCvLayout` repassent sous ~250 lignes (ou justifié).
- [ ] Aucun changement de rendu sur les 4 rendus + mobile (cf. checklist).
- [ ] Gate locale verte (typecheck/lint/tests) puis E2E.

## Notes / décisions

Issu de la revue globale (PR #160, Partie C). Complémentaire de [0005](0005-primitives-react.md)
(primitives réutilisables) : le découpage peut réutiliser/produire ces primitives.
