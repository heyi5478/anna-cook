import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 作者個人資料頁面的樣式變體定義
 * 用於作者展示、作品列表、關注等相關功能的樣式管理
 */

// 作者個人資料主容器樣式變體
export const authorProfileContainer = cva('w-full mx-auto bg-white', {
  variants: {
    variant: {
      default: 'max-w-6xl',
      wide: 'max-w-7xl',
      full: 'max-w-full',
    },
    layout: {
      single: 'grid grid-cols-1 gap-6',
      sidebar: 'grid grid-cols-1 lg:grid-cols-4 gap-6',
      split: 'grid grid-cols-1 md:grid-cols-2 gap-8',
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

// 作者資訊卡片樣式變體
export const authorProfileHeader = cva(
  'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        featured: 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50',
        minimal: 'border-none shadow-none p-4',
      },
      layout: {
        horizontal: 'flex items-center space-x-6',
        vertical: 'text-center space-y-4',
        split: 'grid grid-cols-1 md:grid-cols-3 gap-6 items-center',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'horizontal',
      size: 'md',
    },
  },
);

// 作者頭像樣式變體
export const authorProfileAvatar = cva(
  'rounded-full border-4 border-white shadow-lg',
  {
    variants: {
      size: {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
        xl: 'w-40 h-40',
      },
      variant: {
        default: 'border-white',
        primary: 'border-blue-500',
        gold: 'border-yellow-400',
      },
      interactive: {
        true: 'hover:scale-105 transition-transform duration-200 cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      variant: 'default',
      interactive: false,
    },
  },
);

// 作者統計數據樣式變體
export const authorProfileStats = cva(
  'flex items-center justify-center text-center p-4 rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 border border-gray-200',
        primary: 'bg-blue-50 border border-blue-200',
        success: 'bg-green-50 border border-green-200',
        featured:
          'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200',
      },
      layout: {
        vertical: 'flex-col space-y-1',
        horizontal: 'flex-row space-x-4',
        grid: 'grid grid-cols-3 gap-4 text-center',
      },
      size: {
        sm: 'p-2 text-sm',
        md: 'p-4',
        lg: 'p-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'vertical',
      size: 'md',
    },
  },
);

// 關注按鈕樣式變體
export const authorProfileFollowButton = cva(
  'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        follow: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        following:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        unfollow:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline:
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
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
      state: {
        default: '',
        loading: 'opacity-70 cursor-not-allowed',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'follow',
      size: 'md',
      width: 'auto',
      state: 'default',
    },
  },
);

// 作品網格樣式變體
export const authorProfileGrid = cva('grid gap-6', {
  variants: {
    columns: {
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 md:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    },
    spacing: {
      tight: 'gap-3',
      normal: 'gap-6',
      loose: 'gap-8',
    },
    responsive: {
      true: 'gap-4 md:gap-6 lg:gap-8',
      false: '',
    },
  },
  defaultVariants: {
    columns: '3',
    spacing: 'normal',
    responsive: true,
  },
});

// 作品卡片樣式變體
export const authorProfileRecipeCard = cva(
  'bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'hover:shadow-md hover:border-gray-300',
        featured: 'border-blue-200 bg-blue-50',
        minimal: 'border-gray-100 shadow-none',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.02] hover:shadow-lg',
        false: '',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: true,
      size: 'md',
    },
  },
);

// 簡介文字樣式變體
export const authorProfileBio = cva('text-gray-600 leading-relaxed', {
  variants: {
    variant: {
      default: '',
      highlighted: 'bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500',
      quote: 'italic bg-gray-50 p-4 rounded-lg border border-gray-200',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    maxLines: {
      '3': 'line-clamp-3',
      '5': 'line-clamp-5',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    maxLines: 'none',
  },
});

// TypeScript 類型導出
export type AuthorProfileContainerProps = VariantProps<
  typeof authorProfileContainer
>;
export type AuthorProfileHeaderProps = VariantProps<typeof authorProfileHeader>;
export type AuthorProfileAvatarProps = VariantProps<typeof authorProfileAvatar>;
export type AuthorProfileStatsProps = VariantProps<typeof authorProfileStats>;
export type AuthorProfileFollowButtonProps = VariantProps<
  typeof authorProfileFollowButton
>;
export type AuthorProfileGridProps = VariantProps<typeof authorProfileGrid>;
export type AuthorProfileRecipeCardProps = VariantProps<
  typeof authorProfileRecipeCard
>;
export type AuthorProfileBioProps = VariantProps<typeof authorProfileBio>;
