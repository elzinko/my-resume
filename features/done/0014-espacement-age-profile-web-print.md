---
id: 0014
title: Espacement âge→Profile identique web/impression (WYSIWYG print == web desktop)
type: bug
priority: P1
version:
status: shipped
pr: '#124'
created: 2026-07-02
---

# 0014 — Espacement âge→Profile identique web/impression (WYSIWYG print == web desktop)

## Contexte / Problème

En **web** (CV complet desktop), l'espace entre le bloc en-tête (nom/rôle/**âge**) et la
section **Profile** est agréable. En **impression**, la sensation diffère : le bloc du haut
est **trop rapproché** de « Profile » (cf. screenshot 2). Or, sur l'impression du CV complet,
il reste de la place en bas → rien ne justifie ce resserrement.

Cause : l'en-tête (`Headers` → `HeaderContent`) est **hors** de `.cv-full-cv-print-root`. Son
espacement bas dépend de son propre padding : `md:py-12` (**3rem**) en web desktop, mais
`print:!py-2` (**0.5rem**) en impression (`components/HeaderContent.tsx:63`). D'où la divergence.

**Question de l'utilisateur** : « je pensais que les versions impression devaient être
strictement identiques aux versions web desktop » → **oui**, c'est l'invariant #1 de
`CLAUDE.md` (WYSIWYG : `web == aperçu == PDF`, mobile excepté). Donc c'est un vrai bug de
cohérence : l'impression doit retrouver le rythme du web desktop.

## Proposition

Aligner l'espacement en-tête → Profile de l'impression (et de l'aperçu `?print`) sur celui du
web desktop (que l'utilisateur valide) :

- Rapprocher le padding bas de l'en-tête en print du `md:py-12` web (ex. supprimer/relever le
  `print:!py-2` pour l'en-tête complet — **pas** le CV court `compactPrint` qui reste calé A4).
- Vérifier l'aperçu `.cv-print-preview` en parallèle (même règle, pas d'orpheline — invariant #2).
- Profiter de la place en bas de la page 1 (le complet a de la marge).

⚠️ Zone sensible : rythme d'impression calibré (PR #108/#112/#115) + garde-fou e2e
« rythme inter-sections uniforme ». Le gap en-tête→Profile est un cas à part (l'en-tête n'est
pas une `<section>`), mais **revérifier** que le garde-fou et la pagination (rester sur le bon
nb de pages) ne cassent pas.

## Critères d'acceptation

- [ ] L'écart âge → « Profile » est visuellement le **même** en web desktop, aperçu `?print` et PDF.
- [ ] L'impression du CV complet ne déborde pas / garde une pagination correcte (place en bas OK).
- [ ] Règle appliquée à la fois `@media print` ET `.cv-print-preview` (pas d'orpheline).
- [ ] CV court (`compactPrint`) inchangé (reste calé A4).
- [ ] Garde-fou e2e « rythme inter-sections » (#108/#112) toujours vert.
- [ ] Gate locale verte + E2E, vérif des 4 rendus (`docs/cv-rendering-review-checklist.md`).

## Notes / décisions

- Padding en-tête : `components/HeaderContent.tsx:55-64` (`pb-0 pt-2 print:!py-2 max-md:pt-0 md:py-12`).
- Structure : `Headers` hors `.cv-full-cv-print-root` (`components/OfferTailoredShell.tsx:102-112`).
- Tokens inter-sections : `styles/globals.css:5-86` (`--cv-section-gap`, overrides print/preview).
- Formalise/valide l'invariant WYSIWYG côté en-tête → penser à documenter si on ajuste
  (ADR `docs/adr/0001-cv-rendering-regimes.md`).
