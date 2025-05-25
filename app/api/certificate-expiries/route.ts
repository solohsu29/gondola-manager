import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const certificateExpiries = await prisma.certificateExpiry.findMany({
    orderBy: { expiryDate: 'asc' }
  });
  return NextResponse.json(certificateExpiries);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const cert = await prisma.certificateExpiry.create({ data });
  return NextResponse.json(cert);
}
