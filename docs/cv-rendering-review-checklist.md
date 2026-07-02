# Checklist de revue — modif du rendu CV

À dérouler pour **toute PR** qui touche le rendu du CV (styles, mise en page,
composants de section, `globals.css`, régimes print/aperçu). But : ne plus
**redécouvrir en prod** un écart web ↔ impression. Voir l'[ADR 0001](adr/0001-cv-rendering-regimes.md)
et [`CLAUDE.md`](../CLAUDE.md).

## 1. Les 4 rendus + mobile (obligatoire)

Lancer le dev server, puis vérifier **chaque** rendu (Playwright ou navigateur) :

- [ ] **Complet web** — `/[lang]` (desktop ~1280px)
- [ ] **Complet aperçu/PDF** — `/[lang]?print=1` (doit être identique au PDF `Cmd+P`)
- [ ] **Court web** — `/[lang]/short` (desktop)
- [ ] **Court aperçu/PDF** — `/[lang]/short?print=1`
- [ ] **Mobile** — complet ET court à ~390–412px (Pixel) : lisible, 1 colonne, pas de
      débordement horizontal, **pas** de rendu A4 réduit sur le court

> Astuce : comparer aux captures de référence dans `renders/` (avant/après).

## 2. Cohérence des régimes (la source de dérive)

- [ ] La modif est **répercutée dans les 3 régimes** (web / `.cv-print-preview` /
      `@media print`), pas seulement celui que je regardais.
- [ ] Toute règle d'impression ajoutée existe pour **`@media print` ET
      `.cv-print-preview`** — idéalement via un **sélecteur combiné** plutôt que 2 copies.
- [ ] Aucune règle `.cv-print-preview .cv-short-page` n'impose de taille A4 **sans**
      garde-fou `@media (min-width: 768px)` (sinon le court casse sur mobile).
- [ ] Espacements via `--cv-section-gap` / `--cv-section-body-gap` (pas de marge par
      section codée en dur).

## 3. Non-régression

- [ ] CV court : tient toujours sur **1 page A4** à l'impression (pas de 2e page).
- [ ] CV complet : pagination inchangée (nb de pages), pas de titre orphelin.
- [ ] Paramètres d'URL toujours respectés (`?print`, `?photo`, `?age`, `?ats`,
      `?entriesLayout`, offre…).
- [ ] Couleurs de section / pastilles préservées en print (`print:!text-*`).

## 4. Qualité

- [ ] `npm test` (prettier + lint) OK ; `npx tsc --noEmit` OK.
- [ ] Message de commit : Conventional Commit FR, décrivant l'impact **par régime**.

---

### Pour un reviewer (humain ou agent `ezk-reviewer`)

Question systématique : « cette modif a-t-elle été **vue et validée dans les 4
rendus** ? » Si la description de PR ne montre qu'un régime → demander les captures
manquantes avant d'approuver.
