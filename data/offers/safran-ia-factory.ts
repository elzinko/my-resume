import type { JobOffer } from './types';

const offer: JobOffer = {
  id: 'safran-ia-factory',
  company: 'Safran',
  title: {
    fr: 'Développeur Full Stack Expérimenté - IA Factory',
    en: 'Senior Full Stack Developer - IA Factory',
  },
  requirements: [
    {
      label: 'Python / Backend',
      keywords: ['python', 'flask', 'django', 'fastapi'],
    },
    {
      label: 'React / Frontend',
      keywords: ['react', 'angular', 'vue.js', 'vue', 'typescript'],
    },
    {
      label: 'AWS / Cloud',
      keywords: ['aws', 'ec2', 's3', 'aws lambda', 'eks', 'ecs', 'ecr', 'rds', 'gcp', 'azure'],
    },
    {
      label: 'Docker / Kubernetes',
      keywords: ['docker', 'docker-compose', 'kubernetes', 'openshift', 'rancher'],
    },
    {
      label: 'CI/CD / DevOps',
      keywords: ['jenkins', 'gitlab', 'github', 'azure devops', 'sonar', 'nexus'],
    },
    {
      label: 'IA / ML / LLM',
      keywords: ['llm', 'bedrock', 'mcp', 'langchain', 'langgraph', 'sagemaker', 'spark', 'hadoop', 'mapreduce'],
    },
  ],
};

export default offer;
