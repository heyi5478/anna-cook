import { renderHook } from '@testing-library/react';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Mock console methods
const originalConsoleError = console.error;

describe('useScreenOrientation', () => {
  let mockScreen: any;
  let mockNavigator: any;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;

  beforeEach(() => {
    // Mock console.error
    console.error = jest.fn();

    // Mock addEventListener and removeEventListener
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();
    Object.defineProperty(window, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });

    // Reset screen mock
    mockScreen = {};
    Object.defineProperty(window, 'screen', {
      value: mockScreen,
      writable: true,
      configurable: true,
    });

    // Reset navigator mock
    mockNavigator = {};
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  describe('移動裝置檢測', () => {
    // 測試非移動裝置時不執行任何操作
    test('應該在非移動裝置時不執行任何操作', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

      renderHook(() => useScreenOrientation());

      expect(mockAddEventListener).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    // 測試 iPhone 裝置檢測
    test('應該檢測 iPhone 裝置並執行方向鎖定', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        unlock: jest.fn(),
      };

      renderHook(() => useScreenOrientation());

      expect(mockScreen.orientation.lock).toHaveBeenCalledWith('landscape');
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    // 測試 iPad 裝置檢測
    test('應該檢測 iPad 裝置並執行方向鎖定', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)';
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        unlock: jest.fn(),
      };

      renderHook(() => useScreenOrientation());

      expect(mockScreen.orientation.lock).toHaveBeenCalledWith('landscape');
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    // 測試 Android 裝置檢測
    test('應該檢測 Android 裝置並執行方向鎖定', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G973F)';
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        unlock: jest.fn(),
      };

      renderHook(() => useScreenOrientation());

      expect(mockScreen.orientation.lock).toHaveBeenCalledWith('landscape');
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    // 測試 iPod 裝置檢測
    test('應該檢測 iPod 裝置並執行方向鎖定', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)';
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        unlock: jest.fn(),
      };

      renderHook(() => useScreenOrientation());

      expect(mockScreen.orientation.lock).toHaveBeenCalledWith('landscape');
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });
  });

  describe('螢幕方向 API 支援檢測', () => {
    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
    });

    // 測試完整的 orientation API 支援
    test('應該在支援完整 orientation API 時正常執行', () => {
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        unlock: jest.fn(),
        type: 'portrait-primary',
      };

      renderHook(() => useScreenOrientation());

      expect(mockScreen.orientation.lock).toHaveBeenCalledWith('landscape');
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    // 測試沒有 orientation 屬性
    test('應該在沒有 orientation 屬性時不執行鎖定但仍添加事件監聽器', () => {
      mockScreen = {}; // 沒有 orientation 屬性
      Object.defineProperty(window, 'screen', {
        value: mockScreen,
        writable: true,
        configurable: true,
      });

      renderHook(() => useScreenOrientation());

      // 雖然沒有 orientation 屬性，但仍會添加事件監聽器
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    // 測試有 orientation 但沒有 lock 方法
    test('應該在沒有 lock 方法時不執行鎖定但仍添加事件監聽器', () => {
      mockScreen.orientation = {
        type: 'portrait-primary',
        // 沒有 lock 方法
      };

      renderHook(() => useScreenOrientation());

      // 雖然沒有 lock 方法，但仍會添加事件監聽器
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    // 測試 API 拋出異常
    test('應該處理 API 拋出的異常', () => {
      // 模擬訪問 orientation 時拋出異常
      Object.defineProperty(mockScreen, 'orientation', {
        get: () => {
          throw new Error('API not supported');
        },
      });

      renderHook(() => useScreenOrientation());

      expect(console.error).toHaveBeenCalledWith(
        '螢幕方向 API 不支援:',
        expect.any(Error),
      );
      expect(mockAddEventListener).not.toHaveBeenCalled();
    });
  });

  describe('方向鎖定功能', () => {
    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
    });

    // 測試成功鎖定方向
    test('應該成功鎖定螢幕方向為橫向', () => {
      const mockLock = jest.fn().mockResolvedValue(undefined);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
      };

      renderHook(() => useScreenOrientation());

      expect(mockLock).toHaveBeenCalledWith('landscape');
    });

    // 測試鎖定失敗的錯誤處理
    test('應該處理方向鎖定失敗的錯誤', async () => {
      const lockError = new Error('Lock failed');
      const mockLock = jest.fn().mockRejectedValue(lockError);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
      };

      renderHook(() => useScreenOrientation());

      // 等待 Promise 解決
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      });

      expect(console.error).toHaveBeenCalledWith(
        '無法鎖定螢幕方向:',
        lockError,
      );
    });
  });

  describe('方向變化事件處理', () => {
    let orientationChangeHandler: () => void;

    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'orientationchange') {
          orientationChangeHandler = handler;
        }
      });
    });

    // 測試直向模式時重新鎖定為橫向
    test('應該在檢測到直向模式時重新鎖定為橫向', async () => {
      const mockLock = jest.fn().mockResolvedValue(undefined);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
        type: 'portrait-primary',
      };

      renderHook(() => useScreenOrientation());

      // 初始鎖定
      expect(mockLock).toHaveBeenCalledWith('landscape');
      expect(mockLock).toHaveBeenCalledTimes(1);

      // 觸發方向變化事件
      orientationChangeHandler();

      // 等待 Promise 解決
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      });

      // 應該再次嘗試鎖定
      expect(mockLock).toHaveBeenCalledTimes(2);
      expect(mockLock).toHaveBeenLastCalledWith('landscape');
    });

    // 測試橫向模式時不重新鎖定
    test('應該在橫向模式時不重新鎖定', () => {
      const mockLock = jest.fn().mockResolvedValue(undefined);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
        type: 'landscape-primary',
      };

      renderHook(() => useScreenOrientation());

      // 初始鎖定
      expect(mockLock).toHaveBeenCalledTimes(1);

      // 觸發方向變化事件
      orientationChangeHandler();

      // 不應該再次鎖定
      expect(mockLock).toHaveBeenCalledTimes(1);
    });

    // 測試沒有 type 屬性時的處理
    test('應該在沒有 type 屬性時不重新鎖定', () => {
      const mockLock = jest.fn().mockResolvedValue(undefined);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
        // 沒有 type 屬性
      };

      renderHook(() => useScreenOrientation());

      // 初始鎖定
      expect(mockLock).toHaveBeenCalledTimes(1);

      // 觸發方向變化事件
      orientationChangeHandler();

      // 不應該再次鎖定
      expect(mockLock).toHaveBeenCalledTimes(1);
    });

    // 測試方向變化時鎖定失敗的錯誤處理
    test('應該處理方向變化時鎖定失敗的錯誤', async () => {
      const lockError = new Error('Lock failed on orientation change');
      const mockLock = jest
        .fn()
        .mockResolvedValueOnce(undefined) // 初始鎖定成功
        .mockRejectedValueOnce(lockError); // 方向變化時鎖定失敗

      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
        type: 'portrait-secondary',
      };

      renderHook(() => useScreenOrientation());

      // 觸發方向變化事件
      orientationChangeHandler();

      // 等待 Promise 解決
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      });

      expect(console.error).toHaveBeenCalledWith(
        '無法鎖定螢幕方向:',
        lockError,
      );
    });

    // 測試沒有 lock 方法時的方向變化處理
    test('應該在沒有 lock 方法時不處理方向變化', () => {
      mockScreen.orientation = {
        unlock: jest.fn(),
        type: 'portrait-primary',
        // 沒有 lock 方法
      };

      renderHook(() => useScreenOrientation());

      // 觸發方向變化事件
      orientationChangeHandler();

      // 不應該有任何錯誤
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('清理功能', () => {
    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
    });

    // 測試組件卸載時的清理
    test('應該在組件卸載時移除事件監聽器並解鎖方向', () => {
      const mockUnlock = jest.fn();
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        unlock: mockUnlock,
      };

      const { unmount } = renderHook(() => useScreenOrientation());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );

      // 卸載組件
      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
      expect(mockUnlock).toHaveBeenCalled();
    });

    // 測試沒有 unlock 方法時的清理
    test('應該在沒有 unlock 方法時仍然移除事件監聽器', () => {
      mockScreen.orientation = {
        lock: jest.fn().mockResolvedValue(undefined),
        // 沒有 unlock 方法
      };

      const { unmount } = renderHook(() => useScreenOrientation());

      // 卸載組件
      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
      // 不應該有錯誤
      expect(console.error).not.toHaveBeenCalled();
    });

    // 測試非移動裝置時沒有清理函數
    test('應該在非移動裝置時沒有清理函數', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

      const { unmount } = renderHook(() => useScreenOrientation());

      // 卸載組件
      unmount();

      // 不應該有任何清理操作
      expect(mockRemoveEventListener).not.toHaveBeenCalled();
    });

    // 測試 API 異常時沒有清理函數
    test('應該在 API 異常時沒有清理函數', () => {
      Object.defineProperty(mockScreen, 'orientation', {
        get: () => {
          throw new Error('API not supported');
        },
      });

      const { unmount } = renderHook(() => useScreenOrientation());

      // 卸載組件
      unmount();

      // 不應該有清理操作
      expect(mockRemoveEventListener).not.toHaveBeenCalled();
    });
  });

  describe('邊界情況和異常處理', () => {
    beforeEach(() => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
    });

    // 測試 userAgent 為空字串
    test('應該處理空的 userAgent', () => {
      mockNavigator.userAgent = '';

      renderHook(() => useScreenOrientation());

      expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    // 測試 userAgent 為 undefined
    test('應該處理 undefined 的 userAgent', () => {
      mockNavigator.userAgent = undefined;

      renderHook(() => useScreenOrientation());

      expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    // 測試複雜的直向類型字串
    test('應該正確識別包含 portrait 的複雜類型字串', async () => {
      let orientationChangeHandler: () => void;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'orientationchange') {
          orientationChangeHandler = handler;
        }
      });

      const mockLock = jest.fn().mockResolvedValue(undefined);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
        type: 'portrait-primary-custom',
      };

      renderHook(() => useScreenOrientation());

      // 觸發方向變化事件
      orientationChangeHandler!();

      // 等待 Promise 解決
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      });

      // 應該檢測到 portrait 並重新鎖定
      expect(mockLock).toHaveBeenCalledTimes(2);
    });

    // 測試 type 為空字串
    test('應該處理空的 orientation type', () => {
      let orientationChangeHandler: () => void;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'orientationchange') {
          orientationChangeHandler = handler;
        }
      });

      const mockLock = jest.fn().mockResolvedValue(undefined);
      mockScreen.orientation = {
        lock: mockLock,
        unlock: jest.fn(),
        type: '',
      };

      renderHook(() => useScreenOrientation());

      // 觸發方向變化事件
      orientationChangeHandler!();

      // 不應該重新鎖定
      expect(mockLock).toHaveBeenCalledTimes(1);
    });
  });
});
