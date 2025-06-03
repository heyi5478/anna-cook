import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type VideoState = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentStepIndex: number;
  showRightPanel: boolean;
  dialogOpen: boolean;
};

type VideoActions = {
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  toggleRightPanel: () => void;
  toggleDialog: () => void;
  togglePlay: () => void;
  nextStep: (stepsLength: number) => void;
  prevStep: () => void;
  reset: () => void;
};

const initialState: VideoState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  currentStepIndex: 0,
  showRightPanel: true,
  dialogOpen: false,
};

/**
 * 建立 Recipe Video Store
 */
export const useRecipeVideoStore = create<VideoState & VideoActions>()(
  devtools((set) => ({
    ...initialState,

    /**
     * 設置當前時間
     */
    setCurrentTime: (time) => set({ currentTime: time }),

    /**
     * 設置視頻長度
     */
    setDuration: (duration) => set({ duration }),

    /**
     * 設置播放狀態
     */
    setIsPlaying: (playing) => set({ isPlaying: playing }),

    /**
     * 設置當前步驟索引
     */
    setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

    /**
     * 切換右側面板顯示
     */
    toggleRightPanel: () =>
      set((state) => ({ showRightPanel: !state.showRightPanel })),

    /**
     * 切換對話框顯示
     */
    toggleDialog: () => set((state) => ({ dialogOpen: !state.dialogOpen })),

    /**
     * 切換播放狀態
     */
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    /**
     * 前往下一步
     */
    nextStep: (stepsLength) =>
      set((state) => {
        if (state.currentStepIndex < stepsLength - 1) {
          return {
            currentStepIndex: state.currentStepIndex + 1,
            isPlaying: true,
          };
        }
        return {};
      }),

    /**
     * 前往上一步
     */
    prevStep: () =>
      set((state) => {
        if (state.currentStepIndex > 0) {
          return {
            currentStepIndex: state.currentStepIndex - 1,
            isPlaying: true,
          };
        }
        return {};
      }),

    /**
     * 重置狀態
     */
    reset: () => set(initialState),
  })),
);
