import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 上傳頁面容器樣式變體
 * 控制整個上傳頁面的佈局和間距
 */
export const uploadPageVariants = cva('max-w-2xl mx-auto px-4 py-8', {
  variants: {
    spacing: {
      default: 'max-w-2xl mx-auto px-4 py-8',
      compact: 'max-w-2xl mx-auto px-4 py-6',
      wide: 'max-w-4xl mx-auto px-6 py-8',
    },
    state: {
      default: '',
      loading: 'opacity-75 pointer-events-none',
      error: 'opacity-90',
    },
  },
  defaultVariants: {
    spacing: 'default',
    state: 'default',
  },
});

/**
 * 表單容器樣式變體
 * 控制表單區塊的整體間距和佈局
 */
export const uploadFormVariants = cva('space-y-6', {
  variants: {
    layout: {
      default: 'space-y-6',
      compact: 'space-y-4',
      extended: 'space-y-8',
    },
    state: {
      default: '',
      submitting: 'pointer-events-none opacity-75',
    },
  },
  defaultVariants: {
    layout: 'default',
    state: 'default',
  },
});

/**
 * 表單欄位樣式變體
 * 控制輸入欄位的外觀和狀態
 */
export const uploadFieldVariants = cva(
  'w-full border rounded-md transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'p-3 bg-neutral-50 border-neutral-300',
        textarea: 'p-3 bg-neutral-50 border-neutral-300 resize-none',
        input: 'p-2 bg-white border-gray-300',
        number: 'p-2 bg-white border-neutral-300',
        iconInput: 'px-10 py-3 bg-neutral-50 border-neutral-300',
      },
      state: {
        default:
          'border-neutral-300 hover:border-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        error:
          'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200',
        success:
          'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200',
        disabled: 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50',
      },
      size: {
        sm: 'p-2 text-sm',
        default: 'p-3',
        lg: 'p-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
      size: 'default',
    },
  },
);

/**
 * 上傳按鈕樣式變體
 * 控制各種操作按鈕的外觀和狀態
 */
export const uploadButtonVariants = cva(
  'w-full py-3 rounded-md font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-600 active:bg-primary-700',
        secondary:
          'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400',
        outline:
          'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
        add: 'flex items-center text-neutral-500 hover:text-neutral-700',
        destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
        success:
          'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
      },
      state: {
        default: '',
        loading: 'bg-neutral-300 cursor-not-allowed opacity-75',
        disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50',
        submitting: 'opacity-75 cursor-wait',
      },
      size: {
        sm: 'py-2 px-3 text-sm',
        default: 'py-3 px-4',
        lg: 'py-4 px-6 text-lg',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      state: 'default',
      size: 'default',
    },
  },
);

/**
 * 錯誤訊息樣式變體
 * 控制錯誤提示的顯示樣式
 */
export const uploadErrorMessageVariants = cva('text-sm', {
  variants: {
    variant: {
      default: 'text-red-500',
      inline: 'text-red-500 mt-1',
      popup: 'bg-red-50 border border-red-200 text-red-700 p-3 rounded-md',
      banner: 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4',
    },
    severity: {
      low: 'text-orange-500',
      medium: 'text-red-500',
      high: 'text-red-600 font-medium',
      critical: 'text-red-700 font-bold',
    },
    state: {
      show: 'opacity-100 animate-in fade-in duration-200',
      hide: 'opacity-0 animate-out fade-out duration-200',
    },
  },
  defaultVariants: {
    variant: 'default',
    severity: 'medium',
    state: 'show',
  },
});

/**
 * 上傳區域樣式變體
 * 控制檔案上傳區域的外觀和互動狀態
 */
