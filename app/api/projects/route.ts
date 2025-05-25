import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      gondolas: {
        include: {
          documents: true,
          photos: true,
        },
      },
      deliveryOrders: true,
      documents: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Extract and transform nested data
  const { documents = [], gondolas = [], deliveryOrders = [], ...projectFields } = data;

  // Prepare nested create/connect for Prisma
  const project = await prisma.project.create({
    data: {
      ...projectFields,
      documents: {
        create: documents
          .filter((doc: any) => !doc.id || doc.id.startsWith('preview-') || doc.id.length < 24) // Only create new docs
          .map((doc: any) => ({
            ...doc,
            id: undefined,
            projectId: undefined,
            gondolaId: doc.gondolaId || undefined,
          })),
      },
      gondolas: {
        connect: gondolas.map((g: any) => ({ id: g.id })),
      },
      deliveryOrders: {
        create: deliveryOrders.map((order: any) => ({
          ...order,
          id: undefined,
          projectId: undefined,
        })),
      },
    },
    include: {
      documents: true,
      gondolas: true,
      deliveryOrders: true,
    }
  });

  return NextResponse.json(project);
}
