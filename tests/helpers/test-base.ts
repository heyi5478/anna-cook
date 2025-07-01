import { test as base, expect as baseExpect, Page } from '@playwright/test';

/**
 * 擴展基礎測試工具，提供自定義 fixtures
 */
export const test = base.extend({
  // 可以在這裡添加自定義 fixtures
});

/**
 * 導出擴展的 expect 函式
 */
export const expect = baseExpect;

/**
 * 等待頁面完全載入
 */
export const waitForPageLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
};

/**
 * 檢查元素是否可見且可點擊
 */
export const expectElementReady = async (page: Page, selector: string) => {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  await expect(element).toBeEnabled();
  return element;
};
