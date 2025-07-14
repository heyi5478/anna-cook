import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, isUserLoggedIn } from '@/hooks/useAuth';
import { checkAuth } from '@/services/auth';
import { useRouter } from 'next/router';

// Mock next/router
const mockPush = jest.fn();
const mockRouter = {
  pathname: '/dashboard',
  push: mockPush,
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock auth service
jest.mock('@/services/auth', () => ({
  checkAuth: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock console
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('useAuth Hook', () => {
    // 測試初始載入狀態
    test('應該返回初始載入狀態', () => {
      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuth());

      expect(result.current).toEqual({
        isAuthenticated: null,
        isLoading: true,
      });
    });

    // 測試 localStorage 中有有效用戶資料時的快速載入
    test('應該從 localStorage 快速載入用戶資料', () => {
      const mockUserData = {
        id: '1',
        name: '測試用戶',
        email: 'test@example.com',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUserData));
      (checkAuth as jest.Mock).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuth());

      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        userData: mockUserData,
      });
    });

    // 測試 localStorage 中有無效 JSON 資料時的處理
    test('應該處理 localStorage 中的無效 JSON 資料', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      (checkAuth as jest.Mock).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuth());

      expect(console.error).toHaveBeenCalledWith(
        '解析儲存的用戶資料失敗:',
        expect.any(Error),
      );
      expect(result.current.isAuthenticated).toBe(null);
      expect(result.current.isLoading).toBe(true);
    });

    // 測試成功的身份驗證
    test('應該成功驗證身份並更新狀態', async () => {
      const mockUserData = {
        id: '1',
        name: '測試用戶',
        email: 'test@example.com',
      };
      const mockResponse = { userData: mockUserData };

      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(checkAuth).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('驗證身份中...');
      expect(console.log).toHaveBeenCalledWith('身份驗證成功');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockUserData),
      );
      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        userData: mockUserData,
      });
    });

    // 測試身份驗證失敗時的重定向
    test('應該在驗證失敗時重定向到登入頁面', async () => {
      const mockError = new Error('驗證失敗');

      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth('/login'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith('身份驗證失敗:', mockError);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userData');
      expect(console.log).toHaveBeenCalledWith('重定向到 /login');
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(result.current).toEqual({
        isAuthenticated: false,
        isLoading: false,
      });
    });

    // 測試不重定向到相同頁面
    test('應該不重定向到相同頁面', async () => {
      const mockError = new Error('驗證失敗');
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: '/login',
      });

      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth('/login'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalledWith('重定向到 /login');
    });

    // 測試自定義重定向路徑
    test('應該使用自定義重定向路徑', async () => {
      const mockError = new Error('驗證失敗');
      const customRedirectTo = '/custom-login';

      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(customRedirectTo));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(console.log).toHaveBeenCalledWith(`重定向到 ${customRedirectTo}`);
      expect(mockPush).toHaveBeenCalledWith(customRedirectTo);
    });

    // 測試當 localStorage 拋出異常時的處理
    test('應該處理 localStorage 存取異常', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage 存取錯誤');
      });
      (checkAuth as jest.Mock).mockRejectedValue(new Error('驗證失敗'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    // 測試有儲存資料但 API 驗證失敗的情況
    test('應該清除過期的本地儲存資料當 API 驗證失敗時', async () => {
      const expiredUserData = { id: '1', name: '過期用戶' };
      const mockError = new Error('Token 已過期');

      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredUserData));
      (checkAuth as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth());

      // 首先應該顯示快取的資料
      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        userData: expiredUserData,
      });

      // 等待 API 驗證完成
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userData');
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(result.current).toEqual({
        isAuthenticated: false,
        isLoading: false,
      });
    });

    // 測試依賴變更時重新執行
    test('應該在 router 或 redirectTo 變更時重新執行', async () => {
      const mockUserData = { id: '1', name: '測試用戶' };
      const mockResponse = { userData: mockUserData };

      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockResolvedValue(mockResponse);

      const { rerender } = renderHook(({ redirectTo }) => useAuth(redirectTo), {
        initialProps: { redirectTo: '/login' },
      });

      await waitFor(() => {
        expect(checkAuth).toHaveBeenCalledTimes(1);
      });

      // 變更 redirectTo 參數
      rerender({ redirectTo: '/custom-login' });

      await waitFor(() => {
        expect(checkAuth).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('isUserLoggedIn 函數', () => {
    // 測試有用戶資料時返回 true
    test('應該在有用戶資料時返回 true', () => {
      const mockUserData = { id: '1', name: '測試用戶' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUserData));

      const result = isUserLoggedIn();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('userData');
      expect(result).toBe(true);
    });

    // 測試無用戶資料時返回 false
    test('應該在無用戶資料時返回 false', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = isUserLoggedIn();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('userData');
      expect(result).toBe(false);
    });

    // 測試空字串時返回 false
    test('應該在用戶資料為空字串時返回 false', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = isUserLoggedIn();

      expect(result).toBe(false);
    });

    // 測試 SSR 環境下返回 false
    test('應該在 SSR 環境下返回 false', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const result = isUserLoggedIn();

      expect(result).toBe(false);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('錯誤處理', () => {
    // 測試網路錯誤
    test('應該處理網路錯誤', async () => {
      const networkError = new Error('Network Error');

      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockRejectedValue(networkError);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith('身份驗證失敗:', networkError);
      expect(result.current.isAuthenticated).toBe(false);
    });

    // 測試 API 回應格式錯誤
    test('應該處理無效的 API 回應', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      (checkAuth as jest.Mock).mockResolvedValue({ invalidResponse: true });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        userData: undefined,
      });
    });
  });
});
