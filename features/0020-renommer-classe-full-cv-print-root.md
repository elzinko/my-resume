---
id: 0020
title: Renommer la classe CSS .cv-full-cv-print-root → .cv-full-page
type: refactor
priority: P3
version:
status: todo
pr:
created: 2026-07-10
---

# 0020 — Renommer .cv-full-cv-print-root → .cv-full-page

## Contexte / Problème

La classe `.cv-full-cv-print-root` est en anglais (bien) mais **redondante** : « full-**cv**-print-root »
répète `cv`. Sa sœur est `.cv-short-page`. Un nom cohérent serait `.cv-full-page`.

## Proposition

Renommer `.cv-full-cv-print-root` → `.cv-full-page` partout (~20 occurrences dans
`styles/globals.css` + les composants qui l'appliquent + les mentions dans `docs/`).

## Critères d'acceptation

- [ ] Renommage complet (grep `cv-full-cv-print-root` → 0 hors historique).
- [ ] Aucun changement de rendu sur les 4 rendus + mobile (cf. checklist).
- [ ] Docs (`cv-rendering-rules.md`, ADR-0001) mises à jour.

## Notes / décisions

Issu de la revue globale (PR #160, Partie C). À coordonner avec
[0007](0007-nettoyage-print-preview.md) (qui touche la machinerie print du CV complet) et
[0003](0003-design-system-css-tokens.md) (hygiène CSS) — faire le rename avec l'un ou l'autre
si les zones se recoupent.
