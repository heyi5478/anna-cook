import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { serialize, type SerializeOptions } from 'cookie';
import { authConfig } from '@/config';

/**
 * 合併 class 名稱並處理 Tailwind 類名沖突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    maxAge: authConfig.tokenExpiryDays * 24 * 60 * 60, // 天數轉為秒數
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
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: authConfig.tokenExpiryDays * 24 * 60 * 60, // 天數轉為秒數
    path: '/',
    ...options,
  };

  const cookieString = serialize(name, value, defaultOptions);
  res.setHeader('Set-Cookie', cookieString);
  console.log('已設定非 HttpOnly cookie 允許 JavaScript 讀取:', cookieString);
}
