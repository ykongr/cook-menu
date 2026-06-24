import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'パスワードが間違っています' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);

    const response = NextResponse.json(
      { message: 'ログイン成功', userId: user.id },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'ログインエラー' },
      { status: 500 }
    );
  }
}
