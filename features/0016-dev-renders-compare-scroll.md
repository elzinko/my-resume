---
id: 0016
title: /dev/renders — certains CV ne scrollent pas dans les cellules de comparaison
type: bug
priority: P3
version:
status: todo
pr:
created: 2026-07-03
---

# 0016 — /dev/renders — certains CV ne scrollent pas dans les cellules de comparaison

## Contexte / Problème

Sur `/dev/renders`, onglet **Comparer**, certains CV ne se laissent pas scroller dans
leur cellule (iframe réduit / détaillé) → on ne peut pas voir tout le contenu du rendu.
Observé en marge de la PR #125 (mise au mobile de /dev/renders). « On verra plus tard »
(outil de dev, hors prod).

## Proposition

Diagnostiquer pourquoi le scroll est bloqué dans certaines cellules (probablement
`overflow: hidden` sur le conteneur borné + iframe mis à l'échelle par `transform:
scale()` qui ne propage pas le scroll, ou hauteur d'iframe insuffisante). Permettre un
scroll interne fiable (ou un clic « ouvrir en grand » systématique).

## Critères d'acceptation

- [ ] Dans l'onglet Comparer, chaque cellule (réduite ET détaillée) permet de voir tout
      le rendu (scroll interne ou ouverture pleine taille).
- [ ] Pas de régression desktop/mobile du reste de /dev/renders.

## Notes / décisions

- Fichier : `app/[lang]/dev/renders/page.tsx` (CompareCell / LiveCard, `COMPARE_CELL_HEIGHT`,
  `transform: scale()`, `overflow: hidden`).
- Outil de dev uniquement. Lié à [[0008-dev-renders-mobile]] et [[0017-dev-renders-compare-nav]].
