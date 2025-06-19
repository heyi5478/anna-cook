import {
  NextApiRequest as OriginalNextApiRequest,
  NextApiResponse,
} from 'next';
import { authConfig, getApiConfig } from '@/config';
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
        Authorization: `Bearer ${token}`,
      },
    };

    // 如果沒有明確傳入 body 但原始請求有 body，則使用原始請求的 body
    const requestBody = body !== null ? body : req.body;

    // 如果提供了請求體且非 GET 請求，添加到請求選項
    if (requestBody && method !== 'GET') {
      if (requestBody instanceof FormData) {
        // 如果是 FormData，直接使用，不設置 Content-Type
        // 讓瀏覽器自動加上包含 boundary 的 multipart/form-data
        options.body = requestBody;
      } else {
        // 如果是普通 JSON 物件，設置 Content-Type 並序列化
        options.headers = {
          ...(options.headers as Record<string, string>),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
        options.body = JSON.stringify(requestBody);
      }
    }

    // 從原始請求中獲取並附加查詢參數（若有）
    let apiUrl = `${getApiConfig().baseUrl}${url}`;
    const queryString = Object.keys(req.query)
      .filter((key) => !['recipeId', 'userId', 'displayId'].includes(key)) // 排除路徑參數
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(req.query[key] as string)}`,
      )
      .join('&');

    if (queryString) {
      apiUrl += (apiUrl.includes('?') ? '&' : '?') + queryString;
    }

    // 建立日誌用的 headers 物件，安全地提取 Content-Type
    const logHeaders = options.headers
      ? { ...(options.headers as Record<string, string>) }
      : {};
    const contentType = logHeaders['Content-Type'] || '未設定';

    console.log(`代理請求到 ${apiUrl}`, {
      method,
      hasBody: !!requestBody,
      bodyType: requestBody ? typeof requestBody : 'none',
      contentType,
    });

    // 發送請求到後端 API
    const apiResponse = await fetch(apiUrl, options);

    // 先獲取回應文本
    const responseText = await apiResponse.text();

    // 嘗試解析回應為 JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('解析回應 JSON 失敗:', {
        status: apiResponse.status,
        text:
          responseText.substring(0, 200) +
          (responseText.length > 200 ? '...' : ''),
        error: e,
      });

      // 如果無法解析為 JSON，返回原始錯誤
      return res.status(500).json({
        Status: false,
        Message: '從後端 API 接收到無效的回應格式',
        error: `無法解析回應為 JSON: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`,
      });
    }

    // 如果後端返回了新的 token，更新 cookie
    if (data && (data.token || data.newToken)) {
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
