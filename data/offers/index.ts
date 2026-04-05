import safranJavaFullstack from './safran-java-fullstack';
import safranIaFactory from './safran-ia-factory';
import type { JobOffer } from './types';

export type { MatchRequirement, JobOffer } from './types';

const offers: Record<string, JobOffer> = {
  'safran-java-fullstack': safranJavaFullstack,
  'safran-ia-factory': safranIaFactory,
};

export function getOffer(id: string): JobOffer | undefined {
  return offers[id];
}

export function getAllOfferIds(): string[] {
  return Object.keys(offers);
}