export const uploadAreaVariants = cva(
  'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
  {
    variants: {
      state: {
        default:
          'border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100',
        active: 'border-blue-400 bg-blue-50',
        error: 'border-red-400 bg-red-50',
        success: 'border-green-400 bg-green-50',
        uploading: 'border-blue-400 bg-blue-50 cursor-wait',
        disabled: 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  },
);

/**
 * 標籤樣式變體
 * 控制食譜標籤的顯示樣式
 */
export const tagVariants = cva(
  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-700',
        selected: 'bg-blue-100 text-blue-700',
        removable: 'bg-neutral-100 text-neutral-700 pr-1',
        disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
      },
      interactive: {
        true: 'hover:bg-neutral-200 cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  },
);

/**
 * 食材行樣式變體
 * 控制食材輸入行的佈局和樣式
 */
export const ingredientRowVariants = cva('flex gap-3 items-start', {
  variants: {
    layout: {
      default: 'flex gap-3 items-start',
      compact: 'flex gap-2 items-start',
      wide: 'flex gap-4 items-start',
    },
    state: {
      default: '',
      editing: 'bg-blue-50 p-2 rounded-md',
      error: 'bg-red-50 p-2 rounded-md',
      disabled: 'opacity-50 pointer-events-none',
    },
  },
  defaultVariants: {
    layout: 'default',
    state: 'default',
  },
});

/**
 * 步驟容器樣式變體
 * 控制料理步驟區塊的樣式
 */
export const stepContainerVariants = cva('space-y-4 p-4 rounded-lg', {
  variants: {
    variant: {
      default: 'border-neutral-200 bg-white',
      highlighted: 'border-blue-200 bg-blue-50',
      error: 'border-red-200 bg-red-50',
      disabled: 'border-gray-200 bg-gray-50 opacity-50',
      section: 'mb-6',
      titleSection: 'mb-6 border-t border-b border-dashed border-gray-300 py-4',
      infoSection:
        'mb-6 bg-neutral-50 p-3 rounded-md border border-neutral-300',
      timeSection: 'mb-6 flex gap-4',
    },
    size: {
      sm: 'p-3 space-y-3',
      default: 'p-4 space-y-4',
      lg: 'p-6 space-y-6',
    },
    spacing: {
      default: 'mb-6',
      compact: 'mb-4',
      extended: 'mb-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 標籤樣式變體
 * 控制表單標籤的外觀
 */
export const labelVariants = cva('block text-sm font-medium', {
  variants: {
    variant: {
      default: 'text-neutral-700',
      required: 'text-neutral-700 after:content-["*"] after:text-red-500',
      optional: 'text-neutral-500',
      disabled: 'text-gray-400',
    },
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * 輸入圖示樣式變體
 * 控制輸入欄位圖示的定位和樣式
 */
export const inputIconVariants = cva('absolute inset-y-0 flex items-center', {
  variants: {
    position: {
      left: 'left-0 pl-3',
      right: 'right-0 pr-3',
    },
    size: {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
    state: {
      default: 'text-neutral-400',
      active: 'text-blue-500',
      error: 'text-red-500',
      success: 'text-green-500',
    },
    color: {
      default: 'text-neutral-400',
      active: 'text-neutral-600',
      error: 'text-red-500',
      success: 'text-green-500',
    },
  },
  defaultVariants: {
    position: 'left',
    size: 'default',
    state: 'default',
    color: 'default',
  },
});

/**
 * 成功訊息樣式變體
 * 控制成功提示的顯示樣式
 */
export const successMessageVariants = cva('text-sm', {
  variants: {
    variant: {
      default: 'text-green-600',
      inline: 'text-green-600 mt-1',
      popup:
        'bg-green-50 border border-green-200 text-green-700 p-3 rounded-md',
      banner: 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4',
    },
    state: {
      show: 'opacity-100 animate-in fade-in duration-200',
      hide: 'opacity-0 animate-out fade-out duration-200',
    },
  },
  defaultVariants: {
    variant: 'default',
    state: 'show',
  },
});

/**
 * 上傳表單組合樣式
 * 提供預設的樣式組合方便使用
 */
export const uploadStyles = {
  // 頁面容器樣式
  page: {
    default: uploadPageVariants(),
    wide: uploadPageVariants({ spacing: 'wide' }),
    loading: uploadPageVariants({ state: 'loading' }),
  },
  // 表單樣式
  form: {
    default: uploadFormVariants(),
    compact: uploadFormVariants({ layout: 'compact' }),
    submitting: uploadFormVariants({ state: 'submitting' }),
  },
  // 欄位樣式
  field: {
    input: uploadFieldVariants({ variant: 'input' }),
    textarea: uploadFieldVariants({ variant: 'textarea' }),
    number: uploadFieldVariants({ variant: 'number' }),
    error: uploadFieldVariants({ state: 'error' }),
    disabled: uploadFieldVariants({ state: 'disabled' }),
  },
  // 按鈕樣式
  button: {
    primary: uploadButtonVariants({ variant: 'primary' }),
    secondary: uploadButtonVariants({ variant: 'secondary' }),
    add: uploadButtonVariants({ variant: 'add', size: 'sm' }),
    loading: uploadButtonVariants({ state: 'loading' }),
    disabled: uploadButtonVariants({ state: 'disabled' }),
  },
  // 上傳區域樣式
  upload: {
    default: uploadAreaVariants(),
    active: uploadAreaVariants({ state: 'active' }),
    uploading: uploadAreaVariants({ state: 'uploading' }),
    error: uploadAreaVariants({ state: 'error' }),
    success: uploadAreaVariants({ state: 'success' }),
  },
  // 標籤樣式
  tag: {
    default: tagVariants(),
    selected: tagVariants({ variant: 'selected' }),
    removable: tagVariants({ variant: 'removable', interactive: true }),
  },
  // 錯誤訊息樣式
  error: {
    default: uploadErrorMessageVariants(),
    inline: uploadErrorMessageVariants({ variant: 'inline' }),
    critical: uploadErrorMessageVariants({ severity: 'critical' }),
  },
  // 成功訊息樣式
  success: {
    default: successMessageVariants(),
    inline: successMessageVariants({ variant: 'inline' }),
    popup: successMessageVariants({ variant: 'popup' }),
  },
} as const;

// TypeScript 類型導出

export type UploadPageVariantsProps = VariantProps<typeof uploadPageVariants>;
export type UploadFormVariantsProps = VariantProps<typeof uploadFormVariants>;
export type UploadFieldVariantsProps = VariantProps<typeof uploadFieldVariants>;
export type UploadButtonVariantsProps = VariantProps<
  typeof uploadButtonVariants
>;
export type UploadErrorMessageVariantsProps = VariantProps<
  typeof uploadErrorMessageVariants
>;
export type UploadAreaVariantsProps = VariantProps<typeof uploadAreaVariants>;
export type TagVariantsProps = VariantProps<typeof tagVariants>;
export type IngredientRowVariantsProps = VariantProps<
  typeof ingredientRowVariants
>;
export type StepContainerVariantsProps = VariantProps<
  typeof stepContainerVariants
>;
export type LabelVariantsProps = VariantProps<typeof labelVariants>;
export type InputIconVariantsProps = VariantProps<typeof inputIconVariants>;
export type SuccessMessageVariantsProps = VariantProps<
  typeof successMessageVariants
>;
