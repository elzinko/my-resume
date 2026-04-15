import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const SPEC_PATH = path.join(process.cwd(), 'data', 'api', 'openapi.yaml');

export async function GET() {
  const spec = await readFile(SPEC_PATH, 'utf-8');
  return new NextResponse(spec, {
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
