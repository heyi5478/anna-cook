import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';
import { HTTP_STATUS } from '@/lib/constants';

/**
 * 處理獲取用戶個人資料請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res
      .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .json({ error: '方法不允許' });
  }

  // 從查詢參數中獲取用戶顯示 ID
  const { displayId } = req.query;

  if (!displayId || Array.isArray(displayId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: '無效的用戶 ID' });
  }

  try {
    // 使用通用代理函數處理請求
    return proxyAuthRequest(req, res, `/user/${displayId}`, 'GET');
  } catch (error) {
    console.error('處理獲取用戶個人資料請求失敗:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: '處理請求時發生錯誤',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
