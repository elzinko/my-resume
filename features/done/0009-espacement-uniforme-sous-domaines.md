---
id: 0009
title: Espacement uniforme au-dessus des sous-domaines (Agile == Dev == Ops)
type: bug
priority: P1
version:
status: shipped
pr: '#123'
created: 2026-07-02
---

# 0009 — Espacement uniforme au-dessus des sous-domaines (Agile == Dev == Ops)

## Contexte / Problème

Sous la section **Profile**, les sous-domaines **Agile / Dev / Ops** (`components/Domain.tsx`,
rendus par `app/[lang]/domains.tsx` dans `.cv-domains-grid`) n'ont pas le même espacement
au-dessus de leur titre selon la position :

- **« Agile »** (1er domaine) est séparé de l'intro Profil par le gap inter-blocs
  (flex-gap `--cv-section-gap` ≈ 1.3rem) → grand écart.
- **« Dev » / « Ops »** (empilés en dessous en mobile) ne sont séparés que par le
  `gap-2` (0.5rem) de `.cv-domains-grid` en `grid-cols-1` (< md) → petit écart.

Résultat visible en **mobile** (cf. screenshot) : « Agile » flotte loin de l'intro, « Dev »
est collé sous les pastilles d'Agile. L'utilisateur veut **le même espacement au-dessus de
chaque sous-domaine**, et « plus généralement sur toutes les vues » (rythme intentionnel).

## Proposition

Rendre uniforme l'écart vertical au-dessus de chaque titre de sous-domaine quand ils sont
empilés (mobile), et garder l'alignement propre en 3 colonnes (tablette/desktop où ils sont
côte à côte, donc déjà « au même niveau »).

- Piste : augmenter le `gap-y` de `.cv-domains-grid` en `grid-cols-1` (mobile) pour matcher
  l'écart au-dessus d'« Agile » (plutôt que coller Agile à l'intro) → les 3 blocs deviennent
  régulièrement espacés.
- Vérifier que ça ne dégrade pas le rythme en 3 colonnes (md+ : `gap-y-0` conservé) ni
  l'impression (`print:gap-y-0`, 3 colonnes).

Décision d'ampleur (coller Agile à l'intro vs espacer Dev/Ops comme Agile) : trancher
visuellement — privilégier un rythme régulier lisible.

## Critères d'acceptation

- [ ] En mobile, l'espace au-dessus de « Agile », « Dev » et « Ops » est visuellement identique.
- [ ] En tablette/desktop (3 colonnes), les 3 titres démarrent au même niveau (inchangé/OK).
- [ ] Cohérent dans les 4 rendus (complet-web, complet-print, + aperçu `?print`) — cf.
      `docs/cv-rendering-review-checklist.md`.
- [ ] Pas de régression du garde-fou e2e « rythme inter-sections uniforme » (#108/#112).
- [ ] Gate locale verte + E2E.

## Notes / décisions

- Grille : `.cv-domains-grid` — `styles/globals.css:109-112`.
- Marges internes des domaines : `components/Domain.tsx` (`mt-2`/`mt-4` desc, `mt-2` pastilles).
- Lié à [[0012-tablette-premiere-ligne-alignee]] (même zone, alignement tablette) et
  [[0010-tamiser-couleur-sous-domaines]] (mêmes titres).
