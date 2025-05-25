import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }
  // Find the verification token
  const verification = await prisma.verificationToken.findUnique({ where: { token } });
  if (!verification || verification.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
  // Confirm the user
  const updatedUser = await prisma.user.update({
    where: { id: verification.userId },
    data: { confirmed: true },
  });
  // Delete the token
  await prisma.verificationToken.delete({ where: { token } });
  console.log('User after verification:', updatedUser);
  return NextResponse.json({ success: true, user: updatedUser });
}
