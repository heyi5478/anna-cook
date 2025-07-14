import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 食譜頁面的樣式變體定義
 * 用於食譜詳細頁面、食譜展示等相關功能的樣式管理
 */

// 食譜頁面主容器樣式變體
export const recipePageContainer = cva('w-full mx-auto bg-white', {
  variants: {
    variant: {
      default: 'max-w-6xl',
      compact: 'max-w-4xl',
      wide: 'max-w-7xl',
      full: 'max-w-full',
    },
    layout: {
      single: 'grid grid-cols-1',
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

// 食譜標題區域樣式變體
export const recipePageHeader = cva('mb-8 text-center', {
  variants: {
    variant: {
      default: 'border-b border-gray-200 pb-6',
      minimal: 'pb-4',
      featured: 'bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg mb-8',
    },
    alignment: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'default',
    alignment: 'center',
  },
});

// 食譜內容卡片樣式變體
export const recipePageCard = cva(
  'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        elevated: 'shadow-md border-gray-300',
        flat: 'shadow-none border-gray-100',
        highlighted: 'border-blue-200 bg-blue-50',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      spacing: {
        tight: 'mb-4',
        normal: 'mb-6',
        loose: 'mb-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      spacing: 'normal',
    },
  },
);

// 食材列表樣式變體
export const recipePageIngredient = cva(
  'flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-b-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-50',
        highlighted: 'bg-yellow-50 border-yellow-200',
        checked: 'bg-green-50 border-green-200 line-through text-gray-500',
      },
      size: {
        sm: 'py-2 px-3 text-sm',
        md: 'py-3 px-4',
        lg: 'py-4 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

// 步驟列表樣式變體
export const recipePageStep = cva('mb-6 p-5 bg-gray-50 rounded-lg border-l-4', {
  variants: {
    variant: {
      default: 'border-l-blue-500',
      active: 'border-l-green-500 bg-green-50',
      completed: 'border-l-gray-400 bg-gray-100 opacity-75',
      highlighted: 'border-l-orange-500 bg-orange-50',
    },
    size: {
      sm: 'mb-4 p-3',
      md: 'mb-6 p-5',
      lg: 'mb-8 p-7',
    },
    layout: {
      vertical: 'flex flex-col space-y-3',
      horizontal: 'flex items-center space-x-4',
      grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    layout: 'vertical',
  },
});

// 評分星級樣式變體
export const recipePageRating = cva('flex items-center space-x-1', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    color: {
      yellow: 'text-yellow-400',
      orange: 'text-orange-400',
      red: 'text-red-400',
    },
    interactive: {
      true: 'cursor-pointer hover:scale-110 transition-transform',
      false: 'cursor-default',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'yellow',
    interactive: false,
  },
});

// TypeScript 類型導出
export type RecipePageContainerProps = VariantProps<typeof recipePageContainer>;
export type RecipePageHeaderProps = VariantProps<typeof recipePageHeader>;
export type RecipePageCardProps = VariantProps<typeof recipePageCard>;
export type RecipePageIngredientProps = VariantProps<
  typeof recipePageIngredient
>;
export type RecipePageStepProps = VariantProps<typeof recipePageStep>;
export type RecipePageRatingProps = VariantProps<typeof recipePageRating>;
