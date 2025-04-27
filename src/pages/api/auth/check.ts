import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyAuthRequest } from '@/lib/auth-middleware';

/**
 * 代理處理認證檢查請求，從伺服器端 Cookie 獲取 token
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允許' });
  }

  // 使用通用代理函數處理認證請求
  return proxyAuthRequest(req, res, '/check');
}
