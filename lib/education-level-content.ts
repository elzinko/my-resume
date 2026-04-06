import type { Locale } from '../i18n-config';

/** Bloc « Niveau de formation » : lu depuis `data/cv/{locale}.json` (`educationLevel`). */
export interface EducationLevelContent {
  title: string;
  levelPrimary: string;
  effectiveLevelDetail: string;
  diploma: string;
  diplomaDetail: string;
  additionalTraining: string;
  trainingThemes: string;
}

const FALLBACK: Record<Locale, EducationLevelContent> = {
  fr: {
    title: 'Niveau de formation',
    levelPrimary: 'Bac+5',
    effectiveLevelDetail: "Valorisé par 20 ans d'expérience professionnelle",
    diploma: 'Bac +3',
    diplomaDetail: 'Licence Pro Systèmes Informatiques et Logiciels',
    additionalTraining: 'Formations complémentaires',
    trainingThemes: 'Microélectronique / Traitement du signal / ML / LLM',
  },
  en: {
    title: 'Education Level',
    levelPrimary: 'Bac+5',
    effectiveLevelDetail: 'Backed by 20 years of professional experience',
    diploma: "Bachelor's degree (Bac+3)",
    diplomaDetail:
      'Professional Bachelor in Computer Science and Software Systems',
    additionalTraining: 'Continuing education',
    trainingThemes: 'Microelectronics / Signal processing / ML / LLM',
  },
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickString(
  obj: Record<string, unknown>,
  key: string,
): string | undefined {
  const v = obj[key];
  return typeof v === 'string' && v.trim() !== '' ? v : undefined;
}

/**
 * Extrait le bloc depuis le snapshot CV ; repli sur les textes par défaut si absent ou incomplet.
 */
export function getEducationLevelContent(
  snapshot: Record<string, unknown>,
  locale: Locale,
): EducationLevelContent {
  const raw = snapshot.educationLevel;
  if (!isRecord(raw)) {
    return FALLBACK[locale];
  }
  const fb = FALLBACK[locale];
  return {
    title: pickString(raw, 'title') ?? fb.title,
    levelPrimary: pickString(raw, 'levelPrimary') ?? fb.levelPrimary,
    effectiveLevelDetail:
      pickString(raw, 'effectiveLevelDetail') ?? fb.effectiveLevelDetail,
    diploma: pickString(raw, 'diploma') ?? fb.diploma,
    diplomaDetail: pickString(raw, 'diplomaDetail') ?? fb.diplomaDetail,
    additionalTraining:
      pickString(raw, 'additionalTraining') ?? fb.additionalTraining,
    trainingThemes: pickString(raw, 'trainingThemes') ?? fb.trainingThemes,
  };
}
