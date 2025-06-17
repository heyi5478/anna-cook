import { renderHook, act } from '@testing-library/react';
import { useVideoTime } from '@/hooks/useVideoTime';

// Mock formatTime 函式
jest.mock('@/components/common/VimeoPlayer', () => ({
  formatTime: jest.fn((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }),
}));

describe('useVideoTime', () => {
  // 測試 hook 初始化
  describe('初始化', () => {
    // 測試使用預設參數初始化
    test('應該使用預設參數正確初始化', () => {
      const { result } = renderHook(() => useVideoTime());

      expect(result.current.currentTime).toBe(0);
      expect(result.current.videoDuration).toBe(100);
      expect(typeof result.current.updateDuration).toBe('function');
      expect(typeof result.current.updateCurrentTime).toBe('function');
      expect(typeof result.current.formatTimeHMS).toBe('function');
    });

    // 測試使用自定義初始時長初始化
    test('應該使用自定義初始時長正確初始化', () => {
      const customDuration = 300;
      const { result } = renderHook(() => useVideoTime(customDuration));

      expect(result.current.currentTime).toBe(0);
      expect(result.current.videoDuration).toBe(customDuration);
    });

    // 測試使用 0 作為初始時長
    test('應該能夠使用 0 作為初始時長', () => {
      const { result } = renderHook(() => useVideoTime(0));

      expect(result.current.currentTime).toBe(0);
      expect(result.current.videoDuration).toBe(0);
    });
  });

  // 測試 updateDuration 功能
  describe('updateDuration', () => {
    // 測試更新影片時長
    test('應該正確更新影片時長', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateDuration(250);
      });

      expect(result.current.videoDuration).toBe(250);
    });

    // 測試更新為 0 時長（因為 0 || 100 = 100）
    test('應該能夠更新時長為 0，但會被預設為 100', () => {
      const { result } = renderHook(() => useVideoTime(200));

      act(() => {
        result.current.updateDuration(0);
      });

      expect(result.current.videoDuration).toBe(100); // 因為 0 || 100 = 100
    });

    // 測試處理 null 或 undefined 時長
    test('應該處理 null 或 undefined 時長，預設為 100', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateDuration(null as any);
      });

      expect(result.current.videoDuration).toBe(100);

      act(() => {
        result.current.updateDuration(undefined as any);
      });

      expect(result.current.videoDuration).toBe(100);
    });

    // 測試多次更新時長
    test('應該能夠多次更新時長', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateDuration(150);
      });
      expect(result.current.videoDuration).toBe(150);

      act(() => {
        result.current.updateDuration(200);
      });
      expect(result.current.videoDuration).toBe(200);

      act(() => {
        result.current.updateDuration(75);
      });
      expect(result.current.videoDuration).toBe(75);
    });

    // 測試負數時長
    test('應該能夠處理負數時長', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateDuration(-50);
      });

      expect(result.current.videoDuration).toBe(-50);
    });

    // 測試大數值時長
    test('應該能夠處理大數值時長', () => {
      const { result } = renderHook(() => useVideoTime());
      const largeDuration = 999999;

      act(() => {
        result.current.updateDuration(largeDuration);
      });

      expect(result.current.videoDuration).toBe(largeDuration);
    });
  });

  // 測試 updateCurrentTime 功能
  describe('updateCurrentTime', () => {
    // 測試更新當前時間
    test('應該正確更新當前播放時間', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(45);
      });

      expect(result.current.currentTime).toBe(45);
    });

    // 測試更新為 0 時間
    test('應該能夠更新時間為 0', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(30);
      });
      expect(result.current.currentTime).toBe(30);

      act(() => {
        result.current.updateCurrentTime(0);
      });
      expect(result.current.currentTime).toBe(0);
    });

    // 測試多次更新時間
    test('應該能夠多次更新當前時間', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(10);
      });
      expect(result.current.currentTime).toBe(10);

      act(() => {
        result.current.updateCurrentTime(25);
      });
      expect(result.current.currentTime).toBe(25);

      act(() => {
        result.current.updateCurrentTime(5);
      });
      expect(result.current.currentTime).toBe(5);
    });

    // 測試負數時間
    test('應該能夠處理負數時間', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(-10);
      });

      expect(result.current.currentTime).toBe(-10);
    });

    // 測試小數時間
    test('應該能夠處理小數時間', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(12.5);
      });

      expect(result.current.currentTime).toBe(12.5);
    });

    // 測試大數值時間
    test('應該能夠處理大數值時間', () => {
      const { result } = renderHook(() => useVideoTime());
      const largeTime = 888888;

      act(() => {
        result.current.updateCurrentTime(largeTime);
      });

      expect(result.current.currentTime).toBe(largeTime);
    });
  });

  // 測試組合使用情境
  describe('組合使用情境', () => {
    // 測試同時更新時長和當前時間
    test('應該能夠獨立更新時長和當前時間', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateDuration(300);
        result.current.updateCurrentTime(150);
      });

      expect(result.current.videoDuration).toBe(300);
      expect(result.current.currentTime).toBe(150);
    });

    // 測試當前時間超過影片時長的情況
    test('應該允許當前時間超過影片時長', () => {
      const { result } = renderHook(() => useVideoTime(100));

      act(() => {
        result.current.updateCurrentTime(150);
      });

      expect(result.current.currentTime).toBe(150);
      expect(result.current.videoDuration).toBe(100);
    });

    // 測試模擬影片播放進度
    test('應該能夠模擬影片播放進度', () => {
      const { result } = renderHook(() => useVideoTime());

      // 設置影片時長
      act(() => {
        result.current.updateDuration(120);
      });

      // 模擬播放進度
      const timeStamps = [0, 10, 30, 60, 90, 120];

      timeStamps.forEach((time) => {
        act(() => {
          result.current.updateCurrentTime(time);
        });
        expect(result.current.currentTime).toBe(time);
      });

      expect(result.current.videoDuration).toBe(120);
    });
  });

  // 測試 formatTimeHMS 功能
  describe('formatTimeHMS', () => {
    // 測試格式化時間函式的可用性
    test('應該提供 formatTimeHMS 函式', () => {
      const { result } = renderHook(() => useVideoTime());

      expect(typeof result.current.formatTimeHMS).toBe('function');
    });

    // 測試格式化時間函式的功能
    test('應該正確格式化時間', () => {
      const { result } = renderHook(() => useVideoTime());

      expect(result.current.formatTimeHMS(0)).toBe('0:00');
      expect(result.current.formatTimeHMS(30)).toBe('0:30');
      expect(result.current.formatTimeHMS(60)).toBe('1:00');
      expect(result.current.formatTimeHMS(90)).toBe('1:30');
    });
  });

  // 測試函式穩定性
  describe('函式穩定性', () => {
    // 測試函式引用穩定性
    test('updateDuration 函式應該保持引用穩定性', () => {
      const { result, rerender } = renderHook(() => useVideoTime());

      const initialUpdateDuration = result.current.updateDuration;

      // 重新渲染
      rerender();

      expect(result.current.updateDuration).toBe(initialUpdateDuration);
    });

    // 測試 updateCurrentTime 函式引用穩定性
    test('updateCurrentTime 函式應該保持引用穩定性', () => {
      const { result, rerender } = renderHook(() => useVideoTime());

      const initialUpdateCurrentTime = result.current.updateCurrentTime;

      // 重新渲染
      rerender();

      expect(result.current.updateCurrentTime).toBe(initialUpdateCurrentTime);
    });

    // 測試函式不會因狀態變化而改變引用
    test('函式引用不應該因狀態變化而改變', () => {
      const { result } = renderHook(() => useVideoTime());

      const initialUpdateDuration = result.current.updateDuration;
      const initialUpdateCurrentTime = result.current.updateCurrentTime;

      // 更新狀態
      act(() => {
        result.current.updateDuration(200);
        result.current.updateCurrentTime(50);
      });

      // 函式引用應該保持不變
      expect(result.current.updateDuration).toBe(initialUpdateDuration);
      expect(result.current.updateCurrentTime).toBe(initialUpdateCurrentTime);
    });
  });

  // 測試邊界情況
  describe('邊界情況', () => {
    // 測試極小值
    test('應該處理極小的時間值', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateDuration(0.001);
        result.current.updateCurrentTime(0.001);
      });

      expect(result.current.videoDuration).toBe(0.001);
      expect(result.current.currentTime).toBe(0.001);
    });

    // 測試 NaN 值
    test('應該處理 NaN 值', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(NaN);
      });

      expect(result.current.currentTime).toBeNaN();

      act(() => {
        result.current.updateDuration(NaN);
      });

      expect(result.current.videoDuration).toBe(100); // 因為 NaN || 100 = 100
    });

    // 測試 Infinity 值
    test('應該處理 Infinity 值', () => {
      const { result } = renderHook(() => useVideoTime());

      act(() => {
        result.current.updateCurrentTime(Infinity);
        result.current.updateDuration(Infinity);
      });

      expect(result.current.currentTime).toBe(Infinity);
      expect(result.current.videoDuration).toBe(Infinity);
    });
  });

  // 測試初始參數的不同情況
  describe('初始參數處理', () => {
    // 測試 undefined 初始參數
    test('應該處理 undefined 初始參數', () => {
      const { result } = renderHook(() => useVideoTime(undefined));

      expect(result.current.videoDuration).toBe(100);
    });

    // 測試 null 初始參數
    test('應該處理 null 初始參數', () => {
      const { result } = renderHook(() => useVideoTime(null as any));

      expect(result.current.videoDuration).toBe(null);
    });

    // 測試 NaN 初始參數
    test('應該處理 NaN 初始參數', () => {
      const { result } = renderHook(() => useVideoTime(NaN));

      expect(result.current.videoDuration).toBeNaN();
    });

    // 測試負數初始參數
    test('應該處理負數初始參數', () => {
      const { result } = renderHook(() => useVideoTime(-50));

      expect(result.current.videoDuration).toBe(-50);
    });
  });
});
