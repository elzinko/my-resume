import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Domain from './Domain';

const sampleDomain = {
  id: 'dev',
  name: 'Fullstack Development',
  description:
    'Architecture hexagonale, DDD, clean code. React, Node.js, TypeScript, Java.',
  competencies: [
    { id: '1', name: 'Clean Code' },
    { id: '2', name: 'DDD' },
    { id: '3', name: 'React' },
    { id: '4', name: 'Node.js' },
    { id: '5', name: 'TypeScript' },
  ],
};

const meta: Meta<typeof Domain> = {
  title: 'CV/Domain',
  component: Domain,
  args: { domain: sampleDomain, showTags: true, compact: false },
  argTypes: {
    showTags: { control: 'boolean' },
    compact: { control: 'boolean' },
    titleAccent: { control: 'select', options: ['underline', 'verticalBar'] },
  },
  decorators: [(Story) => <div className="max-w-[400px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Domain>;

export const Default: Story = {};

export const VerticalBar: Story = {
  args: { titleAccent: 'verticalBar' },
};

export const Underline: Story = {
  args: { titleAccent: 'underline' },
};

export const Compact: Story = {
  args: { compact: true },
};

export const WithoutTags: Story = {
  args: { showTags: false },
};
