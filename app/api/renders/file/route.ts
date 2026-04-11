import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCvData } from '@/lib/cv-data';
import { generateDocumentTitle } from '@/lib/cv-document-title';

export const dynamic = 'force-dynamic';

const RENDERS_DIR = path.join(process.cwd(), 'renders');

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
};

/**
 * Extrait la langue et le mode (full/short) du nom de fichier renders.
 * Ex : `fr-short-print.pdf` → { lang: 'fr', mode: 'short' }
 *      `en-full-print.pdf`  → { lang: 'en', mode: 'full' }
 */
function parseRenderFilename(
  name: string,
): { lang: string; mode: 'full' | 'short' } | null {
  const m = name.match(/^(fr|en)-(full|short)-/);
  if (!m) return null;
  return { lang: m[1], mode: m[2] as 'full' | 'short' };
}

/**
 * GET /api/renders/file?name=fr-short-screen.png
 *
 * Serves a static file from the `renders/` directory (screenshots + PDFs).
 * Only whitelisted extensions, no path traversal.
 * PDFs get a Content-Disposition header with a formatted filename matching
 * the browser print button naming convention.
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

  const headers: Record<string, string> = {
    'Content-Type': mime,
    'Cache-Control': 'no-store',
  };

  // PDFs: add Content-Disposition with a formatted filename
  if (ext === '.pdf') {
    const parsed = parseRenderFilename(name);
    if (parsed) {
      try {
        const data: any = await getCvData(parsed.lang as 'fr' | 'en');
        const candidateName = data?.header?.name || 'CV';
        const title = generateDocumentTitle(
          candidateName,
          parsed.lang,
          parsed.mode,
        );
        headers['Content-Disposition'] = `inline; filename="${title}.pdf"`;
      } catch {
        // Fallback: use raw filename
        headers['Content-Disposition'] = `inline; filename="${name}"`;
      }
    }
  }

  return new NextResponse(buf, { headers });
}
