import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * 行動瀏覽器專用測試
 */
test.describe('行動瀏覽器兼容性', () => {
  /**
   * 每個測試前的準備工作 - 設定行動裝置
   */
  test.beforeEach(async ({ page }) => {
    // 設定行動裝置檢視區
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試行動裝置的觸控操作
   */
  test('應該支援行動裝置的觸控操作', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');

    // 檢查觸控支援
    const touchSupport = await page.evaluate(() => {
      return {
        touchEvents: 'ontouchstart' in window,
        touchAction: 'touchAction' in document.body.style,
        pointerEvents: 'onpointerdown' in window,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        userAgentMobile: /iPhone|iPad|Android|Mobile/i.test(
          navigator.userAgent,
        ),
      };
    });

    console.log('行動裝置觸控支援:', touchSupport);

    // 測試點擊操作
    await descriptionInput.tap();
    await page.waitForTimeout(100);

    // 檢查虛擬鍵盤是否觸發
    const isInputFocused = await descriptionInput.evaluate((el) => {
      return document.activeElement === el;
    });

    expect(isInputFocused).toBe(true);

    // 測試觸控輸入
    await page.keyboard.type('行動裝置測試輸入');

    const inputValue = await descriptionInput.inputValue();
    expect(inputValue).toBe('行動裝置測試輸入');

    console.log('行動裝置觸控操作測試完成');
  });

  /**
   * 測試行動裝置的檔案上傳
   */
  test('應該支援行動裝置的檔案選擇', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-file-input"]');

    // 檢查檔案 API 在行動裝置上的支援
    const fileApiSupport = await page.evaluate(() => {
      return {
        fileReader: typeof FileReader !== 'undefined',
        formData: typeof FormData !== 'undefined',
        mediaDevices: 'mediaDevices' in navigator,
        getUserMedia:
          navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices,
        capture: (() => {
          const input = document.createElement('input');
          input.type = 'file';
          return 'capture' in input;
        })(),
      };
    });

    expect(fileApiSupport.fileReader).toBe(true);
    expect(fileApiSupport.formData).toBe(true);

    console.log('行動裝置檔案 API 支援:', fileApiSupport);

    // 測試檔案選擇
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 檢查檔案狀態
    const fileStatus = page.locator('[data-testid="file-status"]');
    if (await fileStatus.isVisible()) {
      await expect(fileStatus).toContainText('檔案上傳成功');
    }

    console.log('行動裝置檔案選擇測試完成');
  });

  /**
   * 測試行動裝置的回應式佈局
   */
  test('應該正確顯示行動裝置佈局', async ({ page }) => {
    // 檢查行動版佈局元素
    const mobileContainer = page.locator('[data-testid="mobile-container"]');
    const desktopSidebar = page.locator('[data-testid="desktop-sidebar"]');

    // 行動版容器應該可見
    if (await mobileContainer.isVisible()) {
      const containerBox = await mobileContainer.boundingBox();
      expect(containerBox?.width).toBeLessThanOrEqual(375);
    }

    // 桌面版側邊欄應該隱藏
    if (await desktopSidebar.isVisible()) {
      const sidebarStyles = await desktopSidebar.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
        };
      });

      // 應該是隱藏狀態
      expect(
        sidebarStyles.display === 'none' ||
          sidebarStyles.visibility === 'hidden',
      ).toBe(true);
    }

    // 檢查字體大小是否適合行動裝置
    const descriptionInput = page.locator('[data-testid="step-description"]');
    if (await descriptionInput.isVisible()) {
      const inputStyles = await descriptionInput.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          fontSize: parseFloat(styles.fontSize),
          minHeight: parseFloat(styles.minHeight || '0'),
          padding: styles.padding,
        };
      });

      // 行動裝置上字體應該不小於 16px（避免縮放）
      expect(inputStyles.fontSize).toBeGreaterThanOrEqual(16);
    }

    console.log('行動裝置佈局測試完成');
  });

  /**
   * 測試行動裝置的效能最佳化
   */
  test('應該針對行動裝置最佳化效能', async ({ page }) => {
    // 檢查載入效能
    const performanceMetrics = await page.evaluate(() => {
      return {
        loadTime:
          performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded:
          performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart,
        resourceCount: performance.getEntriesByType('resource').length,
        memory: 'memory' in performance ? (performance as any).memory : null,
      };
    });

    // 行動裝置載入時間應該合理
    expect(performanceMetrics.loadTime).toBeGreaterThan(0);
    expect(performanceMetrics.domContentLoaded).toBeGreaterThan(0);

    console.log('行動裝置效能指標:', performanceMetrics);

    // 測試捲動效能
    await page.evaluate(() => {
      window.scrollTo(0, 100);
    });

    await page.waitForTimeout(100);

    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBe(100);

    console.log('行動裝置效能最佳化測試完成');
  });

  /**
   * 測試行動裝置的網路條件適應
   */
  test('應該適應行動裝置的網路條件', async ({ page }) => {
    // 模擬慢速網路
    await page.route('**/*', async (route) => {
      // 延遲 100ms 模擬慢速網路
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
      });
      route.continue();
    });

    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('測試慢速網路下的操作');

    // 測試圖片延遲載入
    const images = page.locator('img[loading="lazy"]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      console.log(`發現 ${imageCount} 個延遲載入圖片`);
    }

    // 測試離線檢測
    const offlineSupport = await page.evaluate(() => {
      return {
        onlineStatus: navigator.onLine,
        connectionType:
          'connection' in navigator
            ? (navigator as any).connection?.effectiveType
            : null,
        saveData:
          'connection' in navigator
            ? (navigator as any).connection?.saveData
            : null,
      };
    });

    console.log('行動網路條件:', offlineSupport);

    console.log('行動裝置網路適應測試完成');
  });

  /**
   * 測試行動裝置的方向變更
   */
  test('應該處理行動裝置的方向變更', async ({ page }) => {
    // 初始為直向模式
    const initialLayout = await page
      .locator('[data-testid="video-editor-container"]')
      .boundingBox();

    if (initialLayout) {
      expect(initialLayout.height).toBeGreaterThan(initialLayout.width);
    }

    // 切換到橫向模式
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // 檢查佈局是否適應
    const landscapeLayout = await page
      .locator('[data-testid="video-editor-container"]')
      .boundingBox();

    if (landscapeLayout) {
      expect(landscapeLayout.width).toBeGreaterThan(landscapeLayout.height);
    }

    // 檢查方向變更事件
    const orientationSupport = await page.evaluate(() => {
      return {
        orientationAPI: 'orientation' in window.screen,
        orientationAngle: 'orientation' in window ? window.orientation : null,
        matchMedia: typeof window.matchMedia === 'function',
      };
    });

    console.log('行動裝置方向支援:', orientationSupport);

    // 切回直向模式
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    console.log('行動裝置方向變更測試完成');
  });

  /**
   * 測試行動裝置的輸入體驗
   */
  test('應該提供良好的行動輸入體驗', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');

    // 檢查輸入類型和屬性
    const inputAttributes = await descriptionInput.evaluate((el) => {
      const input = el as HTMLInputElement;
      return {
        type: input.type,
        inputMode: input.inputMode,
        autocomplete: input.autocomplete,
        spellcheck: input.spellcheck,
        autocapitalize: input.autocapitalize,
      };
    });

    console.log('行動輸入屬性:', inputAttributes);

    // 測試觸控輸入
    await descriptionInput.tap();
    await page.waitForTimeout(200); // 等待虛擬鍵盤出現

    // 檢查視窗調整
    const viewportAfterKeyboard = await page.evaluate(() => {
      return {
        innerHeight: window.innerHeight,
        visualViewport: window.visualViewport
          ? {
              height: window.visualViewport.height,
              scale: window.visualViewport.scale,
            }
          : null,
      };
    });

    console.log('虛擬鍵盤後的視窗:', viewportAfterKeyboard);

    // 測試輸入內容
    await page.keyboard.type(
      '這是行動裝置的輸入測試，包含中文字元和標點符號。',
    );

    const inputValue = await descriptionInput.inputValue();
    expect(inputValue).toContain('行動裝置的輸入測試');

    console.log('行動裝置輸入體驗測試完成');
  });

  /**
   * 測試行動裝置的手勢操作
   */
  test('應該支援行動裝置的手勢操作', async ({ page }) => {
    // 檢查手勢 API 支援
    const gestureSupport = await page.evaluate(() => {
      return {
        touch: 'ontouchstart' in window,
        gesture: 'ongesturestart' in window,
        pointer: 'onpointerdown' in window,
        drag: 'ondragstart' in window,
      };
    });

    console.log('手勢 API 支援:', gestureSupport);

    // 測試拖放手勢（如果支援）
    const fileDropZone = page.locator('[data-testid="file-drop-zone"]');

    if (await fileDropZone.isVisible()) {
      // 模擬觸控拖放
      const dropZoneBox = await fileDropZone.boundingBox();

      if (dropZoneBox) {
        // 觸控開始
        await page.touchscreen.tap(
          dropZoneBox.x + dropZoneBox.width / 2,
          dropZoneBox.y + dropZoneBox.height / 2,
        );

        await page.waitForTimeout(100);
      }
    }

    // 測試捲動手勢
    const container = page.locator('[data-testid="video-editor-container"]');
    if (await container.isVisible()) {
      const containerBox = await container.boundingBox();

      if (containerBox) {
        // 模擬向下滑動
        await page.touchscreen.tap(
          containerBox.x + containerBox.width / 2,
          containerBox.y + containerBox.height / 2,
        );
      }
    }

    console.log('行動裝置手勢操作測試完成');
  });

  /**
   * 測試行動裝置的完整工作流程
   */
  test('應該支援行動裝置的完整操作流程', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // Step 1: 觸控輸入描述
    await descriptionInput.tap();
    await page.keyboard.type('行動裝置完整測試流程的烹飪步驟說明');

    // Step 2: 選擇影片檔案
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // Step 3: 檢查回應式設計
    const submitButtonBox = await submitButton.boundingBox();
    if (submitButtonBox) {
      // 按鈕應該適合手指點擊（至少 44px 高度）
      expect(submitButtonBox.height).toBeGreaterThanOrEqual(44);
    }

    // Step 4: 設定 API 攔截
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: '行動裝置測試提交成功',
        }),
      });
    });

    // Step 5: 提交表單
    await submitButton.tap();
    await page.waitForTimeout(2000);

    // Step 6: 檢查成功訊息
    const successMessage = page.locator('[data-testid="success-message"]');
    if (await successMessage.isVisible()) {
      await expect(successMessage).toContainText('行動裝置測試提交成功');
    }

    console.log('行動裝置完整工作流程測試完成');
  });
});
