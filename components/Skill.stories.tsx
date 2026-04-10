import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Skill from './skill';

const meta: Meta<typeof Skill> = {
  title: 'CV/Skill',
  component: Skill,
  args: {
    skill: { id: '1', name: 'TypeScript', link: 'https://typescriptlang.org' },
    compact: false,
  },
  argTypes: { compact: { control: 'boolean' } },
  decorators: [(Story) => <div className="flex flex-wrap gap-2 p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Skill>;

export const WithLink: Story = {};

export const WithoutLink: Story = {
  args: { skill: { id: '2', name: 'Docker' } },
};

export const Compact: Story = {
  args: { compact: true },
};

export const MultipleSkills: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Skill skill={{ id: '1', name: 'TypeScript', link: '#' }} />
      <Skill skill={{ id: '2', name: 'React' }} />
      <Skill skill={{ id: '3', name: 'Node.js', link: '#' }} />
      <Skill skill={{ id: '4', name: 'Docker' }} />
      <Skill skill={{ id: '5', name: 'Kubernetes' }} />
    </div>
  ),
};
