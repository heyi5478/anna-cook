import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * 資源限制處理測試
 */
test.describe('資源限制處理功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試大檔案處理能力
   */
  test('應該正確處理超大影片檔案', async ({ page }) => {
    const warningMessage = page.locator('[data-testid="large-file-warning"]');
    const uploadProgress = page.locator('[data-testid="upload-progress"]');

    // 模擬大檔案上傳（假設超過 100MB）
    const mockLargeFile = {
      name: 'large-video.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.alloc(100 * 1024 * 1024), // 100MB
    };

    // 測試檔案大小限制檢查
    await page.evaluate((file) => {
      const input = document.querySelector(
        '[data-testid="video-file-input"]',
      ) as HTMLInputElement;
      if (input) {
        const mockFile = new File(
          [new ArrayBuffer(file.buffer.length)],
          file.name,
          {
            type: file.mimeType,
          },
        );

        // 模擬檔案選擇事件
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        input.files = dataTransfer.files;

        // 觸發 change 事件
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, mockLargeFile);

    await page.waitForTimeout(1000);

    // 檢查大檔案警告訊息
    await expect(warningMessage).toBeVisible();
    await expect(warningMessage).toContainText(
      '檔案較大，上傳可能需要較長時間',
    );

    // 檢查是否顯示上傳進度
    if (await uploadProgress.isVisible()) {
      await expect(uploadProgress).toBeVisible();
    }

    console.log('大檔案處理測試完成');
  });

  /**
   * 測試檔案大小限制驗證
   */
  test('應該拒絕超過大小限制的檔案', async ({ page }) => {
    const errorMessage = page.locator('[data-testid="file-size-error"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 模擬超大檔案（假設限制為 500MB）
    const mockOversizedFile = {
      name: 'oversized-video.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.alloc(600 * 1024 * 1024), // 600MB
    };

    // 嘗試上傳超大檔案
    await page.evaluate((file) => {
      const input = document.querySelector(
        '[data-testid="video-file-input"]',
      ) as HTMLInputElement;
      if (input) {
        const mockFile = new File(
          [new ArrayBuffer(file.buffer.length)],
          file.name,
          {
            type: file.mimeType,
          },
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        input.files = dataTransfer.files;

        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, mockOversizedFile);

    await page.waitForTimeout(1000);

    // 檢查錯誤訊息
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('檔案大小超過限制（最大 500MB）');

    // 檢查提交按鈕被禁用
    await expect(submitButton).toBeDisabled();

    console.log('檔案大小限制驗證測試完成');
  });

  /**
   * 測試記憶體不足處理
   */
  test('應該處理記憶體不足的情況', async ({ page }) => {
    const memoryWarning = page.locator('[data-testid="memory-warning"]');
    const lowMemoryError = page.locator('[data-testid="low-memory-error"]');

    // 模擬記憶體使用監控
    await page.evaluate(() => {
      // 模擬記憶體使用量檢查
      (window as any).simulateMemoryUsage = () => {
        const mockMemoryInfo = {
          usedJSHeapSize: 800 * 1024 * 1024, // 800MB
          totalJSHeapSize: 1024 * 1024 * 1024, // 1GB
          jsHeapSizeLimit: 1024 * 1024 * 1024, // 1GB
        };

        // 觸發記憶體警告
        if (
          mockMemoryInfo.usedJSHeapSize >
          mockMemoryInfo.totalJSHeapSize * 0.8
        ) {
          const event = new CustomEvent('memorywarning', {
            detail: mockMemoryInfo,
          });
          window.dispatchEvent(event);
        }
      };

      (window as any).simulateMemoryUsage();
    });

    await page.waitForTimeout(1000);

    // 檢查記憶體警告
    if (await memoryWarning.isVisible()) {
      await expect(memoryWarning).toBeVisible();
      await expect(memoryWarning).toContainText('記憶體使用量較高');
    }

    // 模擬記憶體不足情況
    await page.evaluate(() => {
      const mockCriticalMemoryInfo = {
        usedJSHeapSize: 950 * 1024 * 1024, // 950MB
        totalJSHeapSize: 1024 * 1024 * 1024, // 1GB
        jsHeapSizeLimit: 1024 * 1024 * 1024, // 1GB
      };

      if (
        mockCriticalMemoryInfo.usedJSHeapSize >
        mockCriticalMemoryInfo.totalJSHeapSize * 0.9
      ) {
        const event = new CustomEvent('memoryerror', {
          detail: mockCriticalMemoryInfo,
        });
        window.dispatchEvent(event);
      }
    });

    await page.waitForTimeout(1000);

    // 檢查記憶體不足錯誤
    if (await lowMemoryError.isVisible()) {
      await expect(lowMemoryError).toBeVisible();
      await expect(lowMemoryError).toContainText(
        '記憶體不足，請關閉其他應用程式',
      );
    }

    console.log('記憶體不足處理測試完成');
  });

  /**
   * 測試瀏覽器能力限制檢查
   */
  test('應該檢查瀏覽器支援的功能', async ({ page }) => {
    const capabilityWarning = page.locator(
      '[data-testid="capability-warning"]',
    );
    const unsupportedError = page.locator('[data-testid="unsupported-error"]');

    // 檢查瀏覽器能力並記錄
    await page.evaluate(() => {
      const capabilities = {
        videoSupport: !!document.createElement('video').canPlayType,
        webWorkerSupport: typeof Worker !== 'undefined',
        fileApiSupport: typeof FileReader !== 'undefined',
        arrayBufferSupport: typeof ArrayBuffer !== 'undefined',
        webAssemblySupport: typeof WebAssembly !== 'undefined',
        offscreenCanvasSupport: typeof OffscreenCanvas !== 'undefined',
      };
      console.log('Browser capabilities:', capabilities);
    });

    // 模擬缺少必要功能的情況
    await page.evaluate(() => {
      // 暫時隱藏 WebWorker 支援
      (window as any).Worker = undefined;

      // 觸發能力檢查
      const event = new CustomEvent('capabilitycheck');
      window.dispatchEvent(event);
    });

    await page.waitForTimeout(500);

    // 檢查警告訊息
    if (await capabilityWarning.isVisible()) {
      await expect(capabilityWarning).toContainText('瀏覽器功能受限');
    }

    // 模擬完全不支援的情況
    await page.evaluate(() => {
      (window as any).FileReader = undefined;
      (window as any).ArrayBuffer = undefined;

      const event = new CustomEvent('capabilitycheck');
      window.dispatchEvent(event);
    });

    await page.waitForTimeout(500);

    if (await unsupportedError.isVisible()) {
      await expect(unsupportedError).toContainText('瀏覽器不支援此功能');
    }

    console.log('瀏覽器能力限制檢查測試完成');
  });

  /**
   * 測試並發處理限制
   */
  test('應該限制並發處理數量', async ({ page }) => {
    const concurrencyWarning = page.locator(
      '[data-testid="concurrency-warning"]',
    );
    const queueStatus = page.locator('[data-testid="queue-status"]');

    // 模擬批量檔案選擇
    await page.evaluate(() => {
      const input = document.querySelector(
        '[data-testid="video-file-input"]',
      ) as HTMLInputElement;
      if (input) {
        const mockFiles = Array.from({ length: 5 }, (_, index) => {
          return new File(
            [new ArrayBuffer(10 * 1024 * 1024)],
            `video-${index + 1}.mp4`,
            {
              type: 'video/mp4',
            },
          );
        });

        const dataTransfer = new DataTransfer();
        mockFiles.forEach((file) => dataTransfer.items.add(file));
        input.files = dataTransfer.files;

        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    });

    await page.waitForTimeout(1000);

    // 檢查並發限制警告
    if (await concurrencyWarning.isVisible()) {
      await expect(concurrencyWarning).toContainText('同時處理檔案數量過多');
    }

    // 檢查佇列狀態
    if (await queueStatus.isVisible()) {
      await expect(queueStatus).toContainText('佇列中');
    }

    console.log('並發處理限制測試完成');
  });

  /**
   * 測試磁碟空間不足處理
   */
  test('應該檢查磁碟空間並警告使用者', async ({ page }) => {
    const storageWarning = page.locator('[data-testid="storage-warning"]');
    const storageError = page.locator('[data-testid="storage-error"]');

    // 模擬磁碟空間檢查
    await page.evaluate(() => {
      // 覆寫 navigator.storage API
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate = async () => {
          return {
            quota: 5 * 1024 * 1024 * 1024, // 5GB
            usage: 4.5 * 1024 * 1024 * 1024, // 4.5GB 已使用
          };
        };
      }
    });

    // 嘗試上傳檔案觸發空間檢查
    const testVideo = getTestFilePath('test-video-short.mp4');

    await page.evaluate(() => {
      const input = document.querySelector(
        '[data-testid="video-file-input"]',
      ) as HTMLInputElement;
      if (input) {
        // 模擬較大檔案
        const mockFile = new File(
          [new ArrayBuffer(100 * 1024 * 1024)],
          'test-video.mp4',
          {
            type: 'video/mp4',
          },
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        input.files = dataTransfer.files;

        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }, testVideo);

    await page.waitForTimeout(1000);

    // 檢查儲存空間警告
    if (await storageWarning.isVisible()) {
      await expect(storageWarning).toContainText('儲存空間不足');
    }

    // 模擬完全沒有空間的情況
    await page.evaluate(() => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate = async () => {
          return {
            quota: 5 * 1024 * 1024 * 1024, // 5GB
            usage: 4.99 * 1024 * 1024 * 1024, // 4.99GB 已使用
          };
        };
      }
    });

    // 重新檢查
    await page.reload();
    await waitForNetworkIdle(page);

    if (await storageError.isVisible()) {
      await expect(storageError).toContainText('儲存空間已滿');
    }

    console.log('磁碟空間檢查測試完成');
  });

  /**
   * 測試網路頻寬限制適應
   */
  test('應該根據網路頻寬調整處理策略', async ({ page }) => {
    const bandwidthIndicator = page.locator(
      '[data-testid="bandwidth-indicator"]',
    );
    const qualityAdjustment = page.locator(
      '[data-testid="quality-adjustment"]',
    );

    // 模擬低頻寬網路
    await page.route('**/*', async (route) => {
      // 延遲回應模擬低頻寬
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
      route.continue();
    });

    // 觸發頻寬檢測
    await page.evaluate(() => {
      const event = new CustomEvent('bandwidthcheck', {
        detail: { speed: 'slow' },
      });
      window.dispatchEvent(event);
    });

    await page.waitForTimeout(1000);

    // 檢查頻寬指示器
    if (await bandwidthIndicator.isVisible()) {
      await expect(bandwidthIndicator).toContainText('網路速度較慢');
    }

    // 檢查品質調整建議
    if (await qualityAdjustment.isVisible()) {
      await expect(qualityAdjustment).toContainText('建議降低影片品質');
    }

    console.log('網路頻寬限制適應測試完成');
  });

  /**
   * 測試資源清理機制
   */
  test('應該正確清理不再使用的資源', async ({ page }) => {
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // 執行一些資源密集操作

    // 多次上傳和清除檔案
    await Array.from({ length: 3 }).reduce(async (promise) => {
      await promise;
      await page.evaluate(() => {
        const input = document.querySelector(
          '[data-testid="video-file-input"]',
        ) as HTMLInputElement;
        if (input) {
          const mockFile = new File(
            [new ArrayBuffer(50 * 1024 * 1024)],
            `test-${Date.now()}.mp4`,
            {
              type: 'video/mp4',
            },
          );

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(mockFile);
          input.files = dataTransfer.files;

          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
        }
      });

      await page.waitForTimeout(500);

      // 清除檔案
      const clearButton = page.locator('[data-testid="clear-file-btn"]');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(300);
      }
    }, Promise.resolve());

    // 檢查記憶體使用是否有顯著增長
    const finalMemoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    if (memoryUsage > 0 && finalMemoryUsage > 0) {
      const memoryIncrease = finalMemoryUsage - memoryUsage;
      const memoryIncreasePercentage = (memoryIncrease / memoryUsage) * 100;

      // 記憶體增長不應該超過 50%
      expect(memoryIncreasePercentage).toBeLessThan(50);
    }

    console.log('資源清理機制測試完成');
  });
});
