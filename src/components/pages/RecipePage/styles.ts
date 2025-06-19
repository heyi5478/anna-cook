import { cva } from 'class-variance-authority';

/**
 * 定義卡片容器樣式
 */
export const cardStyles = cva('bg-white p-4', {
  variants: {
    spacing: {
      normal: 'mt-2',
      none: '',
    },
    border: {
      default: '',
      rounded: 'rounded-lg',
    },
  },
  defaultVariants: {
    spacing: 'normal',
    border: 'default',
  },
});

/**
 * 定義按鈕互動樣式
 */
export const interactionButtonStyles = cva(
  'flex items-center justify-center gap-2 py-2 rounded-md w-1/3',
  {
    variants: {
      state: {
        active: 'text-primary-500',
        inactive: 'text-neutral-600',
      },
    },
    defaultVariants: {
      state: 'inactive',
    },
  },
);

/**
 * 定義標題樣式
 */
export const headingStyles = cva('font-medium', {
  variants: {
    size: {
      large: 'text-xl mb-1',
      medium: 'text-base mb-2',
      small: 'text-base mb-3',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * 定義分隔項目樣式
 */
export const separatedItemStyles = cva('flex justify-between items-center', {
  variants: {
    spacing: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 定義徽章樣式
 */
export const badgeStyles = cva(
  'rounded-lg py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
  {
    variants: {
      variant: {
        outline: '',
        solid: 'bg-primary-50 text-primary-800',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
);

/**
 * 定義頁面容器樣式
 */
export const pageContainerStyles = 'flex flex-col min-h-screen bg-neutral-50';

/**
 * 定義麵包屑導航樣式
 */
export const breadcrumbStyles =
  'flex items-center text-sm px-4 py-2 text-neutral-500 bg-white';

/**
 * 定義主圖樣式
 */
export const mainImageStyles =
  'relative w-full h-[400px] bg-black rounded-lg overflow-hidden';

/**
 * 定義互動區塊容器樣式
 */
export const interactionContainerStyles = 'flex justify-between';

/**
 * 定義底部導航項目樣式
 */
export const footerNavItemStyles = 'flex flex-col items-center gap-1';

/**
 * 定義食譜信息項目樣式
 */
export const recipeInfoItemStyles = 'flex items-center gap-1';

/**
 * 定義評論列表樣式
 */
export const reviewListStyles = 'space-y-4';

/**
 * 定義作者信息樣式
 */
export const authorContainerStyles = 'flex items-center gap-3';

/**
 * 定義食材列表樣式
 */
export const ingredientListStyles = 'space-y-3';

/**
 * 定義標籤容器樣式
 */
export const tagsContainerStyles = 'flex flex-wrap gap-[10px]';
