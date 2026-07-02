---
id: 0004
title: Data layer découplée (bundle.json → cv.json / tech-catalog / locales)
type: refactor
priority: P3
version:
status: todo
pr:
created: 2026-07-02
---

# 0004 — Data layer découplée

## Contexte / Problème

Le `bundle.json` monolithique mélange données structurelles et textes localisés → i18n peu
propre, duplication entre locales.

## Proposition

Séparer en 3 fichiers :

| Fichier                        | Contenu                                                                    |
| ------------------------------ | -------------------------------------------------------------------------- |
| `data/cv/cv.json`              | Données neutres (dates, slugs, refs tech, structure jobs/studies/projects) |
| `data/cv/tech-catalog.json`    | Dictionnaire techno (nom canonique + lien)                                 |
| `data/cv/locales/{fr,en}.json` | Textes localisés + libellés UI                                             |

Avantages : i18n propre (aucun texte en dur), données structurelles non dupliquées entre
locales, tech-catalog source unique (matching offres + affichage), export DatoCMS possible
via `scripts/export-datocms.ts`.

## Critères d'acceptation

- [ ] `bundle.json` scindé en 3 fichiers, chargeur adapté.
- [ ] Aucun texte en dur dans les composants.
- [ ] Parité de rendu FR/EN (4 rendus) conservée.

## Notes / décisions

Migré depuis `ROADMAP.md`. NB : `tech-catalog.json` existe déjà partiellement (cf. #107).
