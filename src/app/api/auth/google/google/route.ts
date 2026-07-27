import { NextResponse } from 'next/server';
import { fetchGoogleAuthUrl } from '@/services/auth';

// 處理 Google 登入請求：回傳後端提供的 Google 授權 URL
export async function GET() {
  try {
    const redirectUri = await fetchGoogleAuthUrl();
    return NextResponse.json({ redirectUri });
  } catch (error) {
    console.error('Google 登入錯誤:', error);
    return NextResponse.json(
      { error: '獲取 Google 登入 URL 時發生錯誤' },
      { status: 500 },
    );
  }
}
