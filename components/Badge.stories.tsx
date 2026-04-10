import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'CV/Badge',
  component: Badge,
  args: { children: 'Badge', color: 'orange', compact: false },
  argTypes: {
    color: { control: 'select', options: ['orange', 'teal'] },
    compact: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Orange: Story = { args: { color: 'orange', children: '15 ans' } };
export const Teal: Story = { args: { color: 'teal', children: 'DevOps' } };
export const Compact: Story = { args: { color: 'orange', children: '15 ans', compact: true } };
