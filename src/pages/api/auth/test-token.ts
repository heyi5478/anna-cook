import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerToken } from '@/lib/auth-middleware';
import { getServerToken as getGenericServerToken } from '@/services/server-api';

/**
 * 測試 token 獲取函數
 * 這個 API 路由只用於開發環境，用來測試 token 獲取邏輯
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: '在生產環境中無法使用此測試路由' });
  }

  // 分別獲取兩種方式的 token
  const nextApiToken = getServerToken(req);
  const genericToken = getGenericServerToken(req);

  // 輸出結果讓我們判斷是否一致
  return res.status(200).json({
    nextApiToken: nextApiToken ? '有效 token' : '無 token',
    genericToken: genericToken ? '有效 token' : '無 token',
    areEqual: nextApiToken === genericToken,
  });
}
