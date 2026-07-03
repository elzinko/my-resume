---
id: 0015
title: Impression CV complet — afficher toutes les pastilles techno des expériences
type: bug
priority: P1
version:
status: todo
pr:
created: 2026-07-03
---

# 0015 — Impression CV complet — afficher toutes les pastilles techno des expériences

## Contexte / Problème

En **impression du CV complet** (aperçu `?print` et PDF), les pastilles techno des
expériences sont **tronquées** : plafonnées à 10 + « … » (le même cap qu'à l'écran).
Le catalogue techno d'une mission n'est donc pas affiché en entier (cf. screenshot
Médiapost : `java 5 · maven 2 · git · tomcat 5 · jenkins · sybase · jasper report ·
selenium · scrum · tdd · …`). Certaines missions ont bien plus de technos (SNCF 20,
une mission 52).

Cause : `components/JobFrameworkPills.tsx` plafonne à `MAX_VISIBLE_WHEN_COLLAPSED = 10`
en impression **pour le CV long comme pour le court**.

## Proposition

En régime impression du **CV LONG** (`!compact`), afficher `frameworks.length` pastilles
(catalogue complet), sur plusieurs lignes (le conteneur non-compact est déjà `flex-wrap`
/ `print:max-h-none`). Régime impression détecté par le state `printing` (⌘P via
`beforeprint`) **ET** la classe `.cv-print-preview` sur `<html>` (aperçu `?print`) pour
couvrir aperçu + PDF (WYSIWYG). CV court (`compact`) inchangé : plafond 10 (tient sur 1
page A4).

## Critères d'acceptation

- [ ] Impression CV complet (aperçu `?print` ET PDF) : **toutes** les pastilles de chaque
      expérience, aucune troncature ni « … ».
- [ ] Écran CV complet : fit 1 ligne + bouton « … » (inchangé).
- [ ] CV court écran ET impression : plafond 10 (inchangé — 1 page A4).
- [ ] Rythme inter-sections d'impression toujours uniforme (garde-fou `print-section-rhythm`).
- [ ] Gate locale verte.

## Notes / décisions

- Fichier : `components/JobFrameworkPills.tsx` (state `printing`, cap `MAX_VISIBLE_WHEN_COLLAPSED`).
- Implémenté dans la PR #126 (vérifié Playwright + PDF réel : Médiapost 12, SNCF 20 sur
  3 lignes ; écran et short inchangés ; rythme spread 0.0px).
