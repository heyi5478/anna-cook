import { renderHook, act } from '@testing-library/react';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Mock console methods
const originalConsoleDebug = console.debug;

describe('useScreenOrientation (CSS-First 偵測方案)', () => {
  let mockNavigator: any;
  let mockScreen: any;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;

  beforeEach(() => {
    // Mock console.debug
    console.debug = jest.fn();

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

    // Mock innerWidth and innerHeight
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 768,
      writable: true,
      configurable: true,
    });

    // Mock navigator
    mockNavigator = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true,
      configurable: true,
    });

    // Mock screen
    mockScreen = {};
    Object.defineProperty(window, 'screen', {
      value: mockScreen,
      writable: true,
      configurable: true,
    });

    // 清理 window.orientation - 重要！防止測試間狀態洩漏
    if ('orientation' in window) {
      delete (window as any).orientation;
    }
  });

  afterEach(() => {
    console.debug = originalConsoleDebug;
    jest.clearAllMocks();
  });

  describe('移動裝置檢測', () => {
    test('應該正確檢測桌面裝置', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isMobile).toBe(false);
    });

    test('應該正確檢測 iPhone 裝置', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isMobile).toBe(true);
    });

    test('應該正確檢測 iPad 裝置', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)';

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isMobile).toBe(true);
    });

    test('應該正確檢測 Android 裝置', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G973F)';

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isMobile).toBe(true);
    });

    test('應該正確檢測 iPod 裝置', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)';

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('方向偵測', () => {
    test('應該正確偵測橫向模式 (寬度 > 高度)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024 });
      Object.defineProperty(window, 'innerHeight', { value: 768 });

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isLandscape).toBe(true);
      expect(result.current.isPortrait).toBe(false);
    });

    test('應該正確偵測直向模式 (高度 > 寬度)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isPortrait).toBe(true);
      expect(result.current.isLandscape).toBe(false);
    });

    test('應該處理正方形螢幕 (寬度 = 高度)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.isPortrait).toBe(false);
      expect(result.current.isLandscape).toBe(false);
    });
  });

  describe('Orientation API 偵測', () => {
    test('應該正確讀取 screen.orientation.type', () => {
      mockScreen.orientation = {
        type: 'landscape-primary',
      };

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.orientation).toBe('landscape-primary');
    });

    test('應該正確讀取 window.orientation', () => {
      Object.defineProperty(window, 'orientation', {
        value: 90,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.orientation).toBe('90deg');
    });

    test('應該在沒有 orientation API 時降級為 unknown', () => {
      // 沒有 screen.orientation 也沒有 window.orientation
      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.orientation).toBe('unknown');
    });

    test('應該處理 orientation API 拋出的異常', () => {
      Object.defineProperty(mockScreen, 'orientation', {
        get: () => {
          throw new Error('API not supported');
        },
      });

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current.orientation).toBe('unknown');
      expect(console.debug).toHaveBeenCalledWith(
        'Orientation API 不可用，使用基本偵測',
      );
    });
  });

  describe('事件監聽', () => {
    test('應該註冊 resize 和 orientationchange 事件監聽器', () => {
      renderHook(() => useScreenOrientation());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });

    test('應該在 resize 事件時更新方向資訊', () => {
      let resizeHandler: () => void;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'resize') {
          resizeHandler = handler;
        }
      });

      const { result } = renderHook(() => useScreenOrientation());

      // 初始狀態：橫向
      expect(result.current.isLandscape).toBe(true);

      // 模擬視窗大小改變為直向
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });

      act(() => {
        resizeHandler!();
      });

      expect(result.current.isPortrait).toBe(true);
      expect(result.current.isLandscape).toBe(false);
    });

    test('應該在 orientationchange 事件時延遲更新方向資訊', (done) => {
      let orientationChangeHandler: () => void;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'orientationchange') {
          orientationChangeHandler = handler;
        }
      });

      mockScreen.orientation = {
        type: 'portrait-primary',
      };

      const { result } = renderHook(() => useScreenOrientation());

      // 改變 orientation type
      mockScreen.orientation.type = 'landscape-primary';

      act(() => {
        orientationChangeHandler!();
      });

      // 延遲 100ms 後檢查更新
      setTimeout(() => {
        expect(result.current.orientation).toBe('landscape-primary');
        done();
      }, 150);
    });
  });

  describe('開發環境偵測記錄', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      // 模擬開發環境
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
    });

    afterEach(() => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        writable: true,
        configurable: true,
      });
    });

    test('應該在開發環境的移動裝置上記錄偵測資訊', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });

      renderHook(() => useScreenOrientation());

      expect(console.debug).toHaveBeenCalledWith('螢幕方向偵測:', {
        isPortrait: true,
        isLandscape: false,
        orientation: 'unknown',
        dimensions: '768x1024',
      });
    });

    test('應該在非移動裝置上不記錄偵測資訊', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

      renderHook(() => useScreenOrientation());

      expect(console.debug).not.toHaveBeenCalledWith(
        expect.stringMatching(/螢幕方向偵測/),
      );
    });
  });

  describe('清理功能', () => {
    test('應該在組件卸載時移除事件監聽器', () => {
      const { unmount } = renderHook(() => useScreenOrientation());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function),
      );
    });
  });

  describe('完整的 OrientationInfo 回傳值', () => {
    test('應該回傳完整的 OrientationInfo 物件', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });
      mockScreen.orientation = { type: 'portrait-primary' };

      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current).toEqual({
        isMobile: true,
        isPortrait: true,
        isLandscape: false,
        orientation: 'portrait-primary',
      });
    });

    test('應該正確初始化所有屬性', () => {
      const { result } = renderHook(() => useScreenOrientation());

      expect(result.current).toHaveProperty('isMobile');
      expect(result.current).toHaveProperty('isPortrait');
      expect(result.current).toHaveProperty('isLandscape');
      expect(result.current).toHaveProperty('orientation');
    });
  });
});
