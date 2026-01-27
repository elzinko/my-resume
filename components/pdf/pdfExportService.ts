import { PdfCvData } from './PdfCvLayout';

/**
 * Extract CV data from the current page DOM
 */
export function extractCvDataFromPage(): PdfCvData {
  // Extract header info
  const nameEl = document.querySelector('h1');
  const roleEl = document.querySelector('header p');

  // Extract contact info
  const phoneLink = document.querySelector('a[href^="tel:"]');
  const emailLink = document.querySelector('a[href^="mailto:"]');
  const locationEl = document.querySelector('#contact ul li:last-child span');

  // Extract about text
  const aboutSection = document.querySelector('#about p');

  // Extract skills
  const skillsSection = document.querySelector('#skills');
  const skillLinks = skillsSection?.querySelectorAll('a') || [];
  const skills: Array<{ name: string }> = [];
  skillLinks.forEach((link) => {
    if (link.textContent) {
      skills.push({ name: link.textContent.trim() });
    }
  });

  // Extract domains (Agile, Dev, Ops sections)
  const domains: PdfCvData['domains'] = [];
  const domainSections = document.querySelectorAll(
    'section:has(h2):not(#about):not(#contact):not(#skills):not(#jobs):not(#studies):not(#learnings):not(#hobbies):not(#projects)'
  );

  // Try to get Agile, Dev, Ops sections specifically
  const mainContent = document.querySelector('main');
  if (mainContent) {
    const allH2s = mainContent.querySelectorAll('h2');
    allH2s.forEach((h2) => {
      const title = h2.textContent?.trim() || '';
      if (['Agile', 'Dev', 'Ops'].includes(title)) {
        const parent = h2.parentElement;
        const description =
          parent?.querySelector('p:not(:last-child)')?.textContent?.trim() ||
          '';
        const tagsContainer = parent?.querySelector('p:last-child');
        const tags: string[] = [];
        tagsContainer?.querySelectorAll('span').forEach((span) => {
          if (span.textContent) {
            tags.push(span.textContent.trim());
          }
        });
        domains.push({ title, description, tags });
      }
    });
  }

  // Extract jobs
  const jobsSection = document.querySelector('#jobs');
  const jobItems = jobsSection?.querySelectorAll('ul > li') || [];
  const jobs: PdfCvData['jobs'] = [];

  jobItems.forEach((item) => {
    const clientEl = item.querySelector('div > div > span:first-child');
    const dateEl = item.querySelector('div > div > span:last-child');
    const roleEl = item.querySelector('p span:first-child');
    const locationEl = item.querySelector('p span:last-child');
    const descEl = item.querySelectorAll('p')[1];
    const frameworksContainer = item.querySelector('p:last-child');
    const frameworks: string[] = [];

    frameworksContainer?.querySelectorAll('span').forEach((span) => {
      if (span.textContent) {
        frameworks.push(span.textContent.trim());
      }
    });

    const dateText = dateEl?.textContent?.trim() || '';
    const [startDate, endDate] = dateText.includes(' - ')
      ? dateText.split(' - ')
      : [dateText, undefined];

    jobs.push({
      client: clientEl?.textContent?.trim() || '',
      role: roleEl?.textContent?.trim() || '',
      location: locationEl?.textContent?.trim() || '',
      startDate,
      endDate,
      description: descEl?.textContent?.trim() || '',
      frameworks,
    });
  });

  // Extract studies
  const studiesSection = document.querySelector('#studies');
  const studyItems = studiesSection?.querySelectorAll('ul > li') || [];
  const studies: PdfCvData['studies'] = [];

  studyItems.forEach((item) => {
    const nameEl = item.querySelector('strong');
    const establishmentEl = item.querySelector('p:last-child span');
    studies.push({
      name: nameEl?.textContent?.trim() || '',
      establishment: establishmentEl?.textContent?.trim() || '',
    });
  });

  return {
    header: {
      name: nameEl?.textContent?.trim() || 'Thomas Couderc',
      role: roleEl?.textContent?.trim() || 'Développeur Fullstack',
    },
    contact: {
      phone: phoneLink?.textContent?.trim() || '',
      email: emailLink?.textContent?.trim() || '',
      location: locationEl?.textContent?.trim() || '',
    },
    about: aboutSection?.textContent?.trim() || '',
    skills,
    domains,
    jobs,
    studies,
  };
}

/**
 * Get current language from URL
 */
export function getCurrentLang(): 'fr' | 'en' {
  const path = window.location.pathname;
  return path.includes('/en') ? 'en' : 'fr';
}
