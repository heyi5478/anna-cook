/**
 * 時間相關常數
 */

// 時間轉換
export const TIME_CONVERSION = {
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
} as const;

// Cookie 過期時間 (秒)
export const COOKIE_EXPIRES = {
  TOKEN_EXPIRY_DAYS: 7,
  TOKEN_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7天轉換為秒數
} as const;

// Debounce 延遲時間 (毫秒)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  STEP_CHANGE: 10,
  FORM_SUBMIT: 50,
} as const;

// UI 操作延遲時間 (毫秒)
export const UI_DELAYS = {
  TOAST_REMOVE: 1000000, // Toast 移除延遲
  STEP_TRANSITION: 500, // 步驟切換延遲
  STATE_RESET: 50, // 狀態重置延遲
  ERROR_CLEAR: 100, // 錯誤清除延遲
  SMOOTH_TRANSITION: 10, // 平滑過渡延遲
  UPLOAD_PROGRESS_UPDATE: 500, // 上傳進度更新延遲
} as const;

// 倒數計時相關
export const COUNTDOWN = {
  LOGIN_VERIFY_SECONDS: 5, // 登入驗證頁面倒數時間
  TIMER_INTERVAL_MS: 1000, // 計時器間隔 (毫秒)
} as const;

// Next.js 重新驗證時間 (秒)
export const REVALIDATE_INTERVALS = {
  SHORT: 60, // 1分鐘
  MEDIUM: 3600, // 1小時
  LONG: 86400, // 1天
} as const;
