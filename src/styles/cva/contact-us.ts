import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 聯絡我們頁面的樣式變體定義
 * 用於聯絡表單、客服相關功能的樣式管理
 */

// 聯絡我們主容器樣式變體
export const contactUsContainer = cva(
  'w-full mx-auto p-8 bg-white rounded-xl shadow-lg',
  {
    variants: {
      variant: {
        default: 'max-w-2xl',
        wide: 'max-w-4xl',
        full: 'max-w-full',
      },
      background: {
        white: 'bg-white',
        gray: 'bg-gray-50',
        transparent: 'bg-transparent shadow-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      background: 'white',
    },
  },
);

// 表單組件樣式變體
export const contactUsForm = cva('space-y-6', {
  variants: {
    layout: {
      vertical: 'space-y-6',
      compact: 'space-y-4',
      spacious: 'space-y-8',
    },
    alignment: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    layout: 'vertical',
    alignment: 'left',
  },
});

// 表單欄位樣式變體
export const contactUsField = cva(
  'w-full px-4 py-3 border rounded-lg transition-colors duration-200',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        error:
          'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200',
        success:
          'border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3',
        lg: 'px-5 py-4 text-lg',
      },
      fieldType: {
        input: 'h-12',
        textarea: 'min-h-[120px] resize-vertical',
        select: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fieldType: 'input',
    },
  },
);

// 提交按鈕樣式變體
export const contactUsButton = cva(
  'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline:
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      },
      size: {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6',
        lg: 'py-4 px-8 text-lg',
      },
      state: {
        default: '',
        loading: 'opacity-70 cursor-not-allowed',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      state: 'default',
    },
  },
);

// TypeScript 類型導出
export type ContactUsContainerProps = VariantProps<typeof contactUsContainer>;
export type ContactUsFormProps = VariantProps<typeof contactUsForm>;
export type ContactUsFieldProps = VariantProps<typeof contactUsField>;
export type ContactUsButtonProps = VariantProps<typeof contactUsButton>;
