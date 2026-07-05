import { NextResponse } from 'next/server';
import { buildLlmGuideMarkdown } from '@/lib/llm-guide-markdown';

export const dynamic = 'force-dynamic';

/**
 * GET /api/llm-guide
 *
 * Public endpoint serving a self-contained Markdown guide for LLM agents.
 * Lists all public endpoints, the customization params for the HTML CV, and
 * compact references (mission slugs) needed to build URLs. Larger reference
 * data (full tech catalog) is served by `/api/profile` to keep this guide
 * lean. Content shared with the human-readable dev page
 * `/{lang}/dev/llm-guide` (cf. `lib/llm-guide-markdown.ts`).
 */
export async function GET() {
  return new NextResponse(buildLlmGuideMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
