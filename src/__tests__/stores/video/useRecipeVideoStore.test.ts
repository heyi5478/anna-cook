import { renderHook, act } from '@testing-library/react';
import { useRecipeVideoStore } from '@/stores/video/useRecipeVideoStore';

describe('useRecipeVideoStore', () => {
  beforeEach(() => {
    // 重置 store 狀態
    const { result } = renderHook(() => useRecipeVideoStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('初始狀態', () => {
    test('應該返回正確的初始狀態', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.showRightPanel).toBe(true);
      expect(result.current.dialogOpen).toBe(false);
    });
  });

  describe('時間管理', () => {
    test('應該正確設置當前時間', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setCurrentTime(30.5);
      });

      expect(result.current.currentTime).toBe(30.5);
    });

    test('應該正確設置視頻長度', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setDuration(120);
      });

      expect(result.current.duration).toBe(120);
    });

    test('應該處理 0 時間值', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setCurrentTime(0);
        result.current.setDuration(0);
      });

      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
    });

    test('應該處理負數時間值', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setCurrentTime(-10);
        result.current.setDuration(-5);
      });

      expect(result.current.currentTime).toBe(-10);
      expect(result.current.duration).toBe(-5);
    });
  });

  describe('播放狀態管理', () => {
    test('應該正確設置播放狀態', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.setIsPlaying(false);
      });

      expect(result.current.isPlaying).toBe(false);
    });

    test('應該正確切換播放狀態', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 初始狀態為 false
      expect(result.current.isPlaying).toBe(false);

      act(() => {
        result.current.togglePlay();
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.togglePlay();
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('步驟索引管理', () => {
    test('應該正確設置當前步驟索引', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setCurrentStepIndex(2);
      });

      expect(result.current.currentStepIndex).toBe(2);
    });

    test('應該處理負數索引', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setCurrentStepIndex(-1);
      });

      expect(result.current.currentStepIndex).toBe(-1);
    });

    test('應該處理大數值索引', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      act(() => {
        result.current.setCurrentStepIndex(999);
      });

      expect(result.current.currentStepIndex).toBe(999);
    });
  });

  describe('步驟導航', () => {
    test('應該正確前往下一步', () => {
      const { result } = renderHook(() => useRecipeVideoStore());
      const totalSteps = 5;

      // 初始狀態：currentStepIndex = 0
      act(() => {
        result.current.nextStep(totalSteps);
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.isPlaying).toBe(true);
    });

    test('應該在最後一步時不能再前進', () => {
      const { result } = renderHook(() => useRecipeVideoStore());
      const totalSteps = 3;

      // 設置到最後一步
      act(() => {
        result.current.setCurrentStepIndex(2);
        result.current.setIsPlaying(false);
      });

      act(() => {
        result.current.nextStep(totalSteps);
      });

      expect(result.current.currentStepIndex).toBe(2);
      expect(result.current.isPlaying).toBe(false); // 播放狀態不應改變
    });

    test('應該正確前往上一步', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 設置到第二步
      act(() => {
        result.current.setCurrentStepIndex(2);
        result.current.setIsPlaying(false);
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.isPlaying).toBe(true);
    });

    test('應該在第一步時不能再後退', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 初始狀態：currentStepIndex = 0
      act(() => {
        result.current.setIsPlaying(true);
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.isPlaying).toBe(true); // 播放狀態不應改變
    });

    test('應該在單步視頻中正確處理導航', () => {
      const { result } = renderHook(() => useRecipeVideoStore());
      const totalSteps = 1;

      // 唯一的步驟，不能前進
      act(() => {
        result.current.nextStep(totalSteps);
      });

      expect(result.current.currentStepIndex).toBe(0);

      // 也不能後退
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
    });

    test('應該在沒有步驟時正確處理導航', () => {
      const { result } = renderHook(() => useRecipeVideoStore());
      const totalSteps = 0;

      act(() => {
        result.current.nextStep(totalSteps);
      });

      expect(result.current.currentStepIndex).toBe(0);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
    });
  });

  describe('面板和對話框管理', () => {
    test('應該正確切換右側面板顯示', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 初始狀態為 true
      expect(result.current.showRightPanel).toBe(true);

      act(() => {
        result.current.toggleRightPanel();
      });

      expect(result.current.showRightPanel).toBe(false);

      act(() => {
        result.current.toggleRightPanel();
      });

      expect(result.current.showRightPanel).toBe(true);
    });

    test('應該正確切換對話框顯示', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 初始狀態為 false
      expect(result.current.dialogOpen).toBe(false);

      act(() => {
        result.current.toggleDialog();
      });

      expect(result.current.dialogOpen).toBe(true);

      act(() => {
        result.current.toggleDialog();
      });

      expect(result.current.dialogOpen).toBe(false);
    });
  });

  describe('綜合場景測試', () => {
    test('應該在多步驟視頻中正確管理狀態', () => {
      const { result } = renderHook(() => useRecipeVideoStore());
      const totalSteps = 5;

      // 設置視頻基本資訊
      act(() => {
        result.current.setDuration(300);
        result.current.setCurrentTime(0);
      });

      // 播放第一步
      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentStepIndex).toBe(0);

      // 前往下一步
      act(() => {
        result.current.nextStep(totalSteps);
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.isPlaying).toBe(true);

      // 暫停播放
      act(() => {
        result.current.setIsPlaying(false);
      });

      // 前往上一步
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.isPlaying).toBe(true); // prevStep 會自動播放

      // 隱藏右側面板
      act(() => {
        result.current.toggleRightPanel();
      });

      expect(result.current.showRightPanel).toBe(false);
    });

    test('應該在邊界條件下正確處理狀態', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 測試極端值
      act(() => {
        result.current.setCurrentTime(Number.MAX_SAFE_INTEGER);
        result.current.setDuration(Number.MAX_SAFE_INTEGER);
        result.current.setCurrentStepIndex(Number.MAX_SAFE_INTEGER);
      });

      expect(result.current.currentTime).toBe(Number.MAX_SAFE_INTEGER);
      expect(result.current.duration).toBe(Number.MAX_SAFE_INTEGER);
      expect(result.current.currentStepIndex).toBe(Number.MAX_SAFE_INTEGER);

      // 測試負數
      act(() => {
        result.current.setCurrentTime(-100);
        result.current.setDuration(-50);
        result.current.setCurrentStepIndex(-10);
      });

      expect(result.current.currentTime).toBe(-100);
      expect(result.current.duration).toBe(-50);
      expect(result.current.currentStepIndex).toBe(-10);
    });
  });

  describe('重置狀態', () => {
    test('應該重置所有狀態到初始值', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 設置一些非初始值
      act(() => {
        result.current.setCurrentTime(100);
        result.current.setDuration(300);
        result.current.setIsPlaying(true);
        result.current.setCurrentStepIndex(3);
        result.current.toggleRightPanel(); // 設為 false
        result.current.toggleDialog(); // 設為 true
      });

      // 確認狀態已改變
      expect(result.current.currentTime).toBe(100);
      expect(result.current.duration).toBe(300);
      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentStepIndex).toBe(3);
      expect(result.current.showRightPanel).toBe(false);
      expect(result.current.dialogOpen).toBe(true);

      // 重置狀態
      act(() => {
        result.current.reset();
      });

      // 確認所有狀態回到初始值
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.showRightPanel).toBe(true);
      expect(result.current.dialogOpen).toBe(false);
    });

    test('應該在重置後能正常操作', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 設置一些狀態
      act(() => {
        result.current.setCurrentTime(50);
        result.current.setIsPlaying(true);
      });

      // 重置
      act(() => {
        result.current.reset();
      });

      // 重新設置狀態應該正常工作
      act(() => {
        result.current.setCurrentTime(25);
        result.current.togglePlay();
      });

      expect(result.current.currentTime).toBe(25);
      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe('狀態隔離測試', () => {
    test('各個狀態更新應該相互獨立', () => {
      const { result } = renderHook(() => useRecipeVideoStore());

      // 分別更新各個狀態
      act(() => {
        result.current.setCurrentTime(50);
      });
      expect(result.current.duration).toBe(0); // 其他狀態不變

      act(() => {
        result.current.setDuration(200);
      });
      expect(result.current.currentTime).toBe(50); // 之前設置的值保持
      expect(result.current.isPlaying).toBe(false); // 其他狀態不變

      act(() => {
        result.current.setIsPlaying(true);
      });
      expect(result.current.currentTime).toBe(50);
      expect(result.current.duration).toBe(200);
      expect(result.current.currentStepIndex).toBe(0); // 其他狀態不變

      act(() => {
        result.current.setCurrentStepIndex(2);
      });
      expect(result.current.currentTime).toBe(50);
      expect(result.current.duration).toBe(200);
      expect(result.current.isPlaying).toBe(true);
      expect(result.current.showRightPanel).toBe(true); // 其他狀態不變
    });
  });
});
