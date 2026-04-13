# Roadmap

## ~~Unification layout CV complet (supprimer le dual-mode écran/print)~~ ✓ Fait

Layout unifié en une seule colonne linéaire. Le CV complet (`OfferTailoredShell`) utilise `flex flex-col gap-10` par défaut — plus de grille 2 colonnes sur desktop. Les overrides `@media print` et `.cv-print-preview` redondants ont été retirés. Il reste du CSS print-preview pour le formatage des sections (projets, veille, loisirs) et `FullCvPrintPreviewEffect` / `?print` sont conservés pour les différences mineures de rendu impression.

**Nettoyage futur** : retirer entièrement `?print` / `FullCvPrintPreviewEffect` / les classes `print-preview:*` devenues quasi-inutiles.

## Design system — CSS variables et tokens

Remplacer les classes Tailwind `print:*` dispersées dans le JSX par des **CSS variables** dans `styles/globals.css`. Un seul jeu de tokens avec override `@media print` :

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
- **Couleurs sémantiques** (Tailwind extend) : `cv.section`, `cv.tag-text`, `cv.tag-border`, `cv.jobs`, `cv.body-muted`
- **Classes utilitaires** `.cv-*` : `.cv-section`, `.cv-section-title`, `.cv-pill`, `.cv-text-body`, `.cv-row-with-side-meta`, etc.

Convention : plus de `print:text-xs` dans le JSX ; les exceptions screen/print passent par `data-print="off|on"`.

## Data layer découplée

Séparer le `bundle.json` monolithique en 3 fichiers :

| Fichier | Contenu |
|---|---|
| `data/cv/cv.json` | Données neutres (dates, slugs, refs tech, structure jobs/studies/projects) |
| `data/cv/tech-catalog.json` | Dictionnaire techno (nom canonique + lien) |
| `data/cv/locales/{fr,en}.json` | Textes localisés + libellés UI |

Avantages :
- i18n propre : aucun texte en dur dans les composants
- Les données structurelles (dates, tech) ne sont plus dupliquées entre locales
- Le tech catalog devient une source unique pour le matching offres et l'affichage
- Support DatoCMS possible via un script d'export GraphQL (`scripts/export-datocms.ts`)

## Primitives React (optionnel)

Composants réutilisables dans `components/primitives/` :
- `<Section title accent="section|jobs|tag|education">` — titre + spacing
- `<MetaRow left right />` — ligne titre / dates ou méta
- `<DateRange start end present />` — affichage formaté des plages de dates

## Migration Next.js 14 → 15+ (ou 16)

**Contexte** : Next.js 14.2.35 affiche "outdated" dans la console dev ([doc](https://nextjs.org/docs/messages/version-staleness)). La dernière version stable est 16.x.

**Pourquoi pas maintenant** : c'est un chantier dédié avec plusieurs breaking changes :

- **React 19 requis** (actuellement React 18.2) — potentiel impact sur tous les composants
- **`params` devient async** dans les Server Components : `params: { lang }` doit devenir `params: Promise<{ lang: Locale }>` avec `await` dans toutes les pages
- **Tailwind CSS v4** recommandé — configuration entièrement différente (`@import` CSS natif au lieu de `tailwind.config.js` + `@apply`)
- Les `@ts-expect-error Server Component` utilisés partout pourraient changer de comportement
- Turbopack remplace Webpack par défaut (Next 15+), nouvelle API de cache (Next 16)

**Plan de migration suggéré** :

1. Créer une branche dédiée `chore/next-upgrade`
2. Monter React 18 → 19, Next 14 → 15 (migration incrémentale)
3. Adapter tous les `params` async dans `app/[lang]/**`
4. Vérifier la compatibilité Tailwind 3.x avec Next 15 (ou migrer vers Tailwind v4)
5. Tester toutes les pages (full, short, offer, dev/components, dev/renders)
6. Tester print / print-preview / PDF export
7. Valider le déploiement Vercel
