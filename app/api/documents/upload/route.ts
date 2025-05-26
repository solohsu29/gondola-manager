import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
// @ts-ignore
import Busboy from 'busboy';
import type { Readable } from 'stream';
import { prisma } from '@/lib/prisma';

// Removed uploads directory logic. Files are now stored directly in the database.

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
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
    const fileUrl = '';

    let buffer: Buffer;
    try {
      const arrayBuffer = await (file as File).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (fileReadError: any) {
      console.error('File read error:', fileReadError);
      return NextResponse.json({ error: 'File read error', details: fileReadError.message }, { status: 500 });
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
          projectId: typeof projectId === 'string' && projectId.length > 0 ? projectId : null,
          content: buffer,
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

