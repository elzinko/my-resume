# Règles de rendu du CV — référentiel agrégé

Source unique et lisible des **invariants du rendu du CV** : ce qui doit rester vrai
après chaque feature. Agrège [`CLAUDE.md`](../CLAUDE.md), l'[ADR-0001](adr/0001-cv-rendering-regimes.md)
et la [checklist de revue](cv-rendering-review-checklist.md). Chaque règle indique
**ce qu'elle garantit**, **dans quels rendus**, et **ce qui la protège** (test e2e / code).

> **Vue complémentaire, ordonnée de haut en bas** : [`cv-layout-map.md`](cv-layout-map.md)
> parcourt le CV **bloc par bloc** (en-tête → … → loisirs) avec, pour chacun, les
> **valeurs réelles par régime** (web mobile / web desktop / PDF / aperçu) et la liste
> des **divergences web ≠ PDF** repérées. Ce document-ci est thématique ; celui-là est
> structurel — les deux se complètent pour localiser une dérive.

> Convention : ✅ = garanti (règle en place) · 🧪 = couvert par un test e2e ·
> ⚠️ = discipline manuelle (pas de filet automatique).

---

## 0. Le modèle mental — 1 DOM, 5 rendus

Il n'y a **qu'un seul DOM React** (contenu unique, jamais dupliqué). Le PDF est produit
par le **moteur d'impression du navigateur** (`window.print()` via `CvAutoprint`) sur
ce même DOM — **pas** de pipeline PDF séparé. L'apparence change via une **couche CSS
par régime** :

| Régime       | Déclencheur                     | Support CSS                      |
| ------------ | ------------------------------- | -------------------------------- |
| **Web**      | vue normale                     | classes de base + `md:`          |
| **Aperçu**   | `?print=1` (et pendant `Cmd+P`) | `.cv-print-preview` sur `<html>` |
| **PDF réel** | impression                      | `@media print`                   |

Deux layouts : **CV complet** (`OfferTailoredShell` / `.cv-full-cv-print-root`) et
**CV court** (`CompactCvLayout`, `/[lang]/short`, `.cv-print-preview` **permanent**).
→ **5 rendus à garder cohérents** : `complet-web`, `complet-print`, `court-web`,
`court-print`, **+ mobile**.

---

## 1. WYSIWYG & régimes CSS

| #   | Règle                                                                                                                                                                                                                                          | Rendus           | Statut |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------ |
| 1.1 | **`web == aperçu == PDF`.** Toute modif visuelle se valide dans les 3 régimes ET les 2 layouts — jamais un seul.                                                                                                                               | tous             | ⚠️     |
| 1.2 | **Pas de règle print orpheline.** Une règle d'impression vaut pour `@media print` **ET** `.cv-print-preview` (sélecteur combiné ou copies jumelles commentées).                                                                                | print + aperçu   | ⚠️     |
| 1.3 | **Garde-fou mobile du court.** Les règles `.cv-print-preview .cv-short-page` imposant des tailles A4 sont bornées `@media (min-width: 768px)`. Sous `md`, le court est une **vue mobile 1:1** (`zoom = 1`, typo lisible), jamais un A4 réduit. | court-web mobile | 🧪     |
| 1.4 | **Espacements par tokens** (`--cv-section-gap`, `--cv-section-body-gap`), pas de marges par section codées en dur (évite le margin-collapse et la dérive de rythme).                                                                           | tous             | ⚠️     |

---

## 2. En-tête & photo

| #   | Règle                                                                                                                                                                                               | Rendus        | Statut           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------- |
| 2.1 | **Photo affichée sur desktop, masquée sur mobile** (< 768px → toute la largeur pour le nom).                                                                                                        | complet-web   | ✅               |
| 2.2 | **Photo TOUJOURS visible à l'impression**, quelle que soit la marge `@page` (garde-fou `print:!flex` : sans lui, une marge large fait passer la largeur sous 768px et `max-md:hidden` la masquait). | complet-print | ✅               |
| 2.3 | **Rythme nom → rôle → âge uniforme** (une seule classe pilote rôle et âge).                                                                                                                         | tous          | 🧪 `@local-only` |
| 2.4 | Photo affichée par défaut ; `?photo=0` la masque. Âge affiché par défaut ; `?age=0`.                                                                                                                | tous          | ✅               |

---

## 3. Domaines Agile / Dev / Ops

