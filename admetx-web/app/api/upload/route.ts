import { NextResponse } from 'next/server';
import { readClaims } from '@/lib/auth';
import { parseUpload } from '@/lib/parse-upload';

export async function POST(req: Request) {
  const c = await readClaims();
  if (!c) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const form = await req.formData();
  const f = form.get('file');
  if (!(f instanceof File)) {
    return NextResponse.json({ error: 'no_file' }, { status: 400 });
  }
  if (f.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'file_too_large' }, { status: 413 });
  }
  const content = await f.text();
  try {
    const smiles = parseUpload(f.name, content);
    return NextResponse.json({ smiles });
  } catch (e) {
    return NextResponse.json(
      { error: 'parse_failed', message: (e as Error).message },
      { status: 400 },
    );
  }
}
