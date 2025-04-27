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
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: authConfig.tokenExpiryDays * 24 * 60 * 60, // 天數轉為秒數
    path: '/',
    ...options,
  };

  defaultOptions.httpOnly = true;

  const cookieString = serialize(name, value, defaultOptions);
  document.cookie = cookieString;
  console.log(
    '警告：HttpOnly cookie 無法透過客戶端 JavaScript 設置，請使用 API 路由',
  );

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
    maxAge: authConfig.tokenExpiryDays * 24 * 60 * 60, // 天數轉為秒數
    path: '/',
    ...options,
  };

  const cookieString = serialize(name, value, defaultOptions);
  res.setHeader('Set-Cookie', cookieString);
  console.log('已設定 cookie:', cookieString);
}
