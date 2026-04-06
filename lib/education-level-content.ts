import type { Locale } from '../i18n-config';

/** Bloc « Niveau de formation » : lu depuis `data/cv/{locale}.json` (`educationLevel`). */
export interface EducationLevelContent {
  title: string;
  levelPrimary: string;
  /** Variante courte (< sm) ; sinon `levelPrimary` partout. */
  levelPrimaryShort?: string;
  effectiveLevelDetail: string;
  diploma: string;
  diplomaShort?: string;
  diplomaDetail: string;
  diplomaDetailShort?: string;
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
    levelPrimary:
      "Bac+5 — Master's-level (French higher education)",
    levelPrimaryShort: "Bac+5 — Master's (FR scale)",
    effectiveLevelDetail: 'Backed by 20 years of professional experience',
    diploma: "Bac +3 — Bachelor's-level (French scale)",
    diplomaShort: "Bac +3 — Bachelor's (FR)",
    diplomaDetail:
      'Professional Bachelor (Licence Pro) in Computer Science and Software Systems',
    diplomaDetailShort: 'Professional Bachelor (Licence Pro)',
    additionalTraining: 'Supplementary training',
    trainingThemes: 'Microelectronics / Signal processing / ML / LLM',
  },
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickString(obj: Record<string, unknown>, key: string): string | undefined {
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
    levelPrimaryShort:
      pickString(raw, 'levelPrimaryShort') ?? fb.levelPrimaryShort,
    effectiveLevelDetail:
      pickString(raw, 'effectiveLevelDetail') ?? fb.effectiveLevelDetail,
    diploma: pickString(raw, 'diploma') ?? fb.diploma,
    diplomaShort: pickString(raw, 'diplomaShort') ?? fb.diplomaShort,
    diplomaDetail: pickString(raw, 'diplomaDetail') ?? fb.diplomaDetail,
    diplomaDetailShort:
      pickString(raw, 'diplomaDetailShort') ?? fb.diplomaDetailShort,
    additionalTraining:
      pickString(raw, 'additionalTraining') ?? fb.additionalTraining,
    trainingThemes: pickString(raw, 'trainingThemes') ?? fb.trainingThemes,
  };
}
