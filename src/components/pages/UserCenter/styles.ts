import { cva } from 'class-variance-authority';

/**
 * 用戶中心麵包屑導航樣式
 */
export const breadcrumbVariants = cva('flex items-center gap-3 mb-4', {
  variants: {
    spacing: {
      default: 'mb-4',
      compact: 'mb-2',
      relaxed: 'mb-6',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 用戶中心標籤頁觸發器樣式
 */
export const tabTriggerVariants = cva(
  'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
  {
    variants: {
      size: {
        default: 'px-3 py-3',
        compact: 'px-2 py-2',
        relaxed: 'px-4 py-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * 用戶中心標籤頁內容容器樣式
 */
export const tabContentVariants = cva('mt-4', {
  variants: {
    padding: {
      default: 'mt-4',
      none: 'mt-4 px-0',
      normal: 'mt-4 px-4',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
});

/**
 * 用戶中心卡片容器樣式
 */
export const cardContainerVariants = cva('space-y-3', {
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
 * 用戶中心統計項目樣式
 */
export const statsItemVariants = cva('flex justify-between items-center', {
  variants: {
    spacing: {
      default: '',
      compact: 'py-1',
      relaxed: 'py-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 用戶中心載入狀態樣式
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
 * 用戶中心區域標題樣式
 */
export const sectionTitleVariants = cva('text-xl font-medium', {
  variants: {
    size: {
      large: 'text-2xl font-bold',
      default: 'text-xl font-medium',
      small: 'text-lg font-medium',
    },
    spacing: {
      default: '',
      withMargin: 'mb-4',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 用戶中心區域容器樣式
 */
export const sectionContainerVariants = cva('mt-4', {
  variants: {
    spacing: {
      default: 'mt-4',
      compact: 'mt-2',
      relaxed: 'mt-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 用戶中心標籤頁列表容器樣式
 */
export const tabsListVariants = cva(
  'flex justify-between mb-0 w-full rounded-none border-b bg-white p-0 h-auto',
  {
    variants: {
      variant: {
        default: '',
        compact: 'mb-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
