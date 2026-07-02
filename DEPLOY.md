# Déploiement — my-resume

## Stratégie (fiche 0013)

- **`main` + branches → PREVIEW / STAGING** : déployés automatiquement par l'intégration
  Git de Vercel (chaque push = une preview). `main` sert d'environnement de **staging**.
- **PRODUCTION (`elzinko.fr`) → uniquement sur tag `v*`** : on ne déploie en prod que
  quand on **versionne**. Vercel n'ayant pas de déploiement-sur-tag natif, c'est la GitHub
  Action [`.github/workflows/deploy-prod-on-tag.yml`](.github/workflows/deploy-prod-on-tag.yml)
  (CLI Vercel) qui s'en charge.

## Mise en place (à faire UNE fois — actions manuelles)

1. **Couper la prod automatique depuis `main`.** Vercel dashboard → Project → Settings →
   Git → **Production Branch** : mettre `production` (une branche jamais poussée). Effet :
   `main` devient un déploiement **preview** (staging), plus de prod automatique.
2. **Secrets GitHub** (repo → Settings → Secrets and variables → Actions) :
   - `VERCEL_TOKEN` — https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID` — obtenus via `npx vercel link` puis lus dans
     `.vercel/project.json`.

## Déployer en production

```bash
git tag v1.2.3
git push origin v1.2.3   # → la GH Action déploie main (taggé) sur elzinko.fr
```

## Vérifier

- Un push sur `main` → une **preview** (staging) sur `*.vercel.app`, **pas** `elzinko.fr`.
- Un tag `v*` → un **déploiement production** sur `elzinko.fr`.

> Le `vercel.json` existant (skip des builds `dependabot/*`) reste inchangé.
