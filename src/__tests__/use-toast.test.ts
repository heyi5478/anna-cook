import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '@/hooks/use-toast';

// Mock UI_DELAYS
jest.mock('@/lib/constants', () => ({
  UI_DELAYS: {
    TOAST_REMOVE: 1000000,
  },
}));

// Mock toast 元件類型
jest.mock('@/components/ui/toast', () => ({
  ToastActionElement: {},
  ToastProps: {},
}));

describe('use-toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('reducer', () => {
    const initialState = { toasts: [] };

    // 測試添加 toast
    test('應該正確添加新的 toast', () => {
      const newToast = {
        id: '1',
        title: '測試標題',
        description: '測試描述',
        open: true,
      };

      const action = {
        type: 'ADD_TOAST' as const,
        toast: newToast,
      };

      const result = reducer(initialState, action);

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0]).toEqual(newToast);
    });

    // 測試 toast 數量限制
    test('應該限制 toast 數量為 1', () => {
      const stateWithToast = {
        toasts: [
          {
            id: '1',
            title: '第一個 toast',
            open: true,
          },
        ],
      };

      const newToast = {
        id: '2',
        title: '第二個 toast',
        open: true,
      };

      const action = {
        type: 'ADD_TOAST' as const,
        toast: newToast,
      };

      const result = reducer(stateWithToast, action);

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe('2');
    });

    // 測試更新 toast
    test('應該正確更新指定的 toast', () => {
      const initialToast = {
        id: '1',
        title: '原始標題',
        description: '原始描述',
        open: true,
      };

      const stateWithToast = {
        toasts: [initialToast],
      };

      const updateAction = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: '更新後標題',
        },
      };

      const result = reducer(stateWithToast, updateAction);

      expect(result.toasts[0].title).toBe('更新後標題');
      expect(result.toasts[0].description).toBe('原始描述');
      expect(result.toasts[0].id).toBe('1');
    });

    // 測試關閉特定 toast
    test('應該正確關閉指定的 toast', () => {
      const stateWithToast = {
        toasts: [
          {
            id: '1',
            title: '測試 toast',
            open: true,
          },
        ],
      };

      const dismissAction = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1',
      };

      const result = reducer(stateWithToast, dismissAction);

      expect(result.toasts[0].open).toBe(false);
    });

    // 測試關閉所有 toast
    test('應該正確關閉所有 toast', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      };

      const dismissAllAction = {
        type: 'DISMISS_TOAST' as const,
      };

      const result = reducer(stateWithToasts, dismissAllAction);

      result.toasts.forEach((toastItem) => {
        expect(toastItem.open).toBe(false);
      });
    });

    // 測試移除特定 toast
    test('應該正確移除指定的 toast', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      };

      const removeAction = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1',
      };

      const result = reducer(stateWithToasts, removeAction);

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe('2');
    });

    // 測試移除所有 toast
    test('應該正確移除所有 toast', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      };

      const removeAllAction = {
        type: 'REMOVE_TOAST' as const,
      };

      const result = reducer(stateWithToasts, removeAllAction);

      expect(result.toasts).toHaveLength(0);
    });
  });

  describe('toast 函式', () => {
    // 測試建立新 toast
    test('應該建立新的 toast 並返回控制方法', () => {
      const toastProps = {
        title: '測試標題',
        description: '測試描述',
      };

      const result = toast(toastProps);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('dismiss');
      expect(result).toHaveProperty('update');
      expect(typeof result.id).toBe('string');
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    // 測試 toast dismiss 功能
    test('應該能夠關閉指定的 toast', () => {
      const toastInstance = toast({ title: '測試 toast' });

      act(() => {
        toastInstance.dismiss();
      });

      // 由於 dismiss 會觸發 timeout，我們需要推進時間
      act(() => {
        jest.advanceTimersByTime(1000000);
      });
    });

    // 測試 toast update 功能
    test('應該能夠更新指定的 toast', () => {
      const toastInstance = toast({ title: '原始標題' });

      act(() => {
        toastInstance.update({
          id: toastInstance.id,
          title: '更新後標題',
          description: '新增描述',
        });
      });
    });
  });

  describe('useToast Hook', () => {
    // 測試 Hook 基本功能
    test('應該返回正確的狀態和方法', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current).toHaveProperty('toasts');
      expect(result.current).toHaveProperty('toast');
      expect(result.current).toHaveProperty('dismiss');
      expect(Array.isArray(result.current.toasts)).toBe(true);
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
    });

    // 測試使用 Hook 添加 toast
    test('應該能夠通過 Hook 添加 toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: '測試標題',
          description: '測試描述',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('測試標題');
      expect(result.current.toasts[0].description).toBe('測試描述');
    });

    // 測試使用 Hook 關閉 toast
    test('應該能夠通過 Hook 關閉 toast', () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;

      act(() => {
        const toastResult = result.current.toast({
          title: '測試 toast',
        });
        toastId = toastResult.id;
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    // 測試關閉所有 toast
    test('應該能夠關閉所有 toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });

      // 由於 TOAST_LIMIT = 1，只會有一個 toast
      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    // 測試 onOpenChange 回調
    test('應該在 onOpenChange 為 false 時自動關閉 toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: '測試 toast',
        });
      });

      const addedToast = result.current.toasts[0];
      expect(addedToast.open).toBe(true);

      act(() => {
        if (addedToast.onOpenChange) {
          addedToast.onOpenChange(false);
        }
      });

      // 檢查 toast 是否被標記為關閉
      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe('ID 生成', () => {
    // 測試 ID 生成的唯一性
    test('應該為每個 toast 生成唯一的 ID', () => {
      const toast1 = toast({ title: 'Toast 1' });
      const toast2 = toast({ title: 'Toast 2' });
      const toast3 = toast({ title: 'Toast 3' });

      expect(toast1.id).not.toBe(toast2.id);
      expect(toast2.id).not.toBe(toast3.id);
      expect(toast1.id).not.toBe(toast3.id);
    });
  });

  describe('定時器管理', () => {
    // 測試自動移除功能
    test('應該在指定時間後自動移除已關閉的 toast', () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;

      act(() => {
        const toastResult = result.current.toast({
          title: '測試 toast',
        });
        toastId = toastResult.id;
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);

      // 推進時間以觸發自動移除
      act(() => {
        jest.advanceTimersByTime(1000000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });
});
