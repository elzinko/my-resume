import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StudyDisplay from './StudyDisplay';

const sampleStudy = {
  id: 'ing',
  name: 'Diplôme d’ingénieur en informatique',
  establishment: 'ESIEA',
  location: 'Paris',
  startDate: '2008-09-01',
  endDate: '2013-06-30',
};

const meta: Meta<typeof StudyDisplay> = {
  title: 'CV/StudyDisplay',
  component: StudyDisplay,
  args: {
    study: sampleStudy,
    color: 'text-cv-section',
    compact: false,
    condensed: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: [
        'text-cv-section',
        'text-slate-900',
        'text-white',
        'text-red-500',
        'text-amber-400',
      ],
      description: 'Classe Tailwind appliquée au titre + année.',
    },
    compact: { control: 'boolean' },
    condensed: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="max-w-[420px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof StudyDisplay>;

export const Default: Story = {};

export const Condensed: Story = {
  args: { condensed: true },
};

export const Compact: Story = {
  args: { compact: true },
  decorators: [
    (Story) => <ul className="m-0 max-w-[420px] list-none p-0">{Story()}</ul>,
  ],
};

export const BlackColor: Story = {
  args: { color: 'text-slate-900' },
  parameters: { backgrounds: { default: 'white' } },
};
