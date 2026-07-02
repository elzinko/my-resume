# Déploiement — my-resume

Modèle « muti » : **la CI pilote tout** via `vercel deploy` + `vercel alias`.

## Flux

- **push sur `main`** → déploiement _preview_ aliasé sur **https://staging.elzinko.fr** (on teste l'intégration).
- **push d'un tag `v*`** (`git tag v1.0.0 && git push origin v1.0.0`) → **production** sur **https://www.elzinko.fr**.
- **« Run workflow »** (Actions → _Deploy_) → choix manuel `staging` | `production`.

## Pourquoi AUCUN réglage dashboard

- L'auto-deploy git de Vercel sur `main` est **désactivé dans `vercel.json`**
  (`git.deploymentEnabled.main = false`) → `main` ne publie plus tout seul en prod.
- Les **previews de PR** (branches) restent actives (intégration git conservée).
- Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) déploie + aliase via la CLI Vercel.

## Mise en place (à faire UNE fois)

- Secret repo **`VERCEL_TOKEN`** (https://vercel.com/account/tokens).
  Les IDs `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` sont **déjà posés**.
- `staging.elzinko.fr` : un **CNAME** chez IONOS (`staging` → `cname.vercel-dns.com`).

## Vérifier

- Push `main` → `https://staging.elzinko.fr` se met à jour ; `www.elzinko.fr` ne bouge pas.
- `git tag vX.Y.Z && git push origin vX.Y.Z` → `www.elzinko.fr` se met à jour.
