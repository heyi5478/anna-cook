import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 視頻編輯器主容器樣式變體
 */
export const videoEditorContainerVariants = cva(
  'flex flex-col w-full max-w-md mx-auto h-full',
  {
    variants: {
      state: {
        default: 'bg-gray-50',
        uploading: 'bg-gray-50 opacity-90',
        editing: 'bg-gray-50',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

/**
 * 視頻播放器容器樣式變體
 */
export const videoPlayerVariants = cva('space-y-4', {
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
 * 視頻播放器容器樣式變體
 */
export const videoPlayerContainerVariants = cva(
  'relative aspect-video rounded-lg overflow-hidden',
  {
    variants: {
      state: {
        loading: 'bg-gray-200 animate-pulse',
        ready: 'bg-gray-100',
        error: 'bg-red-50 border-red-200 border',
      },
    },
    defaultVariants: {
      state: 'ready',
    },
  },
);

/**
 * 播放控制按鈕樣式變體
 */
export const playControlButtonVariants = cva(
  'rounded-full text-white transition-colors',
  {
    variants: {
      size: {
        sm: 'h-12 w-12',
        default: 'h-16 w-16',
        lg: 'h-20 w-20',
      },
      state: {
        normal: 'bg-black/30 hover:bg-black/50',
        disabled: 'bg-black/20 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'normal',
    },
  },
);

/**
 * 上傳區域樣式變體
 */
export const uploadAreaVariants = cva('px-4', {
  variants: {
    state: {
      empty: '',
      dragging: 'bg-blue-50',
      uploading: 'pointer-events-none',
      ready: '',
      error: 'border-red-200',
    },
  },
  defaultVariants: {
    state: 'empty',
  },
});

/**
 * 上傳容器樣式變體
 */
export const uploadContainerVariants = cva(
  'flex flex-col items-center justify-center border rounded-lg p-6 h-64 bg-white transition-colors',
  {
    variants: {
      state: {
        empty: 'border-gray-300 hover:border-gray-400 cursor-pointer',
        dragging: 'border-blue-400 bg-blue-50',
        uploading: 'border-gray-300 opacity-50 cursor-not-allowed',
        ready: 'border-green-300 bg-green-50',
        error: 'border-red-300 bg-red-50',
      },
    },
    defaultVariants: {
      state: 'empty',
    },
  },
);

/**
 * 控制按鈕樣式變體
 */
export const controlButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        sm: 'h-9 px-3',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
      state: {
        normal: '',
        disabled: 'opacity-50 cursor-not-allowed',
        loading: 'opacity-70 cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'normal',
    },
  },
);

/**
 * 進度指示器樣式變體
 */
export const progressIndicatorVariants = cva('space-y-2', {
  variants: {
    state: {
      hidden: 'hidden',
      visible: 'block',
      error: 'block border-red-200',
    },
  },
  defaultVariants: {
    state: 'hidden',
  },
});

/**
 * 錯誤訊息樣式變體
 */
export const errorMessageVariants = cva('text-sm flex items-center', {
  variants: {
    type: {
      general: 'text-red-500 mt-1',
      api: 'text-red-500 p-2 bg-red-50 border border-red-300 rounded-md mt-2',
      validation: 'text-red-500 text-xs mt-1',
    },
  },
  defaultVariants: {
    type: 'general',
  },
});

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
 * Debug 按鈕樣式變體
 */
export const debugButtonVariants = cva('w-full p-2 rounded mt-2 text-sm', {
  variants: {
    environment: {
      development: 'bg-yellow-50 text-yellow-700 border-yellow-300',
      production: 'hidden',
    },
  },
  defaultVariants: {
    environment: 'development',
  },
});

/**
 * 步驟指示器容器樣式變體
 */
export const stepIndicatorContainerVariants = cva('px-4 py-6');

/**
 * 內容區域樣式變體
 */
export const contentAreaVariants = cva('px-4 space-y-4');

/**
 * 片段導航樣式變體
 */
export const segmentNavigationVariants = cva('space-y-4');

/**
 * 片段導航控制區樣式變體
 */
export const segmentNavigationControlsVariants = cva(
  'flex items-center justify-between px-4 py-2',
);

/**
 * 片段導航按鈕樣式變體
 */
export const segmentNavigationButtonVariants = cva('p-2 transition-colors', {
  variants: {
    state: {
      normal: 'text-neutral-600 hover:text-neutral-800',
      disabled: 'text-neutral-400 cursor-not-allowed',
      active: 'text-blue-600 hover:text-blue-700',
    },
  },
  defaultVariants: {
    state: 'normal',
  },
});

/**
 * 片段指示器樣式變體
 */
export const segmentIndicatorVariants = cva(
  'text-sm text-neutral-700 font-medium',
);

/**
 * 片段刪除按鈕樣式變體
 */
export const segmentDeleteButtonVariants = cva(
  'w-full bg-neutral-200 text-neutral-700 rounded-md py-2 flex items-center justify-center',
  {
    variants: {
      state: {
        normal: 'hover:bg-neutral-300',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

/**
 * 剪輯控制樣式變體
 */
export const trimControlVariants = cva('space-y-4');

/**
 * 時間軸容器樣式變體
 */
export const timelineContainerVariants = cva('space-y-2 mt-6');

/**
 * 時間標記樣式變體
 */
export const timeMarkerVariants = cva(
  'flex justify-between text-xs text-neutral-500',
);

/**
 * 縮圖預覽容器樣式變體
 */
export const thumbnailContainerVariants = cva('relative h-16');

/**
 * 縮圖樣式變體
 */
export const thumbnailVariants = cva(
  'absolute inset-0 flex rounded overflow-hidden',
);

/**
 * 片段標記樣式變體
 */
export const segmentMarkerVariants = cva(
  'absolute top-0 bottom-0 border-2 pointer-events-none z-10',
  {
    variants: {
      state: {
        current: 'border-blue-500 bg-blue-500/10',
        normal: 'border-blue-300 bg-blue-300/10',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

/**
 * 片段標記標籤樣式變體
 */
export const segmentMarkerLabelVariants = cva(
  'absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium px-1 py-0.5 rounded bg-blue-600 text-white',
);

/**
 * 遮罩樣式變體
 */
export const maskVariants = cva(
  'absolute top-0 bottom-0 bg-black/50 pointer-events-none z-10',
  {
    variants: {
      side: {
        left: 'rounded-l',
        right: 'rounded-r',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
);

/**
 * 播放位置指示器樣式變體
 */
export const playbackIndicatorVariants = cva(
  'absolute top-0 bottom-0 w-0.5 bg-red-500 z-20',
);

/**
 * 播放位置指示器標記樣式變體
 */
export const playbackIndicatorMarkerVariants = cva(
  'absolute -top-1 -ml-1.5 w-3 h-3 bg-red-500 rounded-full',
);

/**
 * 滑桿把手樣式變體
 */
export const sliderHandleVariants = cva(
  'absolute top-0 bottom-0 w-1 bg-blue-500 z-40 pointer-events-none',
);

/**
 * 滑桿把手標記樣式變體
 */
export const sliderHandleMarkerVariants = cva(
  'absolute h-6 w-6 bg-blue-500 rounded-full -ml-3 top-1/2 -translate-y-1/2 flex items-center justify-center',
);

/**
 * 時間顯示區域樣式變體
 */
export const timeRangeDisplayVariants = cva(
  'flex justify-between text-sm text-gray-600',
);

/**
 * 標記按鈕組樣式變體
 */
export const markButtonGroupVariants = cva('flex justify-between gap-4 mt-4');

/**
 * 標記按鈕樣式變體
 */
export const markButtonVariants = cva('flex-1');

/**
 * 狀態指示器樣式變體
 */
export const statusIndicatorVariants = cva('mt-3 mb-1');

/**
 * 狀態指示器內容樣式變體
 */
export const statusIndicatorContentVariants = cva('flex items-center');

/**
 * 狀態燈樣式變體
 */
export const statusLightVariants = cva('w-4 h-4 rounded-full mr-2', {
  variants: {
    status: {
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      success: 'bg-green-500',
    },
  },
  defaultVariants: {
    status: 'success',
  },
});

/**
 * 狀態文字樣式變體
 */
export const statusTextVariants = cva('text-sm text-neutral-700');

/**
 * 重置按鈕樣式變體
 */
export const resetButtonVariants = cva(
  'w-full flex items-center justify-center',
);

/**
 * 描述欄位樣式變體
 */
export const descriptionFieldVariants = cva('mt-4');

/**
 * 描述欄位標題樣式變體
 */
export const descriptionFieldTitleVariants = cva(
  'text-sm font-medium text-neutral-700 mb-2',
);

/**
 * 字元計數器樣式變體
 */
export const characterCounterVariants = cva('ml-2 text-xs text-neutral-500');

/**
 * 描述文字區域樣式變體
 */
export const descriptionTextareaVariants = cva(
  'w-full p-2 text-sm border rounded-md min-h-[80px] resize-none transition-colors',
  {
    variants: {
      state: {
        normal: 'border-neutral-300 text-neutral-600 focus:border-blue-500',
        error: 'border-red-500 bg-red-50 focus:border-red-500',
        valid: 'border-green-500 bg-green-50 focus:border-green-500',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

// ================== TypeScript 類型定義 ==================

export type VideoEditorContainerVariantsProps = VariantProps<
  typeof videoEditorContainerVariants
>;
export type VideoPlayerVariantsProps = VariantProps<typeof videoPlayerVariants>;
export type VideoPlayerContainerVariantsProps = VariantProps<
  typeof videoPlayerContainerVariants
>;
export type PlayControlButtonVariantsProps = VariantProps<
  typeof playControlButtonVariants
>;
export type UploadAreaVariantsProps = VariantProps<typeof uploadAreaVariants>;
export type UploadContainerVariantsProps = VariantProps<
  typeof uploadContainerVariants
>;
export type ControlButtonVariantsProps = VariantProps<
  typeof controlButtonVariants
>;
export type ProgressIndicatorVariantsProps = VariantProps<
  typeof progressIndicatorVariants
>;
export type ErrorMessageVariantsProps = VariantProps<
  typeof errorMessageVariants
>;
export type TimeDisplayVariantsProps = VariantProps<typeof timeDisplayVariants>;
export type DebugButtonVariantsProps = VariantProps<typeof debugButtonVariants>;
export type StepIndicatorContainerVariantsProps = VariantProps<
  typeof stepIndicatorContainerVariants
>;
export type ContentAreaVariantsProps = VariantProps<typeof contentAreaVariants>;
export type SegmentNavigationVariantsProps = VariantProps<
  typeof segmentNavigationVariants
>;
export type SegmentNavigationControlsVariantsProps = VariantProps<
  typeof segmentNavigationControlsVariants
>;
export type SegmentNavigationButtonVariantsProps = VariantProps<
  typeof segmentNavigationButtonVariants
>;
export type SegmentIndicatorVariantsProps = VariantProps<
  typeof segmentIndicatorVariants
>;
export type SegmentDeleteButtonVariantsProps = VariantProps<
  typeof segmentDeleteButtonVariants
>;
export type TrimControlVariantsProps = VariantProps<typeof trimControlVariants>;
export type TimelineContainerVariantsProps = VariantProps<
  typeof timelineContainerVariants
>;
export type TimeMarkerVariantsProps = VariantProps<typeof timeMarkerVariants>;
export type ThumbnailContainerVariantsProps = VariantProps<
  typeof thumbnailContainerVariants
>;
export type ThumbnailVariantsProps = VariantProps<typeof thumbnailVariants>;
export type SegmentMarkerVariantsProps = VariantProps<
  typeof segmentMarkerVariants
>;
export type SegmentMarkerLabelVariantsProps = VariantProps<
  typeof segmentMarkerLabelVariants
>;
export type MaskVariantsProps = VariantProps<typeof maskVariants>;
export type PlaybackIndicatorVariantsProps = VariantProps<
  typeof playbackIndicatorVariants
>;
export type PlaybackIndicatorMarkerVariantsProps = VariantProps<
  typeof playbackIndicatorMarkerVariants
>;
export type SliderHandleVariantsProps = VariantProps<
  typeof sliderHandleVariants
>;
export type SliderHandleMarkerVariantsProps = VariantProps<
  typeof sliderHandleMarkerVariants
>;
export type TimeRangeDisplayVariantsProps = VariantProps<
  typeof timeRangeDisplayVariants
>;
export type MarkButtonGroupVariantsProps = VariantProps<
  typeof markButtonGroupVariants
>;
export type MarkButtonVariantsProps = VariantProps<typeof markButtonVariants>;
export type StatusIndicatorVariantsProps = VariantProps<
  typeof statusIndicatorVariants
>;
export type StatusIndicatorContentVariantsProps = VariantProps<
  typeof statusIndicatorContentVariants
>;
export type StatusLightVariantsProps = VariantProps<typeof statusLightVariants>;
export type StatusTextVariantsProps = VariantProps<typeof statusTextVariants>;
export type ResetButtonVariantsProps = VariantProps<typeof resetButtonVariants>;
export type DescriptionFieldVariantsProps = VariantProps<
  typeof descriptionFieldVariants
>;
export type DescriptionFieldTitleVariantsProps = VariantProps<
  typeof descriptionFieldTitleVariants
>;
export type CharacterCounterVariantsProps = VariantProps<
  typeof characterCounterVariants
>;
export type DescriptionTextareaVariantsProps = VariantProps<
  typeof descriptionTextareaVariants
>;
