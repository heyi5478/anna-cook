import { Page, expect } from '@playwright/test';

/**
 * 影片片段資料型別
 */
export type VideoSegment = {
  id: string;
  description: string;
  startTime: number;
  endTime: number;
  startPercent: number;
  endPercent: number;
  duration?: number;
};

/**
 * 片段編輯操作型別
 */
export type SegmentEditOperation = {
  type: 'create' | 'update' | 'delete' | 'split' | 'merge';
  segmentId?: string;
  data?: Partial<VideoSegment>;
};

/**
 * 時間軸標記點型別
 */
export type TimelineMarker = {
  time: number;
  type: 'start' | 'end' | 'split';
  segmentId?: string;
};

/**
 * 預設片段設定
 */
const DEFAULT_SEGMENT_CONFIG = {
  minDuration: 5, // 最小片段時長（秒）
  maxDuration: 300, // 最大片段時長（秒）
  minDescriptionLength: 10, // 最小描述文字長度
  maxDescriptionLength: 500, // 最大描述文字長度
};

/**
 * 取得片段導航容器
 */
export const getSegmentNavigation = async (page: Page): Promise<any> => {
  return page.locator('[data-testid="segment-navigation"]');
};

/**
 * 取得當前片段索引
 */
export const getCurrentSegmentIndex = async (page: Page): Promise<number> => {
  const activeSegment = page.locator('[data-testid="segment-item"].active');
  const segmentIndex = await activeSegment.getAttribute('data-segment-index');
  return parseInt(segmentIndex || '0', 10);
};

/**
 * 取得所有片段列表
 */
export const getAllSegments = async (page: Page): Promise<VideoSegment[]> => {
  return page.evaluate(() => {
    const segmentItems = document.querySelectorAll(
      '[data-testid="segment-item"]',
    );
    return Array.from(segmentItems).map((item, index) => {
      const element = item as HTMLElement;
      return {
        id: element.getAttribute('data-segment-id') || `segment-${index}`,
        description:
          element.querySelector('[data-testid="segment-description"]')
            ?.textContent || '',
        startTime: parseFloat(element.getAttribute('data-start-time') || '0'),
        endTime: parseFloat(element.getAttribute('data-end-time') || '0'),
        startPercent: parseFloat(
          element.getAttribute('data-start-percent') || '0',
        ),
        endPercent: parseFloat(
          element.getAttribute('data-end-percent') || '100',
        ),
      };
    });
  });
};

/**
 * 選擇指定索引的片段
 */
export const selectSegment = async (
  page: Page,
  index: number,
): Promise<void> => {
  const segmentItem = page.locator(
    `[data-testid="segment-item"][data-segment-index="${index}"]`,
  );
  await expect(segmentItem).toBeVisible();
  await segmentItem.click();

  // 等待片段切換完成
  await page.waitForSelector(
    `[data-testid="segment-item"][data-segment-index="${index}"].active`,
  );
  console.log(`已選擇第 ${index + 1} 個片段`);
};

/**
 * 建立新片段
 */
export const createNewSegment = async (page: Page): Promise<void> => {
  const addButton = page.locator('[data-testid="add-segment-btn"]');
  await expect(addButton).toBeVisible();
  await addButton.click();

  // 等待新片段建立完成
  await page.waitForTimeout(500);
  console.log('已建立新片段');
};

/**
 * 刪除當前片段
 */
export const deleteCurrentSegment = async (page: Page): Promise<void> => {
  const deleteButton = page.locator('[data-testid="delete-segment-btn"]');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // 確認刪除對話框
  const confirmButton = page.locator('[data-testid="confirm-delete-btn"]');
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }

  console.log('已刪除當前片段');
};

/**
 * 更新片段描述
 */
