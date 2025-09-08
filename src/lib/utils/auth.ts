import { serialize, type SerializeOptions } from 'cookie';
import { authConfig } from '@/config';
import { COOKIE_EXPIRES } from '@/lib/constants';

/**
 * 在客戶端設置 cookie
 */
export function setClientCookie(
  value: string,
  options: Partial<SerializeOptions> = {},
  name: string = authConfig.tokenCookieName,
): string {
  if (typeof document === 'undefined') return '';

  const defaultOptions: SerializeOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_EXPIRES.TOKEN_EXPIRY_SECONDS,
    path: '/',
    ...options,
  };

  const cookieString = serialize(name, value, defaultOptions);
  document.cookie = cookieString;
  console.log('已設置可讀取的 cookie (非 HttpOnly)，用於客戶端直接上傳');

  return cookieString;
}

/**
 * 在伺服器端設置 cookie (用於 API 路由)
 */
export function setServerCookie(
  res: any, // Next.js Response 物件
  value: string,
  options: Partial<SerializeOptions> = {},
  name: string = authConfig.tokenCookieName,
): void {
  const defaultOptions: SerializeOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_EXPIRES.TOKEN_EXPIRY_SECONDS,
    path: '/',
    ...options,
  };

  const cookieString = serialize(name, value, defaultOptions);
  res.setHeader('Set-Cookie', cookieString);
  console.log('已設定非 HttpOnly cookie 允許 JavaScript 讀取:', cookieString);
}
