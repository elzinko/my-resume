'use client';

import React from 'react';
import { slugifyClient } from '@/lib/slug';

interface MatchClientPillProps {
  client: string;
}

export default function MatchClientPill({ client }: MatchClientPillProps) {
  return (
    <a
      href={`#${slugifyClient(client)}`}
      className="whitespace-nowrap rounded bg-orange-300/20 px-1.5 py-0.5 text-[10px] text-white transition-colors hover:bg-orange-300/40 print:text-[8px]"
    >
      {client}
    </a>
  );
}
