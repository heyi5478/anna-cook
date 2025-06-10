import type { ReactNode } from 'react';

/**
 * 基礎元件 Props 類型
 */
export type BaseComponentProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * 載入狀態類型
 */
export type LoadingState = {
  loading: boolean;
  error: string | null;
};

/**
 * 分頁狀態類型
 */
export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};

/**
 * 表單狀態類型
 */
export type FormState = {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};
