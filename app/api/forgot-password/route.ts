import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendVerificationEmail, sendResetPasswordEmail } from '@/utils/email';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
    }
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { email },
      data: { verificationToken: resetToken },
    });
    // Send reset password email
    await sendResetPasswordEmail({
      to: email,
      token: resetToken,
    });
    return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
