import { cva, type VariantProps } from 'class-variance-authority';

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

/**
 * 收藏標籤頁容器樣式
 */
export const favoriteTabContainerVariants = cva('space-y-2', {
  variants: {
    spacing: {
      compact: 'space-y-1',
      default: 'space-y-2',
      relaxed: 'space-y-3',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 追蹤標籤頁容器樣式
 */
export const followTabContainerVariants = cva('space-y-4', {
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
 * 統計計數文字樣式
 */
export const statsCountTextVariants = cva('text-sm text-neutral-500 mb-1', {
  variants: {
    size: {
      small: 'text-xs',
      default: 'text-sm',
      large: 'text-base',
    },
    spacing: {
      default: 'mb-1',
      compact: 'mb-0.5',
      relaxed: 'mb-2',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 收藏項目容器樣式
 */
export const favoriteItemContainerVariants = cva(
  'flex border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer',
  {
    variants: {
      state: {
        default: 'hover:bg-gray-50',
        active: 'bg-gray-100',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      border: {
        default: 'border',
        none: 'border-0',
        thick: 'border-2',
      },
    },
    defaultVariants: {
      state: 'default',
      border: 'default',
    },
  },
);

/**
 * 追蹤項目容器樣式
 */
export const followItemContainerVariants = cva(
  'hover:bg-gray-50 rounded-md transition-colors cursor-pointer',
  {
    variants: {
      state: {
        default: 'hover:bg-gray-50',
        active: 'bg-gray-100',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

/**
 * 項目圖片容器樣式
 */
export const itemImageContainerVariants = cva('bg-gray-200 shrink-0 relative', {
  variants: {
    size: {
      small: 'w-16 h-16',
      default: 'w-20 h-20',
      large: 'w-24 h-24',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 項目內容區域樣式
 */
export const itemContentAreaVariants = cva('flex-1 p-2', {
  variants: {
    padding: {
      compact: 'p-1',
      default: 'p-2',
      relaxed: 'p-3',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
});

/**
 * 項目標題行樣式
 */
export const itemTitleRowVariants = cva('flex justify-between', {
  variants: {
    alignment: {
      default: 'justify-between',
      start: 'justify-start',
      center: 'justify-center',
    },
  },
  defaultVariants: {
    alignment: 'default',
  },
});

/**
 * 項目標題樣式
 */
export const itemTitleVariants = cva('font-medium', {
  variants: {
    size: {
      small: 'text-sm font-medium',
      default: 'text-base font-medium',
      large: 'text-lg font-medium',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 項目圖標樣式
 */
export const itemIconVariants = cva('', {
  variants: {
    size: {
      small: 'h-3 w-3',
      default: 'h-4 w-4',
      large: 'h-5 w-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 項目描述文字樣式
 */
export const itemDescriptionVariants = cva(
  'text-xs text-neutral-500 line-clamp-2',
  {
    variants: {
      size: {
        small: 'text-xs',
        default: 'text-sm',
      },
      lines: {
        single: 'line-clamp-1',
        default: 'line-clamp-2',
        multiple: 'line-clamp-3',
      },
    },
    defaultVariants: {
      size: 'small',
      lines: 'default',
    },
  },
);

/**
 * 項目統計資訊行樣式
 */
export const itemStatsRowVariants = cva(
  'flex items-center mt-1 text-xs text-neutral-500',
  {
    variants: {
      spacing: {
        compact: 'mt-0.5',
        default: 'mt-1',
        relaxed: 'mt-2',
      },
      size: {
        small: 'text-xs',
        default: 'text-sm',
      },
    },
    defaultVariants: {
      spacing: 'default',
      size: 'small',
    },
  },
);

/**
 * 統計項目圖標樣式
 */
export const statsIconVariants = cva('h-3 w-3 mr-1', {
  variants: {
    size: {
      small: 'h-3 w-3',
      default: 'h-4 w-4',
    },
    spacing: {
      default: 'mr-1',
      compact: 'mr-0.5',
      relaxed: 'mr-2',
    },
  },
  defaultVariants: {
    size: 'small',
    spacing: 'default',
  },
});

/**
 * 統計項目間距樣式
 */
export const statsItemSpacingVariants = cva('mr-2', {
  variants: {
    spacing: {
      compact: 'mr-1',
      default: 'mr-2',
      relaxed: 'mr-3',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 載入更多狀態樣式
 */
export const loadMoreStateVariants = cva('text-center py-4', {
  variants: {
    state: {
      loading: 'text-neutral-500',
      error: 'text-red-500',
    },
    spacing: {
      compact: 'py-2',
      default: 'py-4',
      relaxed: 'py-6',
    },
  },
  defaultVariants: {
    state: 'loading',
    spacing: 'default',
  },
});

/**
 * 載入更多按鈕樣式
 */
export const loadMoreButtonVariants = cva(
  'w-full py-2 flex items-center justify-center gap-1 text-neutral-500',
  {
    variants: {
      size: {
        compact: 'py-1',
        default: 'py-2',
        relaxed: 'py-3',
      },
      gap: {
        small: 'gap-0.5',
        default: 'gap-1',
        large: 'gap-2',
      },
    },
    defaultVariants: {
      size: 'default',
      gap: 'default',
    },
  },
);

/**
 * 空狀態樣式（重用現有的 loadingStateVariants）
 */
export const tabEmptyStateVariants = cva('text-center py-8', {
  variants: {
    type: {
      loading: 'text-neutral-500',
      error: 'text-red-500',
      empty: 'text-neutral-600',
    },
    spacing: {
      compact: 'py-4',
      default: 'py-8',
      relaxed: 'py-12',
    },
  },
  defaultVariants: {
    type: 'empty',
    spacing: 'default',
  },
});

/**
 * 數據標籤頁容器樣式
 */
export const dataTabContainerVariants = cva('space-y-6', {
  variants: {
    spacing: {
      compact: 'space-y-4',
      default: 'space-y-6',
      relaxed: 'space-y-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 數據標題樣式
 */
export const dataTitleVariants = cva('text-lg font-bold mb-1', {
  variants: {
    size: {
      small: 'text-base font-semibold',
      default: 'text-lg font-bold',
      large: 'text-xl font-bold',
    },
    spacing: {
      default: 'mb-1',
      compact: 'mb-0.5',
      relaxed: 'mb-2',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 數據描述樣式
 */
export const dataDescriptionVariants = cva('text-neutral-500', {
  variants: {
    size: {
      small: 'text-sm text-neutral-500',
      default: 'text-base text-neutral-500',
      large: 'text-lg text-neutral-500',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 數據卡片容器樣式
 */
export const dataCardContainerVariants = cva(
  'hover:bg-gray-50 rounded-md transition-colors cursor-pointer',
  {
    variants: {
      hover: {
        default: 'hover:bg-gray-50',
        subtle: 'hover:bg-neutral-50',
        none: '',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      hover: 'default',
      interactive: true,
    },
  },
);

/**
 * 食譜統計項目容器樣式
 */
export const recipeStatsContainerVariants = cva('mb-6', {
  variants: {
    spacing: {
      compact: 'mb-4',
      default: 'mb-6',
      relaxed: 'mb-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜資訊容器樣式
 */
export const recipeInfoContainerVariants = cva('flex items-center gap-4 mb-3', {
  variants: {
    gap: {
      compact: 'gap-2',
      default: 'gap-4',
      relaxed: 'gap-6',
    },
    spacing: {
      compact: 'mb-2',
      default: 'mb-3',
      relaxed: 'mb-4',
    },
  },
  defaultVariants: {
    gap: 'default',
    spacing: 'default',
  },
});

/**
 * 食譜圖片容器樣式
 */
export const recipeImageContainerVariants = cva(
  'w-20 h-20 bg-gray-200 shrink-0 rounded-md overflow-hidden relative',
  {
    variants: {
      size: {
        small: 'w-16 h-16',
        default: 'w-20 h-20',
        large: 'w-24 h-24',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * 食譜圖片樣式
 */
export const recipeImageVariants = cva('object-cover', {
  variants: {
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
    },
  },
  defaultVariants: {
    fit: 'cover',
  },
});

/**
 * 食譜內容容器樣式
 */
export const recipeContentContainerVariants = cva('flex-1', {
  variants: {
    spacing: {
      default: '',
      padded: 'px-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 食譜標題樣式
 */
export const recipeTitleVariants = cva('text-lg font-medium mb-1', {
  variants: {
    size: {
      small: 'text-base font-medium',
      default: 'text-lg font-medium',
      large: 'text-xl font-medium',
    },
    spacing: {
      default: 'mb-1',
      compact: 'mb-0.5',
      relaxed: 'mb-2',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 食譜評分資訊樣式
 */
export const recipeRatingInfoVariants = cva('text-sm text-neutral-500', {
  variants: {
    size: {
      small: 'text-xs text-neutral-500',
      default: 'text-sm text-neutral-500',
      large: 'text-base text-neutral-500',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 統計網格樣式
 */
export const statsGridVariants = cva('grid grid-cols-3 gap-2', {
  variants: {
    columns: {
      two: 'grid-cols-2',
      three: 'grid-cols-3',
      four: 'grid-cols-4',
    },
    gap: {
      compact: 'gap-1',
      default: 'gap-2',
      relaxed: 'gap-3',
    },
  },
  defaultVariants: {
    columns: 'three',
    gap: 'default',
  },
});

/**
 * 統計項目樣式
 */
export const statsItemCardVariants = cva(
  'bg-gray-50 p-3 text-center rounded-md',
  {
    variants: {
      background: {
        default: 'bg-gray-50',
        light: 'bg-neutral-50',
        white: 'bg-white',
      },
      padding: {
        compact: 'p-2',
        default: 'p-3',
        relaxed: 'p-4',
      },
    },
    defaultVariants: {
      background: 'default',
      padding: 'default',
    },
  },
);

/**
 * 統計標籤樣式
 */
export const statsLabelVariants = cva('text-xs text-neutral-500 mb-1', {
  variants: {
    size: {
      small: 'text-xs',
      default: 'text-sm',
    },
    spacing: {
      default: 'mb-1',
      compact: 'mb-0.5',
      relaxed: 'mb-2',
    },
  },
  defaultVariants: {
    size: 'small',
    spacing: 'default',
  },
});

/**
 * 統計數值樣式
 */
export const statsValueVariants = cva('text-lg font-medium', {
  variants: {
    size: {
      small: 'text-base font-medium',
      default: 'text-lg font-medium',
      large: 'text-xl font-medium',
    },
    color: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-neutral-600',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
  },
});

/**
 * 用戶卡片容器樣式
 */
export const userCardContainerVariants = cva(
  'border rounded-lg p-4 flex items-center',
  {
    variants: {
      variant: {
        default: 'border rounded-lg',
        outlined: 'border-2 rounded-lg',
        subtle: 'border-neutral-200 rounded-lg',
      },
      padding: {
        compact: 'p-3',
        default: 'p-4',
        relaxed: 'p-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  },
);

/**
 * 用戶頭像容器樣式
 */
export const userAvatarContainerVariants = cva('w-14 h-14 mr-3', {
  variants: {
    size: {
      small: 'w-12 h-12',
      default: 'w-14 h-14',
      large: 'w-16 h-16',
    },
    spacing: {
      compact: 'mr-2',
      default: 'mr-3',
      relaxed: 'mr-4',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 用戶資訊容器樣式
 */
export const userInfoContainerVariants = cva('flex-1', {
  variants: {
    spacing: {
      default: '',
      padded: 'px-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * 用戶名樣式
 */
export const usernameVariants = cva('text-lg font-medium', {
  variants: {
    size: {
      small: 'text-base font-medium',
      default: 'text-lg font-medium',
      large: 'text-xl font-medium',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * 用戶個人簡介樣式
 */
export const userBioVariants = cva(
  'text-neutral-500 text-sm line-clamp-1 mb-1',
  {
    variants: {
      size: {
        small: 'text-xs',
        default: 'text-sm',
        large: 'text-base',
      },
      lines: {
        single: 'line-clamp-1',
        double: 'line-clamp-2',
        triple: 'line-clamp-3',
      },
      spacing: {
        default: 'mb-1',
        compact: 'mb-0.5',
        relaxed: 'mb-2',
      },
    },
    defaultVariants: {
      size: 'default',
      lines: 'single',
      spacing: 'default',
    },
  },
);

/**
 * 用戶統計資訊樣式
 */
export const userStatsVariants = cva('flex gap-4 text-sm text-neutral-500', {
  variants: {
    gap: {
      compact: 'gap-2',
      default: 'gap-4',
      relaxed: 'gap-6',
    },
    size: {
      small: 'text-xs',
      default: 'text-sm',
      large: 'text-base',
    },
  },
  defaultVariants: {
    gap: 'default',
    size: 'default',
  },
});

/**
 * 已發布標籤頁容器樣式
 */
export const publishedTabContainerVariants = cva('space-y-4', {
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
 * 已發布計數文字樣式
 */
export const publishedCountTextVariants = cva('text-neutral-500 mb-2', {
  variants: {
    size: {
      small: 'text-sm text-neutral-500',
      default: 'text-base text-neutral-500',
      large: 'text-lg text-neutral-500',
    },
    spacing: {
      default: 'mb-2',
      compact: 'mb-1',
      relaxed: 'mb-3',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 已發布卡片容器樣式
 */
export const publishedCardContainerVariants = cva(
  'hover:bg-gray-50 rounded-md transition-colors cursor-pointer',
  {
    variants: {
      hover: {
        default: 'hover:bg-gray-50',
        subtle: 'hover:bg-neutral-50',
        none: '',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      hover: 'default',
      interactive: true,
    },
  },
);

// ================== TypeScript 類型定義 ==================

export type BreadcrumbVariantsProps = VariantProps<typeof breadcrumbVariants>;
export type TabTriggerVariantsProps = VariantProps<typeof tabTriggerVariants>;
export type TabContentVariantsProps = VariantProps<typeof tabContentVariants>;
export type CardContainerVariantsProps = VariantProps<
  typeof cardContainerVariants
>;
export type StatsItemVariantsProps = VariantProps<typeof statsItemVariants>;
export type LoadingStateVariantsProps = VariantProps<
  typeof loadingStateVariants
>;
export type SectionTitleVariantsProps = VariantProps<
  typeof sectionTitleVariants
>;
export type SectionContainerVariantsProps = VariantProps<
  typeof sectionContainerVariants
>;
export type TabsListVariantsProps = VariantProps<typeof tabsListVariants>;
export type DraftTabContainerVariantsProps = VariantProps<
  typeof draftTabContainerVariants
>;
export type StatusMessageVariantsProps = VariantProps<
  typeof statusMessageVariants
>;
export type CountTextVariantsProps = VariantProps<typeof countTextVariants>;
export type CardContainerBaseVariantsProps = VariantProps<
  typeof cardContainerBaseVariants
>;
export type DraftCardInteractionVariantsProps = VariantProps<
  typeof draftCardInteractionVariants
>;
export type CheckboxVariantsProps = VariantProps<typeof checkboxVariants>;
export type CardImageVariantsProps = VariantProps<typeof cardImageVariants>;
export type CardContentVariantsProps = VariantProps<typeof cardContentVariants>;
export type CardTitleVariantsProps = VariantProps<typeof cardTitleVariants>;
export type CardDescriptionVariantsProps = VariantProps<
  typeof cardDescriptionVariants
>;
export type CardStatsVariantsProps = VariantProps<typeof cardStatsVariants>;
export type CardStatsItemVariantsProps = VariantProps<
  typeof cardStatsItemVariants
>;
export type CardActionButtonVariantsProps = VariantProps<
  typeof cardActionButtonVariants
>;
export type DialogVariantsProps = VariantProps<typeof dialogVariants>;
export type DialogTitleVariantsProps = VariantProps<typeof dialogTitleVariants>;
export type DialogIconVariantsProps = VariantProps<typeof dialogIconVariants>;
export type DialogButtonContainerVariantsProps = VariantProps<
  typeof dialogButtonContainerVariants
>;
export type DialogActionButtonVariantsProps = VariantProps<
  typeof dialogActionButtonVariants
>;
export type ItemListContainerVariantsProps = VariantProps<
  typeof itemListContainerVariants
>;
export type ItemContentVariantsProps = VariantProps<typeof itemContentVariants>;
export type SuccessStateVariantsProps = VariantProps<
  typeof successStateVariants
>;
export type SuccessTitleVariantsProps = VariantProps<
  typeof successTitleVariants
>;
export type SuccessDescriptionVariantsProps = VariantProps<
  typeof successDescriptionVariants
>;
export type FavoriteTabContainerVariantsProps = VariantProps<
  typeof favoriteTabContainerVariants
>;
export type FollowTabContainerVariantsProps = VariantProps<
  typeof followTabContainerVariants
>;
export type StatsCountTextVariantsProps = VariantProps<
  typeof statsCountTextVariants
>;
export type FavoriteItemContainerVariantsProps = VariantProps<
  typeof favoriteItemContainerVariants
>;
export type FollowItemContainerVariantsProps = VariantProps<
  typeof followItemContainerVariants
>;
export type ItemImageContainerVariantsProps = VariantProps<
  typeof itemImageContainerVariants
>;
export type ItemContentAreaVariantsProps = VariantProps<
  typeof itemContentAreaVariants
>;
export type ItemTitleRowVariantsProps = VariantProps<
  typeof itemTitleRowVariants
>;
export type ItemTitleVariantsProps = VariantProps<typeof itemTitleVariants>;
export type ItemIconVariantsProps = VariantProps<typeof itemIconVariants>;
export type ItemDescriptionVariantsProps = VariantProps<
  typeof itemDescriptionVariants
>;
export type ItemStatsRowVariantsProps = VariantProps<
  typeof itemStatsRowVariants
>;
export type StatsIconVariantsProps = VariantProps<typeof statsIconVariants>;
export type StatsItemSpacingVariantsProps = VariantProps<
  typeof statsItemSpacingVariants
>;
export type LoadMoreStateVariantsProps = VariantProps<
  typeof loadMoreStateVariants
>;
export type LoadMoreButtonVariantsProps = VariantProps<
  typeof loadMoreButtonVariants
>;
export type TabEmptyStateVariantsProps = VariantProps<
  typeof tabEmptyStateVariants
>;
export type DataTabContainerVariantsProps = VariantProps<
  typeof dataTabContainerVariants
>;
export type DataTitleVariantsProps = VariantProps<typeof dataTitleVariants>;
export type DataDescriptionVariantsProps = VariantProps<
  typeof dataDescriptionVariants
>;
export type DataCardContainerVariantsProps = VariantProps<
  typeof dataCardContainerVariants
>;
export type RecipeStatsContainerVariantsProps = VariantProps<
  typeof recipeStatsContainerVariants
>;
export type RecipeInfoContainerVariantsProps = VariantProps<
  typeof recipeInfoContainerVariants
>;
export type RecipeImageContainerVariantsProps = VariantProps<
  typeof recipeImageContainerVariants
>;
export type RecipeImageVariantsProps = VariantProps<typeof recipeImageVariants>;
export type RecipeContentContainerVariantsProps = VariantProps<
  typeof recipeContentContainerVariants
>;
export type RecipeTitleVariantsProps = VariantProps<typeof recipeTitleVariants>;
export type RecipeRatingInfoVariantsProps = VariantProps<
  typeof recipeRatingInfoVariants
>;
export type StatsGridVariantsProps = VariantProps<typeof statsGridVariants>;
export type StatsItemCardVariantsProps = VariantProps<
  typeof statsItemCardVariants
>;
export type StatsLabelVariantsProps = VariantProps<typeof statsLabelVariants>;
export type StatsValueVariantsProps = VariantProps<typeof statsValueVariants>;
export type UserCardContainerVariantsProps = VariantProps<
  typeof userCardContainerVariants
>;
export type UserAvatarContainerVariantsProps = VariantProps<
  typeof userAvatarContainerVariants
>;
export type UserInfoContainerVariantsProps = VariantProps<
  typeof userInfoContainerVariants
>;
export type UsernameVariantsProps = VariantProps<typeof usernameVariants>;
export type UserBioVariantsProps = VariantProps<typeof userBioVariants>;
export type UserStatsVariantsProps = VariantProps<typeof userStatsVariants>;
export type PublishedTabContainerVariantsProps = VariantProps<
  typeof publishedTabContainerVariants
>;
export type PublishedCountTextVariantsProps = VariantProps<
  typeof publishedCountTextVariants
>;
export type PublishedCardContainerVariantsProps = VariantProps<
  typeof publishedCardContainerVariants
>;
