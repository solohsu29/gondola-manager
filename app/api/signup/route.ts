import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/utils/email';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    // Hash the password before saving (if you want to store passwords)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user with confirmed=false
    const user = await prisma.user.create({
      data: {
        email,
        username: username || null,
        confirmed: false,
        blocked: false,
        // You can add hashedPassword to a separate Password table if needed
      },
    });

    // Create profile for the new user
    const profile = await prisma.profile.create({
      data: {
        name: username || '', // or use a 'name' field from signup if available
        phNumber: '', // fill from signup if available
        // add more fields as needed
      },
    });

    // Link user to profile
    await prisma.user.update({
      where: { id: user.id },
      data: { profileId: profile.id },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry
    await prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
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
