import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { serialize, type SerializeOptions } from 'cookie';
import { authConfig } from '@/config';
import { RecipeDraftStep } from '@/types/api';
import type { Step } from '@/types/recipe';
import { COOKIE_EXPIRES } from '@/lib/constants';

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

/**
 * 生成唯一ID，用於標識片段
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * 格式化時間顯示 (秒)
 */
export const formatTime = (timeInSeconds: number): string => {
  return timeInSeconds.toFixed(2);
};

/**
 * 格式化時間為 mm:ss 格式
 */
export const formatTimeMinutes = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 檢查設備是否為行動裝置
 */
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : '',
  );
};

/**
 * 創建防抖動函數
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function debouncedFunction(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 轉換 API 回傳的步驟資料為元件使用的格式
 */
export const convertApiStepsToComponentSteps = (
  apiSteps: RecipeDraftStep[],
): Step[] => {
  return apiSteps.map((step) => ({
    id: step.stepId,
    startTime: step.videoStart,
    endTime: step.videoEnd,
    description: step.stepDescription,
  }));
};
