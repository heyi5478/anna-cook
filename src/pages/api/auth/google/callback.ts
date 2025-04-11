import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 處理 Google OAuth 登入回調
 * 注意：需在 Google Cloud Console 中設定 Redirect URI 為：
 * http://localhost:3000/api/auth/google/callback
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
    // 從查詢參數中獲取授權碼
    const { code } = req.query;

    // 驗證是否有 code 參數
    if (!code) {
      console.error('Google 回調缺少授權碼');
      return res.status(400).json({ error: '缺少授權碼參數' });
    }

    console.log('收到 Google 回調，授權碼:', code);

    // 完成處理後，將使用者重定向到首頁
    res.setHeader('Location', '/');
    return res.status(302).end();
  } catch (error) {
    console.error('處理 Google 回調時發生錯誤:', error);
    return res.status(500).json({ error: '處理 Google 回調時發生錯誤' });
  }
}
