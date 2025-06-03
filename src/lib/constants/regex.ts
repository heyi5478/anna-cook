/**
 * 正則表達式常數
 */

// 數字驗證
export const REGEX_PATTERNS = {
  // 純數字驗證（用於表單輸入）
  NUMERIC_ONLY: /^\d*$/,

  // 小數數字解析（用於食材數量解析）
  DECIMAL_NUMBERS: /^(\d+(?:\.\d+)?)\s*(.*)$/,

  // Vimeo 影片 ID 提取
  VIMEO_ID: /\/videos\/(\d+)/,
  VIMEO_URL: /vimeo\.com\/(\d+)/,

  // 通用影片路徑 ID 提取
  VIDEO_PATH: /\/(\d+)(?:\/|$)/,
} as const;
