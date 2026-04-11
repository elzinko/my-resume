import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HeaderContent from './HeaderContent';

const meta: Meta<typeof HeaderContent> = {
  title: 'CV/HeaderContent',
  component: HeaderContent,
  args: {
    name: 'Thomas Couderc',
    role: 'Développeur fullstack / DevOps',
    compactPrint: false,
  },
  argTypes: {
    compactPrint: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="max-w-[800px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof HeaderContent>;

export const Default: Story = {};

export const WithBelowRole: Story = {
  args: {
    belowRole: (
      <div className="mt-2 text-right text-sm text-pink-200">
        thomas@example.com · +33 6 12 34 56 78 · Paris
      </div>
    ),
  },
};
