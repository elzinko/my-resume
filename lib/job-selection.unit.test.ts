import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildJobSections } from './job-selection';
import { slugifyClient } from './slug';

const jobs = [
  { client: 'Solopreneur', startDate: '2024', endDate: undefined },
  { client: 'JPB Système', startDate: '2024', endDate: '2025' },
  { client: 'BlaBlaCar', startDate: '2022', endDate: '2023' },
  { client: 'Smartch', startDate: '2021', endDate: '2022' },
  {
    client: 'SNCF Réseaux - DGEX Solutions',
    startDate: '2021',
    endDate: '2022',
  },
  { client: 'Celsius Energy', startDate: '2020', endDate: '2021' },
  { client: 'RelevanC', startDate: '2020', endDate: '2020' },
  { client: 'Ecocea', startDate: '2019', endDate: '2020' },
  { client: 'Thales communications', startDate: '2016', endDate: '2017' },
];

const featuredClients = (sections: ReturnType<typeof buildJobSections>) =>
  sections!
    .filter((s) => s.type === 'featured')
    .map((s) => (s as any).job.client);

describe('buildJobSections', () => {
  it('returns null when highlightedSlugs is undefined', () => {
    assert.equal(buildJobSections(jobs, undefined), null);
  });

  it('returns null when highlightedSlugs is empty', () => {
    assert.equal(buildJobSections(jobs, []), null);
  });

  it('returns null when no slug matches a known job', () => {
    assert.equal(buildJobSections(jobs, ['unknown-mission']), null);
  });

  it('highlights a single job and compresses the rest into one trailing stub', () => {
    const sections = buildJobSections(jobs, ['jpb-systeme']);
    assert.notEqual(sections, null);

    // First section: featured JPB.
    assert.equal(sections![0]!.type, 'featured');
    assert.equal((sections![0] as any).job.client, 'JPB Système');

    // Exactly one trailing stub with everyone else.
    assert.equal(sections!.length, 2);
    assert.equal(sections![1]!.type, 'stub');

    const stubClients = (sections![1] as any).jobs.map((j: any) => j.client);
    assert.equal(stubClients.includes('JPB Système'), false);
    // Data order preserved inside the compressed block.
    assert.equal(stubClients[0], 'Solopreneur');
  });

  it('respects the ORDER of highlightedSlugs (not chronological)', () => {
    const sections = buildJobSections(jobs, [
      'thales-communications',
      'jpb-systeme',
      'celsius-energy',
    ]);
    assert.notEqual(sections, null);

    // Featured order follows the param order, not the timeline.
    assert.deepEqual(featuredClients(sections), [
      'Thales communications',
      'JPB Système',
      'Celsius Energy',
    ]);

    // A single compressed block, always last.
    const stubs = sections!.filter((s) => s.type === 'stub');
    assert.equal(stubs.length, 1);
    assert.equal(sections![sections!.length - 1]!.type, 'stub');
  });

  it('dedupes repeated slugs, keeping the first position', () => {
    const sections = buildJobSections(jobs, [
      'jpb-systeme',
      'jpb-systeme',
      'smartch',
    ]);
    assert.deepEqual(featuredClients(sections), ['JPB Système', 'Smartch']);
  });

  it('excludes RelevanC from the compressed rest', () => {
    const sections = buildJobSections(jobs, ['thales-communications']);
    const allStubClients = sections!
      .filter((s) => s.type === 'stub')
      .flatMap((s) => (s as any).jobs.map((j: any) => j.client));
    assert.equal(allStubClients.includes('RelevanC'), false);
  });

  it('accepts slugs with the mission- prefix', () => {
    const sections = buildJobSections(jobs, ['mission-jpb-systeme']);
    assert.deepEqual(featuredClients(sections), ['JPB Système']);
  });

  it('matches on an explicit slug field when present', () => {
    const withSlug = [
      {
        slug: 'matiere-web',
        client: 'Matière Web',
        startDate: '2020',
        endDate: undefined,
      },
      ...jobs,
    ];
    const sections = buildJobSections(withSlug, ['matiere-web']);
    assert.notEqual(sections, null);
    assert.equal(sections![0]!.type, 'featured');
    assert.equal((sections![0] as any).job.client, 'Matière Web');
  });

  it('all jobs highlighted produces no stub', () => {
    const allSlugs = jobs
      .filter((j) => j.client !== 'RelevanC')
      .map((j) => slugifyClient(j.client));
    const sections = buildJobSections(jobs, allSlugs);
    assert.notEqual(sections, null);
    const stubs = sections!.filter((s) => s.type === 'stub');
    assert.equal(stubs.length, 0);
  });
});
