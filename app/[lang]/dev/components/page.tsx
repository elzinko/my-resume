import '../../../../styles/globals.css';

import React from 'react';
import type { Metadata } from 'next';
import { Locale } from '../../../../i18n-config';
import { getCvData } from '@/lib/cv-data';
import { getEducationLevelContent } from '@/lib/education-level-content';

import About from '../../about';
import Skills from '../../skills';
import Domains from '../../domains';
import Domain from '@/components/domain';
import Contact from '../../contact';
import Studies from '../../studies';
import Hobbies from '../../hobbies';
import Projects from '../../projects';
import Jobs from '../../jobs';
import Header from '../../header';
import EducationLevel from '@/components/EducationLevel';
import ProfileEducationBadge from '@/components/ProfileEducationBadge';
import { getProfileEducationBadgeLabel } from '@/lib/education-level-content';
import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import HeaderDesktopContactStrip from '@/components/HeaderDesktopContactStrip';
import JobDisplay from '@/components/JobDisplay';
import ExperienceClosingBlock from '@/components/ExperienceClosingBlock';
import {
  SHORT_CV_EXCLUDED_CLIENTS,
  SHORT_CV_MAX_JOBS,
  formatRemainingClientsForShortCv,
  getExperienceClosingLabels,
} from '@/lib/cv-experience-footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'dev_components_storybook',
  robots: { index: false, follow: false },
};

/**
 * Storybook léger : rend chaque section CV (Server Components) côte à côte
 * avec les vraies données `data/cv/bundle.json`. Permet de bosser un composant
 * sans naviguer dans les layouts Full / Short / mobile.
 *
 * URL : `/{lang}/dev/components`. Non indexée, exclue des layouts CV.
 */
