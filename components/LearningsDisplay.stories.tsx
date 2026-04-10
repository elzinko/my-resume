import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import LearningsDisplay from './LearningsDisplay';

const sampleItems = [
  { id: '1', name: 'LLM', link: '#', description: 'Agents, RAG, prompt engineering et integration dans des produits SaaS.' },
  { id: '2', name: 'AWS Bedrock', link: '#', description: "Orchestration d'agents IA manages et modeles fondation AWS." },
  { id: '3', name: 'MCP', link: '#', description: "Protocole d'integration d'outils pour modeles de langage." },
  { id: '4', name: 'LangChain', link: '#', description: "Framework d'orchestration de chaines LLM et agents conversationnels." },
  { id: '5', name: 'OpenRAG', link: '#', description: 'Pipeline RAG open source : indexation, recherche vectorielle, generation.' },
  { id: '6', name: 'BMAD', link: '#', description: 'Methodologie de cadrage produit assistee par IA multi-agents.' },
];

const meta: Meta<typeof LearningsDisplay> = {
  title: 'CV/LearningsDisplay',
  component: LearningsDisplay,
  args: { title: 'Apprentissages', items: sampleItems },
  decorators: [(Story) => <div className="max-w-[600px] p-4">{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof LearningsDisplay>;

export const Default: Story = {};

export const WithoutDescriptions: Story = {
  args: {
    items: sampleItems.map(({ description, ...rest }) => rest),
  },
};

export const Narrow: Story = {
  decorators: [(Story) => <div className="max-w-[300px] p-4">{Story()}</div>],
};
