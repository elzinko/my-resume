import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EducationLevel from './EducationLevel';

const sampleContent = {
  title: 'Niveau de formation',
  levelPrimary: 'Bac+5',
  effectiveLevelDetail: "Valorisé par 20 ans d'expérience professionnelle",
  diploma: 'Bac +3',
  diplomaDetail: 'Licence Informatique',
  additionalTraining: 'Formations complémentaires',
  trainingThemes: 'Cloud · DevOps · Agilité',
};

const meta: Meta<typeof EducationLevel> = {
  title: 'CV/EducationLevel',
  component: EducationLevel,
  args: {
    content: sampleContent,
    pillsCompact: true,
  },
  argTypes: {
    pillsCompact: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[320px] border border-dashed border-slate-300 p-3">
        {Story()}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EducationLevel>;

export const NarrowCompact: Story = {};
export const NarrowDefaultPills: Story = { args: { pillsCompact: false } };
