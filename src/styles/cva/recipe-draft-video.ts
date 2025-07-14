import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 草稿視頻編輯器容器樣式變體
 */
export const draftVideoEditorVariants = cva(
  'flex flex-col w-full max-w-md mx-auto bg-white',
  {
    variants: {
      state: {
        loading: 'opacity-75',
        ready: '',
        submitting: 'pointer-events-none opacity-90',
        error: 'border-red-200 bg-red-50',
      },
    },
    defaultVariants: {
      state: 'ready',
    },
  },
);

/**
 * 視頻播放器區域樣式變體
 */
export const videoPlayerSectionVariants = cva('', {
  variants: {
    state: {
      loading: 'animate-pulse',
      ready: '',
      playing: '',
      paused: '',
    },
  },
  defaultVariants: {
    state: 'ready',
  },
});

/**
 * 視頻容器樣式變體
 */
export const videoContainerVariants = cva(
  'bg-gray-100 aspect-video flex items-center justify-center my-2',
  {
    variants: {
      state: {
        loading: 'bg-gray-200 animate-pulse',
        ready: 'bg-gray-100',
        error: 'bg-red-100 border-red-200 border',
      },
    },
    defaultVariants: {
      state: 'ready',
    },
  },
);

/**
 * 時間顯示樣式變體
 */
export const timeDisplayVariants = cva(
  'flex justify-between px-4 py-2 text-sm',
  {
    variants: {
      style: {
        default: 'text-gray-600',
        emphasized: 'text-gray-800 font-medium',
        muted: 'text-gray-500',
      },
    },
    defaultVariants: {
      style: 'default',
    },
  },
);

/**
 * 步驟導航樣式變體
 */
