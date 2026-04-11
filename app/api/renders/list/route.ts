import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * GET /api/renders/list
 *
 * Returns the list of generated render files with modification timestamps.
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  const dir = path.join(process.cwd(), 'renders');
  const exts = new Set(['.png', '.pdf']);

  const files = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => exts.has(path.extname(f).toLowerCase()))
        .map((f) => {
          const stat = fs.statSync(path.join(dir, f));
          return { name: f, mtime: stat.mtimeMs };
        })
    : [];

  const lastGenerated = files.length
    ? Math.max(...files.map((f) => f.mtime))
    : null;

  return NextResponse.json({ files, lastGenerated });
}
