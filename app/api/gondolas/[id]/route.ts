import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const data = await req.json();

  // Extract photos from request
  const { photos, ...rest } = data;

  // Fetch existing photos from DB
  const existingPhotos = await prisma.photo.findMany({ where: { gondolaId: id } });
  const incomingPhotoIds = (photos || []).filter((p: any) => p.id).map((p: any) => p.id);

  // Photos to delete (in DB but not in incoming)
  const photosToDelete = existingPhotos.filter((p) => !incomingPhotoIds.includes(p.id));

  // Separate new photos (no id) and existing (with id)
  const newPhotos = (photos || []).filter((p: any) => !p.id);
  const updatePhotos = (photos || []).filter((p: any) => p.id);

  // Build Prisma nested write
  const photoOps: any = {};
  if (photosToDelete.length > 0) {
    photoOps.deleteMany = photosToDelete.map((p) => ({ id: p.id }));
  }
  if (updatePhotos.length > 0) {
    photoOps.upsert = updatePhotos.map((p: any) => ({
      where: { id: p.id },
      update: {
        url: p.url,
        uploadedAt: new Date(p.uploadedAt),
        description: p.description,
      },
      create: {
        url: p.url,
        uploadedAt: new Date(p.uploadedAt),
        description: p.description,
        // gondolaId removed
      },
    }));
  }
  if (newPhotos.length > 0) {
    photoOps.create = newPhotos.map((p: any) => ({
      url: p.url,
      uploadedAt: new Date(p.uploadedAt),
      description: p.description,
      // gondolaId removed
    }));
  }

  const updated = await prisma.gondola.update({
    where: { id },
    data: {
      ...rest,
      photos: photoOps,
    },
    include: { photos: true },
  });
  return NextResponse.json(updated);
}


export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try{
    await prisma.gondola.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });

  }catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
 
}


