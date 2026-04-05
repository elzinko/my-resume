export const educationLevel = {
  fr: {
    title: 'Niveau de formation',
    diploma: 'Bac +3',
    diplomaDetail: 'Licence Pro Systèmes Informatiques et Logiciels',
    additionalTraining: 'Formations complémentaires',
    /** Thèmes sur une ligne, séparés par « / » (affichage gris sous le titre). */
    trainingThemes: 'Microélectronique / Traitement du signal / ML / LLM',
    effectiveLevel: 'Niveau effectif Bac+5',
    effectiveLevelDetail: "Valorisé par 20 ans d'expérience professionnelle",
  },
  en: {
    title: 'Education Level',
    diploma: "Bachelor's degree (Bac+3)",
    diplomaDetail:
      'Professional Bachelor in Computer Science and Software Systems',
    additionalTraining: 'Continuing education',
    trainingThemes: 'Microelectronics / Signal processing / ML / LLM',
    effectiveLevel: "Effective level: Master's equivalent (Bac+5)",
    effectiveLevelDetail: 'Backed by 20 years of professional experience',
  },
} as const;

export type EducationLevelLang = keyof typeof educationLevel;