export const stepNavigationVariants = cva(
  'flex items-center justify-between px-4 py-2',
  {
    variants: {
      state: {
        normal: '',
        disabled: 'pointer-events-none opacity-50',
        transitioning: 'opacity-75',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

/**
 * 步驟導航按鈕樣式變體
 */
export const stepNavigationButtonVariants = cva('p-2 transition-colors', {
  variants: {
    state: {
      normal: 'text-neutral-600 hover:text-neutral-800',
      disabled: 'text-neutral-400 cursor-not-allowed',
      active: 'text-blue-600 hover:text-blue-700',
      restricted: 'text-neutral-400 cursor-not-allowed',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

/**
 * 步驟指示器樣式變體
 */
export const stepIndicatorVariants = cva('text-sm font-medium', {
  variants: {
    state: {
      normal: 'text-neutral-700',
      transitioning: 'text-neutral-500',
      highlighted: 'text-blue-600',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

/**
 * 時間軸樣式變體
 */
export const timelineVariants = cva('px-4 py-2', {
  variants: {
    state: {
      normal: '',
      dragging: 'user-select-none',
      disabled: 'pointer-events-none opacity-50',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

/**
 * 時間軸標記樣式變體
 */
export const timelineMarkerVariants = cva(
  'flex justify-between text-xs text-neutral-500 mb-1',
);

/**
 * 時間軸控制器樣式變體
 */
export const timelineControlVariants = cva('py-6', {
  variants: {
    interaction: {
      grab: 'cursor-grab',
      grabbing: 'cursor-grabbing',
      disabled: 'cursor-not-allowed',
    },
  },
  defaultVariants: {
    interaction: 'grab',
  },
});

/**
 * 滑桿樣式變體
 */
export const sliderVariants = cva(
  '[&>span:first-child]:h-3 [&>span:first-child]:bg-neutral-200 [&>span:first-child]:rounded-md [&>span:nth-child(2)]:bg-neutral-400',
  {
    variants: {
      state: {
        normal: '',
        dragging: 'cursor-grabbing',
        disabled: 'opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

/**
 * 滑桿拇指樣式變體
 */
export const sliderThumbVariants = cva(
  'h-6 w-4 bg-white border-2 border-neutral-400 rounded-sm shadow-md hover:border-neutral-600 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-colors',
);

/**
 * 時間範圍顯示樣式變體
 */
export const timeRangeDisplayVariants = cva(
  'flex justify-between px-4 py-2 text-sm',
  {
    variants: {
      style: {
        default: 'text-gray-600',
        emphasized: 'text-gray-800 font-medium',
        muted: 'text-gray-500',
      },
    },
    defaultVariants: {
      style: 'default',
    },
  },
);

/**
 * 提交控制樣式變體
 */
export const submitControlVariants = cva('px-4 py-2', {
  variants: {
    state: {
      normal: '',
      submitting: 'pointer-events-none opacity-75',
      disabled: 'pointer-events-none opacity-50',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

/**
 * 載入狀態樣式變體
 */
export const loadingStateVariants = cva(
  'flex justify-center items-center h-40',
  {
    variants: {
      type: {
        spinner: 'animate-pulse',
        skeleton: 'bg-gray-200 rounded',
        message: 'text-gray-600',
      },
    },
    defaultVariants: {
      type: 'message',
    },
  },
);

/**
 * 錯誤狀態樣式變體
 */
export const errorStateVariants = cva('text-red-500 p-4', {
  variants: {
    severity: {
      warning: 'bg-yellow-50 border-yellow-200 border text-yellow-800',
      error: 'bg-red-50 border-red-200 border text-red-800',
      critical: 'bg-red-100 border-red-300 border text-red-900',
    },
  },
  defaultVariants: {
    severity: 'error',
  },
});

/**
 * 麵包屑導航樣式變體
 */
export const breadcrumbNavigationVariants = cva('px-4 py-2 border-b', {
  variants: {
    style: {
      default: 'bg-white border-gray-200',
      highlighted: 'bg-blue-50 border-blue-200',
    },
  },
  defaultVariants: {
    style: 'default',
  },
});

/**
 * 動畫過渡樣式變體
 */
export const transitionVariants = cva('transition-all duration-300', {
  variants: {
    type: {
      fade: 'transition-opacity',
      slide: 'transition-transform',
      scale: 'transition-transform',
      color: 'transition-colors',
      all: 'transition-all',
    },
    timing: {
      fast: 'duration-150',
      normal: 'duration-300',
      slow: 'duration-500',
    },
  },
  defaultVariants: {
    type: 'all',
    timing: 'normal',
  },
});

/**
 * 交互狀態樣式變體
 */
export const interactionStateVariants = cva('', {
  variants: {
    state: {
      idle: '',
      hover: 'hover:bg-gray-50',
      active: 'active:bg-gray-100',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

// ================== TypeScript 類型定義 ==================

export type DraftVideoEditorVariantsProps = VariantProps<
  typeof draftVideoEditorVariants
>;
export type VideoPlayerSectionVariantsProps = VariantProps<
  typeof videoPlayerSectionVariants
>;
export type VideoContainerVariantsProps = VariantProps<
  typeof videoContainerVariants
>;
export type TimeDisplayVariantsProps = VariantProps<typeof timeDisplayVariants>;
export type StepNavigationVariantsProps = VariantProps<
  typeof stepNavigationVariants
>;
export type StepNavigationButtonVariantsProps = VariantProps<
  typeof stepNavigationButtonVariants
>;
export type StepIndicatorVariantsProps = VariantProps<
  typeof stepIndicatorVariants
>;
export type TimelineVariantsProps = VariantProps<typeof timelineVariants>;
export type TimelineMarkerVariantsProps = VariantProps<
  typeof timelineMarkerVariants
>;
export type TimelineControlVariantsProps = VariantProps<
  typeof timelineControlVariants
>;
export type SliderVariantsProps = VariantProps<typeof sliderVariants>;
export type SliderThumbVariantsProps = VariantProps<typeof sliderThumbVariants>;
export type TimeRangeDisplayVariantsProps = VariantProps<
  typeof timeRangeDisplayVariants
>;
export type SubmitControlVariantsProps = VariantProps<
  typeof submitControlVariants
>;
export type LoadingStateVariantsProps = VariantProps<
  typeof loadingStateVariants
>;
export type ErrorStateVariantsProps = VariantProps<typeof errorStateVariants>;
export type BreadcrumbNavigationVariantsProps = VariantProps<
  typeof breadcrumbNavigationVariants
>;
export type TransitionVariantsProps = VariantProps<typeof transitionVariants>;
export type InteractionStateVariantsProps = VariantProps<
  typeof interactionStateVariants
>;
