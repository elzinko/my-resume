# Roadmap

## ~~Unification layout CV complet (supprimer le dual-mode écran/print)~~ ✓ Fait

Layout unifié en une seule colonne linéaire. Le CV complet (`OfferTailoredShell`) utilise `flex flex-col gap-10` par défaut — plus de grille 2 colonnes sur desktop. Les overrides `@media print` et `.cv-print-preview` redondants ont été retirés. Il reste du CSS print-preview pour le formatage des sections (projets, veille, loisirs) et `FullCvPrintPreviewEffect` / `?print` sont conservés pour les différences mineures de rendu impression.

**Nettoyage futur** : retirer entièrement `?print` / `FullCvPrintPreviewEffect` / les classes `print-preview:*` devenues quasi-inutiles.

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
