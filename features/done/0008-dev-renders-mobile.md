---
id: 0008
title: /dev/renders lisible et utilisable en vue mobile
type: feature
priority: P3
version:
status: shipped
pr: '#125'
created: 2026-07-02
---

# 0008 — /dev/renders lisible et utilisable en vue mobile

## Contexte / Problème

`app/[lang]/dev/renders/page.tsx` (dashboard de comparaison des rendus CV : onglets
`snapshots` / `live` / `compare`) est pensé desktop. Sur mobile, la grille de comparaison
(iframes réduits, contrôles sticky) n'est pas adaptée.

Peu prioritaire : le contrôle des rendus se fait en web, hors prod. Mais ce serait
confortable de pouvoir vérifier les previews de PR **depuis un mobile** (ex. relecture
d'une PR loin du poste).

## Proposition

Rendre `/dev/renders` utilisable sur petit écran, sans casser le desktop :

- Les contrôles (URLs réf/candidat, langue, onglets) passent en pile verticale < md.
- L'onglet `compare` (3 colonnes Variant × Réf × Cand) devient empilable ou scrollable
  horizontalement proprement sur mobile.
- Vérifier que les iframes ne débordent pas (largeur 100 %, scroll interne si besoin).

Outil de dev uniquement → pas de contrainte WYSIWYG CV ; on peut styler librement.

## Critères d'acceptation

- [ ] `/fr/dev/renders` est lisible et navigable sur un viewport 390px (onglets, contrôles).
- [ ] L'onglet `compare` reste exploitable sur mobile (empilé ou scroll horizontal contrôlé).
- [ ] Aucun débordement horizontal du body sur mobile.
- [ ] Desktop inchangé.
- [ ] Gate locale verte (typecheck/lint/tests).

## Notes / décisions

- Fichier : `app/[lang]/dev/renders/page.tsx` (styles inline, pas de Tailwind — volontaire
  pour ne pas dépendre du design system du CV).
- Hors périmètre « rendu CV » (pas de régime print).
