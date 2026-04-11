import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HeaderDesktopContactStrip from './HeaderDesktopContactStrip';

const meta: Meta<typeof HeaderDesktopContactStrip> = {
  title: 'CV/HeaderDesktopContactStrip',
  component: HeaderDesktopContactStrip,
  args: {
    email: 'thomas.couderc@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    locale: 'fr',
  },
  argTypes: {
    locale: { control: 'select', options: ['fr', 'en'] },
  },
  decorators: [(Story) => <div className="max-w-[600px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof HeaderDesktopContactStrip>;

export const Default: Story = {};

export const EmailOnly: Story = { args: { phone: '', location: '' } };

export const NoEmail: Story = { args: { email: '' } };
