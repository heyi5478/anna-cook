import type { NextApiRequest, NextApiResponse } from 'next';
import { authConfig } from '@/config';

/**
 * 解析 JWT Token 取得使用者資訊
 */
const parseJWT = (token: string): { DisplayId: string; Id: number } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('解析 JWT 失敗:', e);
    return { DisplayId: '', Id: 0 };
  }
};

/**
 * 驗證當前登入用戶是否與請求中的 displayId 匹配
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
    // 從請求中獲取 token 和要檢查的 displayId
    const { displayId } = req.body;

    if (!displayId) {
      return res.status(400).json({
        isCurrentUser: false,
        message: '缺少 displayId 參數',
      });
    }

    // 從 cookie 中獲取 token
    const { cookies } = req;
    const token = cookies[authConfig.tokenCookieName];

    // 如果沒有 token，則不是登入用戶
    if (!token) {
      return res.status(200).json({ isCurrentUser: false });
    }

    // 解析 token 並驗證是否與 displayId 匹配
    const tokenData = parseJWT(token);
    const isCurrentUser = tokenData.DisplayId === displayId;

    // 回傳結果
    return res.status(200).json({ isCurrentUser });
  } catch (error) {
    console.error('檢查當前用戶時發生錯誤:', error);
    return res.status(500).json({
      isCurrentUser: false,
      message: '驗證過程中發生錯誤',
    });
  }
}
