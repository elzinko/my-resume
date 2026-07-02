---
id: 0007
title: Retirer ?print / FullCvPrintPreviewEffect / classes print-preview:* résiduelles
type: refactor
priority: P3
version:
status: todo
pr:
created: 2026-07-02
---

# 0007 — Nettoyage ?print / FullCvPrintPreviewEffect / print-preview:\*

## Contexte / Problème

Après l'unification du layout (fiche 0001), il reste `?print` / `FullCvPrintPreviewEffect`
et des classes `print-preview:*` conservées pour des différences mineures de rendu
impression — devenues quasi-inutiles pour le CV complet.

## Proposition

Retirer entièrement `?print` / `FullCvPrintPreviewEffect` / les classes `print-preview:*`
lorsque le rendu impression peut être porté par les seuls `@media print` + tokens partagés.

## Critères d'acceptation

- [ ] Aucune régression aperçu/PDF sur les 4 rendus (cf. checklist).
- [ ] `FullCvPrintPreviewEffect` / `?print` retirés OU justifiés s'ils restent nécessaires
      au CV court.

## Notes / décisions

⚠️ Attention : `.cv-print-preview` est **permanent sur `/short`** (invariant `CLAUDE.md`),
donc ce nettoyage concerne surtout le CV **complet** — vérifier l'impact sur le court avant
de retirer quoi que ce soit. Migré depuis `ROADMAP.md` (sous-note « Nettoyage futur »).
