# Roadmap

## Unification layout CV complet (supprimer le dual-mode écran/print)

**Contexte** : le CV complet a deux modes d'affichage différents — un layout 2 colonnes (sidebar + missions) à l'écran, et un layout linéaire (type `?print=1`) à l'impression. Cela génère beaucoup de CSS conditionnel (`cv-print-preview`, `cv-full-cv-print-root`, `display: contents`, `print:order-*`, etc.) et rend le code difficile à maintenir.

**Objectif** : toujours afficher le CV complet dans le layout linéaire (celui de `?print=1`), que ce soit à l'écran ou à l'impression. Un seul rendu, zéro divergence.

**Impact** :

- Supprimer le layout 2 colonnes de `OfferTailoredShell` (`cv-page-split`, `#left`, `#main`)
- Supprimer des centaines de lignes de CSS dual-mode dans `globals.css`
- Retirer les classes `print-preview:*` et `cv-print-preview` devenues inutiles
- Simplifier les composants qui gèrent les deux modes (`display: contents`, `max-md:contents`, etc.)
- Le paramètre `?print=1` et `FullCvPrintPreviewEffect` deviennent obsolètes

**Plan** :

1. Créer une branche dédiée `refactor/unified-layout`
2. Refaire `OfferTailoredShell` en flux linéaire unique (sections empilées)
3. Nettoyer `globals.css` : supprimer tout le CSS `.cv-print-preview` et les overrides `@media print` devenus redondants
4. Tester toutes les pages (full, short, offer, dev/components)
5. Vérifier le PDF export (Cmd+P) — doit être identique à l'écran
6. Supprimer `FullCvPrintPreviewEffect` et le paramètre `?print`

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
