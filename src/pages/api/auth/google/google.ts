import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchGoogleAuthUrl } from '@/services/api';

/**
 * 處理 Google 登入請求
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允許' });
  }

  try {
    // 獲取 Google 登入 URL
    const redirectUri = await fetchGoogleAuthUrl();

    // 成功取得 URL，將其返回給前端
    return res.status(200).json({ redirectUri });
  } catch (error) {
    console.error('Google 登入錯誤:', error);
    return res.status(500).json({ error: '獲取 Google 登入 URL 時發生錯誤' });
  }
}
