---
id: 0010
title: Tamiser la couleur des sous-domaines Agile/Dev/Ops (hiérarchie sous Profile)
type: feature
priority: P2
version:
status: todo
pr:
created: 2026-07-02
---

# 0010 — Tamiser la couleur des sous-domaines Agile/Dev/Ops (hiérarchie sous Profile)

## Contexte / Problème

Les titres des sous-domaines **Agile / Dev / Ops** utilisent `text-blue-400`
(`components/Domain.tsx:112-114`, `#60a5fa`), un bleu proche/aussi vif que le titre de
section **Profile** (`SectionHeadingAts` accent bleu, `#4e94f8`). Résultat : on distingue
mal que Agile/Dev/Ops sont des **sous-parties** de Profile plutôt que des sections sœurs.

L'utilisateur veut **tamiser** (adoucir) la couleur de ces sous-titres pour renforcer la
hiérarchie visuelle : sous-partie < section.

## Proposition

Choisir une teinte plus douce/désaturée pour les titres de sous-domaines (et cohérente avec
la barre verticale d'accent `bg-current` + les pastilles `.cv-pill-domain` qui héritent aussi
du bleu). Options :

1. Baisser l'opacité / la saturation du bleu du titre (ex. `text-blue-400/80`, ou un
   slate-bleu type `text-slate-400`) — la barre verticale suit (`bg-current`).
2. Garder la taille (déjà `text-xl` < `text-2xl` du titre Profile) et ne jouer QUE sur la
   couleur, pour préserver la hiérarchie typographique existante.

Décider si les **pastilles** (`.cv-pill-domain`, `styles/globals.css:563-567`) suivent le
même tamis ou restent en bleu vif (probablement les garder — elles portent l'accent techno).
POC couleur d'abord, ajuster au visuel.

## Critères d'acceptation

- [ ] Les titres Agile/Dev/Ops sont visiblement plus doux que le titre « Profile ».
- [ ] La barre verticale d'accent reste cohérente avec le titre (couleur alignée).
- [ ] Lisibilité conservée (contraste suffisant) dans les 4 rendus, y compris impression
      (`print:!text-blue-400` sur les pastilles à réévaluer si on change la teinte).
- [ ] Cohérent web / aperçu `?print` / PDF — cf. `docs/cv-rendering-review-checklist.md`.
- [ ] Gate locale verte + E2E.

## Notes / décisions

- Titres : `components/Domain.tsx:112-133` (`titleTypo`, `text-blue-400`).
- Pastilles : `.cv-pill-domain` — `styles/globals.css:563-567` (dont `print:!text-blue-400`).
- Envisager de passer par une variable/token de couleur : voir fiche 0003
  « Design system — CSS variables et tokens ».
- Lié à [[0009-espacement-uniforme-sous-domaines]] (mêmes titres).
