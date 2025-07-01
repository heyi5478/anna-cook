import { Page, expect } from '@playwright/test';

/**
 * 斷言選項型別
 */
export type AssertionOptions = {
  timeout?: number;
  message?: string;
  tolerance?: number;
};

/**
 * 檔案驗證選項型別
 */
export type FileAssertionOptions = AssertionOptions & {
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
};

/**
 * 預設斷言選項
 */
const DEFAULT_ASSERTION_OPTIONS: AssertionOptions = {
  timeout: 5000,
  message: '斷言失敗',
  tolerance: 0.1,
};

/**
 * 驗證元素是否可見且可互動
 */
export const assertElementInteractable = async (
  page: Page,
  selector: string,
  options: AssertionOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_ASSERTION_OPTIONS, ...options };
  const element = page.locator(selector);

  // 驗證元素存在
  await expect(element).toBeVisible({ timeout: finalOptions.timeout });

  // 驗證元素已啟用
  await expect(element).toBeEnabled({ timeout: finalOptions.timeout });

  // 驗證元素不被遮蔽
  await expect(element).not.toBeHidden({ timeout: finalOptions.timeout });

  console.log(`元素 ${selector} 可見且可互動`);
};

/**
 * 驗證文字內容是否符合預期
 */
export const assertTextContent = async (
  page: Page,
  selector: string,
  expectedText: string | RegExp,
  options: AssertionOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_ASSERTION_OPTIONS, ...options };
  const element = page.locator(selector);

  if (typeof expectedText === 'string') {
    await expect(element).toContainText(expectedText, {
      timeout: finalOptions.timeout,
    });
  } else {
    await expect(element).toHaveText(expectedText, {
      timeout: finalOptions.timeout,
    });
  }

  console.log(`元素 ${selector} 文字內容符合預期`);
};

/**
 * 驗證數值在預期範圍內
 */
export const assertNumberInRange = (
  actual: number,
  expected: number,
  message?: string,
  tolerance: number = 0.1,
): void => {
  const difference = Math.abs(actual - expected);
  const errorMessage =
    message || `數值 ${actual} 不在預期範圍 ${expected} ± ${tolerance} 內`;

  expect(difference, errorMessage).toBeLessThanOrEqual(tolerance);
  console.log(`數值驗證通過: ${actual} (預期: ${expected} ± ${tolerance})`);
};

/**
 * 驗證時間差在容許範圍內
 */
export const assertTimeDifference = (
  actualTime: number,
  expectedTime: number,
  message?: string,
  toleranceSeconds: number = 1,
): void => {
  const difference = Math.abs(actualTime - expectedTime);
  const errorMessage =
    message || `時間差 ${difference}s 超過容許範圍 ${toleranceSeconds}s`;

  expect(difference, errorMessage).toBeLessThanOrEqual(toleranceSeconds);
  console.log(
    `時間驗證通過: ${actualTime}s (預期: ${expectedTime}s ± ${toleranceSeconds}s)`,
  );
};

/**
 * 驗證陣列長度
 */
export const assertArrayLength = <T>(
  array: T[],
  expectedLength: number,
  message?: string,
): void => {
  const errorMessage =
    message || `陣列長度 ${array.length} 不等於預期的 ${expectedLength}`;

  expect(array.length, errorMessage).toBe(expectedLength);
  console.log(`陣列長度驗證通過: ${array.length}`);
};

/**
 * 驗證陣列包含指定元素
 */
export const assertArrayContains = <T>(
  array: T[],
  expectedItem: T,
  message?: string,
): void => {
  const errorMessage = message || `陣列不包含預期元素: ${expectedItem}`;

  expect(array, errorMessage).toContain(expectedItem);
  console.log(`陣列包含驗證通過: ${expectedItem}`);
};

/**
 * 驗證物件包含指定屬性
 */
export const assertObjectHasProperties = (
  obj: any,
  properties: string[],
  message?: string,
): void => {
  // 使用 forEach 代替 for...of 以符合 ESLint 規則
  properties.forEach((property) => {
    const errorMessage = message || `物件缺少屬性: ${property}`;
    expect(obj, errorMessage).toHaveProperty(property);
  });

  console.log(`物件屬性驗證通過: ${properties.join(', ')}`);
};

