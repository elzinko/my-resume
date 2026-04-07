'use client';

import React from 'react';
import { slugifyClient } from '@/lib/slug';

interface MatchClientPillProps {
  client: string;
  /** Pastilles plus petites (mobile profil match). */
  compact?: boolean;
}

/** Affiche au plus les deux premiers mots pour limiter la largeur des pills. */
function clientLabelFirstTwoWords(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  return parts.slice(0, 2).join(' ');
}

export default function MatchClientPill({
  client,
  compact = false,
}: MatchClientPillProps) {
  const label = clientLabelFirstTwoWords(client);
  const size = compact
    ? 'px-1 py-0.5 text-[9px] print:text-[8px]'
    : 'px-1.5 py-0.5 text-[10px] max-md:px-1 max-md:py-0.5 max-md:text-[9px] print:text-[8px]';
  return (
    <a
      href={`#${slugifyClient(client)}`}
      title={client}
      className={`cv-pill-match whitespace-nowrap ${size}`}
    >
      {label}
    </a>
  );
}
