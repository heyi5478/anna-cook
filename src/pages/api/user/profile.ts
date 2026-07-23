import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import {
  createUploadForm,
  MAX_IMAGE_BYTES,
  IMAGE_MIME_WHITELIST,
  isFileTooLargeError,
  fileToBlob,
} from '@/lib/upload';

// 禁用默認的 body parser，因為我們需要處理 multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * 處理用戶個人資料相關請求，根據請求方法執行不同操作
 * GET: 獲取當前用戶資料
 * PUT: 更新用戶個人資料
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 根據請求方法分別處理
  if (req.method === 'GET') {
    // 處理 GET 請求，直接代理到後端 API
    return proxyAuthRequest(req, res, '/user/profile', 'GET');
  }
  if (req.method === 'PUT') {
    try {
      // 依大小上限建立表單解析器，超過上限會拋出 413
      const form = createUploadForm(MAX_IMAGE_BYTES);
      const parseResult = await form.parse(req).catch((parseError: unknown) => {
        if (isFileTooLargeError(parseError)) return 'TOO_LARGE' as const;
        throw parseError;
      });

      if (parseResult === 'TOO_LARGE') {
        return res.status(413).json({ error: '圖片檔案大小超過上限' });
      }

      const [fields, files] = parseResult;

      // 創建一個新的 FormData 對象來發送到後端
      const formData = new FormData();

      // 添加帳號名稱
      if (fields.accountName && fields.accountName[0]) {
        formData.append('accountName', fields.accountName[0]);
      }

      // 添加描述
      if (fields.description && fields.description[0]) {
        formData.append('description', fields.description[0]);
      }

      // 添加頭像照片，如果有（驗證 MIME 型別後以串流方式轉為 Blob）
      const file = files.profilePhoto?.[0];
      if (file) {
        if (!file.mimetype || !IMAGE_MIME_WHITELIST.includes(file.mimetype)) {
          return res.status(415).json({ error: '不支援的圖片檔案類型' });
        }
        formData.append(
          'profilePhoto',
          await fileToBlob(file.filepath, file.mimetype),
          file.originalFilename || 'profile.jpg',
        );
      }

      // 使用通用代理函數處理請求
      return proxyAuthRequest(req, res, '/user/profile', 'PUT', formData);
    } catch (error) {
      console.error('處理更新用戶個人資料請求失敗:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: '處理請求時發生錯誤',
      });
    }
  } else {
    // 不支援的 HTTP 方法
    return res
      .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .json({ error: '方法不允許' });
  }
}
