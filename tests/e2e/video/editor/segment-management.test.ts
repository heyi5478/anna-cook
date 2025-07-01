import { test, expect } from '@playwright/test';
import {
  waitForVideoLoaded,
  getCurrentTime,
  getVideoDuration,
  seekToTime,
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
  assertTimeDifference,
  assertArrayLength,
} from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 片段管理功能測試
 */
test.describe('片段管理功能', () => {
  let videoDuration: number;

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

    // 獲取影片總時長
    videoDuration = await getVideoDuration(page);
  });

  /**
   * 測試新增片段功能
   */
  test('應該能夠新增影片片段', async ({ page }) => {
    // 檢查新增片段按鈕
    await assertElementInteractable(page, '[data-testid="add-segment-btn"]');

    // 獲取初始片段數量
    const initialSegments = await page
      .locator('[data-testid="segment-item"]')
      .count();

    // 點擊新增片段
    await page.click('[data-testid="add-segment-btn"]');

    // 等待片段新增完成
    await waitForElementVisible(page, '[data-testid="segment-form"]');

    // 填寫片段資訊
    await page.fill('[data-testid="segment-title"]', '第一個片段');
    await page.fill(
      '[data-testid="segment-description"]',
      '這是第一個料理步驟的說明',
    );

    // 確認新增
    await page.click('[data-testid="confirm-add-segment"]');

    // 驗證片段新增成功
    await page.waitForTimeout(500);
    const newSegmentCount = await page
      .locator('[data-testid="segment-item"]')
      .count();
    expect(newSegmentCount).toBe(initialSegments + 1);

    // 檢查新片段顯示
    await expect(
      page.locator('[data-testid="segment-item"]').last(),
    ).toBeVisible();
    const lastSegmentTitle = page
      .locator('[data-testid="segment-item"]')
      .last()
      .locator('[data-testid="segment-title"]');
    await expect(lastSegmentTitle).toContainText('第一個片段');
  });

  /**
   * 測試刪除片段功能
   */
  test('應該能夠刪除影片片段', async ({ page }) => {
    // 先新增一個片段用於測試刪除
    await page.click('[data-testid="add-segment-btn"]');
    await waitForElementVisible(page, '[data-testid="segment-form"]');
    await page.fill('[data-testid="segment-title"]', '待刪除片段');
    await page.click('[data-testid="confirm-add-segment"]');
    await page.waitForTimeout(500);

    // 獲取刪除前的片段數量
    const beforeDeleteCount = await page
      .locator('[data-testid="segment-item"]')
      .count();

    // 找到最後一個片段的刪除按鈕
    const lastSegment = page.locator('[data-testid="segment-item"]').last();
    await lastSegment.locator('[data-testid="delete-segment-btn"]').click();

    // 確認刪除對話框
    await waitForElementVisible(page, '[data-testid="delete-confirm-dialog"]');
    await assertTextContent(
      page,
      '[data-testid="delete-confirm-text"]',
      /確定要刪除此片段嗎/,
    );

    // 確認刪除
    await page.click('[data-testid="confirm-delete-btn"]');

    // 驗證片段刪除成功
    await page.waitForTimeout(500);
    const afterDeleteCount = await page
      .locator('[data-testid="segment-item"]')
      .count();
    expect(afterDeleteCount).toBe(beforeDeleteCount - 1);

    // 確認刪除的片段不再存在
    const segmentTitles = await page
      .locator('[data-testid="segment-title"]')
      .allTextContents();
    expect(segmentTitles).not.toContain('待刪除片段');
  });

  /**
   * 測試片段起點標記功能 (markStartPoint)
   */
  test('應該能夠標記片段起點', async ({ page }) => {
    // 跳轉到影片中間位置
    const startTime = videoDuration * 0.3;
    await seekToTime(page, startTime);
    await page.waitForTimeout(300);

    // 點擊標記起點按鈕
    await assertElementInteractable(
      page,
      '[data-testid="mark-start-point-btn"]',
    );
    await page.click('[data-testid="mark-start-point-btn"]');

    // 檢查起點標記顯示
    await waitForElementVisible(page, '[data-testid="start-point-marker"]');

    // 驗證起點時間正確
    const startPointTime = await page
      .locator('[data-testid="start-point-time"]')
      .textContent();
    expect(startPointTime).toMatch(/\d{2}:\d{2}/);

    // 檢查時間軸上的起點標記
    await expect(
      page.locator('[data-testid="timeline-start-marker"]'),
    ).toBeVisible();

    // 驗證起點位置正確
    const markerPosition = await page
      .locator('[data-testid="timeline-start-marker"]')
      .evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const timeline = document.querySelector(
          '[data-testid="timeline-slider"]',
        );
        if (!timeline) return 0;
        const timelineRect = timeline.getBoundingClientRect();
        return ((rect.left - timelineRect.left) / timelineRect.width) * 100;
      });

    const expectedPosition = (startTime / videoDuration) * 100;
    assertNumberInRange(
      markerPosition,
      expectedPosition,
      '起點標記位置驗證',
      5,
    );
  });

  /**
   * 測試片段終點標記功能 (markEndPoint)
   */
  test('應該能夠標記片段終點', async ({ page }) => {
    // 先標記起點
    await seekToTime(page, videoDuration * 0.2);
    await page.click('[data-testid="mark-start-point-btn"]');
    await page.waitForTimeout(300);

    // 跳轉到終點位置
    const endTime = videoDuration * 0.7;
    await seekToTime(page, endTime);
    await page.waitForTimeout(300);

    // 點擊標記終點按鈕
    await assertElementInteractable(page, '[data-testid="mark-end-point-btn"]');
    await page.click('[data-testid="mark-end-point-btn"]');

    // 檢查終點標記顯示
    await waitForElementVisible(page, '[data-testid="end-point-marker"]');

    // 驗證終點時間正確
    const endPointTime = await page
      .locator('[data-testid="end-point-time"]')
      .textContent();
    expect(endPointTime).toMatch(/\d{2}:\d{2}/);

    // 檢查時間軸上的終點標記
    await expect(
      page.locator('[data-testid="timeline-end-marker"]'),
    ).toBeVisible();

    // 驗證片段範圍顯示
    await expect(
      page.locator('[data-testid="segment-range-highlight"]'),
    ).toBeVisible();

    // 檢查片段時長計算
    const segmentDuration = await page
      .locator('[data-testid="segment-duration"]')
      .textContent();
    expect(segmentDuration).toMatch(/時長: \d{2}:\d{2}/);
  });

  /**
   * 測試片段間導航功能 (goToPreviousSegment)
   */
  test('應該能夠導航到上一個片段', async ({ page }) => {
    // 先創建兩個片段
    const segments = [
      { title: '第一片段', start: 0.1, end: 0.3 },
      { title: '第二片段', start: 0.5, end: 0.8 },
    ];

    await segments.reduce(async (previousPromise, segment) => {
      await previousPromise;
      await seekToTime(page, videoDuration * segment.start);
      await page.click('[data-testid="mark-start-point-btn"]');
      await seekToTime(page, videoDuration * segment.end);
      await page.click('[data-testid="mark-end-point-btn"]');

      await page.click('[data-testid="add-segment-btn"]');
      await page.fill('[data-testid="segment-title"]', segment.title);
      await page.click('[data-testid="confirm-add-segment"]');
      await page.waitForTimeout(300);
    }, Promise.resolve());

    // 移動到第二個片段
    await page.locator('[data-testid="segment-item"]').nth(1).click();
    await page.waitForTimeout(500);

    // 檢查當前位於第二片段
    await expect(
      page.locator('[data-testid="current-segment-indicator"]'),
    ).toContainText('第二片段');

    // 點擊上一個片段按鈕 (goToPreviousSegment)
    await assertElementInteractable(
      page,
      '[data-testid="go-previous-segment-btn"]',
    );
    await page.click('[data-testid="go-previous-segment-btn"]');

    // 驗證導航到第一片段
    await page.waitForTimeout(500);
    await expect(
      page.locator('[data-testid="current-segment-indicator"]'),
    ).toContainText('第一片段');

    // 檢查影片時間跳轉到第一片段起點
    const currentTime = await getCurrentTime(page);
    const expectedTime = videoDuration * 0.1;
    assertTimeDifference(currentTime, expectedTime, '上一片段導航驗證', 1);
  });

  /**
   * 測試片段間導航功能 (goToNextSegment)
   */
  test('應該能夠導航到下一個片段', async ({ page }) => {
    // 先創建兩個片段
    const segments = [
      { title: '第一片段', start: 0.1, end: 0.3 },
      { title: '第二片段', start: 0.5, end: 0.8 },
    ];

    await segments.reduce(async (previousPromise, segment) => {
      await previousPromise;
      await seekToTime(page, videoDuration * segment.start);
      await page.click('[data-testid="mark-start-point-btn"]');
      await seekToTime(page, videoDuration * segment.end);
      await page.click('[data-testid="mark-end-point-btn"]');

      await page.click('[data-testid="add-segment-btn"]');
      await page.fill('[data-testid="segment-title"]', segment.title);
      await page.click('[data-testid="confirm-add-segment"]');
      await page.waitForTimeout(300);
    }, Promise.resolve());

    // 確保當前位於第一個片段
    await page.locator('[data-testid="segment-item"]').first().click();
    await page.waitForTimeout(500);

    // 點擊下一個片段按鈕 (goToNextSegment)
    await assertElementInteractable(
      page,
      '[data-testid="go-next-segment-btn"]',
    );
    await page.click('[data-testid="go-next-segment-btn"]');

    // 驗證導航到第二片段
    await page.waitForTimeout(500);
    await expect(
      page.locator('[data-testid="current-segment-indicator"]'),
    ).toContainText('第二片段');

    // 檢查影片時間跳轉到第二片段起點
    const currentTime = await getCurrentTime(page);
    const expectedTime = videoDuration * 0.5;
    assertTimeDifference(currentTime, expectedTime, '下一片段導航驗證', 1);
  });

  /**
   * 測試片段描述文字管理
   */
  test('應該能夠編輯片段描述文字', async ({ page }) => {
    // 新增一個片段
    await page.click('[data-testid="add-segment-btn"]');
    await page.fill('[data-testid="segment-title"]', '測試片段');
    await page.fill('[data-testid="segment-description"]', '原始描述');
    await page.click('[data-testid="confirm-add-segment"]');
    await page.waitForTimeout(500);

    // 點擊編輯片段按鈕
    const segment = page.locator('[data-testid="segment-item"]').last();
    await segment.locator('[data-testid="edit-segment-btn"]').click();

    // 檢查編輯表單顯示
    await waitForElementVisible(page, '[data-testid="segment-edit-form"]');

    // 檢查當前描述文字
    const currentDescription = await page
      .locator('[data-testid="segment-description"]')
      .inputValue();
    expect(currentDescription).toBe('原始描述');

    // 修改描述文字
    await page.fill(
      '[data-testid="segment-description"]',
      '更新後的描述文字，包含詳細的料理步驟說明',
    );

    // 保存變更
    await page.click('[data-testid="save-segment-btn"]');

    // 驗證描述更新成功
    await page.waitForTimeout(500);
    await expect(
      segment.locator('[data-testid="segment-description-display"]'),
    ).toContainText('更新後的描述文字，包含詳細的料理步驟說明');

    // 檢查描述文字長度限制提示
    await segment.locator('[data-testid="edit-segment-btn"]').click();
    const longDescription = 'A'.repeat(500); // 超長描述
    await page.fill('[data-testid="segment-description"]', longDescription);

    // 檢查字數限制提示
    await expect(
      page.locator('[data-testid="description-length-warning"]'),
    ).toBeVisible();
    await assertTextContent(
      page,
      '[data-testid="description-length-warning"]',
      /字數超過限制/,
    );
  });

  /**
   * 測試片段排序功能
   */
  test('應該能夠調整片段順序', async ({ page }) => {
    // 創建三個片段
    const segmentTitles = ['第一片段', '第二片段', '第三片段'];

    await segmentTitles.reduce(async (previousPromise, title) => {
      await previousPromise;
      await page.click('[data-testid="add-segment-btn"]');
      await page.fill('[data-testid="segment-title"]', title);
      await page.click('[data-testid="confirm-add-segment"]');
      await page.waitForTimeout(300);
    }, Promise.resolve());

    // 檢查初始順序
    const initialOrder = await page
      .locator('[data-testid="segment-title"]')
      .allTextContents();
    assertArrayLength(initialOrder, 3);

    // 選擇第二個片段
    const secondSegment = page.locator('[data-testid="segment-item"]').nth(1);

    // 點擊向上移動按鈕
    await secondSegment.locator('[data-testid="move-up-btn"]').click();

    // 驗證順序變更
    await page.waitForTimeout(500);
    const newOrder = await page
      .locator('[data-testid="segment-title"]')
      .allTextContents();
    expect(newOrder[0]).toBe('第二片段');
    expect(newOrder[1]).toBe('第一片段');
    expect(newOrder[2]).toBe('第三片段');

    // 測試向下移動
    const firstSegment = page.locator('[data-testid="segment-item"]').first();
    await firstSegment.locator('[data-testid="move-down-btn"]').click();

    // 驗證順序再次變更
    await page.waitForTimeout(500);
    const finalOrder = await page
      .locator('[data-testid="segment-title"]')
      .allTextContents();
    expect(finalOrder[0]).toBe('第一片段');
    expect(finalOrder[1]).toBe('第二片段');
    expect(finalOrder[2]).toBe('第三片段');
  });

  /**
   * 測試行動裝置上的片段管理
   */
  test('在行動裝置上應該提供觸控友好的片段管理', async ({ page }) => {
    const isMobile = await isMobileDevice(page);

    if (isMobile) {
      // 檢查行動裝置專用的片段管理介面
      await expect(
        page.locator('[data-testid="mobile-segment-panel"]'),
      ).toBeVisible();

      // 檢查觸控友好的按鈕大小
      const addSegmentBtn = page.locator('[data-testid="add-segment-btn"]');
      const buttonBox = await addSegmentBtn.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

      // 測試滑動手勢片段切換
      const segmentPanel = page.locator('[data-testid="segment-list"]');
      await segmentPanel.evaluate((el) => {
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
        el.dispatchEvent(new TouchEvent('touchmove', { bubbles: true }));
        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
      });

      // 檢查手勢提示
      await expect(
        page.locator('[data-testid="segment-gesture-hints"]'),
      ).toBeVisible();
    }
  });

  /**
   * 測試片段驗證和錯誤處理
   */
  test('應該正確驗證片段資料和處理錯誤', async ({ page }) => {
    // 測試空標題驗證
    await page.click('[data-testid="add-segment-btn"]');
    await page.click('[data-testid="confirm-add-segment"]'); // 不填寫標題直接確認

    // 檢查驗證錯誤訊息
    await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
    await assertTextContent(
      page,
      '[data-testid="title-error"]',
      '請輸入片段標題',
    );

    // 測試重複標題驗證
    await page.fill('[data-testid="segment-title"]', '測試片段');
    await page.click('[data-testid="confirm-add-segment"]');
    await page.waitForTimeout(500);

    // 嘗試新增相同標題的片段
    await page.click('[data-testid="add-segment-btn"]');
    await page.fill('[data-testid="segment-title"]', '測試片段');
    await page.click('[data-testid="confirm-add-segment"]');

    // 檢查重複標題錯誤
    await expect(
      page.locator('[data-testid="duplicate-title-error"]'),
    ).toBeVisible();
    await assertTextContent(
      page,
      '[data-testid="duplicate-title-error"]',
      '片段標題已存在',
    );

    // 測試時間範圍驗證
    await page.fill('[data-testid="segment-title"]', '有效片段');

    // 設定無效的時間範圍（終點早於起點）
    await seekToTime(page, videoDuration * 0.8);
    await page.click('[data-testid="mark-start-point-btn"]');
    await seekToTime(page, videoDuration * 0.3);
    await page.click('[data-testid="mark-end-point-btn"]');

    await page.click('[data-testid="confirm-add-segment"]');

    // 檢查時間範圍錯誤
    await expect(
      page.locator('[data-testid="time-range-error"]'),
    ).toBeVisible();
    await assertTextContent(
      page,
      '[data-testid="time-range-error"]',
      '終點時間不能早於起點時間',
    );
  });
});
