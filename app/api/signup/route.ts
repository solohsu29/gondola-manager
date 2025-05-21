import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/utils/email';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
  
// Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a secure token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        emailVerified: null,
      },
    });
    // Send verification email
    await sendVerificationEmail({
      to: email,
      token: verificationToken,
    });
    return NextResponse.json({ message: 'User created. Please verify your email.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
