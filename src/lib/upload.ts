import formidable from 'formidable';
import fs from 'node:fs';

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

/**
 * 依大小上限建立 formidable 表單解析器；
 * 上傳超過 maxFileSize 時，parse 會拋出對應的 413 錯誤，避免無上限寫入。
 */
export const createUploadForm = (maxFileSize: number) =>
  formidable({ maxFileSize });

/**
 * 判斷 formidable 解析錯誤是否為「檔案超過大小上限」（httpCode 413）
 */
export const isFileTooLargeError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'httpCode' in error &&
  (error as { httpCode?: number }).httpCode === 413;

/**
 * 將磁碟上的暫存檔轉為 Blob。
 * 優先使用 openAsBlob（惰性讀取，不將整檔載入記憶體）；
 * 舊版 Node（< 20.4）不支援時，才後備為整檔讀取。
 */
export const fileToBlob = async (
  filepath: string,
  mimetype: string,
): Promise<Blob> => {
  const { openAsBlob } = fs as typeof fs & {
    openAsBlob?: (path: string, options?: { type?: string }) => Promise<Blob>;
  };

  if (typeof openAsBlob === 'function') {
    return openAsBlob(filepath, { type: mimetype });
  }

  const buffer = await fs.promises.readFile(filepath);
  return new Blob([buffer], { type: mimetype });
};
