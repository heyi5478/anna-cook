import {
  NextApiRequest as OriginalNextApiRequest,
  NextApiResponse,
} from 'next';
import { authConfig, apiConfig } from '@/config';
import { setServerCookie } from '@/lib/utils';

// 擴展 NextApiRequest 類型，添加 user 屬性
declare module 'next' {
  interface NextApiRequest {
    user?: {
      DisplayId: string;
      Id: number;
    };
  }
}

/**
 * 解析 JWT Token 取得使用者資訊
 */
export const parseJWT = (token: string): { DisplayId: string; Id: number } => {
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
 * 從伺服器請求中獲取 JWT Token
 * 此函數可處理 NextApiRequest 並從其 cookies 屬性中提取 token
 * @param req Next.js API 請求物件
 * @returns JWT Token 或 null (如果未找到)
 */
export const getServerToken = (req: OriginalNextApiRequest): string | null => {
  // 從 Next.js 請求物件的 cookies 屬性中獲取 token
  const { cookies } = req;
  const token = cookies[authConfig.tokenCookieName];
  return token || null;
};

/**
 * 認證中間件
 * 檢查請求中是否有有效的認證 Token
 * 如果有，將其附加到 req 物件上，便於後續處理
 */
export const withAuth = (
  handler: (req: OriginalNextApiRequest, res: NextApiResponse) => Promise<void>,
) => {
  return async (req: OriginalNextApiRequest, res: NextApiResponse) => {
    // 從 Cookie 獲取 token
    const token = getServerToken(req);

    // 如果沒有 token，返回未授權錯誤
    if (!token) {
      return res.status(401).json({
        Status: false,
        Message: '未登入或 Token 不存在',
      });
    }

    try {
      // 檢查 token 是否有效
      // 如果需要驗證 token 有效性，可以在這裡向後端 API 發送請求
      // 為簡化流程，這裡僅解析 token 中的資訊
      const userData = parseJWT(token);

      // 將用戶數據附加到請求對象，方便後續處理
      req.user = userData;

      // 繼續處理請求
      return handler(req, res);
    } catch (error) {
      console.error('Token 驗證失敗:', error);
      return res.status(401).json({
        Status: false,
        Message: '身份驗證失敗',
      });
    }
  };
};

/**
 * 用於代理需要認證的 API 請求
 * 自動處理 token 傳遞和更新
 */
export const proxyAuthRequest = async (
  req: OriginalNextApiRequest,
  res: NextApiResponse,
  url: string,
  method: string = 'GET',
  body: any = null,
) => {
  // 獲取 token
  const token = getServerToken(req);

  if (!token) {
    return res.status(401).json({
      Status: false,
      Message: '未登入或 Token 不存在',
    });
  }

  try {
    // 構建請求選項
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // 如果提供了請求體且非 GET 請求，添加到請求選項
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    // 發送請求到後端 API
    const apiResponse = await fetch(`${apiConfig.baseUrl}${url}`, options);

    // 讀取並解析回應
    const data = await apiResponse.json();

    // 如果後端返回了新的 token，更新 cookie
    if (data.token || data.newToken) {
      const newToken = data.token || data.newToken;
      setServerCookie(res, newToken);
    }

    // 返回後端 API 回應
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    console.error(`代理認證請求失敗 (${url}):`, error);
    return res.status(500).json({
      Status: false,
      Message: '代理認證請求時發生錯誤',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
