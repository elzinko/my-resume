import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import JobDisplay from './JobDisplay';

const sampleJob = {
  id: 'acme',
  client: 'ACME Corp',
  role: { name: 'Tech Lead Fullstack' },
  location: 'Paris',
  startDate: '2022-01-01',
  endDate: '2024-06-30',
  descriptionShort: 'Modernisation d’une plateforme e-commerce à fort trafic.',
  description:
    'Refonte progressive du monolithe vers une architecture micro-frontends, migration CI/CD vers GitHub Actions, mise en place observabilité (OpenTelemetry + Grafana).',
  bullets: [
    { id: 'b1', text: 'Lead d’une squad de 5 développeurs (agile SAFe).' },
    { id: 'b2', text: 'Réduction de 40 % du TTFB grâce au SSR + cache.' },
    { id: 'b3', text: 'Mise en place des pipelines de tests e2e (Playwright).' },
  ],
  frameworks: [
    { id: 'react', name: 'React' },
    { id: 'next', name: 'Next.js' },
    { id: 'node', name: 'Node.js' },
    { id: 'ts', name: 'TypeScript' },
    { id: 'gha', name: 'GitHub Actions' },
  ],
};

const meta: Meta<typeof JobDisplay> = {
  title: 'CV/JobDisplay',
  component: JobDisplay,
  args: {
    job: sampleJob,
    compact: false,
    presentLabel: 'Présent',
    locale: 'fr',
  },
  argTypes: {
    compact: { control: 'boolean' },
    locale: { control: 'select', options: ['fr', 'en'] },
    presentLabel: { control: 'text' },
  },
  decorators: [
    (Story) => <div className="max-w-[720px] p-4">{Story()}</div>,
  ],
};

export default meta;
type Story = StoryObj<typeof JobDisplay>;

export const Default: Story = {};

export const Compact: Story = { args: { compact: true } };

export const OngoingMission: Story = {
  args: { job: { ...sampleJob, endDate: undefined } },
};

export const English: Story = {
  args: { locale: 'en', presentLabel: 'Now' },
};
