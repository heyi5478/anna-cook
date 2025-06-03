/**
 * UI 元件相關常數
 */

// 時間單位選項
export const TIME_UNITS = {
  MINUTES: '分鐘',
  HOURS: '小時',
} as const;

// 份量單位選項
export const SERVING_UNITS = {
  PERSON: '人份',
  PORTIONS: '份',
} as const;

// 評分最大值
export const MAX_RATING = 5;

// 預設時間值
export const DEFAULT_TIME_VALUES = {
  START_TIME: 0,
  END_TIME: 10,
  STEP_INTERVAL: 5,
} as const;

// UI 顯示文字
export const UI_TEXT = {
  PLACEHOLDER_STEP: '請輸入步驟說明',
  LOADING: '載入中...',
  SUBMITTING: '提交中...',
  UPLOADING: '上傳中...',
  CANCEL: '取消',
  CONFIRM: '確認',
  SAVE: '儲存',
  DELETE: '刪除',
  COMPLETE: '完成',
} as const;

// 影片播放器設定
export const VIDEO_PLAYER = {
  DEFAULT_WIDTH: 640,
  ASPECT_RATIO: 16 / 9, // 16:9 比例
  DEFAULT_HEIGHT: 360, // 640 * 9 / 16
} as const;

// 影片片段時間限制 (秒)
export const VIDEO_SEGMENT_LIMITS = {
  MIN_DURATION: 5, // 最短片段時間
  MAX_DURATION: 30, // 最長片段時間
  IDEAL_MIN: 10, // 理想最短時間
  IDEAL_MAX: 25, // 理想最長時間
} as const;

// 影片片段狀態文字
export const VIDEO_SEGMENT_STATUS = {
  TOO_SHORT: '時間太短 (建議至少5秒)',
  TOO_LONG: '時間太長 (建議不超過30秒)',
  SLIGHTLY_SHORT: '時間略短 (適中為10-25秒)',
  SLIGHTLY_LONG: '時間略長 (適中為10-25秒)',
  IDEAL: '時間長度適中',
} as const;
