import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
// @ts-ignore
import Busboy from 'busboy';
import type { Readable } from 'stream';
import { prisma } from '@/lib/prisma';

// Set uploads directory
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
    const projectId = formData.get('projectId');
    const gondolaId = formData.get('gondolaId');

    if (!file || (typeof projectId !== 'string' && typeof gondolaId !== 'string')) {
      return NextResponse.json({ error: 'Missing file or projectId/gondolaId' }, { status: 400 });
    }

    // file is of type File (Web API)
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
      const doc = await prisma.document.create({
        data: {
          type: 'ADHOC',
          name: originalName || fileName,
          uploadedAt: now,
          expiryDate: null,
          fileUrl,
          status: 'valid',
          gondolaId: typeof gondolaId === 'string' && gondolaId.length > 0 ? gondolaId : null,
          projectId: typeof projectId === 'string' ? projectId : null,
        },
      });
      return NextResponse.json({
        id: doc.id,
        url: doc.fileUrl,
        name: doc.name,
        uploadedAt: doc.uploadedAt,
        status: doc.status,
        gondolaId: doc.gondolaId,
        projectId: doc.projectId,
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

