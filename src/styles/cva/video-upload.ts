import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 影片上傳頁面的樣式變體定義
 * 用於影片上傳、編輯、分段等相關功能的樣式管理
 */

// 影片上傳主容器樣式變體
export const videoUploadContainer = cva('w-full mx-auto bg-white', {
  variants: {
    variant: {
      default: 'max-w-6xl',
      wide: 'max-w-7xl',
      full: 'max-w-full',
    },
    layout: {
      single: 'grid grid-cols-1 gap-6',
      split: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
      sidebar: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
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
    layout: 'single',
    padding: 'md',
  },
});

// 上傳區域樣式變體
export const videoUploadArea = cva(
  'border-2 border-dashed rounded-lg transition-all duration-200 flex flex-col items-center justify-center',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
        active: 'border-blue-500 bg-blue-50',
        error: 'border-red-500 bg-red-50',
        success: 'border-green-500 bg-green-50',
        dragover: 'border-blue-600 bg-blue-100 scale-[1.02]',
      },
      size: {
        sm: 'min-h-[200px] p-6',
        md: 'min-h-[300px] p-8',
        lg: 'min-h-[400px] p-12',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.01]',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: true,
    },
  },
);

// 影片播放器樣式變體
export const videoUploadPlayer = cva(
  'relative bg-black rounded-lg overflow-hidden',
  {
    variants: {
      variant: {
        default: 'shadow-lg',
        minimal: 'shadow-none',
        bordered: 'border-2 border-gray-300',
      },
      aspectRatio: {
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square',
        auto: '',
      },
      size: {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        full: 'w-full',
      },
      controls: {
        default: '',
        minimal: 'controls-minimal',
        hidden: 'controls-hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
      aspectRatio: '16:9',
      size: 'full',
      controls: 'default',
    },
  },
);

// 時間軸控制器樣式變體
export const videoUploadTimeline = cva(
  'relative w-full bg-gray-200 rounded-full overflow-hidden',
  {
    variants: {
      variant: {
        default: 'h-2',
        thick: 'h-4',
        thin: 'h-1',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-gray-300',
        false: 'cursor-default',
      },
      state: {
        default: '',
        loading: 'animate-pulse',
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

// 分段控制樣式變體
export const videoUploadSegment = cva(
  'bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'hover:border-gray-300 hover:shadow-sm',
        active: 'border-blue-500 bg-blue-50 shadow-md',
        selected: 'border-green-500 bg-green-50',
        error: 'border-red-500 bg-red-50',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.01]',
        false: '',
      },
      spacing: {
        tight: 'mb-2',
        normal: 'mb-4',
        loose: 'mb-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: true,
      spacing: 'normal',
    },
  },
);

// 進度條樣式變體
export const videoUploadProgress = cva(
  'relative w-full bg-gray-200 rounded-full overflow-hidden',
  {
    variants: {
      variant: {
        default: 'h-2',
        thick: 'h-4',
        thin: 'h-1',
      },
      color: {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        yellow: 'bg-yellow-600',
        red: 'bg-red-600',
      },
      animated: {
        true: 'transition-all duration-300 ease-out',
        false: '',
      },
      striped: {
        true: 'bg-gradient-to-r from-transparent via-white to-transparent bg-[length:20px_20px] animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      color: 'blue',
      animated: true,
      striped: false,
    },
  },
);

// 控制按鈕樣式變體
export const videoUploadButton = cva(
  'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline:
          'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
      icon: {
        left: 'flex items-center space-x-2',
        right: 'flex items-center space-x-2 flex-row-reverse',
        only: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      icon: 'left',
    },
  },
);

// 狀態訊息樣式變體
export const videoUploadStatus = cva('p-4 rounded-lg border', {
  variants: {
    variant: {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
    },
    size: {
      sm: 'p-3 text-sm',
      md: 'p-4',
      lg: 'p-6 text-lg',
    },
    dismissible: {
      true: 'flex items-center justify-between',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'md',
    dismissible: false,
  },
});

// TypeScript 類型導出
export type VideoUploadContainerProps = VariantProps<
  typeof videoUploadContainer
>;
export type VideoUploadAreaProps = VariantProps<typeof videoUploadArea>;
export type VideoUploadPlayerProps = VariantProps<typeof videoUploadPlayer>;
export type VideoUploadTimelineProps = VariantProps<typeof videoUploadTimeline>;
export type VideoUploadSegmentProps = VariantProps<typeof videoUploadSegment>;
export type VideoUploadProgressProps = VariantProps<typeof videoUploadProgress>;
export type VideoUploadButtonProps = VariantProps<typeof videoUploadButton>;
export type VideoUploadStatusProps = VariantProps<typeof videoUploadStatus>;
