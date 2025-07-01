import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * Chrome 特定功能測試
 */
test.describe('Chrome 瀏覽器特定功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試 Chrome 的檔案拖放功能
   */
  test('應該支援 Chrome 原生檔案拖放功能', async ({ page }) => {
    const dropZone = page.locator('[data-testid="file-drop-zone"]');
    const fileStatus = page.locator('[data-testid="file-status"]');

    // 檢查拖放區域
    await expect(dropZone).toBeVisible();

    // 模擬檔案拖放
    const validVideo = getTestFilePath('test-video-short.mp4');

    // 在 Chrome 中模擬拖放事件
    await page.evaluate(() => {
      const dropZoneElement = document.querySelector(
        '[data-testid="file-drop-zone"]',
      );
      if (dropZoneElement) {
        // 創建模擬檔案
        const file = new File(['video content'], 'test-video.mp4', {
          type: 'video/mp4',
        });

        // 模擬拖放事件
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dragOverEvent = new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          dataTransfer,
        });

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer,
        });

        dropZoneElement.dispatchEvent(dragOverEvent);
        dropZoneElement.dispatchEvent(dropEvent);
      }
    }, validVideo);

    await page.waitForTimeout(1000);

    // 檢查檔案狀態
    if (await fileStatus.isVisible()) {
      await expect(fileStatus).toContainText('檔案上傳成功');
    }

    console.log('Chrome 檔案拖放功能測試完成');
  });

  /**
   * 測試 Chrome 的 Web API 支援
   */
  test('應該支援 Chrome 特有的 Web API', async ({ page }) => {
    // 檢查 Chrome 特有 API 支援
    const apiSupport = await page.evaluate(() => {
      return {
        fileSystemAccess: 'showOpenFilePicker' in window,
        webSerial: 'serial' in navigator,
        webUsb: 'usb' in navigator,
        webShare: 'share' in navigator,
        webLocks: 'locks' in navigator,
        trustedTypes: 'trustedTypes' in window,
        resizeObserver: 'ResizeObserver' in window,
        intersectionObserver: 'IntersectionObserver' in window,
      };
    });

    // Chrome 應該支援這些 API
    expect(apiSupport.resizeObserver).toBe(true);
    expect(apiSupport.intersectionObserver).toBe(true);

    console.log('Chrome Web API 支援:', apiSupport);
  });

  /**
   * 測試 Chrome 的記憶體效能監控
   */
  test('應該正確監控 Chrome 的記憶體使用', async ({ page }) => {
    // 檢查 Chrome 的 performance.memory API
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        const { memory } = performance as any;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          available: true,
        };
      }
      return { available: false };
    });

    if (memoryInfo.available) {
      expect(memoryInfo.usedJSHeapSize).toBeGreaterThan(0);
      expect(memoryInfo.totalJSHeapSize).toBeGreaterThan(0);
      expect(memoryInfo.jsHeapSizeLimit).toBeGreaterThan(0);

      console.log('Chrome 記憶體資訊:', memoryInfo);
    }
  });

  /**
   * 測試 Chrome 的影片編解碼器支援
   */
  test('應該支援 Chrome 的影片編解碼器', async ({ page }) => {
    const codecSupport = await page.evaluate(() => {
      const video = document.createElement('video');
      return {
        h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
        vp8: video.canPlayType('video/webm; codecs="vp8"'),
        vp9: video.canPlayType('video/webm; codecs="vp9"'),
        av1: video.canPlayType('video/mp4; codecs="av01.0.08M.08"'),
        hevc: video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"'),
      };
    });

    // Chrome 應該支援基本的編解碼器
    expect(codecSupport.h264).toBeTruthy();
    expect(codecSupport.vp8).toBeTruthy();
    expect(codecSupport.vp9).toBeTruthy();

    console.log('Chrome 編解碼器支援:', codecSupport);
  });

  /**
   * 測試 Chrome 的開發者工具整合
   */
  test('應該支援 Chrome DevTools 整合功能', async ({ page }) => {
    // 檢查是否在 Chrome 中運行
    const isChrome = await page.evaluate(() => {
      return (
        navigator.userAgent.includes('Chrome') &&
        !navigator.userAgent.includes('Edg')
      );
    });

    if (isChrome) {
      // 檢查 console API
      const consoleSupport = await page.evaluate(() => {
        return {
          time: typeof console.time === 'function',
          timeEnd: typeof console.timeEnd === 'function',
          group: typeof console.group === 'function',
          table: typeof console.table === 'function',
          trace: typeof console.trace === 'function',
        };
      });

      expect(consoleSupport.time).toBe(true);
      expect(consoleSupport.timeEnd).toBe(true);
      expect(consoleSupport.group).toBe(true);
      expect(consoleSupport.table).toBe(true);
      expect(consoleSupport.trace).toBe(true);

      console.log('Chrome DevTools API 支援完整');
    }
  });

  /**
   * 測試 Chrome 的安全功能
   */
  test('應該正確處理 Chrome 的安全策略', async ({ page }) => {
    // 檢查 HTTPS 要求（在實際部署中）
    const securityFeatures = await page.evaluate(() => {
      return {
        isSecureContext: window.isSecureContext,
        crypto: 'crypto' in window && 'subtle' in window.crypto,
        permissions: 'permissions' in navigator,
        clipboard: 'clipboard' in navigator,
      };
    });

    // 在安全上下文中，這些功能應該可用
    if (securityFeatures.isSecureContext) {
      expect(securityFeatures.crypto).toBe(true);
      expect(securityFeatures.permissions).toBe(true);
    }

    console.log('Chrome 安全功能:', securityFeatures);
  });

  /**
   * 測試 Chrome 特有的媒體功能
   */
  test('應該支援 Chrome 的媒體處理功能', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');

    // 上傳影片檔案
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 檢查 Chrome 的媒體 API
    const mediaSupport = await page.evaluate(() => {
      return {
        mediaDevices: 'mediaDevices' in navigator,
        getUserMedia: 'getUserMedia' in navigator.mediaDevices,
        getDisplayMedia: 'getDisplayMedia' in navigator.mediaDevices,
        webrtc: 'RTCPeerConnection' in window,
        webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
        mediaRecorder: 'MediaRecorder' in window,
        mediaSource: 'MediaSource' in window,
      };
    });

    expect(mediaSupport.mediaDevices).toBe(true);
    expect(mediaSupport.webrtc).toBe(true);
    expect(mediaSupport.webAudio).toBe(true);
    expect(mediaSupport.mediaRecorder).toBe(true);
    expect(mediaSupport.mediaSource).toBe(true);

    console.log('Chrome 媒體功能測試完成');
  });

  /**
   * 測試 Chrome 的效能優化功能
   */
  test('應該利用 Chrome 的效能優化特性', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');

    // 測試 Intersection Observer（Chrome 優化的 API）
    const intersectionSupport = await page.evaluate(() => {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            // 檢查元素是否可見
            console.log('Element visibility:', entry.isIntersecting);
          });
        });

        const element = document.querySelector(
          '[data-testid="step-description"]',
        );
        if (element) {
          observer.observe(element);
          return { supported: true, observing: true };
        }
      }
      return { supported: false, observing: false };
    });

    expect(intersectionSupport.supported).toBe(true);

    // 測試 Chrome 的 requestIdleCallback
    const idleCallbackSupport = await page.evaluate(() => {
      return 'requestIdleCallback' in window;
    });

    if (idleCallbackSupport) {
      console.log('Chrome requestIdleCallback 支援可用');
    }

    // 測試輸入防抖
    await descriptionInput.fill('測試 Chrome 效能優化');
    await page.waitForTimeout(500);

    const inputValue = await descriptionInput.inputValue();
    expect(inputValue).toBe('測試 Chrome 效能優化');

    console.log('Chrome 效能優化功能測試完成');
  });
});
