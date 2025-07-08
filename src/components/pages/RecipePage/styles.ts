import { cva } from 'class-variance-authority';

/**
 * 食譜頁面卡片容器樣式
 */
export const cardStyles = cva('bg-white p-4', {
  variants: {
    spacing: {
      none: '',
      normal: 'mt-2',
      relaxed: 'mt-4',
    },
    border: {
      default: '',
      rounded: 'rounded-lg',
      shadow: 'shadow-sm',
    },
    padding: {
      default: 'p-4',
      compact: 'p-2',
      relaxed: 'p-6',
    },
  },
  defaultVariants: {
    spacing: 'normal',
    border: 'default',
    padding: 'default',
  },
});

/**
 * 食譜頁面按鈕互動樣式
 */
export const interactionButtonStyles = cva(
  'flex items-center justify-center gap-2 py-2 rounded-md w-1/3 transition-colors',
  {
    variants: {
      state: {
        active: 'text-primary-500',
        inactive: 'text-neutral-600 hover:text-neutral-800',
      },
      size: {
        default: 'py-2',
        compact: 'py-1',
        relaxed: 'py-3',
      },
    },
    defaultVariants: {
      state: 'inactive',
      size: 'default',
    },
  },
);

/**
 * 食譜頁面標題樣式
 */
export const headingStyles = cva('font-medium', {
  variants: {
    size: {
      small: 'text-base mb-3',
      medium: 'text-base mb-2',
      large: 'text-xl mb-1',
      extraLarge: 'text-2xl mb-2',
    },
    weight: {
      normal: 'font-medium',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'medium',
    weight: 'normal',
  },
});

/**
 * 食譜頁面分隔項目樣式
 */
export const separatedItemStyles = cva('flex justify-between items-center', {
  variants: {
    spacing: {
      default: '',
      compact: 'py-1',
      relaxed: 'py-2',
    },
    alignment: {
      default: 'items-center',
      start: 'items-start',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    spacing: 'default',
    alignment: 'default',
  },
});

/**
 * 食譜頁面徽章樣式
 */
export const badgeStyles = cva(
  'rounded-lg py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors',
  {
    variants: {
      variant: {
        outline: '',
        solid: 'bg-primary-50 text-primary-800 hover:bg-primary-100',
        ghost: 'bg-transparent border border-neutral-200',
      },
      size: {
        default: 'py-2 px-4',
        compact: 'py-1 px-2 text-sm',
        large: 'py-3 px-6',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
);

/**
 * 食譜頁面容器樣式
 */
export const pageContainerStyles = cva(
  'flex flex-col min-h-screen bg-neutral-50',
  {
    variants: {
      background: {
        default: 'bg-neutral-50',
        white: 'bg-white',
        gray: 'bg-gray-50',
      },
    },
    defaultVariants: {
      background: 'default',
    },
  },
);

/**
 * 食譜頁面麵包屑導航樣式
 */
export const breadcrumbStyles = cva(
  'flex items-center text-sm px-4 py-2 text-neutral-500 bg-white',
  {
    variants: {
      spacing: {
        default: 'px-4 py-2',
        compact: 'px-2 py-1',
        relaxed: 'px-6 py-3',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  },
);

/**
 * 食譜頁面主圖樣式
 */
export const mainImageStyles = cva(
  'relative w-full h-[400px] bg-black rounded-lg overflow-hidden',
  {
    variants: {
      height: {
        default: 'h-[400px]',
        compact: 'h-[300px]',
        large: 'h-[500px]',
      },
      radius: {
        default: 'rounded-lg',
        none: 'rounded-none',
        full: 'rounded-xl',
      },
    },
    defaultVariants: {
      height: 'default',
      radius: 'default',
    },
  },
);

/**
 * 食譜頁面互動區塊容器樣式
 */
export const interactionContainerStyles = cva('flex justify-between', {
  variants: {
    spacing: {
      default: '',
      withGap: 'gap-4',
      withPadding: 'px-4',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜頁面底部導航項目樣式
 */
export const footerNavItemStyles = cva('flex flex-col items-center gap-1', {
  variants: {
    spacing: {
      default: 'gap-1',
      compact: 'gap-0.5',
      relaxed: 'gap-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜頁面資訊項目樣式
 */
export const recipeInfoItemStyles = cva('flex items-center gap-1', {
  variants: {
    spacing: {
      default: 'gap-1',
      compact: 'gap-0.5',
      relaxed: 'gap-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜頁面評論列表樣式
 */
export const reviewListStyles = cva('space-y-4', {
  variants: {
    spacing: {
      compact: 'space-y-2',
      default: 'space-y-4',
      relaxed: 'space-y-6',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜頁面作者資訊樣式
 */
export const authorContainerStyles = cva('flex items-center gap-3', {
  variants: {
    spacing: {
      default: 'gap-3',
      compact: 'gap-2',
      relaxed: 'gap-4',
    },
    alignment: {
      default: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: {
    spacing: 'default',
    alignment: 'default',
  },
});

/**
 * 食譜頁面食材列表樣式
 */
export const ingredientListStyles = cva('space-y-3', {
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
 * 食譜頁面標籤容器樣式
 */
export const tagsContainerStyles = cva('flex flex-wrap gap-[10px]', {
  variants: {
    spacing: {
      default: 'gap-[10px]',
      compact: 'gap-1',
      relaxed: 'gap-3',
    },
    alignment: {
      default: '',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
  defaultVariants: {
    spacing: 'default',
    alignment: 'default',
  },
});
