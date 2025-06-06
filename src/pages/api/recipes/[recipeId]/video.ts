import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
// 需要安裝: npm install formidable @types/formidable
import formidable from 'formidable';
import fs from 'fs';

// 禁用默認的 body parser，因為我們需要處理 multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * 處理食譜影片上傳請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 PUT 請求
  if (req.method !== 'PUT') {
    return res
      .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .json({ error: '方法不允許' });
  }

  // 從查詢參數中獲取食譜 ID
  const { recipeId } = req.query;

  if (!recipeId || Array.isArray(recipeId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: '無效的食譜 ID' });
  }

  try {
    // 使用 formidable 解析表單數據
    const form = formidable({});
    const [, files] = await form.parse(req);

    // 創建一個新的 FormData 對象來發送到後端
    const formData = new FormData();

    // 添加影片檔案
    if (files.video && files.video[0]) {
      const file = files.video[0];
      const fileContent = fs.readFileSync(file.filepath);
      formData.append(
        'video',
        new Blob([fileContent], {
          type: file.mimetype || 'video/mp4',
        }),
        file.originalFilename || 'video.mp4',
      );
    } else {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: VALIDATION_MESSAGES.UPLOAD_VIDEO_REQUIRED });
    }

    // 使用通用代理函數處理請求
    return proxyAuthRequest(
      req,
      res,
      `/recipes/${recipeId}/video`,
      'PUT',
      formData,
    );
  } catch (error) {
    console.error('處理食譜影片上傳請求失敗:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: '處理請求時發生錯誤',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
