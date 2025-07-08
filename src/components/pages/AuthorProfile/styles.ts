import { cva } from 'class-variance-authority';

/**
 * 作者資料頁面主容器樣式
 */
export const profileContainerVariants = cva('min-h-screen bg-gray-50 pb-8', {
  variants: {
    background: {
      default: 'bg-gray-50',
      light: 'bg-white',
      neutral: 'bg-neutral-50',
    },
    padding: {
      default: 'pb-8',
      compact: 'pb-4',
      relaxed: 'pb-12',
    },
  },
  defaultVariants: {
    background: 'default',
    padding: 'default',
  },
});

/**
 * 作者資料卡片容器樣式
 */
export const authorCardVariants = cva('bg-white p-4', {
  variants: {
    padding: {
      default: 'p-4',
      compact: 'p-2',
      relaxed: 'p-6',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
});

/**
 * 作者資訊區域樣式
 */
export const authorInfoVariants = cva(
  'flex flex-col items-center relative mb-4',
  {
    variants: {
      spacing: {
        default: 'mb-4',
        compact: 'mb-2',
        relaxed: 'mb-6',
      },
      alignment: {
        center: 'items-center',
        start: 'items-start',
        stretch: 'items-stretch',
      },
    },
    defaultVariants: {
      spacing: 'default',
      alignment: 'center',
    },
  },
);

/**
 * 作者統計項目樣式
 */
export const authorStatsVariants = cva(
  'flex gap-4 mb-4 text-sm text-neutral-500',
  {
    variants: {
      spacing: {
        default: 'gap-4 mb-4',
        compact: 'gap-2 mb-2',
        relaxed: 'gap-6 mb-6',
      },
      size: {
        default: 'text-sm',
        large: 'text-base',
        small: 'text-xs',
      },
    },
    defaultVariants: {
      spacing: 'default',
      size: 'default',
    },
  },
);

/**
 * 食譜列表容器樣式
 */
export const recipeListVariants = cva('space-y-3', {
  variants: {
    spacing: {
      compact: 'space-y-2',
      default: 'space-y-3',
      relaxed: 'space-y-4',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜區域容器樣式
 */
export const recipesSectionVariants = cva('mt-6', {
  variants: {
    background: {
      default: 'bg-white',
      gray: 'bg-gray-50',
      transparent: 'bg-transparent',
    },
    spacing: {
      default: 'mt-6',
      compact: 'mt-4',
      relaxed: 'mt-8',
    },
  },
  defaultVariants: {
    background: 'default',
    spacing: 'default',
  },
});

/**
 * 食譜標題容器樣式
 */
export const recipeTitleVariants = cva('bg-white px-4 py-3 mb-2', {
  variants: {
    spacing: {
      default: 'py-3 mb-2',
      compact: 'py-2 mb-1',
      relaxed: 'py-4 mb-3',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 載入更多按鈕樣式
 */
export const loadMoreButtonVariants = cva(
  'flex items-center text-neutral-500 py-2',
  {
    variants: {
      size: {
        default: 'py-2',
        compact: 'py-1',
        relaxed: 'py-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * 載入狀態樣式
 */
export const loadingStateVariants = cva('text-center py-4', {
  variants: {
    state: {
      loading: 'text-neutral-500',
      error: 'text-red-500',
      empty: 'text-neutral-600',
    },
    size: {
      default: 'py-4',
      compact: 'py-2',
      relaxed: 'py-6',
    },
  },
  defaultVariants: {
    state: 'loading',
    size: 'default',
  },
});

/**
 * 作者簡介區域樣式
 */
export const authorBioVariants = cva('mt-8 text-neutral-700 text-sm px-4', {
  variants: {
    spacing: {
      default: 'mt-8 px-4',
      compact: 'mt-4 px-2',
      relaxed: 'mt-12 px-6',
    },
    textSize: {
      default: 'text-sm',
      large: 'text-base',
      small: 'text-xs',
    },
  },
  defaultVariants: {
    spacing: 'default',
    textSize: 'default',
  },
});

/**
 * 分享按鈕樣式
 */
export const shareButtonVariants = cva('absolute right-0 top-4', {
  variants: {
    position: {
      default: 'top-4 right-0',
      center: 'top-4 right-4',
      edge: 'top-2 right-2',
    },
  },
  defaultVariants: {
    position: 'default',
  },
});
