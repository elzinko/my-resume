# MY RESUME

![](https://api.checklyhq.com/v1/badges/checks/62d26efa-af80-41e7-ab7b-470b93755513?style=flat&theme=default&responseTime=true)

This is my own resume using [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) using [DatoCMS](https://www.datocms.com/) for data and prettied using [TailwindCSS](https://tailwindcss.com/docs/).

## Getting Started

### 1 - create Datocms project

Create a [datocms](https://www.datocms.com/) project using this button [![Clone DatoCMS project](https://dashboard.datocms.com/clone/button.svg)](https://dashboard.datocms.com/clone?projectId=96311&name=cv-thomas-couderc)

### 2 - configure environment variables

Create an .env file and set your Datocms variable :

```env
DATOCMS_API_URL=https://graphql.datocms.com/
DATOCMS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Expose localy using ngrok

The easiest way to expose your dev webapp to the world is to use ngrok.
Forst [install it](https://dashboard.ngrok.com/get-started/setup) then expose your local server using :

```bash
npm run ngrok
```
