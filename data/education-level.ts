export const educationLevel = {
  fr: {
    title: 'Niveau de formation',
    diploma: 'Licence Pro Systèmes Informatiques et Logiciels (Bac+3)',
    diplomaDetail: 'IUT Fontainebleau',
    additionalTraining: 'Formations complémentaires au CNAM Paris',
    effectiveLevel: 'Niveau effectif Bac+5',
    effectiveLevelDetail: 'Valorisé par 20 ans d\'expérience professionnelle',
  },
  en: {
    title: 'Education Level',
    diploma: 'BSc in Computer Science (Bac+3)',
    diplomaDetail: 'IUT Fontainebleau',
    additionalTraining: 'Additional training at CNAM Paris',
    effectiveLevel: 'Effective level: Master\'s equivalent (Bac+5)',
    effectiveLevelDetail: 'Backed by 20 years of professional experience',
  },
} as const;

export type EducationLevelLang = keyof typeof educationLevel;
