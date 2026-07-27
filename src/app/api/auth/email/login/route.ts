import { type NextRequest, NextResponse } from 'next/server';
import { loginWithEmail } from '@/services/auth';
import { HTTP_STATUS } from '@/lib/constants';
import { authConfig } from '@/config';
import { COOKIE_EXPIRES } from '@/lib/constants/time';

// 處理電子郵件登入請求：成功則設置 token cookie
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json().catch(() => ({}));

    if (!email || !password) {
      return NextResponse.json(
        { StatusCode: HTTP_STATUS.BAD_REQUEST, msg: '請提供電子郵件和密碼' },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const response = await loginWithEmail(email, password);

    if (response.StatusCode === HTTP_STATUS.OK && response.token) {
      const res = NextResponse.json({
        StatusCode: HTTP_STATUS.OK,
        msg: response.msg,
        userData: response.userData,
      });
      res.cookies.set(authConfig.tokenCookieName, response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_EXPIRES.TOKEN_EXPIRY_SECONDS,
        path: '/',
      });
      return res;
    }

    return NextResponse.json(
      { StatusCode: response.StatusCode, msg: response.msg },
      { status: HTTP_STATUS.UNAUTHORIZED },
    );
  } catch (error) {
    console.error('處理登入請求時發生錯誤:', error);
    return NextResponse.json(
      {
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: '處理登入請求時發生錯誤',
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
