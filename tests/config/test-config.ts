/**
 * 測試環境配置設定
 */
export const TEST_CONFIG = {
  // 測試用戶資訊
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword',
  },

  // API 基礎 URL
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',

  // 超時設定
  timeout: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },

  // 測試資料
  testData: {
    recipe: {
      title: '測試食譜標題',
      description: '這是一個用於測試的食譜描述',
      ingredients: ['測試食材1', '測試食材2'],
    },
    user: {
      displayName: '測試用戶',
      bio: '測試用戶的個人簡介',
    },
  },
};

/**
 * 根據環境獲取配置
 */
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  return {
    ...TEST_CONFIG,
    isProduction: env === 'production',
    isDevelopment: env === 'development',
    isTest: env === 'test',
  };
};
