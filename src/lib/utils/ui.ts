import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合併 class 名稱並處理 Tailwind 類名沖突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
