import { type NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/config';
import { HTTP_STATUS } from '@/lib/constants';

// 開發用測試路由：檢查 App Router 端能否由 request.cookies 讀到 token
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: '在生產環境中無法使用此測試路由' },
      { status: HTTP_STATUS.NOT_FOUND },
    );
  }

  const token = request.cookies.get(authConfig.tokenCookieName)?.value ?? null;
  return NextResponse.json({
    token: token ? '有效 token' : '無 token',
  });
}
