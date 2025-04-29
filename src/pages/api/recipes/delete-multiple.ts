import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';

/**
 * 處理批量刪除食譜請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 PATCH 請求
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: '方法不允許' });
  }

  try {
    // 使用通用代理函數處理請求
    return proxyAuthRequest(req, res, '/recipes/delete-multiple', 'PATCH');
  } catch (error) {
    console.error('處理批量刪除食譜請求失敗:', error);
    return res.status(500).json({
      error: '處理請求時發生錯誤',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
