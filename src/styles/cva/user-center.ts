import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 用戶中心頁面的樣式變體定義
 * 用於用戶個人資料、收藏、草稿等相關功能的樣式管理
 */

// 用戶中心主容器樣式變體
export const userCenterContainer = cva('w-full mx-auto bg-white', {
  variants: {
    variant: {
      default: 'max-w-7xl',
      compact: 'max-w-5xl',
      wide: 'max-w-full',
    },
    layout: {
      grid: 'grid grid-cols-1 lg:grid-cols-4 gap-6',
      stack: 'flex flex-col space-y-6',
      sidebar: 'grid grid-cols-1 md:grid-cols-3 gap-6',
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
    layout: 'grid',
    padding: 'md',
  },
});

// 側邊欄樣式變體
export const userCenterSidebar = cva(
  'bg-white rounded-lg shadow-sm border border-gray-200',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        minimal: 'p-3 border-none shadow-none',
      },
      position: {
        left: 'order-first',
        right: 'order-last',
        top: 'order-first lg:order-none',
      },
      sticky: {
        true: 'sticky top-6',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'left',
      sticky: false,
    },
  },
);

// 內容區域樣式變體
export const userCenterContent = cva('bg-white rounded-lg shadow-sm', {
  variants: {
    variant: {
      default: 'border border-gray-200 p-6',
      minimal: 'p-4',
      card: 'border border-gray-200 p-8 shadow-md',
    },
    spacing: {
      tight: 'space-y-4',
      normal: 'space-y-6',
      loose: 'space-y-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'normal',
  },
});

// 標籤頁樣式變體
export const userCenterTab = cva(
  'px-4 py-2 font-medium rounded-t-lg transition-colors duration-200 focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700',
        active: 'border-b-2 border-blue-500 text-blue-600 bg-blue-50',
        inactive: 'text-gray-500 hover:text-gray-700',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

// 卡片列表項目樣式變體
export const userCenterCard = cva(
  'bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'p-4 hover:border-gray-300',
        featured: 'p-6 border-blue-200 bg-blue-50',
        minimal: 'p-3 border-gray-100',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      spacing: {
        tight: 'mb-3',
        normal: 'mb-4',
        loose: 'mb-6',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.02] hover:shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      spacing: 'normal',
      interactive: false,
    },
  },
);

// 用戶統計數據樣式變體
export const userCenterStats = cva('text-center p-4 rounded-lg', {
  variants: {
    variant: {
      default: 'bg-gray-50 border border-gray-200',
      primary: 'bg-blue-50 border border-blue-200',
      success: 'bg-green-50 border border-green-200',
      warning: 'bg-yellow-50 border border-yellow-200',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
    layout: {
      vertical: 'flex flex-col space-y-2',
      horizontal: 'flex items-center justify-between',
      grid: 'grid grid-cols-2 gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    layout: 'vertical',
  },
});

// 動作按鈕樣式變體
export const userCenterAction = cva(
  'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline:
          'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        fit: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      width: 'auto',
    },
  },
);

// TypeScript 類型導出
export type UserCenterContainerProps = VariantProps<typeof userCenterContainer>;
export type UserCenterSidebarProps = VariantProps<typeof userCenterSidebar>;
export type UserCenterContentProps = VariantProps<typeof userCenterContent>;
export type UserCenterTabProps = VariantProps<typeof userCenterTab>;
export type UserCenterCardProps = VariantProps<typeof userCenterCard>;
export type UserCenterStatsProps = VariantProps<typeof userCenterStats>;
export type UserCenterActionProps = VariantProps<typeof userCenterAction>;
