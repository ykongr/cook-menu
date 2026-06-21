// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  console.log(`[Middleware] pathname: ${pathname}, hasToken: ${!!token}`);

  // ログイン・登録ページはスキップ（トークンなしでアクセス可能）
  if (pathname === '/login' || pathname === '/register') {
    // トークンがある場合はホームにリダイレクト
    if (token) {
      console.log(`[Middleware] Token exists on ${pathname}, redirecting to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log(`[Middleware] No token on ${pathname}, allowing access`);
    return NextResponse.next();
  }

  // その他のすべてのページはトークン確認が必須
  if (!token) {
    console.log(`[Middleware] No token on ${pathname}, redirecting to /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log(`[Middleware] Token exists on ${pathname}, allowing access`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\.ico|public).*)',
  ],
};