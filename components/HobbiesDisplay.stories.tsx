import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HobbiesDisplay from './HobbiesDisplay';

const sampleItems = [
  {
    id: '1',
    name: 'Course a pied',
    link: '#',
    description: 'Semi-marathon, trail.',
  },
  { id: '2', name: 'Musique', link: '#', description: 'Guitare, piano.' },
  { id: '3', name: 'Open source', link: '#' },
  {
    id: '4',
    name: 'Voyage',
    link: '#',
    description: 'Asie du Sud-Est, Amerique latine.',
  },
];

const meta: Meta<typeof HobbiesDisplay> = {
  title: 'CV/HobbiesDisplay',
  component: HobbiesDisplay,
  args: { title: 'Loisirs', items: sampleItems },
  decorators: [(Story) => <div className="max-w-[600px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof HobbiesDisplay>;

export const Default: Story = {};

export const WithoutDescriptions: Story = {
  args: {
    items: sampleItems.map(({ description, ...rest }) => rest),
  },
};
