'use client';

import React from 'react';
import { slugifyClient } from '@/lib/slug';

interface MatchClientPillProps {
  client: string;
}

/** Affiche au plus les deux premiers mots pour limiter la largeur des pills. */
function clientLabelFirstTwoWords(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  return parts.slice(0, 2).join(' ');
}

export default function MatchClientPill({ client }: MatchClientPillProps) {
  const label = clientLabelFirstTwoWords(client);
  return (
    <a
      href={`#${slugifyClient(client)}`}
      title={client}
      className="whitespace-nowrap rounded border border-orange-300/50 bg-orange-300/10 px-1.5 py-0.5 text-[10px] font-medium text-orange-300 transition-colors hover:border-orange-300/70 hover:bg-orange-300/20 print:border-orange-300/60 print:bg-orange-300/10 print:text-[8px] print:!text-orange-300"
    >
      {label}
    </a>
  );
}
