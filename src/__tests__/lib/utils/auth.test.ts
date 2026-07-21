import { setServerCookie } from '@/lib/utils/auth';

// Mock 依賴
jest.mock('@/config', () => ({
  authConfig: {
    tokenCookieName: 'auth-token',
  },
}));

jest.mock('@/lib/constants', () => ({
  COOKIE_EXPIRES: {
    TOKEN_EXPIRY_SECONDS: 86400,
  },
}));

// Mock console.log 以避免測試輸出干擾，並用於驗證不洩漏 token
const mockConsoleLog = jest.fn();
console.log = mockConsoleLog;

describe('Auth Utils', () => {
  const originalProcessEnv = process.env;
  let mockProcessEnv: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();

    // Mock 整個 process.env 物件
    mockProcessEnv = {
      ...originalProcessEnv,
      NODE_ENV: 'test',
    } as Record<string, string>;

    Object.defineProperty(process, 'env', {
      value: mockProcessEnv,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // 還原原始的 process.env
    Object.defineProperty(process, 'env', {
      value: originalProcessEnv,
      writable: true,
      configurable: true,
    });
  });

  describe('setServerCookie 行為', () => {
    test('應該正確設置回應標頭', () => {
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'server-token');

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining('auth-token=server-token'),
      );
    });

    test('應該設置 HttpOnly 選項', () => {
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'secure-token');

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).toContain('HttpOnly');
    });

    test('應該在 production 環境設置 Secure 選項', () => {
      mockProcessEnv.NODE_ENV = 'production';
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'secure-token');

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).toContain('Secure');
    });

    test('應該在 development 環境不設置 Secure 選項', () => {
      mockProcessEnv.NODE_ENV = 'development';
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'token');

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).not.toContain('Secure');
    });

    test('應該設置正確的預設選項', () => {
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'test-token');

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).toContain('Path=/');
      expect(cookieHeader).toContain('SameSite=Lax');
      expect(cookieHeader).toContain('Max-Age=86400');
    });

    test('應該接受自定義選項', () => {
      const mockRes = { setHeader: jest.fn() };
      const customOptions = {
        maxAge: 3600,
        path: '/custom',
      };

      setServerCookie(mockRes, 'test-token', customOptions);

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).toContain('Max-Age=3600');
      expect(cookieHeader).toContain('Path=/custom');
    });

    test('應該使用自定義 cookie 名稱', () => {
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'test-token', {}, 'custom-cookie');

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).toContain('custom-cookie=test-token');
    });

    test('應該正確編碼特殊字符', () => {
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'token with spaces & symbols');

      const cookieHeader = mockRes.setHeader.mock.calls[0][1];
      expect(cookieHeader).toContain(
        'auth-token=token%20with%20spaces%20%26%20symbols',
      );
    });

    test('不應將 token 內容寫入 console 日誌', () => {
      const mockRes = { setHeader: jest.fn() };

      setServerCookie(mockRes, 'super-secret-token');

      // 不得把含 token 的 cookie 字串寫入日誌
      const loggedToken = mockConsoleLog.mock.calls.some((args) =>
        args.some(
          (arg: unknown) =>
            typeof arg === 'string' && arg.includes('super-secret-token'),
        ),
      );
      expect(loggedToken).toBe(false);
    });
  });

  describe('錯誤處理', () => {
    test('setServerCookie 應該處理 res 物件為 null 的情況', () => {
      expect(() => {
        setServerCookie(null as any, 'test-token');
      }).toThrow('Cannot read properties of null');
    });
  });
});
