import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';

/**
 * 處理追蹤/取消追蹤用戶請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 POST 和 DELETE 請求
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: '方法不允許' });
  }

  // 從查詢參數中獲取用戶 ID
  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: '無效的用戶 ID' });
  }

  try {
    // 使用通用代理函數處理請求
    return proxyAuthRequest(req, res, `/users/${userId}/follow`, req.method);
  } catch (error) {
    const action = req.method === 'POST' ? '追蹤' : '取消追蹤';
    console.error(`處理${action}用戶請求失敗:`, error);
    return res.status(500).json({
      error: '處理請求時發生錯誤',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
