import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const RENDERS_DIR = path.join(process.cwd(), 'renders');

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
};

/**
 * GET /api/renders/file?name=fr-short-screen.png
 *
 * Serves a static file from the `renders/` directory (screenshots + PDFs).
 * Only whitelisted extensions, no path traversal.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  const name = request.nextUrl.searchParams.get('name');
  if (!name || name.includes('..') || name.includes('/')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const ext = path.extname(name).toLowerCase();
  const mime = MIME[ext];
  if (!mime) {
    return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
  }

  const filePath = path.join(RENDERS_DIR, name);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const buf = fs.readFileSync(filePath);
  return new NextResponse(buf, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'no-store',
    },
  });
}
