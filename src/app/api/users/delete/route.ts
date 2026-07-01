import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    // トークンから userId を取得
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'トークンが見つかりません' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'トークンが無効です' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // ユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // ユーザーに紐づいた具材を削除
    await prisma.ingredient.deleteMany({
      where: {
        menu: {
          userId: userId,
        },
      },
    });

    // ユーザーに紐づいたメニューを削除
    await prisma.menu.deleteMany({
      where: { userId: userId },
    });

    // ユーザーを削除
    await prisma.user.delete({
      where: { id: userId },
    });

    // レスポンスを作成
    const response = NextResponse.json(
      { message: 'ユーザーが削除されました' },
      { status: 200 }
    );

    // クッキーをクリア
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    return NextResponse.json(
      { error: 'ユーザー削除エラーが発生しました' },
      { status: 500 }
    );
  }
}
