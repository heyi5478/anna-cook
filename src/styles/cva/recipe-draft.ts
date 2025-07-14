import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 頁面容器樣式變體 - 用於主要頁面佈局
 */
export const draftPageVariants = cva(
  // 基礎樣式
  'flex flex-col bg-white',
  {
    variants: {
      layout: {
        default: 'min-h-screen',
        contained: 'min-h-[80vh]',
        compact: 'min-h-[60vh]',
      },
      state: {
        default: '',
        loading: 'cursor-wait',
        error: 'bg-red-50',
        disabled: 'opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      layout: 'default',
      state: 'default',
    },
  },
);

/**
 * 區塊容器樣式變體 - 用於表單區塊和內容容器
 */
export const draftSectionVariants = cva(
  // 基礎樣式
  'mb-4',
  {
    variants: {
      layout: {
        default: '',
        grid: 'grid grid-cols-2 gap-4',
        flexBetween: 'flex items-center justify-between',
        flexCenter: 'flex justify-center items-center',
        mainContent: 'flex-1 p-4',
        formContainer: 'max-w-md mx-auto',
        fullWidth: 'w-full',
      },
      spacing: {
        sm: 'mb-2',
        default: 'mb-4',
        lg: 'mb-6',
        none: 'mb-0',
      },
      state: {
        default: '',
        loading: 'animate-pulse',
        error: 'border-red-200 bg-red-50',
        disabled: 'opacity-50',
      },
    },
    defaultVariants: {
      layout: 'default',
      spacing: 'default',
      state: 'default',
    },
  },
);

/**
 * 表單欄位樣式變體 - 替換所有 bg-neutral-50 等硬編碼樣式
 */
export const draftFieldVariants = cva(
  // 基礎樣式
  'bg-neutral-50',
  {
    variants: {
      size: {
        sm: 'w-16 mr-2',
        default: 'w-20 mr-2',
        lg: 'w-32 mr-2',
        full: 'w-full',
        flex: 'flex-1 mr-2',
      },
      type: {
        default: '',
        textarea: 'min-h-[64px]',
        readonly: 'bg-neutral-50 rounded border p-2',
        description: 'p-3 bg-neutral-50 rounded border min-h-[100px]',
      },
      state: {
        default: '',
        error: 'border-red-300 bg-red-50',
        disabled: 'opacity-50 cursor-not-allowed bg-gray-100',
        loading: 'opacity-70',
      },
    },
    defaultVariants: {
      size: 'default',
      type: 'default',
      state: 'default',
    },
  },
);

/**
 * 按鈕樣式變體 - 統一按鈕樣式管理
 */
export const draftButtonVariants = cva(
  // 基礎樣式
  'transition-colors',
  {
    variants: {
      size: {
        sm: 'p-1',
        default: 'px-4 py-2',
        lg: 'px-6 py-3',
        icon: 'p-1',
      },
      width: {
        auto: '',
        full: 'w-full',
      },
      spacing: {
        default: '',
        top: 'mt-2',
        bottom: 'mb-4',
        both: 'mt-2 mb-4',
      },
      variant: {
        default: '',
        neutral: 'text-neutral-500',
        danger: 'text-red-500 hover:text-red-700',
        edit: 'mr-2 p-1 text-neutral-500 z-10',
      },
      state: {
        default: '',
        loading: 'opacity-50 cursor-not-allowed',
        disabled: 'opacity-50 pointer-events-none',
        error: '',
      },
    },
    defaultVariants: {
      size: 'default',
      width: 'auto',
      spacing: 'default',
      variant: 'default',
      state: 'default',
    },
  },
);

/**
 * 標籤樣式變體 - 用於各種標籤和標題
 */
export const draftLabelVariants = cva(
  // 基礎樣式
  'font-medium',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-lg',
        lg: 'text-xl',
        xs: 'text-xs',
      },
      spacing: {
        default: 'mb-2',
        tight: 'mb-1',
        none: 'mb-0',
        loose: 'mb-4',
      },
      display: {
        default: '',
        block: 'block',
        inline: 'inline',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
      },
      position: {
        default: '',
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      state: {
        default: '',
        error: 'text-red-600',
        disabled: 'text-gray-400',
        loading: 'animate-pulse',
      },
    },
    defaultVariants: {
      size: 'default',
      spacing: 'default',
      display: 'default',
      weight: 'medium',
      position: 'default',
      state: 'default',
    },
  },
);

/**
 * 錯誤訊息樣式變體 - 統一錯誤訊息顯示
 */
