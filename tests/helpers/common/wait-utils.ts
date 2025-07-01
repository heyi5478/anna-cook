import { Page } from '@playwright/test';

/**
 * 等待條件型別定義
 */
export type WaitCondition = () => Promise<boolean> | boolean;

/**
 * 等待選項設定型別
 */
export type WaitOptions = {
  timeout?: number;
  interval?: number;
  throwOnTimeout?: boolean;
  message?: string;
};

/**
 * 網路等待選項型別
 */
export type NetworkWaitOptions = WaitOptions & {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeout?: number;
};

/**
 * 元素等待選項型別
 */
export type ElementWaitOptions = WaitOptions & {
  state?: 'visible' | 'hidden' | 'attached' | 'detached';
};

/**
 * 預設等待設定
 */
const DEFAULT_WAIT_OPTIONS: WaitOptions = {
  timeout: 30000,
  interval: 100,
  throwOnTimeout: true,
  message: '等待條件超時',
};

/**
 * 等待指定條件成立
 */
export const waitForCondition = async (
  condition: WaitCondition,
  options: WaitOptions = {},
): Promise<boolean> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };
  const startTime = Date.now();

  const checkCondition = async (): Promise<boolean> => {
    // 等待條件檢查需要循環，因此使用 eslint-disable
    /* eslint-disable no-await-in-loop */
    while (Date.now() - startTime < finalOptions.timeout!) {
      try {
        const result = await condition();
        if (result) {
          return true;
        }
      } catch (error) {
        console.warn('等待條件檢查時發生錯誤:', error);
      }

      await sleep(finalOptions.interval!);
    }
    /* eslint-enable no-await-in-loop */

    if (finalOptions.throwOnTimeout) {
      throw new Error(`${finalOptions.message} (${finalOptions.timeout}ms)`);
    }

    return false;
  };

  return checkCondition();
};

/**
 * 睡眠等待指定毫秒數
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

/**
 * 等待元素出現並可見
 */
export const waitForElementVisible = async (
  page: Page,
  selector: string,
  options: ElementWaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await page.waitForSelector(selector, {
    state: 'visible',
    timeout: finalOptions.timeout,
  });

  console.log(`元素 ${selector} 已出現並可見`);
};

/**
 * 等待元素消失
 */
export const waitForElementHidden = async (
  page: Page,
  selector: string,
  options: ElementWaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await page.waitForSelector(selector, {
    state: 'hidden',
    timeout: finalOptions.timeout,
  });

  console.log(`元素 ${selector} 已隱藏`);
};

/**
 * 等待元素文字內容
 */
export const waitForElementText = async (
  page: Page,
  selector: string,
  expectedText: string | RegExp,
  options: WaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await waitForCondition(async () => {
    try {
      const element = page.locator(selector);
      const text = await element.textContent();

      if (typeof expectedText === 'string') {
        return text?.includes(expectedText) || false;
      }
      return expectedText.test(text || '');
    } catch {
      return false;
    }
  }, finalOptions);

  console.log(`元素 ${selector} 文字內容符合預期: ${expectedText}`);
};

/**
 * 等待載入完成（無載入指示器）
 */
export const waitForLoadingComplete = async (
  page: Page,
  options: WaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  // 等待常見的載入指示器消失
  const loadingSelectors = [
    '.loading',
    '.spinner',
    '.loader',
    '[data-testid="loading"]',
    '[data-testid="spinner"]',
    '.loading-overlay',
  ];

  await waitForCondition(async () => {
    const promises = loadingSelectors.map(async (selector) => {
      try {
        const element = page.locator(selector);
        return !(await element.isVisible());
      } catch {
        return true; // 元素不存在視為載入完成
      }
    });

    const results = await Promise.all(promises);
    return results.every((result) => result);
  }, finalOptions);

  console.log('頁面載入完成');
};

/**
 * 等待網路請求完成
 */
export const waitForNetworkIdle = async (
  page: Page,
  options: NetworkWaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await page.waitForLoadState('networkidle', {
    timeout: finalOptions.timeout,
  });

  console.log('網路請求已完成');
};

/**
 * 等待 API 回應
 */
export const waitForApiResponse = async (
  page: Page,
  urlPattern: string | RegExp,
  options: WaitOptions = {},
): Promise<any> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  const response = await page.waitForResponse(
    (apiResponse) => {
      const url = apiResponse.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout: finalOptions.timeout },
  );

  console.log(`API 回應已收到: ${response.url()}`);
  return response;
};

