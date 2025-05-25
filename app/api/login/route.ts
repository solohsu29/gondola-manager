import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signJwt } from '@/utils/jwt';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (!user.confirmed) {
      return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
    }
    // Generate JWT and set as cookie
    const token = signJwt({ id: user.id, email: user.email, username: user.username, confirmed: user.confirmed });
    const response = NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, confirmed: user.confirmed } });
    response.headers.set('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }));
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
