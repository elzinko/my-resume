---
id: 0005
title: Primitives React réutilisables (Section / MetaRow / DateRange)
type: refactor
priority: P3
version:
status: todo
pr:
created: 2026-07-02
---

# 0005 — Primitives React réutilisables (optionnel)

## Contexte / Problème

Le markup de sections / lignes méta / plages de dates est répété dans plusieurs composants.

## Proposition

Composants réutilisables dans `components/primitives/` :

- `<Section title accent="section|jobs|tag|education">` — titre + spacing
- `<MetaRow left right />` — ligne titre / dates ou méta
- `<DateRange start end present />` — affichage formaté des plages de dates

## Critères d'acceptation

- [ ] Primitives créées et adoptées par au moins 2 sections chacune.
- [ ] Aucun changement de rendu (4 rendus).

## Notes / décisions

Marqué **optionnel** dans le roadmap d'origine. Migré depuis `ROADMAP.md`.
