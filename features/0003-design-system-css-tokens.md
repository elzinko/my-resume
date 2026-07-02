---
id: 0003
title: Design system — CSS variables et tokens (remplacer les print:* épars)
type: refactor
priority: P2
version:
status: todo
pr:
created: 2026-07-02
---

# 0003 — Design system — CSS variables et tokens

## Contexte / Problème

Les classes Tailwind `print:*` sont dispersées dans le JSX → source de dérive web/print et
difficiles à maintenir de façon cohérente.

## Proposition

Remplacer par des **CSS variables** dans `styles/globals.css`. Un seul jeu de tokens avec
override `@media print` :

```css
:root {
  --fs-h2: 1.5rem;
  --fs-body: 0.875rem;
  --sp-section: 2.5rem;
}
@media print {
  :root {
    --fs-h2: 1rem;
    --fs-body: 0.75rem;
    --sp-section: 1rem;
  }
}
```

Tokens envisagés :

- **Typo** : `--fs-h1`, `--fs-h2`, `--fs-title`, `--fs-body`, `--fs-meta`, `--fs-pill`
- **Espacements** : `--sp-section`
- **Couleurs sémantiques** (Tailwind extend) : `cv.section`, `cv.tag-text`, `cv.tag-border`,
  `cv.jobs`, `cv.body-muted`
- **Classes utilitaires** `.cv-*` : `.cv-section`, `.cv-section-title`, `.cv-pill`,
  `.cv-text-body`, `.cv-row-with-side-meta`, etc.

Convention cible : plus de `print:text-xs` dans le JSX ; exceptions screen/print via
`data-print="off|on"`.

## Critères d'acceptation

- [ ] Tokens typo/espacement centralisés en CSS vars + override `@media print`.
- [ ] Suppression progressive des `print:*` du JSX.
- [ ] Aucun régression sur les 4 rendus (cf. checklist).

## Notes / décisions

Aligné avec les invariants `CLAUDE.md` (réduire la duplication web/print). Migré depuis
`ROADMAP.md`.
