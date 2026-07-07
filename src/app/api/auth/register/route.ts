// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    const validation = validatePassword(password);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join('\n') },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に使用されています' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = generateToken(user.id);

    const response = NextResponse.json(
      { message: '登録成功', userId: user.id },
      { status: 201 }
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
      { error: '登録エラー' },
      { status: 500 }
    );
  }
}