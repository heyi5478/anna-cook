import { NextResponse } from 'next/server';
import { authConfig } from '@/config';

// 處理用戶登出：以過期 cookie 使 token 失效
export async function POST() {
  try {
    const response = NextResponse.json({ message: '登出成功' });
    response.cookies.set(authConfig.tokenCookieName, '', {
      maxAge: -1,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.error('登出處理失敗:', error);
    return NextResponse.json(
      { message: '登出處理過程中發生錯誤' },
      { status: 500 },
    );
  }
}
