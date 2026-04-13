import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildJobSections } from './job-selection';

const jobs = [
  { client: 'Solopreneur', startDate: '2024', endDate: undefined },
  { client: 'JPB Système', startDate: '2024', endDate: '2025' },
  { client: 'BlaBlaCar', startDate: '2022', endDate: '2023' },
  { client: 'Smartch', startDate: '2021', endDate: '2022' },
  { client: 'SNCF Réseaux - DGEX Solutions', startDate: '2021', endDate: '2022' },
  { client: 'Celsius Energy', startDate: '2020', endDate: '2021' },
  { client: 'RelevanC', startDate: '2020', endDate: '2020' },
  { client: 'Ecocea', startDate: '2019', endDate: '2020' },
  { client: 'Thales communications', startDate: '2016', endDate: '2017' },
];

describe('buildJobSections', () => {
  it('returns null when highlightedSlugs is undefined', () => {
    assert.equal(buildJobSections(jobs, undefined), null);
  });

  it('returns null when highlightedSlugs is empty', () => {
    assert.equal(buildJobSections(jobs, []), null);
  });

  it('highlights a single job and stubs the rest', () => {
    const sections = buildJobSections(jobs, ['jpb-systeme']);
    assert.notEqual(sections, null);

    // First section should be stub (Solopreneur is before JPB)
    assert.equal(sections![0]!.type, 'stub');
    assert.equal((sections![0] as any).jobs.length, 1);
    assert.equal((sections![0] as any).jobs[0].client, 'Solopreneur');

    // Second section: featured JPB
    assert.equal(sections![1]!.type, 'featured');
    assert.equal((sections![1] as any).job.client, 'JPB Système');

    // Third section: stub for everything after JPB
    assert.equal(sections![2]!.type, 'stub');
  });

  it('highlights multiple jobs with stubs in between', () => {
    const sections = buildJobSections(jobs, [
      'jpb-systeme',
      'celsius-energy',
      'thales-communications',
    ]);
    assert.notEqual(sections, null);

    // Expected sequence: stub(Solo) → featured(JPB) → stub(Blabla,Smartch,SNCF) → featured(Celsius) → stub(Ecocea) → featured(Thales)
    const types = sections!.map((s) => s.type);
    assert.deepEqual(types, [
      'stub',
      'featured',
      'stub',
      'featured',
      'stub',
      'featured',
    ]);

    // Verify featured jobs are correct
    const featured = sections!.filter((s) => s.type === 'featured');
    assert.equal((featured[0] as any).job.client, 'JPB Système');
    assert.equal((featured[1] as any).job.client, 'Celsius Energy');
    assert.equal((featured[2] as any).job.client, 'Thales communications');
  });

  it('excludes RelevanC from stubs', () => {
    const sections = buildJobSections(jobs, ['thales-communications']);
    assert.notEqual(sections, null);

    // RelevanC should not appear in any stub
    const allStubClients = sections!
      .filter((s) => s.type === 'stub')
      .flatMap((s) => (s as any).jobs.map((j: any) => j.client));
    assert.equal(allStubClients.includes('RelevanC'), false);
  });

  it('accepts slugs with mission- prefix', () => {
    const sections = buildJobSections(jobs, ['mission-jpb-systeme']);
    assert.notEqual(sections, null);
    const featured = sections!.find((s) => s.type === 'featured');
    assert.equal((featured as any).job.client, 'JPB Système');
  });

  it('first job as featured has no leading stub', () => {
    const sections = buildJobSections(jobs, ['solopreneur']);
    assert.notEqual(sections, null);
    assert.equal(sections![0]!.type, 'featured');
    assert.equal((sections![0] as any).job.client, 'Solopreneur');
  });

  it('all jobs highlighted produces no stubs', () => {
    const allSlugs = jobs
      .filter((j) => j.client !== 'RelevanC')
      .map((j) =>
        j.client
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      );
    const sections = buildJobSections(jobs, allSlugs);
    assert.notEqual(sections, null);
    const stubs = sections!.filter((s) => s.type === 'stub');
    assert.equal(stubs.length, 0);
  });
});