export const updateSegmentDescription = async (
  page: Page,
  description: string,
): Promise<void> => {
  const descriptionInput = page.locator(
    '[data-testid="segment-description-input"]',
  );
  await expect(descriptionInput).toBeVisible();

  // 清空現有內容並輸入新描述
  await descriptionInput.fill('');
  await descriptionInput.fill(description);

  // 觸發輸入事件
  await descriptionInput.blur();

  console.log(`已更新片段描述: ${description}`);
};

/**
 * 標記片段起始點
 */
export const markSegmentStart = async (page: Page): Promise<void> => {
  const markStartButton = page.locator('[data-testid="mark-start-btn"]');
  await expect(markStartButton).toBeVisible();
  await markStartButton.click();

  console.log('已標記片段起始點');
};

/**
 * 標記片段結束點
 */
export const markSegmentEnd = async (page: Page): Promise<void> => {
  const markEndButton = page.locator('[data-testid="mark-end-btn"]');
  await expect(markEndButton).toBeVisible();
  await markEndButton.click();

  console.log('已標記片段結束點');
};

/**
 * 重置當前片段的時間範圍
 */
export const resetSegmentTiming = async (page: Page): Promise<void> => {
  const resetButton = page.locator('[data-testid="reset-segment-btn"]');
  await expect(resetButton).toBeVisible();
  await resetButton.click();

  console.log('已重置片段時間範圍');
};

/**
 * 導航到上一個片段
 */
export const goToPreviousSegment = async (page: Page): Promise<boolean> => {
  const prevButton = page.locator('[data-testid="previous-segment-btn"]');

  if (await prevButton.isEnabled()) {
    await prevButton.click();
    await page.waitForTimeout(300);
    console.log('已切換到上一個片段');
    return true;
  }

  console.log('已到達第一個片段，無法再往前');
  return false;
};

/**
 * 導航到下一個片段
 */
export const goToNextSegment = async (page: Page): Promise<boolean> => {
  const nextButton = page.locator('[data-testid="next-segment-btn"]');

  if (await nextButton.isEnabled()) {
    await nextButton.click();
    await page.waitForTimeout(300);
    console.log('已切換到下一個片段');
    return true;
  }

  console.log('已到達最後一個片段，無法再往後');
  return false;
};

/**
 * 使用時間軸滑桿設定片段範圍
 */
export const setSegmentRange = async (
  page: Page,
  startPercent: number,
  endPercent: number,
): Promise<void> => {
  const timelineSlider = page.locator('[data-testid="timeline-slider"]');
  await expect(timelineSlider).toBeVisible();

  // 設定起始位置
  const startHandle = timelineSlider.locator(
    '.slider-handle[data-handle="start"]',
  );
  const endHandle = timelineSlider.locator('.slider-handle[data-handle="end"]');

  // 計算滑桿位置
  const sliderBounds = await timelineSlider.boundingBox();
  if (sliderBounds) {
    const startX = sliderBounds.x + (sliderBounds.width * startPercent) / 100;
    const endX = sliderBounds.x + (sliderBounds.width * endPercent) / 100;

    // 拖拽起始點
    await startHandle.dragTo(timelineSlider, {
      targetPosition: {
        x: startX - sliderBounds.x,
        y: sliderBounds.height / 2,
      },
    });

    // 拖拽結束點
    await endHandle.dragTo(timelineSlider, {
      targetPosition: { x: endX - sliderBounds.x, y: sliderBounds.height / 2 },
    });
  }

  console.log(`已設定片段範圍: ${startPercent}% - ${endPercent}%`);
};

/**
 * 驗證片段資料
 */
