---
id: 0017
title: /dev/renders — navigation rapide (onglets/arborescence) pour les comparaisons
type: feature
priority: P3
version:
status: todo
pr:
created: 2026-07-03
---

# 0017 — /dev/renders — navigation rapide (onglets/arborescence) pour les comparaisons

## Contexte / Problème

Sur `/dev/renders`, onglet **Comparer**, il faut scroller beaucoup pour parcourir toutes
les variantes (short/full × langue × screen/mobile/print/pdf) réf ↔ candidat. C'est long
et fastidieux d'aller à une comparaison précise. Idée soulevée en marge de la PR #125 :
un système d'**onglets** ou une **arborescence** pour accéder plus vite à une comparaison
donnée. « On verra après » (outil de dev, hors prod).

## Proposition

Ajouter une navigation secondaire dans l'onglet Comparer : sélecteur/arborescence
(variante → langue → medium) ou sous-onglets, pour sauter directement à une comparaison
sans scroller toute la matrice. Garder le tout aligné avec la mise au mobile (0008).

## Critères d'acceptation

- [ ] On peut atteindre une comparaison précise (ex. « full · FR · print-preview ») en
      un ou deux clics, sans scroller toute la page.
- [ ] Fonctionne desktop ET mobile.

## Notes / décisions

- Fichier : `app/[lang]/dev/renders/page.tsx` (onglet compare, `compareRows()`).
- Outil de dev uniquement. Lié à [[0008-dev-renders-mobile]] et [[0016-dev-renders-compare-scroll]].
