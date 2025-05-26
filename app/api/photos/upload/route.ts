import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const formData = await req.formData();
    const file = formData.get('file');
    const gondolaId = formData.get('gondolaId');
    const description = formData.get('description');

    if (!file || typeof gondolaId !== 'string' || !gondolaId) {
      return NextResponse.json({ error: 'Missing file or gondolaId' }, { status: 400 });
    }

    // Check if gondola exists
    const gondola = await prisma.gondola.findUnique({ where: { id: gondolaId } });
    if (!gondola) {
      console.error('[photos.upload] Invalid gondolaId:', gondolaId);
      return NextResponse.json({ error: 'Invalid gondolaId', gondolaId }, { status: 400 });
    }

    try {
      const originalName = (file as File).name;
      const ext = originalName.split('.').pop() || '';
      const now = new Date();
      // Validate MIME type
      const fileType = (file as File).type;
      if (!fileType || !fileType.startsWith('image/')) {
        return NextResponse.json({ error: "The requested resource isn't a valid image.", details: `Received ${fileType}` }, { status: 400 });
      }
      const arrayBuffer = await (file as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // Create the photo and set the url in one step
      let tempPhoto;
      try {
        tempPhoto = await prisma.photo.create({
          data: {
            uploadedAt: now,
            description: typeof description === 'string' ? description : '',
            gondolaId,
            content: buffer,
            mimeType: fileType,
            url: '', // will update after id is known
          },
        });
      } catch (err) {
        console.error('[photos.upload] Failed to create photo:', err);
        return NextResponse.json({ error: 'Failed to create photo', details: err instanceof Error ? err.message : err }, { status: 500 });
      }
      const url = `/api/photos/${tempPhoto.id}/download`;
      // Update the url field
      let photo;
      try {
        photo = await prisma.photo.update({ where: { id: tempPhoto.id }, data: { url } });
      } catch (err) {
        console.error('[photos.upload] Failed to update photo url:', err);
        return NextResponse.json({ error: 'Failed to update photo url', details: err instanceof Error ? err.message : err }, { status: 500 });
      }
      return NextResponse.json({
        id: photo.id,
        url,
        uploadedAt: photo.uploadedAt,
        description: photo.description,
        gondolaId: photo.gondolaId,
      });
    } catch (err: any) {
      console.error('[photos.upload] Database error:', err);
      return NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error', details: err.message }, { status: 500 });
  }
}
