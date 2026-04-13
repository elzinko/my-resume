import type { EducationLevelContent } from '@/lib/education-level-content';

export type EducationLevelRowPrimaryRole = 'heading' | 'primary';

export interface EducationLevelRow {
  id: string;
  primaryRole: EducationLevelRowPrimaryRole;
  primary: string;
  secondary?: string;
  /** Libellé principal via `Pill` éducation (`.cv-pill-education`). */
  pillLevelLabel: boolean;
}

export function buildEducationLevelRows(
  t: EducationLevelContent,
): EducationLevelRow[] {
  return [
    {
      id: 'level',
      primaryRole: 'heading',
      primary: t.levelPrimary,
      secondary: t.effectiveLevelDetail,
      pillLevelLabel: true,
    },
    {
      id: 'diploma',
      primaryRole: 'primary',
      primary: t.diploma,
      secondary: t.diplomaDetail,
      pillLevelLabel: true,
    },
    {
      id: 'additional',
      primaryRole: 'primary',
      primary: t.additionalTraining,
      secondary: t.trainingThemes,
      pillLevelLabel: true,
    },
  ];
}
