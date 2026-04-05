# MY RESUME

![checkly](https://api.checklyhq.com/v1/badges/checks/b0fd8907-eae6-4c3f-8c79-f52d0da2667a?style=flat&theme=light)

This is my own resume using [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) using [DatoCMS](https://www.datocms.com/) for data and prettied using [TailwindCSS](https://tailwindcss.com/docs/).

## Getting Started

### 1 - create Datocms project

Want to create a [datocms](https://www.datocms.com/) similar project ?

[![Clone DatoCMS project](https://dashboard.datocms.com/clone/button.svg)](https://dashboard.datocms.com/clone?projectId=96311&name=cv-thomas-couderc)

### 2 - configure environment variables

Create an .env file and set your Datocms variable :

```env
DATOCMS_API_URL=https://graphql.datocms.com/
DATOCMS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If the website is deployed staticaly, then you should remove Analytics using environment variable :

```env
STATIC_DEPLOYMENT=true
```

### 3 - run in dev mode

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3 - build for production

First, run the development server:

```bash
npm run build
```

## CV personnalisé par annonce (URL dynamique + LLM)

- **Paramètres lisibles dans l’URL** : `/{lang}/offer/match?company=…&requirement=Libellé:mots` (voir la doc).
- **JSON compact base64** : `/{lang}/offer/custom?spec=…`

Détails, exemples et limites : **[docs/OFFER_CUSTOM_ENDPOINT.md](docs/OFFER_CUSTOM_ENDPOINT.md)**.
