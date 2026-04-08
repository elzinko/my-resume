# MY RESUME

![checkly](https://api.checklyhq.com/v1/badges/checks/b0fd8907-eae6-4c3f-8c79-f52d0da2667a?style=flat&theme=light)

CV personnel en [Next.js](https://nextjs.org/) et [Tailwind CSS](https://tailwindcss.com/docs/). Les contenus multilingues vivent dans un **fichier unique** [`data/cv/bundle.json`](data/cv/bundle.json) (clés `fr` et `en`). Le catalogue pour le matching (ids + tokens texte) est **dérivé du même fichier** au chargement côté serveur (`lib/match-catalog-from-bundle.ts`), sans artefact JSON séparé.

## Démarrage

Créer un `.env` si besoin (ex. déploiement statique) :

```env
STATIC_DEPLOYMENT=true
```

Lancer le serveur de dev :

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Build production :

```bash
npm run build
```

## CV personnalisé par annonce (URL dynamique + LLM)

- **Paramètres lisibles dans l’URL** : `/{lang}?company=…&requirement=Libellé:mots` (voir la doc).
- **JSON compact base64** : `/{lang}?spec=…`

Détails, exemples et limites : **[docs/OFFER_CUSTOM_ENDPOINT.md](docs/OFFER_CUSTOM_ENDPOINT.md)**.
