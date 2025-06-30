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
      ? 'https://anna-cook.vercel.app'
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
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 使用預設認證狀態
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: './tests/.auth/user.json',
      },
      dependencies: ['setup'],
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
