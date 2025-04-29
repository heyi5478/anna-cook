import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';

/**
 * 處理切換食譜發佈狀態請求，將請求代理到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 PATCH 請求
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: '方法不允許' });
  }

  // 從查詢參數中獲取食譜 ID
  const { recipeId } = req.query;

  if (!recipeId || Array.isArray(recipeId)) {
    return res.status(400).json({ error: '無效的食譜 ID' });
  }

  try {
    // 使用通用代理函數處理請求，並明確傳遞請求體
    return proxyAuthRequest(
      req,
      res,
      `/recipes/${recipeId}/publish`,
      'PATCH',
      req.body,
    );
  } catch (error) {
    console.error('處理切換食譜發佈狀態請求失敗:', error);
    return res.status(500).json({
      error: '處理請求時發生錯誤',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
