import type { NextApiRequest, NextApiResponse } from 'next';
import { setServerCookie } from '@/lib/utils';
import { exchangeGoogleCodeForToken } from '@/services/auth';

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
    console.log('code', code);

    // 驗證是否有 code 參數
    if (!code) {
      console.error('Google 回調缺少授權碼');
      return res.status(401).json({ StatusCode: 401, msg: '未收到授權碼' });
    }

    console.log('收到 Google 回調，授權碼:', code);

    // 使用 API 服務發送授權碼給後端
    const data = await exchangeGoogleCodeForToken(code as string);
    const { token } = data;
    console.log('token', token);

    if (!token) {
      throw new Error('後端未提供 token');
    }

    // 使用 utils 中的函式設置 cookie
    setServerCookie(res, token);

    // 重定向到首頁
    res.writeHead(302, { Location: '/' });
    return res.end();
  } catch (error) {
    console.error('處理 Google 回調時發生錯誤:', error);
    return res.status(500).json({
      StatusCode: 500,
      msg: '處理 Google 回調時發生錯誤',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
