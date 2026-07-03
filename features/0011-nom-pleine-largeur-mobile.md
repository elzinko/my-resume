---
id: 0011
title: Nom en pleine largeur sur mobile (pas de photo → agrandir le nom)
type: feature
priority: P2
version:
status: todo
pr:
created: 2026-07-02
---

# 0011 — Nom en pleine largeur sur mobile (pas de photo → agrandir le nom)

## Contexte / Problème

En vue **mobile**, la photo est masquée (`components/HeaderContent.tsx:77` `max-md:hidden`),
donc le bloc texte occupe déjà toute la largeur. Mais le **nom** (« Thomas Couderc ») est rendu
en `text-2xl` (24px, `HeaderContent.tsx:129-132`) — taille choisie pour tenir sur une ligne à
375px, mais qui laisse beaucoup de blanc à droite. Le nom étant constant et sans photo à côté,
il devrait **prendre plus de place** (remplir la largeur si possible).

## Proposition

Sur mobile **uniquement** (< md), agrandir le nom pour qu'il remplisse ~la largeur dispo tout
en restant sur **une seule ligne** :

- Piste robuste : taille de police **fluide** bornée, ex. `text-[clamp(2rem, 12vw, 3rem)]` en
  `max-md:` (à calibrer pour que « Thomas Couderc » remplisse ~375-430px sans wrapper).
- Alternative : bump de palier (`text-4xl` en mobile) — plus simple mais moins « pleine largeur ».
- Ne change RIEN à desktop/print (`md:text-5xl … lg:text-7xl`, `print:text-5xl`) ni au CV court
  (`compactPrint`, taille fixe A4).
- Cas photo présente (`?photo=1`) : photo masquée en mobile aussi → traiter pareil OU garder le
  comportement actuel ; décider (probablement même règle « pleine largeur si pas de photo visible »).

## Critères d'acceptation

- [ ] En mobile (375px et 430px), « Thomas Couderc » est nettement plus grand et remplit ~la
      largeur, **sans passer sur 2 lignes**.
- [ ] Desktop (md+), impression et CV court **inchangés**.
- [ ] Le sous-titre (rôle) et l'âge restent cohérents / lisibles sous le nom agrandi.
- [ ] Pas de débordement horizontal.
- [ ] Gate locale verte + E2E.

## Notes / décisions

- Fichier : `components/HeaderContent.tsx:119-136` (`<h1 data-cv-id="fullname">`).
- Contrainte historique : `text-2xl` retenu pour tenir sur 1 ligne à 375px → toute solution
  doit préserver ça au plus petit breakpoint.
- Mobile only → pas d'impact WYSIWYG print (l'impression reste calée sur desktop).
