import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Pill from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'CV/Pill',
  component: Pill,
  args: { children: 'react', compact: false },
  argTypes: {
    color: {
      control: 'select',
      options: [
        'fuchsia',
        'orange',
        'skill',
        'jobs',
        'domain',
        'education',
        'match',
      ],
    },
    size: { control: 'select', options: ['s', 'm', 'l'] },
    compact: { control: 'boolean' },
    border: { control: 'boolean' },
    metric: { control: 'text' },
  },
  decorators: [
    (Story) => <div className="flex flex-wrap gap-2 p-4">{Story()}</div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Skill: Story = {
  args: { color: 'skill', children: 'TypeScript' },
};
export const Jobs: Story = { args: { color: 'jobs', children: 'react' } };
export const Domain: Story = {
  args: { color: 'domain', children: 'clean code' },
};
export const Education: Story = {
  args: { color: 'education', children: 'Bac+5 (Master)' },
};
export const Match: Story = { args: { color: 'match', children: 'React' } };
export const MatchWithMetric: Story = {
  args: { color: 'match', children: 'React', metric: '4 ans' },
};
export const MatchClientBadge: Story = {
  args: { color: 'match', children: 'BlaBlaCar', size: 's', border: false },
};
export const Fuchsia: Story = {
  args: { color: 'fuchsia', children: 'fuchsia' },
};
export const Orange: Story = { args: { color: 'orange', children: 'orange' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Pill color="skill">TypeScript</Pill>
      <Pill color="jobs">react</Pill>
      <Pill color="domain">clean code</Pill>
      <Pill color="education">Bac+5 (Master)</Pill>
      <Pill color="match">React</Pill>
      <Pill color="match" metric="4 ans">
        React
      </Pill>
      <Pill color="match" size="s" border={false}>
        BlaBlaCar
      </Pill>
      <Pill color="fuchsia">fuchsia</Pill>
      <Pill color="orange">orange</Pill>
    </div>
  ),
};

export const MatchVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <Pill color="match" metric="10 ans">
          Java
        </Pill>
        <Pill color="match" size="s" border={false}>
          BlaBlaCar
        </Pill>
        <Pill color="match" size="s" border={false}>
          SNCF
        </Pill>
        <Pill color="match" size="s" border={false}>
          Ecocea
        </Pill>
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <Pill color="match" compact metric="4 ans">
          React
        </Pill>
        <Pill color="match" compact metric="2 ans">
          Node.js
        </Pill>
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <Pill color="match" size="l" metric="10 ans">
          Java
        </Pill>
      </div>
    </div>
  ),
};

export const CompactAll: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill color="skill" compact>
        TypeScript
      </Pill>
      <Pill color="jobs" compact>
        react
      </Pill>
      <Pill color="domain" compact>
        clean code
      </Pill>
      <Pill color="education" compact>
        Bac+5
      </Pill>
      <Pill color="match" compact metric="4 ans">
        React
      </Pill>
    </div>
  ),
};
