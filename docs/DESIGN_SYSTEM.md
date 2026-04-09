# Design system

> Référence courte pour rester cohérent dans le CV.
> Pour la philosophie / motivations, voir `docs/CODE_REVIEW_2026-04.md`.

## Principe : un seul rendu, deux médias

Toute la typographie et les espacements proviennent de **CSS variables**
définies dans `styles/globals.css` :

```css
:root {
  --fs-h2:    1.5rem;
  --fs-body:  0.875rem;
  --sp-section: 2.5rem;
  ...
}
@media print {
  :root {
    --fs-h2:    1rem;
    --fs-body:  0.75rem;
    --sp-section: 1rem;
    ...
  }
}
```

**Conséquence : on n'écrit plus `print:text-xs`, `print:mt-4` etc. dans le JSX.**
Pour ajuster le rendu PDF, on modifie les variables du bloc `@media print` —
une seule source de vérité pour les deux médias.

Les rares exceptions (masquer/afficher un élément) passent par les attributs
sémantiques `data-print="off"` / `data-print="on"`.

## Tokens typographiques

| Token            | Écran | Print | Usage                                              |
| ---------------- | ----- | ----- | -------------------------------------------------- |
| `--fs-h1`        | 48 px | 30 px | Nom (header)                                       |
| `--fs-h2`        | 24 px | 16 px | Titres de section (`h2`)                           |
| `--fs-title`     | 16 px | 14 px | Client mission, diplôme, ligne primaire formation  |
| `--fs-body`      | 14 px | 12 px | Corps, description mission, méta études            |
| `--fs-meta`      | 12 px | 10 px | Dates, méta secondaires                            |
| `--fs-pill`      | 12 px | 10 px | Pastilles techno / compétences                     |
| `--sp-section`   | 40 px | 16 px | Marge entre sections                               |

## Couleurs sémantiques (Tailwind)

Définies dans `tailwind.config.js → theme.extend.colors.cv` :

| Token           | Rôle                                                           |
| --------------- | -------------------------------------------------------------- |
| `cv.section`    | Profil + domaines (Agile / Dev / Ops) + titres Études          |
| `cv.tag-text`   | Pastilles compétences + titres Skills / Projects               |
| `cv.tag-border` | Bordure des pastilles compétences                              |
| `cv.jobs`       | Titres Expérience / Contact + nom du client                    |
| `cv.body-muted` | Texte secondaire (descriptions, méta)                          |

## Classes utilitaires

Toutes documentées dans `styles/globals.css` (préfixe `.cv-*`).

### Sections
- `.cv-section` — espacement vertical entre sections
- `.cv-section-title` — `<h2>` avec border-b et taille adaptée
- `.cv-section-simple-list` — liste compacte (Projects, Hobbies, Studies…)

### Lignes méta
- `.cv-row-with-side-meta` — flex titre / méta alignés en bas
- `.cv-row-study-title-year` — variante études (alignement baseline)

### Typo blocs
- `.cv-text-title` / `.cv-text-body` / `.cv-text-meta`
- `.cv-job-description`
- `.cv-study-title` / `.cv-study-meta` / `.cv-study-year`
- `.cv-education-heading` / `.cv-education-primary` / `.cv-education-muted`

### Pastilles
- `.cv-pill` (base) + variante `.cv-pill-skill` ou `.cv-pill-job`
- `.cv-pill-link` ajoute le hover bleu pour les pastilles cliquables

## Primitives React

Disponibles dans `components/primitives/` :

- `<Section title accent="section|jobs|tag|education">` — titre + spacing
- `<MetaRow left right />` — ligne titre / dates ou méta
- `<DateRange start end present />` — affiche `MM/YYYY - MM/YYYY` ou « Présent »
- `<Pill tone="skill|job">` — déjà existant (`components/Pill.tsx`)

## Conventions

- **Pas de `print:*` dans le JSX**. Ces classes ne devraient apparaître nulle
  part en dehors de `globals.css`. Utilise les variables CSS ou
  `data-print="off|on"`.
- **Pas de variantes `*-compact`**. La version courte du CV est obtenue par
  un prop `variant="compact"` sur le layout, pas par une classe CSS dédiée.
- **i18n**: aucun texte en dur dans les composants. Les libellés viennent
  des fichiers `data/cv/locales/{fr,en}.json` (cf. §4 du code review).
