/**
 * 應用程式配置
 * 集中管理所有環境變數和配置項目
 */

/**
 * 獲取 API Base URL，支援開發和生產環境切換
 */
const getApiBaseUrl = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 開發環境優先使用開發專用 URL
  if (isDevelopment && process.env.NEXT_PUBLIC_API_BASE_URL_DEV) {
    return process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
  }

  // 使用一般的 API URL
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 如果都沒有配置，拋出錯誤
  throw new Error(
    'API URL 未設定！請在 .env 檔案中設定 NEXT_PUBLIC_API_BASE_URL 或 NEXT_PUBLIC_API_BASE_URL_DEV',
  );
};

/**
 * 驗證 API URL 並確保安全連線
 */
const validateApiUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);

    // 在生產環境中強制使用 HTTPS
    if (
      process.env.NODE_ENV === 'production' &&
      parsedUrl.protocol !== 'https:'
    ) {
      console.warn('安全警告: 生產環境應使用 HTTPS! 自動轉換為 HTTPS。');
      parsedUrl.protocol = 'https:';
      return parsedUrl.toString();
    }

    return url;
  } catch (error) {
    console.error('配置錯誤: API URL 格式無效', error);
    throw new Error(`API URL 格式無效: ${url}`);
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
 * API 相關配置 - 延遲載入
 */
export const getApiConfig = () => ({
  baseUrl: validateApiUrl(getApiBaseUrl()),
});

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
