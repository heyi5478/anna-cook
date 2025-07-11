import { cva, type VariantProps } from 'class-variance-authority';

// 上傳頁面容器樣式
export const uploadPageVariants = cva('max-w-2xl mx-auto px-4 py-8', {
  variants: {
    spacing: {
      default: 'max-w-2xl mx-auto px-4 py-8',
      compact: 'max-w-2xl mx-auto px-4 py-6',
      wide: 'max-w-4xl mx-auto px-6 py-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

// 表單容器樣式
export const uploadFormVariants = cva('space-y-6', {
  variants: {
    layout: {
      default: 'space-y-6',
      compact: 'space-y-4',
      extended: 'space-y-8',
    },
  },
  defaultVariants: {
    layout: 'default',
  },
});

// 表單欄位樣式
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

// 上傳按鈕樣式
export const uploadButtonVariants = cva(
  'w-full py-3 rounded-md font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary:
          'bg-neutral-400 text-white hover:bg-neutral-500 active:bg-neutral-600',
        secondary:
          'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400',
        outline:
          'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
        add: 'flex items-center text-neutral-500 hover:text-neutral-700',
      },
      state: {
        default: '',
        loading: 'bg-neutral-300 cursor-not-allowed opacity-75',
        disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50',
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

// 錯誤訊息樣式
export const errorMessageVariants = cva('text-sm', {
  variants: {
    variant: {
      field: 'mt-1 text-red-500',
      banner:
        'mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded-md',
      inline: 'text-red-500',
    },
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'field',
    size: 'default',
  },
});

// 圖片上傳區域樣式
export const uploadAreaVariants = cva(
  'border rounded-md p-4 h-64 flex items-center justify-center cursor-pointer transition-all duration-200',
  {
    variants: {
      state: {
        default:
          'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400',
        error: 'bg-red-50 border-red-500 hover:bg-red-100',
        success: 'bg-green-50 border-green-300',
        dragOver: 'bg-blue-50 border-blue-400 border-dashed',
      },
      size: {
        default: 'h-64',
        sm: 'h-48',
        lg: 'h-80',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  },
);

// 標籤樣式
export const tagVariants = cva(
  'rounded-full flex items-center transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300',
        selected: 'bg-blue-100 text-blue-700 border border-blue-300',
        removable: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-2 py-1 text-sm',
        lg: 'px-3 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// 食材/調料輸入行樣式
export const ingredientRowVariants = cva('flex items-center gap-2 mb-2', {
  variants: {
    layout: {
      default: 'flex items-center gap-2 mb-2',
      compact: 'flex items-center gap-1 mb-1',
      spacious: 'flex items-center gap-3 mb-3',
    },
    state: {
      default: '',
      error: 'bg-red-50 p-2 rounded border border-red-200',
      highlighted: 'bg-blue-50 p-2 rounded border border-blue-200',
    },
  },
  defaultVariants: {
    layout: 'default',
    state: 'default',
  },
});

// 步驟容器樣式
export const stepContainerVariants = cva('mb-6', {
  variants: {
    variant: {
      section: 'mb-6',
      titleSection: 'mb-6 border-t border-b border-dashed border-gray-300 py-4',
      infoSection:
        'mb-6 bg-neutral-50 p-3 rounded-md border border-neutral-300',
      timeSection: 'mb-6 flex gap-4',
    },
    spacing: {
      default: 'mb-6',
      compact: 'mb-4',
      extended: 'mb-8',
    },
  },
  defaultVariants: {
    variant: 'section',
    spacing: 'default',
  },
});

// 標籤標題樣式
export const labelVariants = cva('block font-medium mb-2', {
  variants: {
    size: {
      sm: 'text-sm',
      default: 'text-lg',
      lg: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    spacing: {
      tight: 'mb-1',
      default: 'mb-2',
      loose: 'mb-3',
    },
  },
  defaultVariants: {
    size: 'default',
    weight: 'medium',
    spacing: 'default',
  },
});

// 輸入圖示容器樣式
export const inputIconVariants = cva('absolute top-1/2 -translate-y-1/2', {
  variants: {
    position: {
      left: 'left-3',
      right: 'right-3',
    },
    size: {
      sm: 'w-4 h-4',
      default: 'w-5 h-5',
      lg: 'w-6 h-6',
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
    color: 'default',
  },
});

// 成功訊息樣式
export const successMessageVariants = cva('text-sm', {
  variants: {
    variant: {
      field: 'mt-1 text-green-500',
      banner:
        'mb-4 p-3 bg-green-50 border border-green-300 text-green-600 rounded-md',
      inline: 'text-green-500',
    },
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'field',
    size: 'default',
  },
});

// 類型定義
export type UploadPageVariantsProps = VariantProps<typeof uploadPageVariants>;
export type UploadFormVariantsProps = VariantProps<typeof uploadFormVariants>;
export type UploadFieldVariantsProps = VariantProps<typeof uploadFieldVariants>;
export type UploadButtonVariantsProps = VariantProps<
  typeof uploadButtonVariants
>;
export type ErrorMessageVariantsProps = VariantProps<
  typeof errorMessageVariants
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
