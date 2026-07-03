# Backlog features & bugs

Source de vérité = le front-matter de chaque fiche `features/NNNN-slug.md`. Cet index est
**régénéré** depuis les fiches (ne pas l'éditer à la main). Fiches livrées → `features/done/`.

Règles : 1 PR par feature, squash-merge quand la CI est verte. Priorités P0 (urgent) → P3.
Statuts : 🔴 todo · 🟠 in-progress · ⛔ blocked · ✅ shipped. Rendu CV : respecter les
invariants de `CLAUDE.md` et la checklist `docs/cv-rendering-review-checklist.md`.

Dernière mise à jour : 2026-07-03

## Actives (triées par priorité)

| #    | Titre                                                               | Type     | Prio | Statut  | PR  |
| ---- | ------------------------------------------------------------------- | -------- | ---- | ------- | --- |
| 0009 | Espacement uniforme au-dessus des sous-domaines (Agile==Dev==Ops)   | bug      | P1   | 🔴 todo |     |
| 0013 | /short web — zoom par défaut 100 % (min 75 %, max 150 %)            | bug      | P1   | 🔴 todo |     |
| 0014 | Espacement âge→Profile identique web/impression (WYSIWYG)           | bug      | P1   | 🔴 todo |     |
| 0015 | Impression CV complet — toutes les pastilles techno des expériences | bug      | P1   | 🔴 todo |     |
| 0002 | Loisirs — bascule inline / 2 lignes via `?entriesLayout`            | feature  | P2   | 🔴 todo |     |
| 0003 | Design system — CSS variables et tokens                             | refactor | P2   | 🔴 todo |     |
| 0006 | Migration Next.js 14 → 15+/16                                       | chore    | P2   | 🔴 todo |     |
| 0010 | Tamiser la couleur des sous-domaines Agile/Dev/Ops                  | feature  | P2   | 🔴 todo |     |
| 0011 | Nom en pleine largeur sur mobile (pas de photo)                     | feature  | P2   | 🔴 todo |     |
| 0012 | Tablette — titres Agile/Dev/Ops alignés (1ʳᵉ ligne au même niveau)  | bug      | P2   | 🔴 todo |     |
| 0004 | Data layer découplée (bundle → cv/tech-catalog/locales)             | refactor | P3   | 🔴 todo |     |
| 0005 | Primitives React réutilisables                                      | refactor | P3   | 🔴 todo |     |
| 0007 | Retirer `?print` / `FullCvPrintPreviewEffect` résiduels             | refactor | P3   | 🔴 todo |     |
| 0008 | /dev/renders lisible et utilisable en vue mobile                    | feature  | P3   | 🔴 todo |     |

## Livré (`done/`)

| #    | Titre                         | Type     | Prio | Statut     | PR  |
| ---- | ----------------------------- | -------- | ---- | ---------- | --- |
| 0001 | Unification layout CV complet | refactor | P1   | ✅ shipped |     |
