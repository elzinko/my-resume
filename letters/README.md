# Lettres de motivation

Lettres Markdown éditables, classées par thème. Chaque fichier est autonome : on peut le copier-coller dans un mail, ou l'exporter en PDF via un outil Markdown (Marked, Typora, pandoc, etc.).

## Enseignement (`teaching/`)

| Fichier                                                            | Cible                                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [`teaching/iut-fontainebleau.md`](teaching/iut-fontainebleau.md)   | Lettre principale — IUT de Fontainebleau, vacations + perspective permanent + proposition de module Product Builder |
| [`teaching/lycee-mathematiques.md`](teaching/lycee-mathematiques.md) | Enseignement des mathématiques en lycée                                                                |
| [`teaching/college-techno-informatique.md`](teaching/college-techno-informatique.md) | Enseignement de la technologie / informatique en collège                                               |

### Placeholders à compléter avant envoi

Chaque lettre contient des champs entre crochets — `[NOM DU LYCÉE]`, `[DATE]`, `[ADRESSE]`, etc. Ouvrir le fichier, faire un `Cmd+F` sur `[` pour les repérer rapidement et les remplir manuellement.

### CV joint

Les lettres pointent vers l'URL CV enseignement :

```
https://elzinko.fr/fr?mode=teaching&edu=1
```

Pour générer le PDF du CV : ouvrir l'URL, faire `Cmd+P` puis « Enregistrer au format PDF ». La pastille « Bac+5 » s'affiche grâce à `&edu=1`.

Pour personnaliser le sous-titre (rôle affiché sous le nom) — utile selon le poste visé — ajouter `&subtitle_fr=...` à l'URL, par exemple :

```
?mode=teaching&edu=1&subtitle_fr=Enseignant%20vacataire%20%E2%80%94%20IUT%20%2F%20secondaire
?mode=teaching&edu=1&subtitle_fr=Professeur%20de%20math%C3%A9matiques
?mode=teaching&edu=1&subtitle_fr=Professeur%20de%20technologie
```
