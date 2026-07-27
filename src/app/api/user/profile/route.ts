import { type NextRequest, NextResponse } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import { MAX_IMAGE_BYTES, IMAGE_MIME_WHITELIST } from '@/lib/upload';

// 獲取當前用戶資料，直接代理到後端 API
export async function GET(request: NextRequest) {
  return proxyAuthRequestApp(request, '/user/profile', 'GET');
}

// 更新用戶個人資料（multipart/form-data），驗證頭像後代理到後端 API
export async function PUT(request: NextRequest) {
  try {
    const incoming = await request.formData();
    const formData = new FormData();

    const accountName = incoming.get('accountName');
    if (typeof accountName === 'string') {
      formData.append('accountName', accountName);
    }
    const description = incoming.get('description');
    if (typeof description === 'string') {
      formData.append('description', description);
    }

    const photo = incoming.get('profilePhoto');
    if (photo instanceof File) {
      if (photo.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: '圖片檔案大小超過上限' },
          { status: 413 },
        );
      }
      if (!IMAGE_MIME_WHITELIST.includes(photo.type)) {
        return NextResponse.json(
          { error: '不支援的圖片檔案類型' },
          { status: 415 },
        );
      }
      formData.append('profilePhoto', photo, photo.name || 'profile.jpg');
    }

    return proxyAuthRequestApp(request, '/user/profile', 'PUT', formData);
  } catch (error) {
    console.error('處理更新用戶個人資料請求失敗:', error);
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
