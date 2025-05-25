import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { documentId, projectId } = await req.json();
    if (!documentId || !projectId) {
      return NextResponse.json({ error: 'Missing documentId or projectId' }, { status: 400 });
    }
    const updated = await prisma.document.update({
      where: { id: documentId },
      data: { projectId },
    });
    return NextResponse.json({ success: true, document: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
