// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'ログアウト成功' },
    { status: 200 }
  );

  response.cookies.set('token', '', {
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}