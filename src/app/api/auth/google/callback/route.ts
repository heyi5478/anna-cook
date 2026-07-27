import { type NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCodeForToken } from '@/services/auth';
import { authConfig } from '@/config';
import { COOKIE_EXPIRES } from '@/lib/constants/time';

// 處理 Google OAuth 登入回調（Google Cloud Console 的 Redirect URI: /api/auth/google/callback）
// 註：Tier-C 的 OAuth state 驗證未來加在此處（需後端配合），本次先原樣遷移
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
      console.error('Google 回調缺少授權碼');
      return NextResponse.json(
        { StatusCode: 401, msg: '未收到授權碼' },
        { status: 401 },
      );
    }

    const data = await exchangeGoogleCodeForToken(code);
    const { token } = data;

    if (!token) {
      throw new Error('後端未提供 token');
    }

    // 設置 cookie 後重定向到首頁
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set(authConfig.tokenCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_EXPIRES.TOKEN_EXPIRY_SECONDS,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('處理 Google 回調時發生錯誤:', error);
    return NextResponse.json(
      { StatusCode: 500, msg: '處理 Google 回調時發生錯誤' },
      { status: 500 },
    );
  }
}
