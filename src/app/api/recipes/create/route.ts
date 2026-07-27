import { type NextRequest, NextResponse } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
import { MAX_IMAGE_BYTES, IMAGE_MIME_WHITELIST } from '@/lib/upload';

// 處理食譜創建請求（multipart/form-data），驗證封面圖後代理到後端 API
export async function POST(request: NextRequest) {
  try {
    const incoming = await request.formData();

    const recipeName = incoming.get('recipeName');
    if (typeof recipeName !== 'string' || !recipeName) {
      return NextResponse.json(
        { error: '食譜名稱為必填欄位' },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const photo = incoming.get('photo');
    if (!(photo instanceof File)) {
      return NextResponse.json(
        { error: VALIDATION_MESSAGES.UPLOAD_IMAGE_REQUIRED },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }
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

    const formData = new FormData();
    formData.append('recipeName', recipeName);
    formData.append('photo', photo, photo.name || 'image.jpg');

    return proxyAuthRequestApp(request, '/recipes', 'POST', formData);
  } catch (error) {
    console.error('處理食譜創建請求失敗:', error);
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
