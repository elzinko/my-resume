---
id: 0006
title: Migration Next.js 14 → 15+/16 (React 19, params async, Tailwind v4)
type: chore
priority: P2
version:
status: todo
pr:
created: 2026-07-02
---

# 0006 — Migration Next.js 14 → 15+/16

## Contexte / Problème

Next.js 14.2.35 affiche « outdated » en console dev
([doc](https://nextjs.org/docs/messages/version-staleness)). Dernière stable : 16.x.

## Proposition

Chantier dédié — plusieurs breaking changes :

- **React 19 requis** (actuellement 18.2) — impact potentiel sur tous les composants.
- **`params` devient async** dans les Server Components : `params: Promise<{ lang: Locale }>`
  - `await` dans toutes les pages.
- **Tailwind CSS v4** recommandé — config entièrement différente (`@import` natif au lieu de
  `tailwind.config.js` + `@apply`).
- Les `@ts-expect-error Server Component` partout pourraient changer de comportement.
- Turbopack par défaut (Next 15+), nouvelle API de cache (Next 16).

Plan suggéré :

1. Branche dédiée `chore/next-upgrade`.
2. React 18 → 19, Next 14 → 15 (incrémental).
3. Adapter les `params` async dans `app/[lang]/**`.
4. Vérifier compat Tailwind 3.x avec Next 15 (ou migrer Tailwind v4).
5. Tester toutes les pages (full, short, offer, dev/components, dev/renders).
6. Tester print / print-preview / PDF export.
7. Valider le déploiement Vercel.

## Critères d'acceptation

- [ ] Next 15+ (ou 16) + React 19, build vert.
- [ ] `params` async partout ; toutes les pages OK.
- [ ] 4 rendus + PDF non régressés ; déploiement Vercel OK.

## Notes / décisions

Gros chantier, pas urgent (« pourquoi pas maintenant »). Migré depuis `ROADMAP.md`.
