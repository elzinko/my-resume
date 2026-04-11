import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * POST /api/renders/generate
 *
 * Spawns the Playwright render script (`renders/generate.mjs`) to regenerate
 * all screenshots + PDFs.  Streams stdout/stderr back as JSON when done.
 *
 * Only available in development.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Only available in development' },
      { status: 403 },
    );
  }

  // Determine the app's own origin so Playwright hits the running dev server
  const origin = request.headers.get('x-forwarded-host')
    ? `${
        request.headers.get('x-forwarded-proto') || 'http'
      }://${request.headers.get('x-forwarded-host')}`
    : new URL(request.url).origin;

  const script = path.join(process.cwd(), 'renders', 'generate.mjs');

  return new Promise<NextResponse>((resolve) => {
    const chunks: string[] = [];
    const child = spawn('node', [script], {
      env: { ...process.env, RENDERS_BASE_URL: origin },
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (d: Buffer) => chunks.push(d.toString()));
    child.stderr.on('data', (d: Buffer) => chunks.push(d.toString()));

    child.on('close', (code) => {
      const output = chunks.join('');
      if (code === 0) {
        resolve(NextResponse.json({ ok: true, output }));
      } else {
        resolve(
          NextResponse.json({ ok: false, code, output }, { status: 500 }),
        );
      }
    });

    child.on('error', (err) => {
      resolve(
        NextResponse.json({ ok: false, error: err.message }, { status: 500 }),
      );
    });
  });
}
