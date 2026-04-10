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
      options: ['fuchsia', 'orange', 'skill', 'jobs', 'domain', 'education'],
    },
    compact: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="flex flex-wrap gap-2 p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Skill: Story = { args: { color: 'skill', children: 'TypeScript' } };
export const Jobs: Story = { args: { color: 'jobs', children: 'react' } };
export const Domain: Story = { args: { color: 'domain', children: 'clean code' } };
export const Education: Story = { args: { color: 'education', children: 'Bac+5 (Master)' } };
export const Fuchsia: Story = { args: { color: 'fuchsia', children: 'fuchsia' } };
export const Orange: Story = { args: { color: 'orange', children: 'orange' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Pill color="skill">TypeScript</Pill>
      <Pill color="jobs">react</Pill>
      <Pill color="domain">clean code</Pill>
      <Pill color="education">Bac+5 (Master)</Pill>
      <Pill color="fuchsia">fuchsia</Pill>
      <Pill color="orange">orange</Pill>
    </div>
  ),
};

export const CompactAll: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill color="skill" compact>TypeScript</Pill>
      <Pill color="jobs" compact>react</Pill>
      <Pill color="domain" compact>clean code</Pill>
      <Pill color="education" compact>Bac+5</Pill>
    </div>
  ),
};
