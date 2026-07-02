# Backlog features & bugs

Source de vérité = le front-matter de chaque fiche `features/NNNN-slug.md`. Cet index est
**régénéré** depuis les fiches (ne pas l'éditer à la main). Fiches livrées → `features/done/`.

Règles : 1 PR par feature, squash-merge quand la CI est verte. Priorités P0 (urgent) → P3.
Statuts : 🔴 todo · 🟠 in-progress · ⛔ blocked · ✅ shipped.

Dernière mise à jour : 2026-07-02

## Actives (triées par priorité)

| #    | Titre                                                    | Type     | Prio | Statut  | PR  |
| ---- | -------------------------------------------------------- | -------- | ---- | ------- | --- |
| 0002 | Loisirs — bascule inline / 2 lignes via `?entriesLayout` | feature  | P2   | 🔴 todo |     |
| 0003 | Design system — CSS variables et tokens                  | refactor | P2   | 🔴 todo |     |
| 0006 | Migration Next.js 14 → 15+/16                            | chore    | P2   | 🔴 todo |     |
| 0004 | Data layer découplée (bundle → cv/tech-catalog/locales)  | refactor | P3   | 🔴 todo |     |
| 0005 | Primitives React réutilisables                           | refactor | P3   | 🔴 todo |     |
| 0007 | Retirer `?print` / `FullCvPrintPreviewEffect` résiduels  | refactor | P3   | 🔴 todo |     |

## Livré (`done/`)

| #    | Titre                         | Type     | Prio | Statut     | PR  |
| ---- | ----------------------------- | -------- | ---- | ---------- | --- |
| 0001 | Unification layout CV complet | refactor | P1   | ✅ shipped |     |

> Priorités **proposées** à la migration depuis `ROADMAP.md` — à réajuster (éditer le
> front-matter des fiches puis régénérer cet index).
