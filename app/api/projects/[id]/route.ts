import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {

    const data = await req.json();

    // Extract and transform nested data as needed
    const { documents = [], gondolaIds = [], deliveryOrders = [], ...projectFields } = data;

    // Update gondolas and deliveryOrders by setting to new arrays
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...projectFields,
        gondolas: {
          set: gondolaIds.map((gid: string) => ({ id: gid })),
        },
        deliveryOrders: {
          set: deliveryOrders.map((order: any) => ({ id: order.id })),
        },
        // You may want to update documents similarly if needed
      },
      include: {
        documents: true,
        gondolas: {
          include: {
            documents: true,
            photos: true,
          },
        },
        deliveryOrders: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
    try {

      await prisma.project.delete({ where: { id } });
      return new NextResponse(null, { status: 204 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
  }