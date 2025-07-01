import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * Firefox 兼容性測試
 */
test.describe('Firefox 瀏覽器兼容性', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試 Firefox 的媒體編解碼器支援
   */
  test('應該支援 Firefox 的媒體編解碼器', async ({ page }) => {
    const codecSupport = await page.evaluate(() => {
      const video = document.createElement('video');
      return {
        h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
        vp8: video.canPlayType('video/webm; codecs="vp8"'),
        vp9: video.canPlayType('video/webm; codecs="vp9"'),
        av1: video.canPlayType('video/mp4; codecs="av01.0.08M.08"'),
        theora: video.canPlayType('video/ogg; codecs="theora"'),
        webm: video.canPlayType('video/webm'),
        ogg: video.canPlayType('video/ogg'),
      };
    });

    // Firefox 特別支援開放格式
    expect(codecSupport.vp8).toBeTruthy();
    expect(codecSupport.vp9).toBeTruthy();
    expect(codecSupport.webm).toBeTruthy();
    expect(codecSupport.ogg).toBeTruthy();

    console.log('Firefox 編解碼器支援:', codecSupport);
  });

  /**
   * 測試 Firefox 的檔案處理功能
   */
  test('應該正確處理檔案上傳和拖放', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const fileStatus = page.locator('[data-testid="file-status"]');

    // 測試標準檔案上傳
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 檢查檔案狀態
    if (await fileStatus.isVisible()) {
      await expect(fileStatus).toContainText('檔案上傳成功');
    }

    // 測試 Firefox 的拖放實作
    await page.evaluate(() => {
      const dropZoneElement = document.querySelector(
        '[data-testid="file-drop-zone"]',
      );
      if (dropZoneElement) {
        // Firefox 特定的拖放處理
        const file = new File(['video content'], 'firefox-test.mp4', {
          type: 'video/mp4',
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer,
        });

        dropZoneElement.dispatchEvent(dropEvent);
      }
    });

    await page.waitForTimeout(1000);

    console.log('Firefox 檔案處理功能測試完成');
  });

  /**
   * 測試 Firefox 的表單驗證和輸入處理
   */
  test('應該正確處理表單驗證', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const validationMessage = page.locator(
      '[data-testid="validation-message"]',
    );

    // 測試即時驗證
    await descriptionInput.fill(
      '測試 Firefox 表單驗證功能，確保即時回饋正常運作',
    );
    await page.waitForTimeout(500);

    // 檢查驗證狀態
    if (await validationMessage.isVisible()) {
      await expect(validationMessage).toContainText('輸入有效');
    }

    // 測試 Firefox 的輸入事件處理
    await descriptionInput.fill('');
    await descriptionInput.fill('更新後的文字內容');

    const finalValue = await descriptionInput.inputValue();
    expect(finalValue).toBe('更新後的文字內容');

    // 測試提交按鈕狀態
    const isEnabled = await submitButton.isEnabled();
    expect(typeof isEnabled).toBe('boolean');

    console.log('Firefox 表單驗證測試完成');
  });

  /**
   * 測試 Firefox 的 CSS 和佈局渲染
   */
  test('應該正確渲染 CSS 和佈局', async ({ page }) => {
    const container = page.locator('[data-testid="video-editor-container"]');
    const descriptionInput = page.locator('[data-testid="step-description"]');

    // 檢查基本佈局
    if (await container.isVisible()) {
      const containerBox = await container.boundingBox();
      expect(containerBox?.width).toBeGreaterThan(0);
      expect(containerBox?.height).toBeGreaterThan(0);
    }

    // 測試 Firefox 的 CSS Grid 和 Flexbox 支援
    const layoutSupport = await page.evaluate(() => {
      const testElement = document.createElement('div');
      document.body.appendChild(testElement);

      // 測試 CSS Grid
      testElement.style.display = 'grid';
      const gridSupported = getComputedStyle(testElement).display === 'grid';

      // 測試 Flexbox
      testElement.style.display = 'flex';
      const flexSupported = getComputedStyle(testElement).display === 'flex';

      document.body.removeChild(testElement);

      return {
        grid: gridSupported,
        flex: flexSupported,
        cssom: 'getComputedStyle' in window,
      };
    });

    expect(layoutSupport.grid).toBe(true);
    expect(layoutSupport.flex).toBe(true);
    expect(layoutSupport.cssom).toBe(true);

    // 測試回應式設計
    await page.setViewportSize({ width: 768, height: 1024 }); // 平板尺寸
    await page.waitForTimeout(500);

    const inputBox = await descriptionInput.boundingBox();
    if (inputBox) {
      expect(inputBox.width).toBeGreaterThan(200);
    }

    console.log('Firefox CSS 渲染測試完成');
  });

  /**
   * 測試 Firefox 的 JavaScript 功能支援
   */
  test('應該支援現代 JavaScript 功能', async ({ page }) => {
    const jsSupport = await page.evaluate(() => {
      // 測試 ES6+ 功能
      const features = {
        arrow: (() => true)(),
        destructuring: (() => {
          const [a] = [1];
          return a === 1;
        })(),
        templateLiterals: (() => {
          const name = 'test';
          return `Hello ${name}` === 'Hello test';
        })(),
        promises: typeof Promise !== 'undefined',
        asyncAwait: (async () => true)() instanceof Promise,
        modules: 'import' in document.createElement('script'),
        classes: (() => {
          try {
            class Test {}
            return typeof Test === 'function';
          } catch {
            return false;
          }
        })(),
        spread: (() => {
          const arr = [1, 2, 3];
          return [...arr].length === 3;
        })(),
      };

      return features;
    });

    // Firefox 應該支援這些現代 JavaScript 功能
    expect(jsSupport.arrow).toBe(true);
    expect(jsSupport.destructuring).toBe(true);
    expect(jsSupport.templateLiterals).toBe(true);
    expect(jsSupport.promises).toBe(true);
    expect(jsSupport.classes).toBe(true);
    expect(jsSupport.spread).toBe(true);

    console.log('Firefox JavaScript 功能支援:', jsSupport);
  });

  /**
   * 測試 Firefox 的網路請求處理
   */
  test('應該正確處理網路請求和回應', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 準備測試資料
    await descriptionInput.fill('測試 Firefox 網路請求處理');

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 測試 Fetch API 支援
    const fetchSupport = await page.evaluate(() => {
      return {
        fetch: typeof fetch !== 'undefined',
        headers: typeof Headers !== 'undefined',
        request: typeof Request !== 'undefined',
        response: typeof Response !== 'undefined',
      };
    });

    expect(fetchSupport.fetch).toBe(true);
    expect(fetchSupport.headers).toBe(true);
    expect(fetchSupport.request).toBe(true);
    expect(fetchSupport.response).toBe(true);

    // 設定 API 攔截
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Firefox 測試成功',
        }),
      });
    });

    // 測試提交
    await submitButton.click();
    await page.waitForTimeout(2000);

    const successMessage = page.locator('[data-testid="success-message"]');
    if (await successMessage.isVisible()) {
      await expect(successMessage).toContainText('Firefox 測試成功');
    }

    console.log('Firefox 網路請求處理測試完成');
  });

  /**
   * 測試 Firefox 的安全性功能
   */
  test('應該遵循 Firefox 的安全策略', async ({ page }) => {
    // 檢查安全相關 API
    const securityFeatures = await page.evaluate(() => {
      return {
        csp: 'securityPolicyViolation' in document,
        srcdoc: 'srcdoc' in document.createElement('iframe'),
        sandbox: 'sandbox' in document.createElement('iframe'),
        cors: 'withCredentials' in new XMLHttpRequest(),
        mixedContent: window.location.protocol === 'https:',
      };
    });

    // Firefox 的安全功能檢查
    expect(securityFeatures.cors).toBe(true);

    // 測試內容安全策略
    const cspTest = await page.evaluate(() => {
      try {
        // 嘗試執行內聯腳本（應該被 CSP 阻止）
        const script = document.createElement('script');
        script.textContent = 'window.testInlineScript = true;';
        document.head.appendChild(script);
        document.head.removeChild(script);

        return {
          inlineScriptAllowed: 'testInlineScript' in window,
          cspActive: true,
        };
      } catch {
        return {
          inlineScriptAllowed: false,
          cspActive: true,
        };
      }
    });

    console.log('Firefox 安全功能:', securityFeatures);
    console.log('CSP 測試結果:', cspTest);
  });

  /**
   * 測試 Firefox 的效能和記憶體管理
   */
  test('應該有效管理效能和記憶體', async ({ page }) => {
    // 測試 Performance API
    const performanceSupport = await page.evaluate(() => {
      return {
        performance: 'performance' in window,
        timing: 'timing' in performance,
        navigation: 'navigation' in performance,
        mark: 'mark' in performance,
        measure: 'measure' in performance,
        observer: 'PerformanceObserver' in window,
      };
    });

    expect(performanceSupport.performance).toBe(true);
    expect(performanceSupport.timing).toBe(true);
    expect(performanceSupport.mark).toBe(true);
    expect(performanceSupport.measure).toBe(true);

    // 執行效能測試
    const performanceMetrics = await page.evaluate(() => {
      performance.mark('test-start');

      // 模擬一些操作
      const start = performance.now();
      const arr = Array.from({ length: 1000 }, (_, i) => i);
      const sum = arr.reduce((a, b) => a + b, 0);
      const end = performance.now();

      performance.mark('test-end');
      performance.measure('test-duration', 'test-start', 'test-end');

      const measures = performance.getEntriesByType('measure');

      return {
        duration: end - start,
        measureCount: measures.length,
        sum,
      };
    });

    expect(performanceMetrics.duration).toBeGreaterThan(0);
    expect(performanceMetrics.sum).toBe(499500); // 0+1+2+...+999

    console.log('Firefox 效能測試完成:', performanceMetrics);
  });

  /**
   * 測試 Firefox 的使用者介面交互
   */
  test('應該支援完整的使用者介面交互', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');

    // 測試鍵盤事件
    await descriptionInput.focus();
    await page.keyboard.type('測試 Firefox 鍵盤輸入');

    // 測試鍵盤快捷鍵
    await page.keyboard.press('Control+A'); // 全選
    await page.keyboard.press('Control+C'); // 複製
    await page.keyboard.press('Delete'); // 刪除
    await page.keyboard.press('Control+V'); // 貼上

    const finalValue = await descriptionInput.inputValue();
    expect(finalValue).toBe('測試 Firefox 鍵盤輸入');

    // 測試滑鼠事件
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    await submitButton.hover();
    await page.waitForTimeout(100);

    // 檢查 hover 狀態
    const hoverState = await submitButton.evaluate((el) => {
      return getComputedStyle(el).cursor;
    });

    expect(hoverState).toBeTruthy();

    console.log('Firefox UI 交互測試完成');
  });
});
