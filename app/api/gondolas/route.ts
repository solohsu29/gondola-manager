import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all gondolas
export async function GET() {
  const gondolas = await prisma.gondola.findMany({
    select: {
      id: true,
      serialNumber: true,
      status: true,
      bay: true,
      floor: true,
      block: true,
      elevation: true,
      deployedAt: true,
      lastInspection: true,
      nextInspection: true,
      documents: {
        select: {
          id: true,
          type: true,
          name: true,
          uploadedAt: true,
          expiryDate: true,
          fileUrl: true,
          status: true,
          gondolaId: true,
          // content is intentionally excluded
        }
      },
      photos: {
        select: {
          id: true,
          url: true,
          uploadedAt: true,
          description: true,
          gondolaId: true,
          // content, mimeType are excluded
        }
      }
    }
  });
  return NextResponse.json(gondolas);
}

// POST a new gondola
export async function POST(req: NextRequest) {
  const data = await req.json()
  const gondola = await prisma.gondola.create({ data })
  return NextResponse.json(gondola)
}
