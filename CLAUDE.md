# CLAUDE.md — règles projet (auto-chargées)

Guide court pour toute session Claude Code sur ce repo. Objectif : **arrêter les
dérives entre le rendu web et le rendu impression du CV**, qui reviennent après
chaque feature. Lis la section « Rendu CV » avant TOUTE modif de style/mise en page.

## Rendu CV — le modèle mental (à ne pas oublier)

Il n'y a **qu'un seul DOM React** (le contenu est unique, jamais dupliqué). Le PDF
est produit par le **moteur d'impression du navigateur** (`Cmd+P` / `window.print()`
déclenché par `CvAutoprint`) sur ce même DOM. Il n'y a **pas** de moteur PDF séparé.

Ce qui change l'apparence = une **couche CSS par régime**, posée sur le DOM commun :

| Régime     | Déclencheur                     | Où                                                                       |
| ---------- | ------------------------------- | ------------------------------------------------------------------------ |
| **Web**    | vue normale                     | classes de base + `md:`                                                  |
| **Aperçu** | `?print=1` (et pendant `Cmd+P`) | classe `.cv-print-preview` sur `<html>` (cf. `FullCvPrintPreviewEffect`) |
| **PDF**    | impression réelle               | `@media print`                                                           |

Et il y a **2 layouts distincts** : CV complet (`OfferTailoredShell`) et CV court
(`CompactCvLayout`, route `/[lang]/short`). Donc **4 rendus** à garder cohérents :
`complet-web`, `complet-print`, `court-web`, `court-print` (+ le mobile).

**La dérive vient de là** : une règle « print » doit souvent être écrite DEUX fois
(`@media print` ET `.cv-print-preview`). Corriger l'une en oubliant l'autre = l'aperçu
ment sur le PDF (ou l'inverse). Une modif « web-only » n'a aucun effet sur le print.

## Invariants (respecter, sinon on recrée la dérive)

1. **WYSIWYG** : `web == aperçu ?print == PDF`. Toute modif visuelle doit être
   répercutée dans **les 3 régimes** (et les 2 layouts si concerné). Ne jamais livrer
   une modif qui n'a été vue que dans un seul régime.
2. **Pas de règle print orpheline** : toute règle d'impression doit valoir pour
   `@media print` **ET** `.cv-print-preview`. Préférer un **sélecteur combiné**
   (`@media print, .cv-print-preview { … }` ou une classe/variable partagée) plutôt
   que deux copies qui divergeront.
3. **`.cv-print-preview` est PERMANENT sur `/short`** (cf. `short/layout.tsx`). Donc
   toute règle `.cv-print-preview .cv-short-page …` qui impose des **tailles A4**
   (≈ 9–12px) doit être bornée `@media (min-width: 768px)` : sous `md`, le CV court
   retombe sur la typo responsive lisible (`text-base`). Le PDF garde ses tailles via
   les copies `@media print`. (Cf. le fix « CV court lisible sur mobile ».)
4. **CV court sous `md` = vue mobile 1:1**, jamais un A4 réduit (pas de `zoom` < 1 :
   `CvZoomSlider` force `zoom = 1` sous `md`).
5. **Entrées de liste** (Études, Projets, Loisirs…) : date/année **colorée et collée
   à droite** dans tous les régimes ; le détail (école, description) inline ou sur 2
   lignes selon `?entriesLayout` (défaut : inline).
6. **Tokens d'espacement** : passer par `--cv-section-gap` / `--cv-section-body-gap`,
   pas de marges par section codées en dur (évite le margin-collapse et la dérive de
   rythme entre régimes).
7. **Photo** : affichée sur desktop, **masquée sous `md`** (mobile), **toujours à
   l'impression** (garde-fou `print:!flex` sur le conteneur — sans lui, une marge
   `@page` large fait passer la largeur de rendu sous 768px et `max-md:hidden` masque
   la photo dans le PDF alors que l'aperçu la montre).
8. **Domaines Agile/Dev/Ops en print** : les 5 pastilles de chaque colonne tiennent sur
   **1 seule ligne** (compaction police 10px + padding/gap resserrés + `column-gap`
   aligné sur le PDF, en `@media print` **ET** `.cv-print-preview`) — on **compacte**,
   on ne tronque pas. Web/mobile (13-14px) intacts.

## Référentiel des règles (agrégé, lisible)

Toutes les règles de rendu — régimes, en-tête/photo, domaines, pastilles, espacement,
entrées, liens, params URL — sont consolidées et lisibles dans
[`docs/cv-rendering-rules.md`](docs/cv-rendering-rules.md) (avec, pour chaque règle, le
rendu concerné et le test qui la protège). **Le lire avant toute modif de rendu.**

Pour **localiser une dérive à sa position dans le flux** : la carte structurelle
[`docs/cv-layout-map.md`](docs/cv-layout-map.md) parcourt le CV **bloc par bloc, de haut
en bas**, avec les **valeurs réelles par régime** (web mobile / desktop / PDF / aperçu)
et la liste des **divergences web ≠ PDF** connues (classées voulue / vraie dérive / code mort).

## Vérification obligatoire avant toute PR touchant le rendu CV

Lancer le dev server et **vérifier les 4 rendus + le mobile** (Playwright), pas un
seul. Checklist détaillée : [`docs/cv-rendering-review-checklist.md`](docs/cv-rendering-review-checklist.md).
Décision d'archi et rationale : [`docs/adr/0001-cv-rendering-regimes.md`](docs/adr/0001-cv-rendering-regimes.md).

Rappel : `renders/` contient des captures de référence des 4 modes — utile comme
diff visuel avant/après.

## Divers

- Paramètres d'URL (offre, `?print`, `?photo`, `?age`, `?ats`, `?entriesLayout`, …)
  pilotent le rendu : les préserver et les documenter à l'ajout.
- `npm test` = `prettier:check` + `lint`. Formater avant de committer.
- Commits : Conventional Commits en français (`fix(cv): …`, `feat(cv): …`).
