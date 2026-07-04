---
id: 0013
title: /short web — zoom par défaut 100 % (min 75 %, max 150 %)
type: bug
priority: P1
version:
status: shipped
pr: '#122'
created: 2026-07-02
---

# 0013 — /short web — zoom par défaut 100 % (min 75 %, max 150 %)

## Contexte / Problème

Sur `/[lang]/short` en web (ex. `https://staging.elzinko.fr/fr/short`), le zoom par défaut
part à **~184 %** : `CvZoomSlider` applique `fitToWidth()` en vue normale desktop
(`components/CvZoomSlider.tsx:68`), soit `largeur_dispo / 800`. Sur écran large ça donne
~1.84 → le CV court s'étale sur toute la largeur.

L'utilisateur veut un **zoom par défaut à 100 %**, avec **min 75 %** et **max 150 %**.
(Déjà demandé auparavant — probable régression.)

## Proposition

Dans `components/CvZoomSlider.tsx` :

- `MIN` : `0.5` → **`0.75`**
- `MAX` : `2.5` → **`1.5`**
- Vue normale desktop (`!printMode`) : appliquer **`1`** au lieu de `fitToWidth()`
  (ligne 68). Le bouton « % » (fit-to-width) peut rester comme action manuelle, clampé au
  nouveau [0.75 ; 1.5] — ou être revu si `fitToWidth` n'a plus de sens comme défaut.
- Vérifier `SCREEN_A4_ZOOM` (0.82) pour l'aperçu `?print=1` : 0.82 ≥ 0.75 → reste dans les
  bornes, OK. Mobile force déjà `1` (inchangé).
- Le PDF n'est jamais affecté (`@media print { zoom: 1 !important }`).

## Critères d'acceptation

- [ ] `/fr/short` en web desktop s'ouvre à **100 %** (pas 184 %).
- [ ] Le curseur borne à **75 % min** et **150 % max**.
- [ ] Aperçu `?print=1` inchangé (A4 à ~0.82) et dans les bornes.
- [ ] Mobile inchangé (zoom 1, curseur masqué).
- [ ] PDF inchangé (zoom neutralisé).
- [ ] Gate locale verte + E2E.

## Notes / décisions

- Fichier : `components/CvZoomSlider.tsx:12-13` (MIN/MAX) et `:64-68` (valeur par défaut).
- Vérifier les tests e2e existants qui liraient un % de zoom par défaut.
