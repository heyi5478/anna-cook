import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { authConfig } from '@/config';

/**
 * 處理用戶登出的 API route
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不被允許' });
  }

  try {
    // 建立過期的 cookie，使 token 失效
    const cookie = serialize(authConfig.tokenCookieName, '', {
      maxAge: -1,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true,
    });

    // 設置 cookie 到回應中
    res.setHeader('Set-Cookie', cookie);

    // 回傳成功訊息
    return res.status(200).json({ message: '登出成功' });
  } catch (error) {
    console.error('登出處理失敗:', error);
    return res.status(500).json({ message: '登出處理過程中發生錯誤' });
  }
}
