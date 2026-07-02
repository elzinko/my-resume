---
id: 0002
title: Loisirs — bascule inline / 2 lignes via ?entriesLayout
type: feature
priority: P2
version:
status: todo
pr:
created: 2026-07-02
---

# 0002 — Loisirs — bascule inline / 2 lignes via ?entriesLayout

## Contexte / Problème

Les **Études** supportent déjà `?entriesLayout=inline|stacked` (défaut `inline` : titre +
détail sur une ligne, année à droite ; `stacked` : détail en L2). Le séparateur `·` des
Loisirs est déjà en place. Reste à étendre le **même paramètre partagé** aux **Loisirs**
(description sur 1 ligne inline vs 2 lignes).

**Pourquoi pas fait en même temps que les Études** : contrairement aux Études (grille
`.cv-entry`), la visibilité des descriptions loisirs (`.cv-hobby-desc`) est pilotée par des
règles **empilées** — container-query (`display:none` < 36rem / `inline` ≥ 36rem),
`@media print` et `.cv-print-preview` — **toutes en `!important` dans `@layer components`**.
Or `!important` **inverse** l'ordre des cascade-layers.

## Proposition

- Câbler `entriesLayout` à `<Hobbies>` (`OfferTailoredShell`) + `data-entries-layout` sur la
  section `#hobbies`.
- Règle **hors layer** (top-level), placée **après** le bloc
  `.cv-print-preview … .cv-hobby-desc` (~`styles/globals.css:1123`) :
  `.cv-cq-section[data-cv-section='hobbies'][data-entries-layout='stacked'] .cv-hobby-desc { display: block !important }`
  (+ `::before { content: none }`).
- Décider du comportement **mobile** (description en 2 lignes ou masquée < 36rem comme
  aujourd'hui).

## Critères d'acceptation

- [ ] `?entriesLayout=stacked` met la description loisir en 2 lignes (desktop + PDF).
- [ ] `inline` (défaut) inchangé ; comportement mobile décidé et cohérent.
- [ ] Les 4 rendus vérifiés (cf. `docs/cv-rendering-review-checklist.md`).
- [ ] Gate locale verte (typecheck/lint) puis E2E impression.

## Notes / décisions

Le paramètre `?entriesLayout` + l'infra (`lib/cv-entries-layout.ts`) existent déjà (PR #116).
Migré depuis `ROADMAP.md`.
