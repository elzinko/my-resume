import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Project from './Project';

const sampleProject = {
  id: 'my-resume',
  title: 'My Resume',
  client: 'Open Source',
  location: 'GitHub',
  description: 'CV personnel en Next.js + Tailwind CSS avec matching IA.',
  link: 'https://github.com/elzinko/my-resume',
  startDate: '2023-01-01',
  endDate: '2026-01-01',
};

const meta: Meta<typeof Project> = {
  title: 'CV/Project',
  component: Project,
  args: { project: sampleProject },
  argTypes: {
    compact: { control: 'boolean' },
    hideDatesPrint: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="max-w-[600px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Project>;

export const Default: Story = {};

export const Compact: Story = {
  args: { compact: true },
};

export const WithoutLink: Story = {
  args: {
    project: { ...sampleProject, link: '' },
  },
};

export const WithoutDescription: Story = {
  args: {
    project: { ...sampleProject, description: '' },
  },
};
