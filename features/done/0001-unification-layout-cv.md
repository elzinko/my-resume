---
id: 0001
title: Unification layout CV complet (supprimer le dual-mode écran/print)
type: refactor
priority: P1
version:
status: shipped
pr:
created: 2026-07-02
---

# 0001 — Unification layout CV complet (supprimer le dual-mode écran/print)

## Contexte / Problème

Le CV complet avait une grille 2 colonnes (sidebar + missions) sur desktop, distincte
du rendu impression → double maintenance et dérives web/print.

## Proposition

Layout unifié en une seule colonne linéaire. `OfferTailoredShell` utilise
`flex flex-col gap-10` par défaut. Retirer les overrides `@media print` /
`.cv-print-preview` redondants.

## Critères d'acceptation

- [x] Colonne unique, identique écran/impression.
- [x] Overrides print redondants retirés.

## Notes / décisions

Livré. Il reste du CSS print-preview pour le formatage de sections (projets, veille,
loisirs) ; `FullCvPrintPreviewEffect` / `?print` conservés pour des différences mineures.
Nettoyage restant tracké séparément → voir fiche 0007. Migré depuis `ROADMAP.md`.
