import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';

/**
 * 處理獲取作者食譜列表請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允許' });
  }

  // 從查詢參數中獲取用戶顯示 ID
  const { displayId } = req.query;

  if (!displayId || Array.isArray(displayId)) {
    return res.status(400).json({ error: '無效的用戶 ID' });
  }

  // 獲取其他查詢參數
  const { isPublished } = req.query;

  try {
    // 構建 API 路徑
    const apiPath = `/user/${displayId}/author-recipes${
      isPublished !== undefined ? `?isPublished=${isPublished}` : ''
    }`;

    // 使用通用代理函數處理請求
    return proxyAuthRequest(req, res, apiPath, 'GET');
  } catch (error) {
    console.error('處理獲取作者食譜列表請求失敗:', error);
    return res.status(500).json({
      error: '處理請求時發生錯誤',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
