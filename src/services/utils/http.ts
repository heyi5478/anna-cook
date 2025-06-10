import { authConfig } from '@/config';
import { DEV_TEST_TOKEN, COMMON_TEXTS, COOKIE_EXPIRES } from '@/lib/constants';

/**
 * 從 Cookie 或 localStorage 獲取 JWT Token
 */
export const getAuthToken = (): string | null => {
  // 開發環境下使用測試 token
  if (process.env.NODE_ENV === 'development') {
    console.log(COMMON_TEXTS.DEV_ENVIRONMENT_TOKEN);
    return DEV_TEST_TOKEN;
  }

  // 在伺服器端 document 不存在
  if (typeof window === 'undefined') return null;

  // 1. 嘗試從 localStorage 獲取 token (如果存在)
  const localToken = localStorage.getItem('authToken');
  if (localToken) {
    return localToken;
  }

  // 2. 嘗試從 Cookie 獲取 Token (可能無法獲取 HttpOnly Cookie)
  const cookies = document.cookie.split(';');
  const authCookie = cookies
    .map((cookie) => cookie.trim().split('='))
    .find(([name]) => name === authConfig.tokenCookieName);

  if (authCookie) {
    return decodeURIComponent(authCookie[1]);
  }

  return null;
};

/**
 * 更新 Cookie 和 localStorage 中的 JWT Token
 */
export const updateAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;

  // 1. 更新 Cookie (可能由服務器設置為 HttpOnly)
  const expirationDate = new Date();
  expirationDate.setDate(
    expirationDate.getDate() + COOKIE_EXPIRES.TOKEN_EXPIRY_DAYS,
  );

  document.cookie = `${authConfig.tokenCookieName}=${encodeURIComponent(
    token,
  )}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict; Secure`;

  // 2. 同時存儲到 localStorage 以便客戶端讀取
  localStorage.setItem('authToken', token);
};
