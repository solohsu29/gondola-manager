import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import { prisma } from '@/lib/prisma';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (e) {}
}

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    await ensureUploadsDir();
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
      return NextResponse.json({ error: 'Invalid gondolaId' }, { status: 400 });
    }

    const originalName = (file as File).name;
    const ext = path.extname(originalName);
    const fileName = uuidv4() + ext;
    const savePath = path.join(uploadsDir, fileName);
    const fileUrl = `/uploads/${fileName}`;

    try {
      const arrayBuffer = await (file as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(savePath, buffer);
    } catch (fileWriteError: any) {
      console.error('File write error:', fileWriteError);
      return NextResponse.json({ error: 'File write error', details: fileWriteError.message }, { status: 500 });
    }

    try {
      const now = new Date();
      const photo = await prisma.photo.create({
        data: {
          url: fileUrl,
          uploadedAt: now,
          description: typeof description === 'string' ? description : '',
          gondolaId,
        },
      });
      return NextResponse.json({
        id: photo.id,
        url: photo.url,
        uploadedAt: photo.uploadedAt,
        description: photo.description,
        gondolaId: photo.gondolaId,
      });
    } catch (err: any) {
      console.error('Database error:', err);
      return NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error', details: err.message }, { status: 500 });
  }
}
