import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Pill from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'CV/Pill',
  component: Pill,
  args: { children: 'react', compact: false },
  argTypes: {
    color: {
      control: 'select',
      options: [
        'fuchsia',
        'orange',
        'skill',
        'jobs',
        'domain',
        'education',
        'match',
      ],
    },
    size: { control: 'select', options: ['s', 'm', 'l'] },
    compact: { control: 'boolean' },
    border: { control: 'boolean' },
    metric: { control: 'text' },
  },
  decorators: [
    (Story) => <div className="flex flex-wrap gap-2 p-4">{Story()}</div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Skill: Story = {
  args: { color: 'skill', children: 'TypeScript' },
};
export const Jobs: Story = { args: { color: 'jobs', children: 'react' } };
export const Domain: Story = {
  args: { color: 'domain', children: 'clean code' },
};
export const Education: Story = {
  args: { color: 'education', children: 'Bac+5 (Master)' },
};
export const Match: Story = { args: { color: 'match', children: 'React' } };
export const MatchWithMetric: Story = {
  args: { color: 'match', children: 'React', metric: '4 ans' },
};
export const MatchClientBadge: Story = {
  args: { color: 'match', children: 'BlaBlaCar', size: 's', border: false },
};
export const Fuchsia: Story = {
  args: { color: 'fuchsia', children: 'fuchsia' },
};
export const Orange: Story = { args: { color: 'orange', children: 'orange' } };