/**
 * 驗證 URL 格式
 */
export const assertValidUrl = (
  url: string,
  expectedProtocol?: string,
  message?: string,
): void => {
  const errorMessage = message || `無效的 URL 格式: ${url}`;

  try {
    const urlObj = new URL(url);

    if (expectedProtocol) {
      expect(urlObj.protocol, `協議不符合預期: ${urlObj.protocol}`).toBe(
        expectedProtocol,
      );
    }

    console.log(`URL 格式驗證通過: ${url}`);
  } catch (error) {
    throw new Error(errorMessage);
  }
};

/**
 * 驗證影片檔案格式
 */
export const assertVideoFileFormat = async (
  page: Page,
  fileSelector: string,
  options: FileAssertionOptions = {},
): Promise<void> => {
  const finalOptions = {
    ...DEFAULT_ASSERTION_OPTIONS,
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSize: 100 * 1024 * 1024, // 100MB
    ...options,
  };

  const fileInfo = await page.evaluate((selector) => {
    const input = document.querySelector(selector) as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) return null;

    return {
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }, fileSelector);

  if (!fileInfo) {
    throw new Error('找不到檔案或檔案未選擇');
  }

  // 驗證檔案類型
  if (finalOptions.allowedTypes) {
    expect(finalOptions.allowedTypes).toContain(fileInfo.type);
  }

  // 驗證檔案大小
  if (finalOptions.maxSize) {
    expect(fileInfo.size).toBeLessThanOrEqual(finalOptions.maxSize);
  }

  if (finalOptions.minSize) {
    expect(fileInfo.size).toBeGreaterThanOrEqual(finalOptions.minSize);
  }

  console.log(
    `影片檔案格式驗證通過: ${fileInfo.name} (${fileInfo.type}, ${fileInfo.size} bytes)`,
  );
};

/**
 * 驗證表單驗證狀態
 */
export const assertFormValidationState = async (
  page: Page,
  formSelector: string,
  shouldBeValid: boolean,
  options: AssertionOptions = {},
): Promise<void> => {
  // options 參數保留以供未來擴展，確保 linter 不會報告未使用錯誤
  if (options) {
    // 目前版本暫不使用 options，但保留參數以維護 API 一致性
  }

  const validationState = await page.evaluate((selector) => {
    const form = document.querySelector(selector) as HTMLFormElement;
    const errors = form?.querySelectorAll('.error, [data-testid*="error"]');
    const submitButton = form?.querySelector(
      '[type="submit"]',
    ) as HTMLButtonElement;

    return {
      hasErrors: errors ? errors.length > 0 : false,
      isSubmitEnabled: submitButton ? !submitButton.disabled : false,
      formValid: form ? form.checkValidity() : false,
    };
  }, formSelector);

  if (shouldBeValid) {
    expect(validationState.hasErrors, '表單不應該有驗證錯誤').toBe(false);
    expect(validationState.isSubmitEnabled, '提交按鈕應該可用').toBe(true);
  } else {
    expect(validationState.hasErrors, '表單應該有驗證錯誤').toBe(true);
    expect(validationState.isSubmitEnabled, '提交按鈕應該不可用').toBe(false);
  }

  console.log(`表單驗證狀態符合預期: ${shouldBeValid ? '有效' : '無效'}`);
};

/**
 * 驗證 API 回應狀態
 */
export const assertApiResponseStatus = async (
  response: any,
  expectedStatus: number,
  message?: string,
): Promise<void> => {
  const errorMessage =
    message ||
    `API 回應狀態碼不符合預期: 實際 ${response.status()}, 預期 ${expectedStatus}`;

  expect(response.status(), errorMessage).toBe(expectedStatus);
  console.log(`API 回應狀態驗證通過: ${response.status()}`);
};

/**
 * 驗證 API 回應內容
 */
