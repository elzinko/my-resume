import { PdfCvData } from './PdfCvLayout';

/**
 * Extract CV data from the current page DOM
 */
export function extractCvDataFromPage(): PdfCvData {
  // Extract header info
  const nameEl = document.querySelector('h1');
  const roleEl = nameEl?.nextElementSibling;

  // Extract contact info - look in #contact section
  const contactSection = document.querySelector('#contact');
  const phoneLink = contactSection?.querySelector('a[href^="tel:"]');
  const emailLink = contactSection?.querySelector('a[href^="mailto:"]');
  const contactItems = contactSection?.querySelectorAll('li');
  let locationText = 'Paris, France';
  contactItems?.forEach((li) => {
    const strong = li.querySelector('strong');
    if (strong?.textContent?.toLowerCase().includes('emplacement') || 
        strong?.textContent?.toLowerCase().includes('location')) {
      const span = li.querySelector('span');
      locationText = span?.textContent?.trim() || locationText;
    }
  });

  // Extract about text
  const aboutSection = document.querySelector('#about');
  const aboutText = aboutSection?.querySelector('p')?.textContent?.trim() || '';

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
  const mainContent = document.querySelector('main');
  if (mainContent) {
    const allH2s = mainContent.querySelectorAll('h2');
    allH2s.forEach((h2) => {
      const title = h2.textContent?.trim() || '';
      if (['Agile', 'Dev', 'Ops'].includes(title)) {
        const parent = h2.parentElement;
        const paragraphs = parent?.querySelectorAll('p') || [];
        const description = paragraphs[0]?.textContent?.trim() || '';
        const tags: string[] = [];
        const lastP = paragraphs[paragraphs.length - 1];
        lastP?.querySelectorAll('span').forEach((span) => {
          if (span.textContent) {
            tags.push(span.textContent.trim());
          }
        });
        domains.push({ title, description, tags });
      }
    });
  }

  // Extract jobs - updated selectors to match job.tsx structure
  const jobsSection = document.querySelector('#jobs');
  const jobItems = jobsSection?.querySelectorAll('ul > li') || [];
  const jobs: PdfCvData['jobs'] = [];

  jobItems.forEach((item) => {
    const jobDiv = item.querySelector('div');
    if (!jobDiv) return;

    // Get client and dates from first inner div
    const headerDiv = jobDiv.querySelector('div');
    const smalls = headerDiv?.querySelectorAll('small') || [];
    const clientText = smalls[0]?.textContent?.trim() || '';
    const dateText = smalls[1]?.textContent?.trim() || '';

    // Get role and location from first p
    const firstP = jobDiv.querySelector('p');
    const pSmalls = firstP?.querySelectorAll('small') || [];
    const roleText = pSmalls[0]?.textContent?.trim() || '';
    const locationText2 = pSmalls[1]?.textContent?.trim() || '';

    // Get description - it's a p with class text-justify or the second p
    const allPs = jobDiv.querySelectorAll('p');
    let descText = '';
    allPs.forEach((p) => {
      if (p.classList.contains('text-justify') || p.classList.contains('text-xs')) {
        if (!p.querySelector('small') && !p.querySelector('span')) {
          descText = p.textContent?.trim() || '';
        }
      }
    });

    // Get frameworks from last p with spans
    const frameworks: string[] = [];
    const lastP = allPs[allPs.length - 1];
    if (lastP) {
      lastP.querySelectorAll('span').forEach((span) => {
        if (span.textContent) {
          frameworks.push(span.textContent.trim());
        }
      });
    }

    // Parse dates
    const [startDate, endDate] = dateText.includes(' - ')
      ? dateText.split(' - ')
      : [dateText, undefined];

    if (clientText) {
      jobs.push({
        client: clientText,
        role: roleText,
        location: locationText2,
        startDate,
        endDate,
        description: descText,
        frameworks,
      });
    }
  });

  // Extract studies
  const studiesSection = document.querySelector('#studies');
  const studyItems = studiesSection?.querySelectorAll('ul > li') || [];
  const studies: PdfCvData['studies'] = [];

  studyItems.forEach((item) => {
    const nameEl = item.querySelector('strong');
    const paragraphs = item.querySelectorAll('p');
    const establishmentEl = paragraphs[paragraphs.length - 1]?.querySelector('span');
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
      phone: phoneLink?.textContent?.trim() || '+33661412725',
      email: emailLink?.textContent?.trim() || 'thomas.couderc@gmail.com',
      location: locationText,
    },
    about: aboutText,
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
