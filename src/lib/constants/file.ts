/**
 * 檔案相關常數
 */

// 支援的圖片格式
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

// 檔案驗證訊息
export const FILE_VALIDATION_MESSAGES = {
  INVALID_IMAGE_TYPE: '僅支援 JPG, JPEG 與 PNG 格式的圖片',
  UPLOAD_IMAGE_REQUIRED: '請上傳封面圖片',
  UPLOAD_VIDEO_REQUIRED: '請上傳影片：影片為必填欄位',
} as const;
