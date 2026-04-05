import type { JobOffer } from './types';

const offer: JobOffer = {
  id: 'safran-java-fullstack',
  company: 'Safran',
  title: {
    fr: 'Chef de Projet Java Full Stack',
    en: 'Java Full Stack Project Manager',
  },
  requirements: [
    {
      label: 'Java EE / JSF',
      keywords: ['java', 'jee', 'j2ee', 'jsf', 'primefaces', 'java ee', 'spring'],
    },
    {
      label: 'SQL (PostgreSQL, MariaDB)',
      keywords: ['sql', 'postgresql', 'mariadb', 'sqlserver', 'mysql', 'oracle', 'postgres'],
    },
    {
      label: 'Node.JS / JavaScript',
      keywords: ['node', 'nodejs', 'node.js', 'javascript', 'typescript'],
    },
    {
      label: 'Docker / WildFly',
      keywords: ['docker', 'docker-compose', 'wildfly', 'jboss', 'tomcat'],
    },
    {
      label: 'Git / GitLab / Sonar',
      keywords: ['git', 'gitlab', 'github', 'sonar', 'sonarqube'],
    },
    {
      label: 'MongoDB / NoSQL',
      keywords: ['mongodb', 'mongo', 'cassandra', 'hbase'],
    },
  ],
};

export default offer;
