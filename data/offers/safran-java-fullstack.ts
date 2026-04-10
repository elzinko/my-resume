import type { JobOffer } from './types';

const offer: JobOffer = {
  id: 'safran-java-fullstack',
  company: 'Safran',
  title: {
    fr: 'Chef de Projet Java Full Stack',
    en: 'Java Full Stack Project Manager',
  },
  contract: 'cdi',
  requirements: [
    {
      label: 'Java EE / JSF',
      shortLabel: 'Java / EE',
      keywords: [
        'java',
        'jee',
        'j2ee',
        'jsf',
        'primefaces',
        'java ee',
        'spring',
      ],
    },
    {
      label: 'SQL (PostgreSQL, MariaDB)',
      shortLabel: 'SQL',
      keywords: [
        'sql',
        'postgresql',
        'mariadb',
        'sqlserver',
        'mysql',
        'oracle',
        'postgres',
      ],
    },
    {
      label: 'Node.JS / JavaScript',
      shortLabel: 'Node / JavaScript',
      keywords: ['node', 'nodejs', 'node.js', 'javascript', 'typescript'],
    },
    {
      label: 'Docker',
      keywords: ['docker', 'docker-compose'],
    },
    {
      label: 'WildFly / JBoss',
      shortLabel: 'WildFly / JBoss',
      keywords: ['wildfly', 'jboss', 'undertow', 'tomcat'],
    },
    {
      label: 'Git / GitLab / Sonar',
      shortLabel: 'Git / qualité',
      keywords: ['git', 'gitlab', 'github', 'sonar', 'sonarqube'],
    },
    {
      label: 'MongoDB / NoSQL',
      shortLabel: 'MongoDB / NoSQL',
      keywords: ['mongodb', 'mongo', 'cassandra', 'hbase'],
    },
  ],
};

export default offer;
