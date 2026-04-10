import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import JobExperienceBody from './JobExperienceBody';

const meta: Meta<typeof JobExperienceBody> = {
  title: 'CV/JobExperienceBody',
  component: JobExperienceBody,
  args: {
    description: "Conception et developpement d'une plateforme SaaS de gestion de contenu avec architecture microservices.",
    descriptionShort: 'Plateforme SaaS de gestion de contenu.',
    bullets: [
      { id: '1', text: 'Architecture microservices avec Docker et Kubernetes' },
      { id: '2', text: "Pipeline CI/CD avec GitLab et deploiement continu" },
      { id: '3', text: 'API REST et GraphQL pour les clients mobiles et web' },
    ],
    locale: 'fr',
    compact: false,
  },
  argTypes: {
    locale: { control: 'select', options: ['fr', 'en'] },
    compact: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="max-w-[600px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof JobExperienceBody>;

export const Default: Story = {};

export const Compact: Story = {
  args: { compact: true },
};

export const WithoutShortDescription: Story = {
  args: { descriptionShort: null },
};

export const WithoutBullets: Story = {
  args: { bullets: [] },
};

export const English: Story = {
  args: {
    locale: 'en',
    description: 'Design and development of a SaaS content management platform with microservices architecture.',
    descriptionShort: 'SaaS content management platform.',
    bullets: [
      { id: '1', text: 'Microservices architecture with Docker and Kubernetes' },
      { id: '2', text: 'CI/CD pipeline with GitLab and continuous deployment' },
    ],
  },
};
