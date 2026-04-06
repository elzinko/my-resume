const colors = require('tailwindcss/colors');

/**
 * Palette CV sémantique — source unique :
 * - section : Profil + domaines (Agile / Dev / Ops)
 * - tag-* : titres Skills / Projects + pastilles type compétence (bordure + texte)
 * - jobs : titres Expérience / Contact + client ; dates missions en taille cv-meta
 * - cv-meta : dates / méta secondaires (missions, études, projets) — couleur par token cv-* sur le composant
 * - body-muted : texte secondaire ; descriptions missions = `.cv-job-description` (globals) : `text-xs` mobile,
 *   `md:text-sm`, `text-justify` (y compris mobile) ; print `text-xs`.
 *
 * Colonne gauche : `.cv-education-heading`, `.cv-education-primary`, `.cv-study-title` en `text-base` ; méta grise `text-sm`.
 * Bloc Niveau de formation (`EducationLevel`) : même classes sur CV complet et CV court / mobile (pas de `-compact` sur le corps).
 *
 * Header : `lib/cv-header-toolbar.ts` — boutons `h-8 w-8`, icônes `h-4` (md `h-5`) ; fond clair, Malt légèrement désaturé au repos.
 *
 * Lignes titre + date : `.cv-row-with-side-meta` + `self-end` sur la méta droite (missions, projets). Études : `.cv-row-study-title-year` (baseline).
 *
 * Espacement : `.cv-mobile-section-mt` + `space-y-10` — blocs pleine largeur (Résumé, Domaines, Contact/Skills mobile, avant Jobs) ; `.cv-section-simple-list` — Projects, Learnings, Hobbies, Studies ; jobs — `app/[lang]/jobs.tsx` (`mt-4 space-y-4`).
 * Typo : `styles/globals.css` (`.cv-education-*`, `.cv-study-*`, `.cv-job-description`, `.cv-row-*`).
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        cv: {
          section: colors.teal[300],
          'tag-text': colors.blue[300],
          'tag-border': colors.blue[400],
          'tag-text-hover': colors.blue[200],
          jobs: colors.pink[300],
          'body-muted': colors.gray[400],
        },
      },
      fontSize: {
        'cv-meta': ['0.75rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
};
