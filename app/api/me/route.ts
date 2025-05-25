import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = verifyJwt(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  return NextResponse.json({ user });
}
