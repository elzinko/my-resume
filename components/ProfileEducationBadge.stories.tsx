import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ProfileEducationBadge from './ProfileEducationBadge';

const meta: Meta<typeof ProfileEducationBadge> = {
  title: 'CV/ProfileEducationBadge',
  component: ProfileEducationBadge,
  args: {
    label: 'Équivalent Bac+5',
  },
  decorators: [
    (Story) => <div className="p-4">{Story()}</div>,
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileEducationBadge>;

export const Default: Story = {};
export const LongLabel: Story = {
  args: { label: 'Équivalent Bac+5 · 20 ans d’expérience' },
};
