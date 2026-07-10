# ADR 0001 — Rendu du CV : un seul DOM, régimes pilotés par CSS

- **Statut** : accepté
- **Date** : 2026-07-02
- **Contexte associé** : dérives récurrentes web ↔ impression ; PR #108 (écart
  « Expérience »), fix « CV court lisible sur mobile ».

## Contexte

Le CV (complet et court) est rendu par des composants React. Le PDF est produit par
le **moteur d'impression du navigateur** (`window.print()` via `CvAutoprint`) sur le
**même DOM** que la vue web — il n'existe pas de pipeline PDF séparé.

Les différences d'apparence entre web, aperçu et PDF sont donc obtenues par une
**couche CSS spécifique à chaque régime**, sur un DOM commun :

- **Web** : classes de base + variantes `md:`.
- **Aperçu écran** (`?print=1`, et pendant `Cmd+P`) : classe `.cv-print-preview` sur
  `<html>` (`FullCvPrintPreviewEffect`), qui **duplique** les règles d'impression pour
  que l'aperçu colle au PDF sans écouter `@media print`.
- **PDF réel** : `@media print`.

Deux layouts coexistent : CV complet (`OfferTailoredShell`, flux linéaire
`.cv-full-cv-print-root`) et CV court (`CompactCvLayout`, route `/[lang]/short`, qui
force `.cv-print-preview` **en permanence** pour que sa vue normale soit un aperçu A4
fidèle).

## Problème observé

La duplication `@media print` ⟺ `.cv-print-preview` (et les 2 layouts) crée **4 rendus
(+ mobile)** à maintenir cohérents à la main. Symptômes récurrents :

- une correction appliquée à `@media print` mais pas à `.cv-print-preview` (ou
  l'inverse) → l'aperçu ment sur le PDF (ex. PR #108, padding avant « Expérience ») ;
- une amélioration « web » sans équivalent print → régimes divergents (ex. dates à
  droite en grille sur web, mais inline avec tirets en print) ;
- le CV court, `.cv-print-preview` permanent + `zoom` d'ajustement A4, devient
  illisible sur mobile (typo 10px réduite à 50 %).

On **redécouvre** ces écarts après coup, en prod.

## Décision

On **garde** l'architecture « un seul DOM, régimes CSS » (le contenu unique est un
atout : pas de duplication de markup, bonne accessibilité, ATS OK). Mais on
**encadre** la maintenance par des invariants explicites et vérifiables :

1. **WYSIWYG** : `web == aperçu == PDF`. Une modif visuelle se valide dans les 3
   régimes et les 2 layouts, jamais un seul.
2. **Pas de règle print orpheline** : privilégier un **sélecteur combiné**
   `@media print, .cv-print-preview { … }` (ou une variable/classe partagée) plutôt
   que deux copies. Réduire la duplication au fil de l'eau quand on touche une zone.
3. **Garde-fou mobile du court** : les règles `.cv-print-preview .cv-short-page` qui
   imposent des tailles A4 sont bornées `@media (min-width: 768px)` ; sous `md`, le
   court est une vue mobile 1:1 (`zoom = 1`, typo de base).
4. **Entrées de liste** : année colorée à droite dans tous les régimes ; layout
   inline/2-lignes piloté par `?entriesLayout` (défaut inline).

Ces invariants vivent dans [`CLAUDE.md`](../../CLAUDE.md) (auto-chargé par Claude
Code) et sont contrôlés par [`docs/cv-rendering-review-checklist.md`](../cv-rendering-review-checklist.md).

## Alternatives écartées

- **Composant d'impression séparé** (fork du markup pour le PDF) : duplique le
  contenu, casse l'unicité (accessibilité/ATS/SEO), double la surface de bug. Rejeté.
- **PDF server-side dédié** (Playwright/puppeteer headless en prod) : infra en plus,
  divergence garantie avec la vue web. Rejeté (le `renders/` via Playwright reste un
  outil de **test**, pas le chemin de production).

## Conséquences

- **+** Contenu unique conservé ; règles claires ; dérives détectables en revue.
- **−** La cohérence reste portée par la discipline (invariants + checklist + revue),
  pas par le compilateur. D'où l'intérêt de `CLAUDE.md` (les agents LLM les
  appliquent automatiquement) et, à terme, d'un diff visuel automatisé des 4 rendus.
- **Suivi** : migrer progressivement les paires de règles dupliquées vers des
  sélecteurs combinés ; ajouter un check de régression visuelle (snapshots `renders/`).