export const errorMessageVariants = cva(
  // 基礎樣式
  'text-red-500',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      spacing: {
        default: 'mt-1',
        tight: 'mt-0.5',
        loose: 'mt-2',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
      },
      state: {
        default: '',
        critical: 'text-red-600 font-semibold',
        warning: 'text-orange-500',
        loading: 'animate-pulse',
      },
    },
    defaultVariants: {
      size: 'sm',
      spacing: 'default',
      weight: 'normal',
      state: 'default',
    },
  },
);

/**
 * 步驟手風琴樣式變體 - 用於料理步驟展開/收合
 */
export const stepAccordionVariants = cva(
  // 基礎樣式
  'w-full',
  {
    variants: {
      item: {
        default: 'mb-2 border rounded',
        compact: 'mb-1 border rounded-sm',
        spacious: 'mb-4 border rounded-lg',
      },
      trigger: {
        default: 'px-2 py-3 hover:no-underline',
        compact: 'px-2 py-2 hover:no-underline',
        spacious: 'px-4 py-4 hover:no-underline',
      },
      content: {
        default: 'p-4 pt-2 border-t',
        compact: 'p-2 pt-1 border-t',
        spacious: 'p-6 pt-4 border-t',
      },
      grid: {
        default: 'grid grid-cols-[1fr_auto] items-center',
        simple: 'flex items-center justify-between',
      },
      state: {
        default: '',
        active: 'bg-blue-50 border-blue-200',
        disabled: 'opacity-50',
        loading: 'animate-pulse',
      },
    },
    defaultVariants: {
      item: 'default',
      trigger: 'default',
      content: 'default',
      grid: 'default',
      state: 'default',
    },
  },
);

/**
 * 影片容器樣式變體 - 用於影片播放器容器
 */
export const videoContainerVariants = cva(
  // 基礎樣式
  'relative rounded overflow-hidden',
  {
    variants: {
      aspect: {
        video: 'aspect-video',
        square: 'aspect-square',
        wide: 'aspect-[21/9]',
      },
      background: {
        default: 'bg-neutral-200',
        dark: 'bg-neutral-800',
        light: 'bg-neutral-100',
      },
      spacing: {
        default: 'mb-2',
        tight: 'mb-1',
        loose: 'mb-4',
      },
      size: {
        sm: 'h-32',
        default: 'h-40',
        lg: 'h-64',
        full: 'w-full h-full',
      },
      state: {
        default: '',
        loading: 'animate-pulse',
        error: 'border-2 border-red-300',
        disabled: 'opacity-50',
      },
    },
    defaultVariants: {
      aspect: 'video',
      background: 'default',
      spacing: 'default',
      size: 'default',
      state: 'default',
    },
  },
);

/**
 * 標籤項目樣式變體 - 用於食譜標籤顯示
 */
export const tagItemVariants = cva(
  // 基礎樣式
  '',
  {
    variants: {
      container: {
        default: 'flex flex-wrap mb-2',
        inline: 'flex items-center',
        vertical: 'flex flex-col',
      },
      item: {
        default: 'mr-2 mb-2',
        compact: 'mr-1 mb-1',
        spacious: 'mr-3 mb-3',
      },
      button: {
        default: 'ml-1 text-xs',
        compact: 'ml-0.5 text-xs',
        large: 'ml-2 text-sm',
      },
      icon: {
        sm: 'w-3 h-3',
        default: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
      state: {
        default: '',
        active: 'ring-2 ring-blue-500',
        disabled: 'opacity-50 pointer-events-none',
        loading: 'animate-pulse',
      },
    },
    defaultVariants: {
      container: 'default',
      item: 'default',
      button: 'default',
      icon: 'sm',
      state: 'default',
    },
  },
);

/**
 * 食材行樣式變體 - 用於食材和調味料列表項目
 */
export const ingredientRowVariants = cva(
  // 基礎樣式
  'mb-2',
  {
    variants: {
      layout: {
        default: 'flex items-center',
        grid: 'grid grid-cols-[1fr_auto] items-center gap-2',
        vertical: 'flex flex-col',
      },
      container: {
        default: 'flex items-center flex-1',
        full: 'w-full',
        compact: 'flex items-center',
      },
      spacing: {
        tight: 'gap-1',
        default: 'gap-2',
        loose: 'gap-4',
      },
      state: {
        default: '',
        editing: 'bg-blue-50 rounded p-2',
        error: 'bg-red-50 border border-red-200 rounded p-2',
        disabled: 'opacity-50',
        loading: 'animate-pulse',
      },
    },
    defaultVariants: {
      layout: 'default',
      container: 'default',
      spacing: 'default',
      state: 'default',
    },
  },
);

/**
 * 通用載入狀態樣式變體 - 用於載入和錯誤狀態顯示
 */
export const loadingStateVariants = cva(
  // 基礎樣式
  'flex items-center justify-center min-h-screen',
  {
    variants: {
      layout: {
        default: 'flex justify-center items-center min-h-screen',
        compact: 'flex justify-center items-center min-h-[200px]',
        column: 'flex flex-col justify-center items-center min-h-screen gap-4',
      },
      text: {
        default: 'text-xl font-semibold',
        small: 'text-lg font-medium',
        large: 'text-2xl font-bold',
      },
      state: {
        default: '',
        loading: 'animate-pulse',
        error: 'text-red-500',
        success: 'text-green-600',
      },
    },
    defaultVariants: {
      layout: 'default',
      text: 'default',
      state: 'default',
    },
  },
);

/**
 * 通用間距樣式變體 - 用於統一間距管理
 */
export const spacingVariants = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-2',
      default: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    margin: {
      none: 'm-0',
      sm: 'm-2',
      default: 'm-4',
      lg: 'm-6',
      xl: 'm-8',
    },
  },
  defaultVariants: {
    padding: 'default',
    margin: 'none',
  },
});

