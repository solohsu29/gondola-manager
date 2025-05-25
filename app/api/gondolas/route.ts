import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all gondolas
export async function GET() {
  const gondolas = await prisma.gondola.findMany({
    include: { photos: true, documents: true },
  });
  return NextResponse.json(gondolas);
}

// POST a new gondola
export async function POST(req: NextRequest) {
  const data = await req.json()
  const gondola = await prisma.gondola.create({ data })
  return NextResponse.json(gondola)
}
