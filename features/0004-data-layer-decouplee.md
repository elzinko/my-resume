---
id: 0004
title: Retirer les derniers textes en dur des composants (fallbacks FR/EN)
type: refactor
priority: P3
version:
status: todo
pr:
created: 2026-07-02
---

# 0004 — Retirer les derniers textes en dur des composants (fallbacks FR/EN)

## Contexte / Problème

**Mise à jour 2026-07-05** : le découpage du data layer proposé par cette fiche est
**déjà fait**, mais pas exactement comme décrit à l'origine — vérifié à la relecture du
backlog (repo `data/cv/`) :

- `bundle.json` **a disparu** (aucune trace sur `main`), remplacé par **4 fichiers** :
  `profile.json`, `experience.json`, `tech-catalog.json`, `locales/{fr,en}.json`
  (`lib/cv-data.ts:loadCvSources`). Découpage plus fin que les 3 fichiers proposés
  (`cv.json` a été scindé en `profile.json` + `experience.json`), mais l'esprit
  (structure / catalogue tech / textes localisés séparés) est respecté.
- Les 4 dernières mentions de « bundle.json » dans le code (`dev/components/page.tsx`,
  `CompactCvLayout.tsx`, `scripts/split-bundle.ts`, `lib/match-catalog-schema.ts`) sont des
  **commentaires morts** (dont le script de migration one-shot lui-même), pas des
  dépendances runtime — à nettoyer un jour, non bloquant.

**Ce qui reste réellement à faire** (le seul critère non rempli) : **5 occurrences** du
motif `lang === 'fr' ? '<texte>' : '<texte>'` (texte en dur, pas piloté par les locales)
dans `components/CompactCvLayout.tsx` et `components/OfferTailoredShell.tsx` — labels de
secours pour les titres de section (« Coordonnées »/« Contact », « Profil »/« Profile »).

## Proposition

Déplacer ces 5 libellés de secours vers `data/cv/locales/{fr,en}.json` (le mécanisme
existe déjà partiellement, cf. `data.titles.contact` dans `CompactCvLayout.tsx`) pour
qu'aucun composant ne contienne de texte FR/EN en dur, même en fallback.

## Critères d'acceptation

- [x] `bundle.json` scindé, chargeur adapté (fait — 4 fichiers, cf. ci-dessus).
- [ ] Aucun texte en dur dans les composants (5 occurrences restantes à traiter).
- [ ] Parité de rendu FR/EN (4 rendus) conservée après le déplacement des libellés.

## Notes / décisions

Migré depuis `ROADMAP.md`. Recadrée le 2026-07-05 après vérification de l'état réel du
repo (le split de fichiers était déjà fait, la fiche décrivait un problème obsolète) —
même id, périmètre resserré sur ce qui reste vraiment à faire.
