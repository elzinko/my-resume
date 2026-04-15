# MY RESUME

![checkly](https://api.checklyhq.com/v1/badges/checks/b0fd8907-eae6-4c3f-8c79-f52d0da2667a?style=flat&theme=light)

CV personnel en [Next.js](https://nextjs.org/) et [Tailwind CSS](https://tailwindcss.com/docs/). Les contenus vivent dans 4 fichiers sous [`data/cv/`](data/cv/) : `profile.json` (identité/contact), `tech-catalog.json` (dictionnaire techno), `experience.json` (missions/études/projets par ids) et `locales/{fr,en}.json` (textes localisés). L'app les compose au runtime via [`lib/cv-compose.ts`](lib/cv-compose.ts). Le catalogue de matching (ids + tokens texte) est **dérivé** des mêmes fichiers côté serveur (`lib/match-catalog-from-bundle.ts`), sans artefact JSON séparé.

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

- **Paramètres lisibles** : `/{lang}?company=…&requirement=Libellé:mots&contract=cdi`
- **JSON compact base64** : `/{lang}?spec=…`
- **Type de contrat** : `?contract=cdi` adapte les textes profil/domaines pour un poste permanent ; `freelance` par défaut.
- **Guide LLM dynamique** : `GET /api/llm-guide` — markdown auto-généré avec le catalogue de technos complet et des exemples d’URLs.

Plafonds (longueurs, nombre d’exigences) : `lib/dynamic-offer-spec.ts`, `lib/query-offer-params.ts`. URLs limitées à ~2k caractères par le navigateur ; au-delà, préférer `spec` base64.

Encodage CLI : `npm run encode-offer-spec -- path/to/offer.json`

## Liens utiles

| Ressource                   | Chemin / URL                                                         |
| --------------------------- | -------------------------------------------------------------------- |
| Données CV (structure)      | [`data/cv/profile.json`](data/cv/profile.json), [`tech-catalog.json`](data/cv/tech-catalog.json), [`experience.json`](data/cv/experience.json) |
| Textes localisés (FR/EN)    | [`data/cv/locales/fr.json`](data/cv/locales/fr.json), [`data/cv/locales/en.json`](data/cv/locales/en.json) |
| Spec OpenAPI (API profile)  | [`data/api/openapi.yaml`](data/api/openapi.yaml) — `GET /api/openapi.yaml`                                 |
| Types offre (interfaces TS) | [`data/offers/types.ts`](data/offers/types.ts)                       |
| Guide LLM (statique)        | [`.llm/README.md`](.llm/README.md)                                   |
| Guide LLM (dynamique)       | `GET /api/llm-guide`                                                 |
| Storybook maison (dev)      | `http://localhost:3000/{lang}/dev/components`                        |
| Storybook (Chromatic)       | `http://localhost:6006` (`npm run storybook`)                        |
| Rendus PDF / screenshots    | [`renders/`](renders/) -- [`renders/index.html`](renders/index.html) |
