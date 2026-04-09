import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HeaderToolbar from './HeaderToolbar';

const meta: Meta<typeof HeaderToolbar> = {
  title: 'CV/HeaderToolbar',
  component: HeaderToolbar,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/fr', query: {} },
    },
  },
  decorators: [
    (Story) => <div className="max-w-[960px] p-4">{Story()}</div>,
  ],
};

export default meta;
type Story = StoryObj<typeof HeaderToolbar>;

export const Default: Story = {};

export const ShortCvMode: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/fr/short', query: {} },
    },
  },
};

export const English: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/en', query: {} },
    },
  },
};
