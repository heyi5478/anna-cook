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

// 開發環境測試 Token
export const DEV_TEST_TOKEN =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6MjksIkRpc3BsYXlJZCI6Ik0wMDAwMDIiLCJBY2NvdW50RW1haWwiOiJhMTIzQGdtYWlsLmNvbSIsIkFjY291bnROYW1lIjoiQWxpY2UiLCJSb2xlIjowLCJMb2dpblByb3ZpZGVyIjowLCJFeHAiOiIyMDI1LTA0LTI3VDEyOjM4OjA0LjIyNDg3OTlaIn0.MjTGyLcMjwBKq_BkySyPk2aIjfKmx_SzY8O3cLcRNYfY5ksh4oPbAXCTwYRTJTAANAzyGwC3F1siYfXh5FYl5g';

// 分頁預設值
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;
