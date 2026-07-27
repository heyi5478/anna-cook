import { type NextRequest, NextResponse } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
import { MAX_VIDEO_BYTES, VIDEO_MIME_WHITELIST } from '@/lib/upload';

// 處理食譜影片上傳請求（multipart/form-data），驗證影片後代理到後端 API
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await params;

  try {
    const incoming = await request.formData();

    const video = incoming.get('video');
    if (!(video instanceof File)) {
      return NextResponse.json(
        { error: VALIDATION_MESSAGES.UPLOAD_VIDEO_REQUIRED },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }
    if (video.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: '影片檔案大小超過上限' },
        { status: 413 },
      );
    }
    if (!VIDEO_MIME_WHITELIST.includes(video.type)) {
      return NextResponse.json(
        { error: '不支援的影片檔案類型' },
        { status: 415 },
      );
    }

    const formData = new FormData();
    formData.append('video', video, video.name || 'video.mp4');

    return proxyAuthRequestApp(
      request,
      `/recipes/${encodeURIComponent(recipeId)}/video`,
      'PUT',
      formData,
    );
  } catch (error) {
    console.error('處理食譜影片上傳請求失敗:', error);
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
