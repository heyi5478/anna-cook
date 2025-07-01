import { test, expect } from '@playwright/test';
import {
  waitForVideoLoaded,
  getCurrentTime,
  getVideoDuration,
  getVideoPlaybackState,
} from '../../../helpers/video/video-playback';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForElementVisible,
  waitForNetworkIdle,
} from '../../../helpers/common/wait-utils';
import {
  assertElementInteractable,
  assertTextContent,
  assertNumberInRange,
} from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 影片播放器基本功能測試
 */
test.describe('影片播放器基本功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 取得測試影片檔案路徑
    getDefaultTestVideo();

    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);

    // 等待影片載入完成
    await waitForVideoLoaded(page);
  });

  /**
   * 測試播放暫停切換功能
   */
  test('應該能夠正確執行播放暫停切換', async ({ page }) => {
    // 檢查初始播放按鈕狀態
    await assertElementInteractable(page, '[data-testid="play-pause-button"]');

    // 獲取初始播放狀態
    const initialState = await getVideoPlaybackState(page);
    expect(initialState.isPlaying).toBe(false);

    // 執行播放切換 (atTogglePlayPause)
    await page.click('[data-testid="play-pause-button"]');

    // 驗證播放狀態變更
    await page.waitForTimeout(500); // 等待狀態更新
    const playingState = await getVideoPlaybackState(page);
    expect(playingState.isPlaying).toBe(true);

    // 檢查播放按鈕圖示變更
    await expect(page.locator('[data-testid="pause-icon"]')).toBeVisible();
    await expect(page.locator('[data-testid="play-icon"]')).not.toBeVisible();

    // 再次點擊暫停
    await page.click('[data-testid="play-pause-button"]');

    // 驗證暫停狀態
    await page.waitForTimeout(500);
    const pausedState = await getVideoPlaybackState(page);
    expect(pausedState.isPlaying).toBe(false);

    // 檢查暫停按鈕圖示變更
    await expect(page.locator('[data-testid="play-icon"]')).toBeVisible();
    await expect(page.locator('[data-testid="pause-icon"]')).not.toBeVisible();
  });

  /**
   * 測試影片時間更新機制
   */
  test('應該正確顯示和更新影片播放時間', async ({ page }) => {
    // 檢查時間顯示元素
    await expect(page.locator('[data-testid="current-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-duration"]')).toBeVisible();

    // 獲取影片總時長
    const duration = await getVideoDuration(page);
    expect(duration).toBeGreaterThan(0);

    // 驗證總時長顯示
    const durationText = await page
      .locator('[data-testid="total-duration"]')
      .textContent();
    expect(durationText).toMatch(/\d{2}:\d{2}/);

    // 開始播放
    await page.click('[data-testid="play-pause-button"]');

    // 等待一秒讓影片播放
    await page.waitForTimeout(1000);

    // 檢查當前時間更新 (atTimeUpdate)
    const currentTime = await getCurrentTime(page);
    expect(currentTime).toBeGreaterThan(0);

    // 驗證當前時間顯示更新
    const currentTimeText = await page
      .locator('[data-testid="current-time"]')
      .textContent();
    expect(currentTimeText).toMatch(/\d{2}:\d{2}/);
    expect(currentTimeText).not.toBe('00:00');

    // 檢查時間格式正確性
    const timePattern = /^(\d{2}):(\d{2})$/;
    const matches = currentTimeText?.match(timePattern);
    expect(matches).toBeTruthy();
    if (matches) {
      const minutes = parseInt(matches[1], 10);
      const seconds = parseInt(matches[2], 10);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(seconds).toBeGreaterThanOrEqual(0);
      expect(seconds).toBeLessThan(60);
    }
  });

  /**
   * 測試音量控制功能
   */
  test('應該能夠正確控制影片音量', async ({ page }) => {
    // 檢查音量控制元素
    await assertElementInteractable(page, '[data-testid="volume-control"]');
    await expect(page.locator('[data-testid="volume-slider"]')).toBeVisible();

    // 獲取初始音量
    const initialVolume = await page
      .locator('[data-testid="volume-slider"]')
      .getAttribute('value');
    expect(parseFloat(initialVolume || '0')).toBeGreaterThanOrEqual(0);

    // 測試音量調整到 50%
    await page.locator('[data-testid="volume-slider"]').fill('0.5');

    // 驗證音量變更
    const newVolume = await page
      .locator('[data-testid="volume-slider"]')
      .getAttribute('value');
    expect(parseFloat(newVolume || '0')).toBe(0.5);

    // 檢查音量圖示變更
    await expect(
      page.locator('[data-testid="volume-medium-icon"]'),
    ).toBeVisible();

    // 測試靜音功能
    await page.click('[data-testid="mute-button"]');

    // 驗證靜音狀態
    await expect(
      page.locator('[data-testid="volume-muted-icon"]'),
    ).toBeVisible();
    const mutedVolume = await page
      .locator('[data-testid="volume-slider"]')
      .getAttribute('value');
    expect(parseFloat(mutedVolume || '1')).toBe(0);

    // 取消靜音
    await page.click('[data-testid="mute-button"]');

    // 驗證音量恢復
    const restoredVolume = await page
      .locator('[data-testid="volume-slider"]')
      .getAttribute('value');
    expect(parseFloat(restoredVolume || '0')).toBe(0.5);
  });

  /**
   * 測試播放速度控制功能
   */
  test('應該能夠調整影片播放速度', async ({ page }) => {
    // 檢查播放速度控制元素
    await assertElementInteractable(
      page,
      '[data-testid="playback-speed-control"]',
    );

    // 檢查速度選項
    await page.click('[data-testid="playback-speed-control"]');
    await waitForElementVisible(page, '[data-testid="speed-options"]');

    // 驗證可用的播放速度選項
    const speedOptions = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];

    speedOptions.forEach(async (speed) => {
      await expect(
        page.locator(`[data-testid="speed-option-${speed}"]`),
      ).toBeVisible();
    });

    // 測試設定播放速度為 1.5x
    await page.click('[data-testid="speed-option-1.5x"]');

    // 驗證播放速度設定
    await assertTextContent(page, '[data-testid="current-speed"]', '1.5x');

    // 開始播放以測試速度變更
    await page.click('[data-testid="play-pause-button"]');

    // 等待並檢查播放速度實際生效
    await page.waitForTimeout(1000);

    // 驗證影片播放速度 (通過檢查時間更新速度)
    const timeBeforeSpeed = await getCurrentTime(page);
    await page.waitForTimeout(1000);
    const timeAfterSpeed = await getCurrentTime(page);

    const timeElapsed = timeAfterSpeed - timeBeforeSpeed;
    // 1.5x 速度下，1秒應該播放約 1.5 秒的內容
    assertNumberInRange(timeElapsed, 1.5, '播放速度驗證', 0.3); // 允許一些誤差
  });

  /**
   * 測試鍵盤快捷鍵控制
   */
  test('應該支援鍵盤快捷鍵控制播放', async ({ page }) => {
    // 確保影片播放器有焦點
    await page.locator('[data-testid="video-player"]').click();

    // 測試空白鍵播放暫停
    await page.keyboard.press('Space');

    // 驗證播放狀態
    await page.waitForTimeout(500);
    const playingState = await getVideoPlaybackState(page);
    expect(playingState.isPlaying).toBe(true);

    // 再次按空白鍵暫停
    await page.keyboard.press('Space');

    // 驗證暫停狀態
    await page.waitForTimeout(500);
    const pausedState = await getVideoPlaybackState(page);
    expect(pausedState.isPlaying).toBe(false);

    // 測試方向鍵時間跳轉
    const initialTime = await getCurrentTime(page);

    // 右箭頭前進 5 秒
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const forwardTime = await getCurrentTime(page);
    expect(forwardTime).toBeGreaterThan(initialTime);

    // 左箭頭後退 5 秒
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);

    const backwardTime = await getCurrentTime(page);
    expect(backwardTime).toBeLessThan(forwardTime);
  });

  /**
   * 測試全螢幕播放功能
   */
  test('應該支援全螢幕播放模式', async ({ page }) => {
    // 檢查全螢幕按鈕
    await assertElementInteractable(page, '[data-testid="fullscreen-button"]');

    // 點擊全螢幕按鈕
    await page.click('[data-testid="fullscreen-button"]');

    // 驗證全螢幕狀態
    await expect(page.locator('[data-testid="video-player"]')).toHaveClass(
      /fullscreen/,
    );

    // 檢查退出全螢幕按鈕
    await expect(
      page.locator('[data-testid="exit-fullscreen-button"]'),
    ).toBeVisible();

    // 退出全螢幕
    await page.keyboard.press('Escape');

    // 驗證退出全螢幕狀態
    await expect(page.locator('[data-testid="video-player"]')).not.toHaveClass(
      /fullscreen/,
    );
    await expect(
      page.locator('[data-testid="fullscreen-button"]'),
    ).toBeVisible();
  });

  /**
   * 測試行動裝置上的播放控制
   */
  test('在行動裝置上應該提供觸控友好的播放控制', async ({ page }) => {
    const isMobile = await isMobileDevice(page);

    if (isMobile) {
      // 檢查行動裝置專用的控制介面
      await expect(
        page.locator('[data-testid="mobile-controls"]'),
      ).toBeVisible();

      // 檢查觸控播放按鈕大小
      const playButton = page.locator('[data-testid="play-pause-button"]');
      const buttonBox = await playButton.boundingBox();

      // 確保按鈕足夠大以便觸控操作 (至少 44px)
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

      // 測試雙擊播放/暫停
      await playButton.dblclick();

      // 驗證播放狀態
      await page.waitForTimeout(500);
      const state = await getVideoPlaybackState(page);
      expect(state.isPlaying).toBe(true);

      // 檢查行動裝置手勢控制提示
      await expect(page.locator('[data-testid="gesture-hints"]')).toBeVisible();
    }
  });

  /**
   * 測試播放錯誤處理
   */
  test('應該正確處理播放錯誤情況', async ({ page }) => {
    // 模擬網路錯誤
    await page.route('**/video/**', (route) => route.abort());

    // 嘗試播放
    await page.click('[data-testid="play-pause-button"]');

    // 檢查錯誤提示
    await waitForElementVisible(page, '[data-testid="playback-error"]');
    await assertTextContent(
      page,
      '[data-testid="playback-error"]',
      /播放失敗|網路錯誤|無法載入影片/,
    );

    // 檢查重試按鈕
    await expect(
      page.locator('[data-testid="retry-playback-btn"]'),
    ).toBeVisible();
    await assertTextContent(page, '[data-testid="retry-playback-btn"]', '重試');

    // 測試重試功能
    await page.unroute('**/video/**'); // 移除路由攔截
    await page.click('[data-testid="retry-playback-btn"]');

    // 驗證錯誤訊息消失
    await expect(
      page.locator('[data-testid="playback-error"]'),
    ).not.toBeVisible();
  });
});
