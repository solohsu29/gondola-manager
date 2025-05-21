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
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verificationToken: null,
      },
    });
    return NextResponse.json({ message: 'Password has been reset.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
