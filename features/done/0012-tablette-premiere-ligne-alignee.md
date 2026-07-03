---
id: 0012
title: Tablette — titres Agile/Dev/Ops alignés (première ligne au même niveau)
type: bug
priority: P2
version:
status: shipped
pr: '#123'
created: 2026-07-02
---

# 0012 — Tablette — titres Agile/Dev/Ops alignés (première ligne au même niveau)

## Contexte / Problème

En **vue tablette** (≥ md = 768px, `.cv-domains-grid` en `grid-cols-3`), les pastilles des
sous-domaines Agile/Dev/Ops ne tiennent pas sur une seule ligne (elles wrappent). Ce n'est pas
grave — ça reste lisible. **Mais** comme pour le mobile et les autres vues, l'utilisateur veut
que **la première ligne (les titres Agile/Dev/Ops) démarre au même niveau** dans les 3 colonnes.

Actuellement `.cv-domains-grid` utilise `md:items-stretch` et chaque `Domain` est un
`flex flex-col` avec description `flex-1` (pousse les pastilles en bas). Les titres SONT censés
être en haut (alignés), mais à vérifier en tablette : selon la hauteur d'intro/description, un
décalage de la première ligne peut apparaître.

## Proposition

Garantir que les 3 titres de sous-domaines s'alignent en haut (première ligne au même Y) en
tablette et desktop, indépendamment du nombre de lignes de description / de pastilles :

- Vérifier que `items-stretch` + titre en tête de colonne suffit ; sinon aligner explicitement
  le haut des colonnes (`items-start` sur la rangée des titres) tout en gardant les pastilles
  alignées en bas via `flex-1` sur la description.
- Ne pas casser l'alignement bas des pastilles (déjà voulu, cf. `Domain.tsx` commentaires).

## Critères d'acceptation

- [ ] En tablette (~768-1024px), les titres « Agile », « Dev », « Ops » démarrent exactement au
      même niveau vertical, même si les pastilles wrappent sur 2 lignes.
- [ ] Les pastilles restent alignées en bas des 3 colonnes (comportement existant conservé).
- [ ] Desktop et impression inchangés / cohérents (3 colonnes).
- [ ] Gate locale verte + E2E (vérif Playwright en viewport tablette).

## Notes / décisions

- Grille : `.cv-domains-grid` — `styles/globals.css:109-112`.
- Composant : `components/Domain.tsx:135-152` (`flex flex-col`, description `flex-1`).
- Lié à [[0009-espacement-uniforme-sous-domaines]] (même zone, cohérence d'alignement inter-vues).