export const verifySegmentData = async (
  page: Page,
  expectedSegment: Partial<VideoSegment>,
): Promise<void> => {
  const currentIndex = await getCurrentSegmentIndex(page);
  const segments = await getAllSegments(page);
  const currentSegment = segments[currentIndex];

  if (!currentSegment) {
    throw new Error(`找不到索引為 ${currentIndex} 的片段`);
  }

  if (expectedSegment.description !== undefined) {
    expect(currentSegment.description).toBe(expectedSegment.description);
  }

  if (expectedSegment.startTime !== undefined) {
    expect(
      Math.abs(currentSegment.startTime - expectedSegment.startTime),
    ).toBeLessThan(1);
  }

  if (expectedSegment.endTime !== undefined) {
    expect(
      Math.abs(currentSegment.endTime - expectedSegment.endTime),
    ).toBeLessThan(1);
  }

  if (expectedSegment.startPercent !== undefined) {
    expect(
      Math.abs(currentSegment.startPercent - expectedSegment.startPercent),
    ).toBeLessThan(1);
  }

  if (expectedSegment.endPercent !== undefined) {
    expect(
      Math.abs(currentSegment.endPercent - expectedSegment.endPercent),
    ).toBeLessThan(1);
  }

  console.log('片段資料驗證通過');
};

/**
 * 驗證片段描述輸入驗證
 */
export const verifyDescriptionValidation = async (
  page: Page,
  description: string,
  shouldBeValid: boolean,
): Promise<void> => {
  await updateSegmentDescription(page, description);

  const errorMessage = page.locator('[data-testid="description-error"]');

  if (shouldBeValid) {
    await expect(errorMessage).not.toBeVisible();
    console.log('描述驗證通過：有效輸入');
  } else {
    await expect(errorMessage).toBeVisible();
    console.log('描述驗證通過：無效輸入被正確檢測');
  }
};

/**
 * 驗證片段時間範圍有效性
 */
export const verifySegmentTiming = async (
  page: Page,
  segmentIndex?: number,
): Promise<void> => {
  const segments = await getAllSegments(page);
  const targetIndex = segmentIndex ?? (await getCurrentSegmentIndex(page));
  const segment = segments[targetIndex];

  if (!segment) {
    throw new Error(`找不到索引為 ${targetIndex} 的片段`);
  }

  // 驗證時間範圍合理性
  expect(segment.startTime).toBeGreaterThanOrEqual(0);
  expect(segment.endTime).toBeGreaterThan(segment.startTime);
  expect(segment.startPercent).toBeGreaterThanOrEqual(0);
  expect(segment.endPercent).toBeGreaterThan(segment.startPercent);
  expect(segment.endPercent).toBeLessThanOrEqual(100);

  // 驗證片段時長
  const duration = segment.endTime - segment.startTime;
  expect(duration).toBeGreaterThanOrEqual(DEFAULT_SEGMENT_CONFIG.minDuration);
  expect(duration).toBeLessThanOrEqual(DEFAULT_SEGMENT_CONFIG.maxDuration);

  console.log(`片段 ${targetIndex + 1} 時間範圍驗證通過`);
};

/**
 * 取得片段總數
 */
export const getSegmentCount = async (page: Page): Promise<number> => {
  const segments = await getAllSegments(page);
  return segments.length;
};

/**
 * 驗證所有片段的連續性
 */
export const verifySegmentContinuity = async (page: Page): Promise<void> => {
  const segments = await getAllSegments(page);

  for (let i = 0; i < segments.length - 1; i += 1) {
    const currentSegment = segments[i];
    const nextSegment = segments[i + 1];

    // 確保片段之間沒有重疊
    expect(currentSegment.endTime).toBeLessThanOrEqual(
      nextSegment.startTime + 0.1,
    );

    console.log(`片段 ${i + 1} 和 ${i + 2} 連續性驗證通過`);
  }

  console.log('所有片段連續性驗證通過');
};

/**
 * 計算片段總時長
 */
export const calculateTotalSegmentDuration = async (
  page: Page,
): Promise<number> => {
  const segments = await getAllSegments(page);
  return segments.reduce((total, segment) => {
    return total + (segment.endTime - segment.startTime);
  }, 0);
};

/**
 * 匯出片段資料
 */
export const exportSegmentData = async (
  page: Page,
): Promise<VideoSegment[]> => {
  const segments = await getAllSegments(page);
  console.log(`匯出 ${segments.length} 個片段的資料`);
  return segments;
};