export default async function DevComponentsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const data: any = await getCvData(lang);
  const educationLevel = getEducationLevelContent(data, lang);

  // Workaround: les sections sont des async Server Components, on les exécute
  // ici et on insère leur résultat dans le tableau de stories.
  const [
    headerNode,
    aboutNode,
    contactDefaultNode,
    skillsNode,
    domainsNode,
    studiesDefaultNode,
    studiesCondensedNode,
    hobbiesNode,
    projectsNode,
    jobsNode,
  ] = await Promise.all([
    (Header as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (About as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang, educationLevel }),
    (Contact as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (Skills as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (Domains as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (Studies as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (Studies as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang, condensed: true }),
    (Hobbies as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (Projects as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
    (Jobs as unknown as (p: any) => Promise<React.ReactElement>)({ locale: lang }),
  ]);

  const headerName: string = data?.header?.name ?? '';
  const headerRole: string = data?.header?.role ?? '';
  const contactEmail: string = data?.contact?.email ?? '';
  const contactPhone: string = data?.contact?.phone ?? '';
  const contactLocation: string = data?.contact?.location ?? '';

  /** Bandeau coordonnées compact (sous le rôle, version short / impression). */
  const headerContactStripNode = (
    <HeaderDesktopContactStrip
      email={contactEmail}
      phone={contactPhone}
      location={contactLocation}
      locale={lang}
    />
  );

  /** Toolbar (menu) seul, en dehors du `<header>`. */
  const headerToolbarNode = <HeaderToolbar />;

  /** Bloc titre + rôle (HeaderContent), sans toolbar ni contact strip. */
  const headerContentBareNode = (
    <HeaderContent name={headerName} role={headerRole} />
  );

  /** HeaderContent avec coordonnées compactes sous le rôle (variante CV court / print). */
  const headerContentWithContactNode = (
    <HeaderContent
      name={headerName}
      role={headerRole}
      afterRole={
        <div className="w-full">{headerContactStripNode}</div>
      }
    />
  );

  // Variante « short » des missions : même filtre/limite que CompactCvLayout
  // (`SHORT_CV_EXCLUDED_CLIENTS`, `SHORT_CV_MAX_JOBS`) + bloc de clôture.
  const allJobs: any[] = data?.allJobsModels || [];
  const closing = getExperienceClosingLabels(lang);
  const moreClientsLine = formatRemainingClientsForShortCv(allJobs, lang);
  const recentJobs = allJobs
    .filter((job: any) => !SHORT_CV_EXCLUDED_CLIENTS.has(job.client))
    .slice(0, SHORT_CV_MAX_JOBS);
  const presentLabel = lang === 'fr' ? 'Présent' : 'Now';
  const jobsShortNode = (
    <section>
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs">
        {data?.jobsTitle?.title}
      </h2>
      <ul className="mt-2 space-y-4">
        {recentJobs.map((job: any, idx: number) => (
          <li key={idx}>
            <JobDisplay
              job={job}
              compact
              presentLabel={presentLabel}
              locale={lang}
            />
          </li>
        ))}
      </ul>
      <ExperienceClosingBlock
        moreExperience={closing.moreExperience}
        moreExperienceTail={closing.moreExperienceTail}
        moreClientsLine={moreClientsLine}
      />
    </section>
  );

  /** Force le mode « conteneur étroit » des sections `cv-cq-section` (~mobile / colonne sidebar). */
  const Narrow = ({ children }: { children: React.ReactNode }) => (
    <div className="w-[320px] max-w-full border border-dashed border-slate-300 p-3">
      {children}
    </div>
  );

  /** Force le rendu « short CV » : projets en ligne sans description, listes loisirs/veille en `a / b / c`. */
  const ShortFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="cv-short-page">{children}</div>
  );

  const stories: Array<{ id: string; title: string; node: React.ReactNode }> = [
    { id: 'header', title: 'Header (assemblé)', node: headerNode },
    {
      id: 'header-toolbar',
      title: 'Header · Toolbar (desktop)',
      node: headerToolbarNode,
    },
    {
      id: 'header-toolbar-mobile',
      title: 'Header · Toolbar (mobile)',
      node: <Narrow>{headerToolbarNode}</Narrow>,
    },
    {
      id: 'header-content',
      title: 'Header · Content (titre + rôle seuls)',
      node: headerContentBareNode,
    },
    {
      id: 'header-content-with-contact',
      title: 'Header · Content + contact strip (CV court / print)',
      node: headerContentWithContactNode,
    },
    {
      id: 'header-contact-strip',
      title: 'Header · Contact strip (compact, sous le rôle)',
      node: headerContactStripNode,
    },
    { id: 'about', title: 'About', node: aboutNode },
    { id: 'contact', title: 'Contact', node: contactDefaultNode },
    { id: 'skills', title: 'Skills', node: skillsNode },
    { id: 'domains', title: 'Domains (3 colonnes)', node: domainsNode },
    ...(data?.allDomainsModels || []).map((domain: any, i: number) => ({
      id: `domain-${domain.id || i}`,
      title: `Domain · ${domain.name || `#${i}`}`,
      node: (
        <div className="max-w-sm">
          <Domain key={domain.id} domain={domain} />
        </div>
      ),
    })),
    {
      id: 'education-level',
      title: 'Niveau de formation',
      node: (
        <Narrow>
          <EducationLevel content={educationLevel} pillsCompact />
        </Narrow>
      ),
    },
    {
      id: 'profile-education-badge',
      title: 'Niveau de formation · pastille condensée (sous le profil)',
      node: (
        <ProfileEducationBadge
          label={getProfileEducationBadgeLabel(educationLevel, lang)}
        />
      ),
    },
    { id: 'studies-default', title: 'Studies (default)', node: studiesDefaultNode },
    { id: 'studies-condensed', title: 'Studies (condensed)', node: studiesCondensedNode },
    {
      id: 'studies-narrow',
      title: 'Studies (narrow container — mobile / sidebar)',
      node: <Narrow>{studiesDefaultNode}</Narrow>,
    },
    { id: 'hobbies', title: 'Hobbies (large container)', node: hobbiesNode },
    {
      id: 'hobbies-narrow',
      title: 'Hobbies (narrow container — mobile / sidebar)',
      node: <Narrow>{hobbiesNode}</Narrow>,
    },
    { id: 'projects', title: 'Projects (default)', node: projectsNode },
    {
      id: 'projects-narrow',
      title: 'Projects (narrow container — mobile)',
      node: <Narrow>{projectsNode}</Narrow>,
    },
    {
      id: 'projects-short',
      title: 'Projects (short CV — titres + dates seulement)',
      node: <ShortFrame>{projectsNode}</ShortFrame>,
    },
    { id: 'jobs', title: 'Jobs (full CV)', node: jobsNode },
    {
      id: 'job-single',
      title: 'Job · single (premier job)',
      node: allJobs[0] ? (
        <JobDisplay
          job={allJobs[0]}
          presentLabel={presentLabel}
          locale={lang}
        />
      ) : <p>Aucun job</p>,
    },
    {
      id: 'job-single-compact',
      title: 'Job · single compact (short CV)',
      node: allJobs[0] ? (
        <JobDisplay
          job={allJobs[0]}
          compact
          presentLabel={presentLabel}
          locale={lang}
        />
      ) : <p>Aucun job</p>,
    },
    {
      id: 'jobs-short',
      title: 'Jobs (short CV — missions limitées + bloc de clôture)',
      node: jobsShortNode,
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 text-cv-body">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold">Dev · Components storybook</h1>
        <p className="mt-2 text-sm text-cv-body-muted">
          Chaque carte rend une section CV de façon isolée avec les données
          réelles (<code>data/cv/bundle.json</code>, locale <code>{lang}</code>).
          Aide à valider visuellement un composant sans toucher aux layouts
          Full / Short / mobile.
        </p>
        <nav className="mt-4 flex flex-wrap gap-2 text-xs">
          <a
            href={`/${lang}/dev/renders`}
            className="rounded border border-teal-400/40 bg-teal-950/30 px-2 py-1 text-teal-300 hover:border-teal-400/80"
          >
            Renders Comparison
          </a>
          {stories.map((s) => (
            <a
              key={s.id}
              href={`#story-${s.id}`}
              className="rounded border border-white/20 px-2 py-1 hover:border-white/60"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-12">
        {stories.map((s) => (
          <section
            key={s.id}
            id={`story-${s.id}`}
            data-story={s.id}
            className="rounded-lg border border-white/15 bg-white p-6 text-slate-900 shadow-sm"
          >
            <h2 className="mb-4 text-xs uppercase tracking-wider text-slate-500">
              {s.title}
            </h2>
            <div className="cv-storybook-frame">{s.node}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
