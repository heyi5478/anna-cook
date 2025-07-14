import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 食譜草稿影片頁面的樣式變體定義
 * 用於食譜影片編輯、時間標記、步驟同步等相關功能的樣式管理
 */

// 食譜草稿影片主容器樣式變體
export const recipeDraftVideoContainer = cva('w-full mx-auto bg-white', {
  variants: {
    variant: {
      default: 'max-w-7xl',
      wide: 'max-w-full',
      compact: 'max-w-5xl',
    },
    layout: {
      single: 'grid grid-cols-1 gap-6',
      split: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
      threecol: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    layout: 'split',
    padding: 'md',
  },
});

// 影片播放區域樣式變體
export const recipeDraftVideoPlayer = cva(
  'relative bg-black rounded-lg overflow-hidden shadow-lg',
  {
    variants: {
      variant: {
        default: 'aspect-video',
        square: 'aspect-square',
        wide: 'aspect-[21/9]',
        tall: 'aspect-[9/16]',
      },
      size: {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        full: 'w-full',
      },
      border: {
        none: '',
        default: 'border-2 border-gray-200',
        thick: 'border-4 border-gray-300',
        colored: 'border-2 border-blue-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'full',
      border: 'none',
    },
  },
);

// 步驟面板樣式變體
export const recipeDraftVideoStepPanel = cva(
  'bg-white rounded-lg border border-gray-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        expanded: 'p-8',
        minimal: 'p-3 border-none shadow-none',
      },
      height: {
        auto: 'h-auto',
        fixed: 'h-96',
        tall: 'h-[500px]',
        full: 'h-full',
      },
      scrollable: {
        true: 'overflow-y-auto',
        false: 'overflow-hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
      height: 'auto',
      scrollable: true,
    },
  },
);

// 時間標記按鈕樣式變體
export const recipeDraftVideoTimeMarker = cva(
  'absolute w-4 h-4 rounded-full border-2 border-white cursor-pointer transition-all duration-200 hover:scale-125',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 hover:bg-blue-700',
        active: 'bg-green-600 hover:bg-green-700 scale-125',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        error: 'bg-red-600 hover:bg-red-700',
      },
      size: {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
      state: {
        default: '',
        selected: 'ring-4 ring-blue-300',
        editing: 'ring-4 ring-yellow-300 animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  },
);

// 時間軸滑桿樣式變體
export const recipeDraftVideoTimeline = cva(
  'relative w-full bg-gray-300 rounded-full overflow-hidden cursor-pointer',
  {
    variants: {
      variant: {
        default: 'h-3',
        thick: 'h-6',
        thin: 'h-2',
      },
      interactive: {
        true: 'hover:bg-gray-400 transition-colors duration-200',
        false: 'cursor-default',
      },
      state: {
        default: '',
        loading: 'animate-pulse bg-gray-400',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: true,
      state: 'default',
    },
  },
);

// 步驟列表項目樣式變體
export const recipeDraftVideoStepItem = cva(
  'p-4 border border-gray-200 rounded-lg transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-white hover:bg-gray-50 hover:border-gray-300',
        active: 'bg-blue-50 border-blue-500 shadow-md',
        completed: 'bg-green-50 border-green-500',
        editing: 'bg-yellow-50 border-yellow-500',
        error: 'bg-red-50 border-red-500',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      spacing: {
        tight: 'mb-2',
        normal: 'mb-4',
        loose: 'mb-6',
      },
      interactive: {
        true: 'hover:scale-[1.01] hover:shadow-sm',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      spacing: 'normal',
      interactive: true,
    },
  },
);

// 描述文字輸入框樣式變體
export const recipeDraftVideoDescription = cva(
  'w-full p-3 border border-gray-300 rounded-md resize-vertical transition-all duration-200 focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        default: 'focus:ring-blue-500 focus:border-blue-500',
        error:
          'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50',
        success:
          'border-green-500 focus:ring-green-500 focus:border-green-500 bg-green-50',
        warning:
          'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50',
      },
      size: {
        sm: 'min-h-[80px] text-sm',
        md: 'min-h-[100px]',
        lg: 'min-h-[120px] text-lg',
      },
      state: {
        default: '',
        readonly: 'bg-gray-100 cursor-not-allowed',
        disabled: 'bg-gray-200 opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  },
);

// 導航按鈕樣式變體
export const recipeDraftVideoNavigation = cva(
  'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        previous:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        next: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        save: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        cancel: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline:
          'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        fit: 'w-fit',
      },
      icon: {
        left: 'flex items-center space-x-2',
        right: 'flex items-center space-x-2 flex-row-reverse',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'next',
      size: 'md',
      width: 'auto',
      icon: 'none',
    },
  },
);

// 面包屑導航樣式變體
export const recipeDraftVideoBreadcrumb = cva(
  'flex items-center space-x-2 text-sm text-gray-600',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'text-xs',
        emphasized: 'text-base font-medium',
      },
      separator: {
        slash: 'divide-x-0',
        arrow: 'space-x-1',
        dot: 'space-x-1',
      },
      interactive: {
        true: 'hover:text-gray-800 cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      separator: 'arrow',
      interactive: true,
    },
  },
);

// TypeScript 類型導出
export type RecipeDraftVideoContainerProps = VariantProps<
  typeof recipeDraftVideoContainer
>;
export type RecipeDraftVideoPlayerProps = VariantProps<
  typeof recipeDraftVideoPlayer
>;
export type RecipeDraftVideoStepPanelProps = VariantProps<
  typeof recipeDraftVideoStepPanel
>;
export type RecipeDraftVideoTimeMarkerProps = VariantProps<
  typeof recipeDraftVideoTimeMarker
>;
export type RecipeDraftVideoTimelineProps = VariantProps<
  typeof recipeDraftVideoTimeline
>;
export type RecipeDraftVideoStepItemProps = VariantProps<
  typeof recipeDraftVideoStepItem
>;
export type RecipeDraftVideoDescriptionProps = VariantProps<
  typeof recipeDraftVideoDescription
>;
export type RecipeDraftVideoNavigationProps = VariantProps<
  typeof recipeDraftVideoNavigation
>;
export type RecipeDraftVideoBreadcrumbProps = VariantProps<
  typeof recipeDraftVideoBreadcrumb
>;