export const assertApiResponseContent = async (
  response: any,
  expectedProperties: string[],
  message?: string,
): Promise<void> => {
  const responseBody = await response.json();

  // 使用 forEach 代替 for...of 以符合 ESLint 規則
  expectedProperties.forEach((property) => {
    const errorMessage = message || `API 回應缺少屬性: ${property}`;
    expect(responseBody, errorMessage).toHaveProperty(property);
  });

  console.log(`API 回應內容驗證通過: ${expectedProperties.join(', ')}`);
};

/**
 * 驗證頁面標題
 */
export const assertPageTitle = async (
  page: Page,
  expectedTitle: string | RegExp,
  options: AssertionOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_ASSERTION_OPTIONS, ...options };

  if (typeof expectedTitle === 'string') {
    await expect(page).toHaveTitle(expectedTitle, {
      timeout: finalOptions.timeout,
    });
  } else {
    await expect(page).toHaveTitle(expectedTitle, {
      timeout: finalOptions.timeout,
    });
  }

  console.log(`頁面標題驗證通過: ${expectedTitle}`);
};

/**
 * 驗證頁面 URL
 */
export const assertPageUrl = async (
  page: Page,
  expectedUrl: string | RegExp,
  options: AssertionOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_ASSERTION_OPTIONS, ...options };

  if (typeof expectedUrl === 'string') {
    await expect(page).toHaveURL(expectedUrl, {
      timeout: finalOptions.timeout,
    });
  } else {
    await expect(page).toHaveURL(expectedUrl, {
      timeout: finalOptions.timeout,
    });
  }

  console.log(`頁面 URL 驗證通過: ${expectedUrl}`);
};

/**
 * 驗證元素屬性值
 */
export const assertElementAttribute = async (
  page: Page,
  selector: string,
  attributeName: string,
  expectedValue: string | RegExp,
  options: AssertionOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_ASSERTION_OPTIONS, ...options };
  const element = page.locator(selector);

  if (typeof expectedValue === 'string') {
    await expect(element).toHaveAttribute(attributeName, expectedValue, {
      timeout: finalOptions.timeout,
    });
  } else {
    await expect(element).toHaveAttribute(attributeName, expectedValue, {
      timeout: finalOptions.timeout,
    });
  }

  console.log(`元素 ${selector} 屬性 ${attributeName} 驗證通過`);
};

/**
 * 驗證元素樣式
 */
export const assertElementStyle = async (
  page: Page,
  selector: string,
  styleName: string,
  expectedValue: string,
  options: AssertionOptions = {},
): Promise<void> => {
  // options 參數保留以供未來擴展，確保 linter 不會報告未使用錯誤
  if (options) {
    // 目前版本暫不使用 options，但保留參數以維護 API 一致性
  }

  const actualValue = await page
    .locator(selector)
    .evaluate((element, style) => {
      return window.getComputedStyle(element).getPropertyValue(style);
    }, styleName);

  const errorMessage = `元素 ${selector} 樣式 ${styleName} 不符合預期: 實際 ${actualValue}, 預期 ${expectedValue}`;
  expect(actualValue, errorMessage).toBe(expectedValue);

  console.log(`元素 ${selector} 樣式 ${styleName} 驗證通過: ${actualValue}`);
};

// ===========================================
// 便利函式 (Convenience Functions)
// ===========================================

/**
 * 驗證頁面標題包含指定文字（簡化版本）
 */
export const expectPageTitle = async (
  page: Page,
  titleText: string,
): Promise<void> => {
  await expect(page).toHaveTitle(new RegExp(titleText, 'i'));
};

/**
 * 驗證 URL 包含指定路徑（簡化版本）
 */
export const expectUrlContains = async (
  page: Page,
  path: string,
): Promise<void> => {
  await expect(page).toHaveURL(new RegExp(path));
};

/**
 * 驗證元素包含指定文字（簡化版本）
 */
export const expectElementText = async (
  page: Page,
  selector: string,
  text: string,
): Promise<void> => {
  await expect(page.locator(selector)).toContainText(text);
};
