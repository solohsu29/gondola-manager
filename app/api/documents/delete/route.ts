import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/documents/delete expects a JSON body: { documentId: string }
export async function DELETE(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    console.log('documentid from backend',documentId)
    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }
    await prisma.document.delete({ where: { id: documentId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete document', details: error }, { status: 500 });
  }
}
