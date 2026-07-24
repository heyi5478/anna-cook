import { test, expect } from '@playwright/test';

/**
 * 影片上傳頁最小 smoke 測試。
 * 只斷言真實存在的行為：已登入 → 上傳頁可見 → 以 setInputFiles 選檔 → 顯示檔名。
 * （現有 upload/* 等測試因依賴未實作 UI 已 quarantine；此檔為對應真實流程的最小綠燈，
 *   同時驗證整條 harness：auth setup → storageState → 受保護頁面可存取。）
 */
test.describe('影片上傳頁 smoke', () => {
  /**
   * 驗證登入狀態下可於上傳頁選取影片並顯示檔名
   */
  test('應該能在登入後於上傳頁選取影片並顯示檔名', async ({ page }) => {
    // 已登入（storageState）狀態下前往上傳頁（未登入會被導回 /login）
    await page.goto('/upload-video');

    // 上傳拖放區應可見（真實存在的元素，代表頁面已載入且通過認證）
    await expect(page.getByTestId('video-upload-dropzone')).toBeVisible();

    // 隱藏的檔案 input 以 setInputFiles 直接設定（不斷言可見）；
    // 使用記憶體內的最小 video/mp4 檔，避免依賴外部影片素材
    await page.getByTestId('video-upload-input').setInputFiles({
      name: 'test-video-short.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('mp4 smoke fixture'),
    });

    // 選取後應顯示所選檔名（UploadArea 於 fileName 存在時渲染檔名）
    await expect(page.getByText('test-video-short.mp4')).toBeVisible();
  });
});
