import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ExperienceClosingBlock from './ExperienceClosingBlock';

const meta: Meta<typeof ExperienceClosingBlock> = {
  title: 'CV/ExperienceClosingBlock',
  component: ExperienceClosingBlock,
  args: {
    moreExperience: "Et bien d'autres expériences…",
    moreExperienceTail:
      'disponibles dans la version complète du CV sur demande.',
    moreClientsLine: 'Également : BNP Paribas, Orange, SNCF, Decathlon.',
  },
  argTypes: {
    moreClientsLine: { control: 'text' },
  },
  decorators: [(Story) => <div className="max-w-[720px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof ExperienceClosingBlock>;

export const Default: Story = {};
export const WithoutMoreClients: Story = { args: { moreClientsLine: null } };
