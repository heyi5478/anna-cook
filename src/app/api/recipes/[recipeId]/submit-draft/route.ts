import { type NextRequest, NextResponse } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import { MAX_IMAGE_BYTES, IMAGE_MIME_WHITELIST } from '@/lib/upload';

// 處理提交食譜草稿請求（multipart/form-data），代理到後端 API
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await params;

  try {
    const incoming = await request.formData();
    const formData = new FormData();

    const recipeName = incoming.get('recipeName');
    if (typeof recipeName === 'string') {
      formData.append('recipeName', recipeName);
    }
    const detail = incoming.get('detail');
    if (typeof detail === 'string') {
      formData.append('detail', detail);
    }
    const steps = incoming.get('steps');
    if (typeof steps === 'string') {
      formData.append('steps', steps);
    }

    const photo = incoming.get('photo');
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
      formData.append('photo', photo, photo.name || 'image.jpg');
    }

    return proxyAuthRequestApp(
      request,
      `/recipes/${encodeURIComponent(recipeId)}/submit-draft`,
      'POST',
      formData,
    );
  } catch (error) {
    console.error('處理提交食譜草稿請求失敗:', error);
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
