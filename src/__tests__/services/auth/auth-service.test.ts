import {
  fetchGoogleAuthUrl,
  exchangeGoogleCodeForToken,
  checkAuth,
  registerWithEmail,
  loginWithEmail,
} from '@/services/auth/auth-service';
import { HTTP_STATUS } from '@/lib/constants';
import type {
  GoogleAuthResponse,
  RegisterResponse,
  LoginResponse,
  CheckAuthResponse,
} from '@/types/api';

// Mock 依賴
jest.mock('@/config', () => ({
  getApiConfig: () => ({
    baseUrl: 'https://api.test.com',
  }),
}));

jest.mock('@/services/utils/http', () => ({
  updateAuthToken: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock console methods 以避免測試輸出干擾
const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();
console.log = mockConsoleLog;
console.error = mockConsoleError;

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// 測試資料
const mockGoogleAuthResponse: GoogleAuthResponse = {
  StatusCode: 200,
  msg: 'success',
  redirectUri: 'https://accounts.google.com/oauth/authorize?client_id=test',
};

const mockCheckAuthResponse: CheckAuthResponse = {
  message: 'success',
  token: 'new-test-token',
  userData: {
    id: 1,
    displayId: 'U001',
    accountEmail: 'test@example.com',
    accountName: 'Test User',
    profilePhoto: '/profile.jpg',
    role: 1,
    loginProvider: 1,
  },
};

const mockRegisterResponse: RegisterResponse = {
  StatusCode: 200,
  msg: '註冊成功',
};

const mockLoginResponse: LoginResponse = {
  StatusCode: 200,
  msg: '登入成功',
  token: 'auth-token-123',
  userData: {
    userId: 1,
    userDisplayId: 'U001',
    accountName: 'Test User',
    accountEmail: 'test@example.com',
    profilePhoto: '/profile.jpg',
    role: 1,
    roleName: 'user',
  },
};

describe('Auth Service', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();

    // 確保 window 物件存在（用於瀏覽器環境檢測）
    if (typeof global.window === 'undefined') {
      (global as any).window = {};
    }
  });

  afterEach(() => {
    // 還原 window 物件
    if (originalWindow) {
      (global as any).window = originalWindow;
    } else {
      delete (global as any).window;
    }
  });

  describe('fetchGoogleAuthUrl 行為', () => {
    test('應該成功獲取 Google 登入 URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockGoogleAuthResponse),
      });

      const result = await fetchGoogleAuthUrl();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/auth/google/auth',
      );
      expect(result).toBe(mockGoogleAuthResponse.redirectUri);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '發送請求: GET https://api.test.com/auth/google/auth',
      );
    });

    test('應該在 HTTP 錯誤時拋出異常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchGoogleAuthUrl()).rejects.toThrow(
        'HTTP error! status: 500',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取 Google 登入 URL 失敗:',
        expect.any(Error),
      );
    });

    test('應該在網路錯誤時拋出異常', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(fetchGoogleAuthUrl()).rejects.toThrow('Network error');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取 Google 登入 URL 失敗:',
        networkError,
      );
    });
  });

  describe('exchangeGoogleCodeForToken 行為', () => {
    test('應該成功使用授權碼換取 token', async () => {
      const mockTokenResponse = {
        StatusCode: 200,
        token: 'google-auth-token',
        userData: mockCheckAuthResponse.userData,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockTokenResponse),
      });

      const result = await exchangeGoogleCodeForToken('auth-code-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/auth/google/callback?code=auth-code-123',
        { method: 'GET' },
      );
      expect(result).toEqual(mockTokenResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Google code exchange completed',
      );
    });

    test('應該正確編碼 URL 參數中的特殊字符', async () => {
      const codeWithSpecialChars = 'code+with/special&chars=test';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({ StatusCode: 200 }),
      });

      await exchangeGoogleCodeForToken(codeWithSpecialChars);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/auth/google/callback?code=code%2Bwith%2Fspecial%26chars%3Dtest',
        { method: 'GET' },
      );
    });

    test('應該在 HTTP 錯誤時拋出異常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(exchangeGoogleCodeForToken('invalid-code')).rejects.toThrow(
        'HTTP error! status: 400',
      );
    });
  });

  describe('checkAuth 行為', () => {
    test('應該成功檢查認證狀態並返回用戶資料', async () => {
      const mockSuccessResponse = {
        Status: true,
        ...mockCheckAuthResponse,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockSuccessResponse),
      });

      const result = await checkAuth();

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });
      expect(result).toEqual(mockSuccessResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Authentication check completed',
      );
    });

    test('應該在認證失敗時拋出異常', async () => {
      const mockFailureResponse = {
        Status: false,
        Message: '用戶未登入',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockFailureResponse),
      });

      await expect(checkAuth()).rejects.toThrow('用戶未登入');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '檢查使用者認證狀態失敗:',
        expect.any(Error),
      );
    });

    test('應該在沒有錯誤訊息時使用預設錯誤訊息', async () => {
      const mockFailureResponse = {
        Status: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockFailureResponse),
      });

      await expect(checkAuth()).rejects.toThrow('身份驗證失敗');
    });

    test('應該在網路錯誤時拋出異常', async () => {
      const networkError = new Error('Connection failed');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(checkAuth()).rejects.toThrow('Connection failed');
    });
  });

  describe('registerWithEmail 行為', () => {
    test('應該成功註冊新帳號', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockRegisterResponse)),
      });

      const result = await registerWithEmail(
        'test@example.com',
        'Test User',
        'password123',
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            AccountEmail: 'test@example.com',
            AccountName: 'Test User',
            Password: 'password123',
          }),
        },
      );
      expect(result).toEqual(mockRegisterResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Registration request processed successfully',
      );
    });

    test('應該正確遮蔽密碼在 log 中', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockRegisterResponse)),
      });

      await registerWithEmail('test@example.com', 'Test User', 'secret123');

      expect(mockConsoleLog).toHaveBeenCalledWith('請求資料:', {
        AccountEmail: 'test@example.com',
        AccountName: 'Test User',
        Password: '***',
      });
    });

    test('應該處理無效的 JSON 回應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('Invalid JSON'),
      });

      const result = await registerWithEmail(
        'test@example.com',
        'Test User',
        'password123',
      );

      expect(result).toEqual({
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: '回應不是有效的 JSON: Invalid JSON',
      });
    });

    test('應該在網路錯誤時返回錯誤回應', async () => {
      const networkError = new Error('Network connection failed');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await registerWithEmail(
        'test@example.com',
        'Test User',
        'password123',
      );

      expect(result).toEqual({
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: 'Network connection failed',
      });
      expect(mockConsoleError).toHaveBeenCalledWith('註冊失敗:', networkError);
    });

    test('應該在未知錯誤時返回通用錯誤訊息', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error');

      const result = await registerWithEmail(
        'test@example.com',
        'Test User',
        'password123',
      );

      expect(result).toEqual({
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: '註冊過程中發生未知錯誤',
      });
    });
  });

  describe('loginWithEmail 行為', () => {
    test('應該成功登入並儲存認證資料', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockLoginResponse)),
      });

      const result = await loginWithEmail('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            AccountEmail: 'test@example.com',
            Password: 'password123',
          }),
        },
      );
      expect(result).toEqual(mockLoginResponse);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockLoginResponse.userData),
      );
    });

    test('應該在沒有 token 的情況下不儲存認證資料', async () => {
      const responseWithoutToken = {
        StatusCode: 200,
        msg: '登入成功',
        // 沒有 token 欄位
        userData: mockLoginResponse.userData,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(responseWithoutToken)),
      });

      const result = await loginWithEmail('test@example.com', 'password123');

      expect(result).toEqual(responseWithoutToken);
      // 沒有 token 時不會觸發 localStorage 儲存
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    test('應該在登入失敗時不儲存認證資料', async () => {
      const failedLoginResponse = {
        StatusCode: 400,
        msg: '帳號或密碼錯誤',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(failedLoginResponse)),
      });

      const result = await loginWithEmail('test@example.com', 'wrong-password');

      expect(result).toEqual(failedLoginResponse);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    test('應該正確處理沒有 userData 的成功登入', async () => {
      const loginResponseWithoutUserData = {
        StatusCode: 200,
        msg: '登入成功',
        token: 'auth-token-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () =>
          Promise.resolve(JSON.stringify(loginResponseWithoutUserData)),
      });

      const result = await loginWithEmail('test@example.com', 'password123');

      expect(result).toEqual(loginResponseWithoutUserData);
      // 只有 userData 存在時才會存儲
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    test('應該處理無效的 JSON 回應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('<!DOCTYPE html><html>'),
      });

      const result = await loginWithEmail('test@example.com', 'password123');

      expect(result).toEqual({
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: '回應不是有效的 JSON: <!DOCTYPE html><html>',
      });
    });

    test('應該在網路錯誤時返回錯誤回應', async () => {
      const networkError = new Error('Request timeout');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await loginWithEmail('test@example.com', 'password123');

      expect(result).toEqual({
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: 'Request timeout',
      });
      expect(mockConsoleError).toHaveBeenCalledWith('登入失敗:', networkError);
    });
  });

  describe('錯誤處理', () => {
    test('fetchGoogleAuthUrl 應該處理 fetch 異常', async () => {
      const fetchError = new TypeError('Failed to fetch');
      mockFetch.mockRejectedValueOnce(fetchError);

      await expect(fetchGoogleAuthUrl()).rejects.toThrow('Failed to fetch');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取 Google 登入 URL 失敗:',
        fetchError,
      );
    });

    test('checkAuth 應該處理 JSON 解析錯誤', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(checkAuth()).rejects.toThrow('Invalid JSON');
    });
  });
});
