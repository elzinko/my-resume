import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import JobFrameworkPills from './JobFrameworkPills';

const sampleFrameworks = [
  { id: '1', name: 'React' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'Node.js' },
  { id: '4', name: 'Docker' },
  { id: '5', name: 'PostgreSQL' },
  { id: '6', name: 'AWS' },
  { id: '7', name: 'Kubernetes' },
  { id: '8', name: 'GraphQL' },
  { id: '9', name: 'Redis' },
  { id: '10', name: 'MongoDB' },
  { id: '11', name: 'Jenkins' },
  { id: '12', name: 'Terraform' },
];

const meta: Meta<typeof JobFrameworkPills> = {
  title: 'CV/JobFrameworkPills',
  component: JobFrameworkPills,
  args: {
    frameworks: sampleFrameworks,
    compact: false,
    expandAriaLabel: 'Voir toutes les technologies',
    collapseAriaLabel: 'Reduire',
  },
  argTypes: { compact: { control: 'boolean' } },
  decorators: [(Story) => <div className="max-w-[500px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof JobFrameworkPills>;

export const Default: Story = {};

export const Compact: Story = {
  args: { compact: true },
};

export const FewPills: Story = {
  args: { frameworks: sampleFrameworks.slice(0, 3) },
};

export const Narrow: Story = {
  decorators: [(Story) => <div className="max-w-[250px] p-4">{Story()}</div>],
};
