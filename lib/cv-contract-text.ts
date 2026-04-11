import type { ContractType } from '@/data/offers/types';

/**
 * Resolve about/profile text based on contract type.
 * CDI uses `textCdi` if available, otherwise falls back to `text` (freelance default).
 */
export function resolveAboutText(
  about: { text?: string; textCdi?: string } | undefined | null,
  contract?: ContractType,
): string {
  if (contract === 'cdi' && about?.textCdi) return about.textCdi;
  return about?.text || '';
}

/**
 * Resolve domain description based on contract type.
 * CDI uses `descriptionCdi` if available, otherwise falls back to `description` (freelance default).
 */
export function resolveDomainDescription(
  domain: { description?: string; descriptionCdi?: string } | undefined | null,
  contract?: ContractType,
): string {
  if (contract === 'cdi' && domain?.descriptionCdi) return domain.descriptionCdi;
  return domain?.description || '';
}
