import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Extract photo ID from URL
  const url = new URL(req.url);
  // /api/photos/[id]/download -> get [id]
  const parts = url.pathname.split('/').filter(Boolean);
  const id = parts.length >= 4 ? parts[2] : undefined;

  if (!id) {
    return NextResponse.json({ error: 'Missing photo ID' }, { status: 400 });
  }
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo || !photo.content) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  // Use stored MIME type if present, else default to jpeg
  const mimeType = photo.mimeType || (photo.url?.endsWith('.png') ? 'image/png' : 'image/jpeg');

  const headers = new Headers();
  headers.set('Content-Type', mimeType);
  headers.set('Content-Disposition', `inline; filename="photo_${id}.jpg"`);

  return new NextResponse(Buffer.from(photo.content), {
    status: 200,
    headers,
  });
}
