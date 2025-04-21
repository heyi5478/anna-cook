/**
 * 應用程式配置
 * 集中管理所有環境變數和配置項目
 */

/**
 * 驗證 API URL 並確保安全連線
 */
const validateApiUrl = (url?: string): string => {
  // 如果沒有提供 URL，使用預設值
  const apiUrl = url || 'https://annacook.rocket-coding.com/api';

  try {
    const parsedUrl = new URL(apiUrl);

    // 在生產環境中強制使用 HTTPS
    if (
      process.env.NODE_ENV === 'production' &&
      parsedUrl.protocol !== 'https:'
    ) {
      console.warn('安全警告: 生產環境應使用 HTTPS! 自動轉換為 HTTPS。');
      parsedUrl.protocol = 'https:';
      return parsedUrl.toString();
    }

    return apiUrl;
  } catch (error) {
    console.error('配置錯誤: API URL 格式無效', error);
    // 回傳安全的預設值
    return 'https://annacook.rocket-coding.com/api';
  }
};

/**
 * 解析整數型環境變數
 */
const parseIntEnv = (
  value: string | undefined,
  defaultValue: number,
): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/**
 * API 相關配置
 */
export const apiConfig = {
  baseUrl: validateApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
};

/**
 * 認證相關配置
 */
export const authConfig = {
  tokenCookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token',
  tokenExpiryDays: parseIntEnv(process.env.NEXT_PUBLIC_TOKEN_EXPIRY_DAYS, 7),
};

/**
 * 環境配置
 */
export const envConfig = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};