/**
 * 等待多個條件全部成立
 */
export const waitForAll = async (
  conditions: WaitCondition[],
  options: WaitOptions = {},
): Promise<boolean> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  return waitForCondition(async () => {
    const results = await Promise.all(
      conditions.map((condition) =>
        Promise.resolve(condition()).catch(() => false),
      ),
    );
    return results.every((result) => result);
  }, finalOptions);
};

/**
 * 等待任一條件成立
 */
export const waitForAny = async (
  conditions: WaitCondition[],
  options: WaitOptions = {},
): Promise<boolean> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  return waitForCondition(async () => {
    const results = await Promise.all(
      conditions.map((condition) =>
        Promise.resolve(condition()).catch(() => false),
      ),
    );
    return results.some((result) => result);
  }, finalOptions);
};

/**
 * 等待表單驗證完成
 */
export const waitForFormValidation = async (
  page: Page,
  formSelector: string = 'form',
  options: WaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await waitForCondition(async () => {
    try {
      // 檢查表單是否存在驗證錯誤
      const errorElements = page.locator(
        `${formSelector} .error, ${formSelector} [data-testid*="error"]`,
      );
      // 檢查錯誤數量（目前版本不使用但保留以供擴展）
      await errorElements.count();

      // 檢查是否有載入中的驗證
      const validatingElements = page.locator(
        `${formSelector} .validating, ${formSelector} [data-testid*="validating"]`,
      );
      const validatingCount = await validatingElements.count();

      return validatingCount === 0;
    } catch {
      return false;
    }
  }, finalOptions);

  console.log('表單驗證已完成');
};

/**
 * 等待檔案上傳完成
 */
export const waitForFileUploadComplete = async (
  page: Page,
  options: WaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await waitForCondition(async () => {
    try {
      // 檢查上傳進度條
      const progressElement = page.locator('[data-testid="upload-progress"]');
      const progressValue = await progressElement.getAttribute('data-progress');

      if (progressValue) {
        const progress = parseInt(progressValue, 10);
        return progress >= 100;
      }

      // 檢查上傳完成訊息
      const successElement = page.locator('[data-testid="upload-success"]');
      return await successElement.isVisible();
    } catch {
      return false;
    }
  }, finalOptions);

  console.log('檔案上傳已完成');
};

/**
 * 等待動畫完成
 */
export const waitForAnimationComplete = async (
  page: Page,
  selector?: string,
  options: WaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };

  await waitForCondition(async () => {
    try {
      return await page.evaluate((elementSelector) => {
        const elements = elementSelector
          ? document.querySelectorAll(elementSelector)
          : document.querySelectorAll('*');

        const checkAnimations = (element: Element): boolean => {
          const computedStyle = window.getComputedStyle(element);
          const { animationName } = computedStyle;
          const { transitionProperty } = computedStyle;

          return animationName === 'none' && transitionProperty === 'none';
        };

        return Array.from(elements).every(checkAnimations);
      }, selector);
    } catch {
      return true; // 如果檢查失敗，假設動畫已完成
    }
  }, finalOptions);

  console.log('動畫已完成');
};

/**
 * 等待頁面穩定（無變化）
 */
export const waitForPageStable = async (
  page: Page,
  stableDuration: number = 1000,
  options: WaitOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_WAIT_OPTIONS, ...options };
  // 記錄基準時間（保留以供日誌使用）
  Date.now();

  // 監聽 DOM 變化
  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      (window as any).lastDOMChange = Date.now();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    (window as any).lastDOMChange = Date.now();
  });

  await waitForCondition(async () => {
    const lastChange = await page.evaluate(() => (window as any).lastDOMChange);
    return Date.now() - lastChange >= stableDuration;
  }, finalOptions);

  console.log(`頁面已穩定 ${stableDuration}ms`);
};

/**
 * 重試操作直到成功
 */
export const retryUntilSuccess = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error | null = null;

  // 重試操作需要循環等待，使用 eslint-disable
  /* eslint-disable no-await-in-loop */
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const result = await operation();
      console.log(`操作在第 ${attempt} 次嘗試成功`);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(`第 ${attempt} 次嘗試失敗:`, error);

      if (attempt < maxRetries) {
        await sleep(delay);
      }
    }
  }
  /* eslint-enable no-await-in-loop */

  throw new Error(
    `操作在 ${maxRetries} 次嘗試後仍然失敗: ${lastError?.message}`,
  );
};
