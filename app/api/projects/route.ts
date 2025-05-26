import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      clientName: true,
      siteName: true,
      createdAt: true,
      startDate: true,
      endDate: true,
      status: true,
      gondolas: {
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
      },
      deliveryOrders: {
        select: {
          id: true,
          number: true,
          date: true,
          fileUrl: true,
          projectId: true,
        }
      },
      documents: {
        select: {
          id: true,
          type: true,
          name: true,
          uploadedAt: true,
          expiryDate: true,
          fileUrl: true,
          status: true,
          // content is intentionally excluded
        }
      }
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
          .map((doc: any) => {
            // Attach to gondola if gondolaId is present, otherwise to project
            const base = {
              ...doc,
              id: undefined,
              projectId: undefined,
              gondolaId: undefined,
            };
            if (doc.gondolaId) {
              return { ...base, gondolaId: doc.gondolaId };
            } else {
              return { ...base, projectId: undefined };
            }
          }),
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
