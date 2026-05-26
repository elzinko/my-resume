import type { ContractType } from '@/data/offers/types';

export type CvMode = 'teaching';

/**
 * Resolve about/profile text based on contract type and/or CV mode.
 * Teaching mode wins over CDI when both are set (they're meant to be exclusive).
 */
export function resolveAboutText(
  about:
    | { text?: string; textCdi?: string; textTeaching?: string }
    | undefined
    | null,
  contract?: ContractType,
  mode?: CvMode,
): string {
  if (mode === 'teaching' && about?.textTeaching) return about.textTeaching;
  if (contract === 'cdi' && about?.textCdi) return about.textCdi;
  return about?.text || '';
}

/**
 * Resolve domain description based on contract type and/or CV mode.
 * Teaching mode wins over CDI when both are set.
 */
export function resolveDomainDescription(
  domain:
    | {
        description?: string;
        descriptionCdi?: string;
        descriptionTeaching?: string;
      }
    | undefined
    | null,
  contract?: ContractType,
  mode?: CvMode,
): string {
  if (mode === 'teaching' && domain?.descriptionTeaching)
    return domain.descriptionTeaching;
  if (contract === 'cdi' && domain?.descriptionCdi)
    return domain.descriptionCdi;
  return domain?.description || '';
}
