import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';
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
      // 使用 formidable 解析表單數據
      const form = formidable({});
      const [fields, files] = await form.parse(req);

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

      // 添加頭像照片，如果有
      if (files.profilePhoto && files.profilePhoto[0]) {
        const file = files.profilePhoto[0];
        const fileContent = fs.readFileSync(file.filepath);
        formData.append(
          'profilePhoto',
          new Blob([fileContent], {
            type: file.mimetype || 'image/jpeg',
          }),
          file.originalFilename || 'profile.jpg',
        );
      }

      // 使用通用代理函數處理請求
      return proxyAuthRequest(req, res, '/user/profile', 'PUT', formData);
    } catch (error) {
      console.error('處理更新用戶個人資料請求失敗:', error);
      return res.status(500).json({
        error: '處理請求時發生錯誤',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    // 不支援的 HTTP 方法
    return res.status(405).json({ error: '方法不允許' });
  }
}
