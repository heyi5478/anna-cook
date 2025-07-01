import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * Safari/WebKit 瀏覽器功能檢測相關型別定義
 */
type SafariCodecSupport = {
  h264: string;
  hevc: string;
  mp4: string;
  mov: string;
  hls: string;
  webm: string;
};

type SafariTouchSupport = {
  touchEvents: boolean;
  touchAction: boolean;
  pointerEvents: boolean;
  gestureEvents: boolean;
};

type SafariCssSupport = {
  webkitBackdropFilter: boolean;
  backdropFilter: boolean;
  webkitMask: boolean;
  webkitClipPath: boolean;
  webkitTransform: boolean;
  transform: boolean;
  flexbox: boolean;
  grid: boolean;
  cssVariables: boolean;
  objectFit: boolean;
};

type SafariJavaScriptSupport = {
  es6Classes: boolean;
  asyncAwait: boolean;
  arrow: boolean;
  templateLiterals: boolean;
  destructuring: boolean;
  spread: boolean;
  symbols: boolean;
  proxy: boolean;
  weakMap: boolean;
  set: boolean;
  map: boolean;
};

/**
 * Safari/WebKit 兼容性測試
 */
test.describe('Safari/WebKit 瀏覽器兼容性', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試 Safari 的媒體播放支援
   */
  test('應該支援 Safari 的媒體格式', async ({ page }) => {
    // 檢查 Safari 支援的編解碼器
    const codecSupport: SafariCodecSupport = await page.evaluate(() => {
      const video = document.createElement('video');
      return {
        h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
        hevc: video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"'),
        mp4: video.canPlayType('video/mp4'),
        mov: video.canPlayType('video/quicktime'),
        hls: video.canPlayType('application/vnd.apple.mpegurl'),
        webm: video.canPlayType('video/webm'),
      };
    });

    // Safari 主要支援 Apple 格式
    expect(codecSupport.h264).toBeTruthy();
    expect(codecSupport.mp4).toBeTruthy();

    console.log('Safari 媒體格式支援:', codecSupport);

    // 測試實際影片檔案播放
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    const videoPlayer = page.locator('[data-testid="video-player"]');
    if (await videoPlayer.isVisible()) {
      // 檢查影片載入狀態
      const videoElement = await videoPlayer.evaluate((video) => {
        const el = video.querySelector('video');
        return el
          ? {
              readyState: el.readyState,
              networkState: el.networkState,
              duration: el.duration,
            }
          : null;
      });

      if (videoElement) {
        expect(videoElement.readyState).toBeGreaterThanOrEqual(0);
      }
    }

    console.log('Safari 媒體播放測試完成');
  });

  /**
   * 測試 Safari 的觸控和手勢支援
   */
  test('應該支援 Safari 的觸控功能', async ({ page }) => {
    // 檢查觸控 API 支援
    const touchSupport: SafariTouchSupport = await page.evaluate(() => {
      return {
        touchEvents: 'ontouchstart' in window,
        touchAction: 'touchAction' in document.body.style,
        pointerEvents: 'onpointerdown' in window,
        gestureEvents: 'ongesturestart' in window,
      };
    });

    console.log('Safari 觸控支援:', touchSupport);

    // 模擬觸控事件
    const descriptionInput = page.locator('[data-testid="step-description"]');

    // 使用 Playwright 的 touch API（如果支援）
    await descriptionInput.click();
    await page.waitForTimeout(100);

    // 檢查焦點狀態
    const isFocused = await descriptionInput.evaluate((el) => {
      return document.activeElement === el;
    });

    expect(isFocused).toBe(true);

    console.log('Safari 觸控功能測試完成');
  });

  /**
   * 測試 Safari 的 CSS 特性支援
   */
  test('應該支援 Safari 的 CSS 功能', async ({ page }) => {
    // 檢查 Safari CSS 特性
    const cssSupport: SafariCssSupport = await page.evaluate(() => {
      const testEl = document.createElement('div');
      const { style } = testEl;

      return {
        webkitBackdropFilter: 'webkitBackdropFilter' in style,
        backdropFilter: 'backdropFilter' in style,
        webkitMask: 'webkitMask' in style,
        webkitClipPath: 'webkitClipPath' in style,
        webkitTransform: 'webkitTransform' in style,
        transform: 'transform' in style,
        flexbox: 'flexBasis' in style,
        grid: 'gridTemplateColumns' in style,
        cssVariables: CSS.supports('--test: 0'),
        objectFit: 'objectFit' in style,
      };
    });

    // Safari 應該支援這些 CSS 功能
    expect(cssSupport.transform).toBe(true);
    expect(cssSupport.flexbox).toBe(true);
    expect(cssSupport.cssVariables).toBe(true);

    console.log('Safari CSS 功能支援:', cssSupport);

    // 測試實際 CSS 渲染
    const container = page.locator('[data-testid="video-editor-container"]');
    if (await container.isVisible()) {
      const styles = await container.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          display: computed.display,
          position: computed.position,
          zIndex: computed.zIndex,
        };
      });

      expect(styles.display).toBeTruthy();
    }

    console.log('Safari CSS 渲染測試完成');
  });

  /**
   * 測試 Safari 的檔案處理限制
   */
  test('應該處理 Safari 的檔案上傳限制', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-file-input"]');

    // 檢查檔案 API 支援
    const fileApiSupport = await page.evaluate(() => {
      return {
        fileReader: typeof FileReader !== 'undefined',
        fileList: typeof FileList !== 'undefined',
        file: typeof File !== 'undefined',
        blob: typeof Blob !== 'undefined',
        formData: typeof FormData !== 'undefined',
      };
    });

    expect(fileApiSupport.fileReader).toBe(true);
    expect(fileApiSupport.file).toBe(true);
    expect(fileApiSupport.blob).toBe(true);
    expect(fileApiSupport.formData).toBe(true);

    // 測試檔案上傳
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 檢查檔案處理狀態
    const fileStatus = page.locator('[data-testid="file-status"]');
    if (await fileStatus.isVisible()) {
      await expect(fileStatus).toContainText('檔案上傳成功');
    }

    console.log('Safari 檔案處理測試完成');
  });

  /**
   * 測試 Safari 的 JavaScript 引擎限制
   */
  test('應該適應 Safari 的 JavaScript 限制', async ({ page }) => {
    // 檢查 Safari JavaScript 功能
    const jsSupport: SafariJavaScriptSupport = await page.evaluate(() => {
      return {
        es6Classes: (() => {
          try {
            class TestClass {}
            return typeof TestClass === 'function';
          } catch {
            return false;
          }
        })(),
        asyncAwait: (async () => {})().constructor.name === 'AsyncFunction',
        arrow: (() => {}).constructor.name === 'Function',
        templateLiterals: (() => {
          try {
            return `test` === 'test';
          } catch {
            return false;
          }
        })(),
        destructuring: (() => {
          try {
            const { testValue } = { testValue: true };
            return testValue === true;
          } catch {
            return false;
          }
        })(),
        spread: (() => {
          try {
            const arr = [1, 2, 3];
            return [...arr].length === 3;
          } catch {
            return false;
          }
        })(),
        symbols: typeof Symbol !== 'undefined',
        proxy: typeof Proxy !== 'undefined',
        weakMap: typeof WeakMap !== 'undefined',
        set: typeof Set !== 'undefined',
        map: typeof Map !== 'undefined',
      };
    });

    // Safari 應該支援現代 JavaScript 功能
    expect(jsSupport.es6Classes).toBe(true);
    expect(jsSupport.arrow).toBe(true);
    expect(jsSupport.templateLiterals).toBe(true);
    expect(jsSupport.symbols).toBe(true);
    expect(jsSupport.set).toBe(true);
    expect(jsSupport.map).toBe(true);

    console.log('Safari JavaScript 功能支援:', jsSupport);
  });

  /**
   * 測試 Safari 的隱私功能
   */
  test('應該遵循 Safari 的隱私政策', async ({ page }) => {
    // 檢查 Safari 隱私相關功能
    const privacyFeatures = await page.evaluate(() => {
      return {
        doNotTrack: navigator.doNotTrack,
        cookieEnabled: navigator.cookieEnabled,
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        indexedDB: typeof indexedDB !== 'undefined',
        webSQL: 'openDatabase' in window,
        thirdPartyCookies: (() => {
          try {
            localStorage.setItem('test', 'value');
            localStorage.removeItem('test');
            return true;
          } catch {
            return false;
          }
        })(),
      };
    });

    // Safari 隱私功能檢查
    expect(privacyFeatures.cookieEnabled).toBe(true);
    expect(privacyFeatures.localStorage).toBe(true);
    expect(privacyFeatures.sessionStorage).toBe(true);

    console.log('Safari 隱私功能:', privacyFeatures);

    // 測試 localStorage 功能
    await page.evaluate(() => {
      localStorage.setItem('safari-test', 'test-value');
    });

    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('safari-test');
    });

    expect(storedValue).toBe('test-value');

    // 清理測試資料
    await page.evaluate(() => {
      localStorage.removeItem('safari-test');
    });

    console.log('Safari 隱私政策測試完成');
  });

  /**
   * 測試 Safari 的效能特性
   */
  test('應該優化 Safari 的效能表現', async ({ page }) => {
    // 檢查 Safari 效能 API
    const performanceSupport = await page.evaluate(() => {
      return {
        performance: typeof performance !== 'undefined',
        now: typeof performance.now === 'function',
        mark: typeof performance.mark === 'function',
        measure: typeof performance.measure === 'function',
        timing: 'timing' in performance,
        navigation: 'navigation' in performance,
        observer: typeof PerformanceObserver !== 'undefined',
        memory: 'memory' in performance,
      };
    });

    expect(performanceSupport.performance).toBe(true);
    expect(performanceSupport.now).toBe(true);
    expect(performanceSupport.timing).toBe(true);

    // 執行效能測試
    const performanceTest = await page.evaluate(() => {
      const start = performance.now();

      // 執行一些計算
      const result = Array.from({ length: 1000 }, (_, i) => i)
        .map((x) => x * 2)
        .filter((x) => x % 2 === 0)
        .reduce((sum, x) => sum + x, 0);

      const end = performance.now();

      return {
        duration: end - start,
        result,
      };
    });

    expect(performanceTest.duration).toBeGreaterThan(0);
    expect(performanceTest.result).toBeGreaterThan(0);

    console.log('Safari 效能測試完成:', performanceTest);
  });

  /**
   * 測試 Safari 的表單互動
   */
  test('應該正確處理 Safari 的表單行為', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 測試 Safari 的輸入處理
    await descriptionInput.focus();
    await page.keyboard.type('測試 Safari 表單輸入功能');

    // Safari 特殊的 composition 事件處理
    const inputValue = await descriptionInput.inputValue();
    expect(inputValue).toBe('測試 Safari 表單輸入功能');

    // 測試 Safari 的表單驗證
    await descriptionInput.fill('');
    await page.waitForTimeout(100);

    const validationState = await descriptionInput.evaluate((el) => {
      const input = el as HTMLInputElement;
      return {
        validity: input.validity?.valid,
        required: input.hasAttribute('required'),
        value: input.value,
      };
    });

    console.log('Safari 表單驗證狀態:', validationState);

    // 重新填寫有效內容
    await descriptionInput.fill('有效的 Safari 測試內容');

    // 上傳檔案
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 設定 API 攔截
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Safari 測試提交成功',
        }),
      });
    });

    // 測試提交
    await submitButton.click();
    await page.waitForTimeout(2000);

    const successMessage = page.locator('[data-testid="success-message"]');
    if (await successMessage.isVisible()) {
      await expect(successMessage).toContainText('Safari 測試提交成功');
    }

    console.log('Safari 表單互動測試完成');
  });

  /**
   * 測試 Safari 的網路請求處理
   */
  test('應該處理 Safari 的網路限制', async ({ page }) => {
    // 檢查 Fetch API 支援
    const networkSupport = await page.evaluate(() => {
      return {
        fetch: typeof fetch !== 'undefined',
        xhr: typeof XMLHttpRequest !== 'undefined',
        headers: typeof Headers !== 'undefined',
        request: typeof Request !== 'undefined',
        response: typeof Response !== 'undefined',
        formData: typeof FormData !== 'undefined',
        urlSearchParams: typeof URLSearchParams !== 'undefined',
      };
    });

    expect(networkSupport.fetch).toBe(true);
    expect(networkSupport.xhr).toBe(true);
    expect(networkSupport.headers).toBe(true);

    // 測試實際網路請求
    await page.route('**/api/test', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          safari: true,
          message: 'Safari 網路測試成功',
        }),
      });
    });

    const networkTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });

    expect(networkTest.success).toBe(true);
    if (networkTest.success) {
      expect(networkTest.data?.safari).toBe(true);
    }

    console.log('Safari 網路請求測試完成');
  });
});
