import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ContactDisplay from './ContactDisplay';

const sampleContact = {
  title: 'Contact',
  emailTitle: 'Email',
  email: 'thomas.couderc@example.com',
  phoneTitle: 'Tél.',
  phone: '+33 6 12 34 56 78',
  locationTitle: 'Lieu',
  location: 'Paris, France',
};

const meta: Meta<typeof ContactDisplay> = {
  title: 'CV/ContactDisplay',
  component: ContactDisplay,
  args: {
    contact: sampleContact,
    locale: 'fr',
    compact: false,
    cvShortInlineRows: false,
  },
  argTypes: {
    locale: { control: 'select', options: ['fr', 'en'] },
    compact: { control: 'boolean' },
    cvShortInlineRows: { control: 'boolean' },
  },
  decorators: [
    (Story) => <div className="max-w-[480px] p-4">{Story()}</div>,
  ],
};

export default meta;
type Story = StoryObj<typeof ContactDisplay>;

export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
export const CvShortInlineRows: Story = { args: { cvShortInlineRows: true } };
