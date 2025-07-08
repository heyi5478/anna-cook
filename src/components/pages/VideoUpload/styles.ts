import { cva } from 'class-variance-authority';

// 視頻編輯器主容器樣式變體
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

// 視頻播放器容器樣式變體
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

// 視頻播放器容器樣式變體
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

// 播放控制按鈕樣式變體
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

// 上傳區域樣式變體
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

// 上傳容器樣式變體
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

// 控制按鈕樣式變體
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

// 進度指示器樣式變體
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

// 錯誤訊息樣式變體
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

// 時間顯示樣式變體
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

// Debug 按鈕樣式變體
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

// 步驟指示器容器樣式變體
export const stepIndicatorContainerVariants = cva('px-4 py-6');

// 內容區域樣式變體
export const contentAreaVariants = cva('px-4 space-y-4');
