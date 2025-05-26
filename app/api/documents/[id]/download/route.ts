import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Extract document ID from URL
  const url = new URL(req.url);
  // /api/documents/[id]/download -> get [id]
  const parts = url.pathname.split('/').filter(Boolean);
  const id = parts.length >= 4 ? parts[2] : undefined;

  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc || !doc.content) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const mimeType = doc.name?.endsWith('.pdf')
    ? 'application/pdf'
    : 'application/octet-stream';

  const headers = new Headers();
  headers.set('Content-Type', mimeType);
  headers.set(
    'Content-Disposition',
    `attachment; filename="${doc.name || 'document'}"`
  );

  return new NextResponse(Buffer.from(doc.content), {
    status: 200,
    headers,
  });
}

