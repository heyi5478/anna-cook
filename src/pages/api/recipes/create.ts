import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
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
 * 處理食譜創建請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res
      .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .json({ error: '方法不允許' });
  }

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

    // 添加食譜名稱
    if (fields.recipeName && fields.recipeName[0]) {
      formData.append('recipeName', fields.recipeName[0]);
    } else {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: '食譜名稱為必填欄位' });
    }

    // 驗證封面圖片存在與 MIME 型別，並以串流方式轉為 Blob
    const file = files.photo?.[0];
    if (!file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: VALIDATION_MESSAGES.UPLOAD_IMAGE_REQUIRED });
    }
    if (!file.mimetype || !IMAGE_MIME_WHITELIST.includes(file.mimetype)) {
      return res.status(415).json({ error: '不支援的圖片檔案類型' });
    }
    formData.append(
      'photo',
      await fileToBlob(file.filepath, file.mimetype),
      file.originalFilename || 'image.jpg',
    );

    // 使用通用代理函數處理請求
    return proxyAuthRequest(req, res, '/recipes', 'POST', formData);
  } catch (error) {
    console.error('處理食譜創建請求失敗:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: '處理請求時發生錯誤',
    });
  }
}
