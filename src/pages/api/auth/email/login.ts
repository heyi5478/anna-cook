import type { NextApiRequest, NextApiResponse } from 'next';
import { loginWithEmail } from '@/services/api';
import { setServerCookie } from '@/lib/utils';

/**
 * 處理電子郵件登入請求
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允許' });
  }

  try {
    const { email, password } = req.body;

    // 驗證是否有必要的參數
    if (!email || !password) {
      return res.status(400).json({
        StatusCode: 400,
        msg: '請提供電子郵件和密碼',
      });
    }

    // 呼叫登入 API
    const response = await loginWithEmail(email, password);

    // 如果登入成功且有 token
    if (response.StatusCode === 200 && response.token) {
      // 設置 cookie
      setServerCookie(res, response.token);

      // 回傳成功訊息和使用者資料（不包含 token）
      return res.status(200).json({
        StatusCode: 200,
        msg: response.msg,
        userData: response.userData,
      });
    }

    // 登入失敗
    return res.status(401).json({
      StatusCode: response.StatusCode,
      msg: response.msg,
    });
  } catch (error) {
    console.error('處理登入請求時發生錯誤:', error);
    return res.status(500).json({
      StatusCode: 500,
      msg: '處理登入請求時發生錯誤',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
