import React from 'react';
import type { Metadata } from 'next';
import { buildLlmGuideMarkdown } from '@/lib/llm-guide-markdown';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'dev_llm_guide',
  robots: { index: false, follow: false },
};

/**
 * Version « page » du guide LLM (`/api/llm-guide`) : même Markdown, mais rendu
 * dans une page du layout `[lang]` → la nav dev reste affichée (contrairement
 * à la route API qui sert du text/markdown brut, sans chrome). La route API
 * reste le point d'entrée des agents ; cette page sert à la lecture humaine.
 *
 * URL : `/{lang}/dev/llm-guide`. Non indexée, 404 en production (middleware).
 */
export default function DevLlmGuidePage() {
  const markdown = buildLlmGuideMarkdown();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-semibold">Dev · LLM guide</h1>
      <p className="mb-6 text-sm text-slate-500">
        Rendu lisible de{' '}
        <a href="/api/llm-guide" className="text-teal-600 underline">
          /api/llm-guide
        </a>{' '}
        (source Markdown servie aux agents).
      </p>
      <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-6 font-mono text-[0.8rem] leading-relaxed text-slate-800">
        {markdown}
      </pre>
    </div>
  );
}
