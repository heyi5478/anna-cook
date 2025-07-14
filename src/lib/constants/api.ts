/**
 * API 相關常數
 */

// HTTP 狀態碼
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API 排序類型
export const SORT_TYPES = {
  LATEST: 'latest',
  POPULAR: 'popular',
  CLASSIC: 'classic',
  CREATED_AT: 'createdAt',
} as const;

// 開發環境測試 Token (從環境變數中取得，僅在開發環境使用)
export const DEV_TEST_TOKEN =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_TEST_TOKEN || ''
    : '';

// 分頁預設值
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;
