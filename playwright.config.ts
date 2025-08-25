import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 測試目錄
  testDir: './tests/e2e',

  // 完全並行執行
  fullyParallel: true,

  // CI 環境禁止 only 標記
  forbidOnly: !!process.env.CI,

  // 重試設定
  retries: process.env.CI ? 2 : 0,

  // Worker 設定
  workers: process.env.CI ? 1 : undefined,

  // 測試報告
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
  ],

  // 全域設定
  use: {
    // 基礎 URL
    baseURL: process.env.CI
      ? 'https://anna-cook.zeabur.app/'
      : 'http://localhost:3000',

    // 追蹤設定
    trace: 'on-first-retry',

    // 截圖設定
    screenshot: 'only-on-failure',

    // 影片錄製
    video: 'retain-on-failure',

    // 等待時間
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // 測試專案配置
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // 不需要認證的測試（如首頁、公開頁面）
    {
      name: 'chromium-no-auth',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*\/(navigation|public)\/.*\.test\.ts/,
    },
    {
      name: 'firefox-no-auth',
      use: {
        ...devices['Desktop Firefox'],
      },
      testMatch: /.*\/(navigation|public)\/.*\.test\.ts/,
    },
    // 需要認證的測試
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\/(navigation|public)\/.*\.test\.ts/,
    },
    {
      name: 'firefox-auth',
      use: {
        ...devices['Desktop Firefox'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\/(navigation|public)\/.*\.test\.ts/,
    },
    {
      name: 'webkit-auth',
      use: {
        ...devices['Desktop Safari'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\/(navigation|public)\/.*\.test\.ts/,
    },
    {
      name: 'mobile-chrome-auth',
      use: {
        ...devices['Pixel 5'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\/(navigation|public)\/.*\.test\.ts/,
    },
  ],

  // 本地開發伺服器
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },

  // 輸出目錄
  outputDir: 'test-results/',

  // 測試超時
  timeout: 30 * 1000,

  // 期望超時
  expect: {
    timeout: 5000,
  },
});