// TypeScript 類型定義
export type DraftPageVariants = VariantProps<typeof draftPageVariants>;
export type DraftSectionVariants = VariantProps<typeof draftSectionVariants>;
export type DraftFieldVariants = VariantProps<typeof draftFieldVariants>;
export type DraftButtonVariants = VariantProps<typeof draftButtonVariants>;
export type DraftLabelVariants = VariantProps<typeof draftLabelVariants>;
export type ErrorMessageVariants = VariantProps<typeof errorMessageVariants>;
export type StepAccordionVariants = VariantProps<typeof stepAccordionVariants>;
export type VideoContainerVariants = VariantProps<
  typeof videoContainerVariants
>;
export type TagItemVariants = VariantProps<typeof tagItemVariants>;
export type IngredientRowVariants = VariantProps<typeof ingredientRowVariants>;
export type LoadingStateVariants = VariantProps<typeof loadingStateVariants>;
export type SpacingVariants = VariantProps<typeof spacingVariants>;

// 預設樣式組合 - 常用樣式的快速訪問
export const draftStyles = {
  // 頁面佈局
  page: {
    default: draftPageVariants(),
    loading: draftPageVariants({ state: 'loading' }),
    error: draftPageVariants({ state: 'error' }),
  },

  // 區塊容器
  section: {
    default: draftSectionVariants(),
    grid: draftSectionVariants({ layout: 'grid' }),
    flexBetween: draftSectionVariants({ layout: 'flexBetween' }),
    mainContent: draftSectionVariants({ layout: 'mainContent' }),
    formContainer: draftSectionVariants({ layout: 'formContainer' }),
  },

  // 表單欄位
  field: {
    default: draftFieldVariants(),
    small: draftFieldVariants({ size: 'sm' }),
    full: draftFieldVariants({ size: 'full' }),
    flex: draftFieldVariants({ size: 'flex' }),
    textarea: draftFieldVariants({ type: 'textarea', size: 'full' }),
    readonly: draftFieldVariants({ type: 'readonly' }),
    description: draftFieldVariants({ type: 'description' }),
    error: draftFieldVariants({ state: 'error' }),
  },

  // 按鈕
  button: {
    default: draftButtonVariants(),
    icon: draftButtonVariants({ size: 'icon' }),
    fullWidth: draftButtonVariants({ width: 'full' }),
    addButton: draftButtonVariants({ spacing: 'top' }),
    submitButton: draftButtonVariants({ width: 'full', spacing: 'bottom' }),
    editButton: draftButtonVariants({ variant: 'edit' }),
    dangerButton: draftButtonVariants({ variant: 'danger' }),
  },

  // 標籤
  label: {
    default: draftLabelVariants(),
    section: draftLabelVariants({ size: 'default' }),
    field: draftLabelVariants({ size: 'sm' }),
    small: draftLabelVariants({ size: 'xs' }),
    title: draftLabelVariants({ size: 'lg', weight: 'semibold' }),
  },

  // 錯誤訊息
  error: {
    default: errorMessageVariants(),
    field: errorMessageVariants({ size: 'sm' }),
    critical: errorMessageVariants({ state: 'critical' }),
    warning: errorMessageVariants({ state: 'warning' }),
  },

  // 載入狀態
  loading: {
    default: loadingStateVariants(),
    compact: loadingStateVariants({ layout: 'compact' }),
    error: loadingStateVariants({ layout: 'column', state: 'error' }),
  },
};
