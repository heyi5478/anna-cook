/**
 * 上傳檔案大小上限（bytes）。
 * 注意：此為前端保守預設值，實際上線前應與後端限制對齊。
 */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB（涵蓋高解析手機照片）
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

/**
 * 允許的圖片 MIME 類型白名單
 */
export const IMAGE_MIME_WHITELIST: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * 允許的影片 MIME 類型白名單
 */
export const VIDEO_MIME_WHITELIST: readonly string[] = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
];
