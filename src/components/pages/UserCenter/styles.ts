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

/**
 * 草稿標籤頁容器樣式
 */
export const draftTabContainerVariants = cva('space-y-4', {
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
 * 狀態消息樣式
 */
export const statusMessageVariants = cva('p-3 rounded-md mb-4', {
  variants: {
    variant: {
      success: 'bg-green-50 text-green-700',
      error: 'bg-red-50 text-red-700',
      warning: 'bg-yellow-50 text-yellow-700',
    },
    withIcon: {
      true: 'flex items-center',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'success',
    withIcon: false,
  },
});

/**
 * 計數文字樣式
 */
export const countTextVariants = cva('text-neutral-500 mb-2', {
  variants: {
    size: {
      small: 'text-sm',
      default: 'text-base',
      large: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 卡片容器樣式
 */
export const cardContainerBaseVariants = cva(
  'border rounded-lg p-4 flex relative',
  {
    variants: {
      size: {
        small: 'p-3',
        default: 'p-4',
        large: 'p-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * 草稿卡片交互樣式
 */
export const draftCardInteractionVariants = cva(
  'cursor-pointer rounded-md transition-all',
  {
    variants: {
      state: {
        normal: 'hover:bg-gray-50 active:bg-gray-100',
        selected: 'bg-orange-50 border border-orange-200',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

/**
 * 複選框樣式
 */
export const checkboxVariants = cva(
  'mr-2 w-6 h-6 flex-shrink-0 border rounded flex items-center justify-center cursor-pointer',
  {
    variants: {
      state: {
        unchecked: 'border-neutral-300',
        checked: 'bg-orange-500 border-orange-500 text-white',
      },
    },
    defaultVariants: {
      state: 'unchecked',
    },
  },
);

/**
 * 卡片圖片容器樣式
 */
export const cardImageVariants = cva(
  'bg-gray-200 shrink-0 overflow-hidden relative',
  {
    variants: {
      size: {
        small: 'w-[96px] h-[96px] rounded-md',
        large: 'w-[132px] h-[132px] rounded-none',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

/**
 * 卡片內容區域樣式
 */
export const cardContentVariants = cva('flex-1 ml-4 flex flex-col', {
  variants: {
    alignment: {
      default: '',
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: {
    alignment: 'default',
  },
});

/**
 * 卡片標題樣式
 */
export const cardTitleVariants = cva('text-lg font-medium mb-1', {
  variants: {
    size: {
      small: 'text-base',
      default: 'text-lg',
      large: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 卡片描述樣式
 */
export const cardDescriptionVariants = cva(
  'text-neutral-500 text-sm mb-auto line-clamp-2',
  {
    variants: {
      spacing: {
        default: '',
        withMargin: 'mt-3',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  },
);

/**
 * 卡片統計區域樣式
 */
export const cardStatsVariants = cva(
  'flex items-center gap-6 mt-2 text-sm text-neutral-800',
  {
    variants: {
      gap: {
        small: 'gap-3',
        default: 'gap-6',
        large: 'gap-8',
      },
    },
    defaultVariants: {
      gap: 'default',
    },
  },
);

/**
 * 卡片統計項目樣式
 */
export const cardStatsItemVariants = cva('flex items-center gap-1', {
  variants: {
    gap: {
      small: 'gap-0.5',
      default: 'gap-1',
      large: 'gap-2',
    },
  },
  defaultVariants: {
    gap: 'default',
  },
});

/**
 * 卡片操作按鈕樣式
 */
export const cardActionButtonVariants = cva(
  'absolute top-4 right-4 px-5 py-1 h-8 rounded-md font-normal text-sm',
  {
    variants: {
      variant: {
        toDraft:
          'bg-red-50 hover:bg-red-100 text-red-500 border border-red-200',
        toPublish: 'bg-orange-500 hover:bg-orange-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'toDraft',
    },
  },
);

/**
 * 對話框樣式
 */
export const dialogVariants = cva('bg-white rounded-lg p-6', {
  variants: {
    size: {
      small: 'sm:max-w-sm',
      default: 'sm:max-w-md',
      large: 'sm:max-w-lg',
    },
    withBorder: {
      true: 'border border-gray-200 shadow-lg',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    withBorder: false,
  },
});

/**
 * 對話框標題樣式
 */
export const dialogTitleVariants = cva('text-center font-medium mb-2', {
  variants: {
    size: {
      default: 'text-lg',
      large: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 對話框圖標容器樣式
 */
export const dialogIconVariants = cva(
  'rounded-full border-2 border-gray-400 flex items-center justify-center mb-4',
  {
    variants: {
      size: {
        default: 'w-12 h-12',
        large: 'w-16 h-16',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * 對話框按鈕容器樣式
 */
export const dialogButtonContainerVariants = cva(
  'flex justify-between mt-6 space-x-4',
  {
    variants: {
      direction: {
        horizontal: 'flex-row space-x-4',
        vertical: 'flex-col space-y-2 space-x-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      direction: 'horizontal',
      fullWidth: false,
    },
  },
);

/**
 * 對話框操作按鈕樣式
 */
export const dialogActionButtonVariants = cva('flex-1', {
  variants: {
    variant: {
      confirm: 'bg-orange-500 hover:bg-orange-600',
      cancel: 'border border-neutral-200',
      cancelGray: 'border border-neutral-300 text-black font-normal',
      delete: 'bg-zinc-800 hover:bg-zinc-700 text-white font-normal',
    },
  },
  defaultVariants: {
    variant: 'confirm',
  },
});

/**
 * 項目列表容器樣式
 */
export const itemListContainerVariants = cva('flex items-center', {
  variants: {
    spacing: {
      default: '',
      withGap: 'gap-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 項目內容容器樣式
 */
export const itemContentVariants = cva('flex-1', {
  variants: {
    withMargin: {
      true: 'ml-1',
      false: '',
    },
  },
  defaultVariants: {
    withMargin: false,
  },
});

/**
 * 成功狀態容器樣式
 */
export const successStateVariants = cva(
  'flex flex-col items-center justify-center py-8',
  {
    variants: {
      spacing: {
        compact: 'py-4',
        default: 'py-8',
        relaxed: 'py-12',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  },
);

/**
 * 成功狀態標題樣式
 */
export const successTitleVariants = cva(
  'text-lg font-medium text-center mb-2',
  {
    variants: {
      size: {
        default: 'text-lg',
        large: 'text-xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * 成功狀態描述樣式
 */
export const successDescriptionVariants = cva('text-neutral-500 text-center', {
  variants: {
    size: {
      default: 'text-base',
      small: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
