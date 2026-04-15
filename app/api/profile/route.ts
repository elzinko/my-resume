import { NextResponse, type NextRequest } from 'next/server';
import { i18n, type Locale } from '../../../i18n-config';
import { loadCvSources } from '@/lib/cv-data';
import {
  buildProfileResponse,
  parseIncludeParam,
  UnknownSectionError,
} from '@/lib/profile-api';

export const dynamic = 'force-dynamic';

const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 's-maxage=3600, stale-while-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function jsonError(
  status: number,
  code: string,
  message: string,
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status, headers: JSON_HEADERS },
  );
}

/**
 * GET /api/profile?lang=fr|en&include=profile,jobs,…
 *
 * Public, read-only JSON endpoint. Spec: `data/api/openapi.yaml`.
 * Data source: the same 4 files used to render the HTML CV.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const sp = request.nextUrl.searchParams;
  const rawLang = sp.get('lang');
  const lang: Locale = rawLang ? (rawLang as Locale) : i18n.defaultLocale;
  if (rawLang && !i18n.locales.includes(lang)) {
    return jsonError(
      400,
      'invalid_lang',
      `Unsupported "lang" value. Expected one of: ${i18n.locales.join(', ')}.`,
    );
  }

  let sections;
  try {
    sections = parseIncludeParam(sp.get('include'));
  } catch (err) {
    if (err instanceof UnknownSectionError) {
      return jsonError(
        400,
        'unknown_section',
        `Unknown section "${err.section}". Expected a comma-separated subset of: profile, about, domains, jobs, studies, projects, hobbies, learnings, skills, techCatalog.`,
      );
    }
    throw err;
  }

  const sources = await loadCvSources(lang);
  const payload = buildProfileResponse(lang, sources, sections);
  return NextResponse.json(payload, { headers: JSON_HEADERS });
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