| #   | Règle                                                                                                                                                                                                                                                                                                                                                                                               | Rendus         | Statut |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------ |
| 3.1 | Les domaines sont des **sous-titres du Profil**, pas des sections sœurs (même bleu que « Profil », tamisé `/70`).                                                                                                                                                                                                                                                                                   | tous           | ✅     |
| 3.2 | **Mobile : Profil + domaines = un seul bloc groupé** — rythme vertical UNIFORME (`fin texte précédent → titre` == `titre → texte`, ≈ 16px) pour Summary→Agile et entre Agile/Dev/Ops ; l'écart vers la vraie section suivante reste nettement plus grand. Posé en `@media screen` (JAMAIS en print → 3 colonnes du PDF intactes même <768px), scopé `.cv-full-cv-print-root` (CV court non touché). | complet mobile | 🧪     |
| 3.3 | **Print (3 colonnes) : les 5 pastilles de chaque domaine tiennent sur 1 SEULE ligne**, taille compacte identique (10px), sans rétrécir la police en-deçà du lisible. Vérifié PDF réel (786px) + aperçu 768→1024px.                                                                                                                                                                                  | complet-print  | ✅     |
| 3.4 | **Vignettes de taille homogène** (même police par régime : web 14px, print 10px) ; on ne tronque pas, on compacte l'espacement.                                                                                                                                                                                                                                                                     | tous           | ✅     |
| 3.5 | Web/mobile : pastilles à 13-14px (lisibles), **non impactées** par la compaction print.                                                                                                                                                                                                                                                                                                             | complet-web    | ✅     |

---

## 4. Pastilles technos (sous les expériences)

| #   | Règle                                                                                                                                                                                                      | Rendus        | Statut |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| 4.1 | **Web : fit dynamique sur 1 ligne** (mesuré), plafonné à **10** + bouton **« … »** qui déplie tout. Le « … » est un bouton, pas une troncature figée.                                                      | complet-web   | ✅     |
| 4.2 | **Print : TOUTES les technos** s'affichent (multi-lignes), pas de « … ».                                                                                                                                   | complet-print | ✅     |
| 4.3 | Sur tablette le rendu paraît « sans max » : la colonne étroite fait tenir < 10 pastilles, donc le plafond de 10 ne mord pas. Sur desktop large il coupe à 10 (ajustable via `MAX_VISIBLE_WHEN_COLLAPSED`). | complet-web   | ✅     |

---

## 5. Espacement (tokens)

Deux tokens, une valeur par régime — **régler ici = régler partout**.

| Token                                                         | Web    | Print + aperçu | CV court |
| ------------------------------------------------------------- | ------ | -------------- | -------- |
| `--cv-section-gap` (inter-sections, **au-dessus des titres**) | 1.5rem | 1.3rem         | 0.9rem   |
| `--cv-section-body-gap` (titre → contenu)                     | 1rem   | 0.5rem         | 0.4rem   |

> Le **CV complet** aligne son web sur les valeurs print (1.3 / 0.5) via
> `.cv-full-cv-print-root` → pas de saut au switch aperçu↔normal.

| #   | Règle                                                                                    | Rendus        | Statut                    |
| --- | ---------------------------------------------------------------------------------------- | ------------- | ------------------------- |
| 5.1 | **Le CV court DOIT tenir sur 1 page A4** à l'impression. Son 0.9 / 0.4 est tuné pour ça. | court-print   | 🧪 `short-cv-one-page`    |
| 5.2 | Rythme inter-sections **uniforme** (même écart avant chaque titre de section).           | complet-print | 🧪 `print-section-rhythm` |

---

## 6. Entrées de liste (Études, Projets, Loisirs)

| #   | Règle                                                                                        | Rendus | Statut |
| --- | -------------------------------------------------------------------------------------------- | ------ | ------ |
| 6.1 | **Année/date colorée, collée à droite** dans tous les régimes.                               | tous   | ✅     |
| 6.2 | Détail (école, description) inline ou sur 2 lignes selon `?entriesLayout` (défaut : inline). | tous   | ✅     |

---

## 7. Liens « CV en ligne »

| #   | Règle                                                                                                                | Rendus        | Statut |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| 7.1 | **CV court** : lien « voir le CV complet en ligne » (court → complet), visible dans tous les régimes.                | court         | ✅     |
| 7.2 | **CV complet** : lien « CV en ligne » (complet-PDF → complet-web), **print-only** (masqué à l'écran, on y est déjà). | complet-print | ✅     |
| 7.3 | URL **absolue** reprise de l'origine courante (prod / preview Vercel) → cliquable dans le PDF exporté.               | print         | ✅     |

---

## 8. Paramètres d'URL (à préserver & documenter)

`?print` · `?photo=0` · `?age=0` · `?ats=1` · `?entriesLayout=inline|stacked` ·
`?headerAlign=right` · `?subtitle(_fr|_en)` · `?contract=cdi|freelance` · `?mode=teaching` ·
`?edu=1` · `?detail=` · `?maxJobShown=N` · `?job=<slug>` (répétable) · offre (`?company` + `?requirement`).

---

## 9. Vérification obligatoire avant toute PR « rendu CV »

1. Lancer le dev server et **vérifier les 5 rendus** (Playwright), pas un seul —
   cf. [checklist détaillée](cv-rendering-review-checklist.md).
2. Pour le print : mesurer au **vrai PDF** (`page.pdf` / `emulateMedia('print')`),
   pas seulement l'aperçu — l'aperçu (largeur desktop) peut mentir sur le PDF (largeur
   `@page` ~786px, ou < 768px si marges larges).
3. Filets e2e (gatés en CI) : `short-cv-one-page`, `print-section-rhythm`,
   `print-layout`, `mobile-section-spacing`, `cv-column-alignment`, `section-heading-filets`.

Décision d'archi & rationale : [ADR-0001](adr/0001-cv-rendering-regimes.md).
