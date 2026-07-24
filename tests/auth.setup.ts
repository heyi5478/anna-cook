import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 認證狀態儲存路徑（供需認證的測試以 storageState 載入）
 */
const AUTH_FILE = 'tests/.auth/user.json';

/**
 * 從環境變數取得測試帳號憑證；缺少時明確失敗，不使用任何寫死的預設值
 */
const getTestCredentials = (): { email: string; password: string } => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      '缺少測試憑證：請先設定環境變數 TEST_USER_EMAIL 與 TEST_USER_PASSWORD，再執行 e2e 認證 setup。',
    );
  }

  return { email, password };
};

/**
 * 認證設定 - 以真實 /signin-email 登入流程取得已登入 session 並保存 storageState。
 * 送出改由頁面內呼叫表單本身使用的登入 API，避免 UI hydration/analytics 造成的 setup flaky
 * （亦符合 Playwright 對 auth setup 以 API 登入的建議）。
 */
setup('authenticate', async ({ page, context }) => {
  const { email, password } = getTestCredentials();

  // 前往電子郵件登入頁（真實登入頁，而非只有 Google 按鈕的 /login）
  await page.goto('/signin-email', { waitUntil: 'domcontentloaded' });

  // 以 placeholder 定位真實欄位並填入帳號密碼（驗證登入頁結構正確）
  await page.getByPlaceholder('請輸入您的電子信箱').fill(email);
  await page.getByPlaceholder('請輸入您的密碼').fill(password);

  // 透過表單本身使用的登入 API 送出，並確認 session 有效（/api/auth/check）
  const result = await page.evaluate(
    async ({ email: accountEmail, password: accountPassword }) => {
      const loginResponse = await fetch('/api/auth/email/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: accountEmail, password: accountPassword }),
      });
      const loginBody = (await loginResponse.json()) as { StatusCode?: number };
      const checkResponse = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      return {
        loginStatus: loginResponse.status,
        loginStatusCode: loginBody?.StatusCode,
        checkStatus: checkResponse.status,
      };
    },
    { email, password },
  );

  // 成功判斷（其一）：登入與 session 檢查皆成功
  expect(result.loginStatus, '登入 API 應回應 HTTP 200').toBe(200);
  expect(result.loginStatusCode, '登入回應的 StatusCode 應為 200').toBe(200);
  expect(result.checkStatus, '登入後 /api/auth/check 應回應 200（session 有效）').toBe(200);

  // 成功判斷（其二）：瀏覽器持有認證 token cookie（不依賴不存在的 user-menu 掛鉤）
  const cookies = await context.cookies();
  const hasTokenCookie = cookies.some((cookie) => cookie.name === 'token');
  expect(hasTokenCookie, '登入後應存在認證 token cookie').toBe(true);

  // 確保目錄存在後保存認證狀態
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await context.storageState({ path: AUTH_FILE });
});
