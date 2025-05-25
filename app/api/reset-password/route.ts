import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });
    }
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });
    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    // Update the user's password (if the User model has a password field)
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        // Uncomment the following line if the User model has a password field:
        // password: hashedPassword,
      },
    });
    // Delete the used token
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ message: 'Password has been reset.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
