import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 個人資料編輯表單的樣式變體定義
 * 用於用戶資料編輯、設定修改等相關功能的樣式管理
 */

// 個人資料編輯主容器樣式變體
export const profileEditContainer = cva(
  'w-full mx-auto bg-white rounded-lg shadow-md',
  {
    variants: {
      variant: {
        default: 'max-w-3xl p-6',
        compact: 'max-w-2xl p-4',
        wide: 'max-w-5xl p-8',
      },
      background: {
        white: 'bg-white',
        gray: 'bg-gray-50',
        card: 'bg-white border border-gray-200',
      },
    },
    defaultVariants: {
      variant: 'default',
      background: 'white',
    },
  },
);

// 表單區段樣式變體
export const profileEditSection = cva('mb-8 p-5 border rounded-lg', {
  variants: {
    variant: {
      default: 'border-gray-200 bg-gray-50',
      primary: 'border-blue-200 bg-blue-50',
      accent: 'border-green-200 bg-green-50',
    },
    spacing: {
      tight: 'mb-4 p-3',
      normal: 'mb-8 p-5',
      loose: 'mb-12 p-7',
    },
    emphasis: {
      subtle: 'border-gray-100',
      normal: 'border-gray-200',
      strong: 'border-gray-300 shadow-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'normal',
    emphasis: 'normal',
  },
});

// 表單輸入欄位樣式變體
export const profileEditInput = cva(
  'w-full px-4 py-3 border rounded-md transition-all duration-200 focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        error:
          'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50',
        success:
          'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50',
        warning:
          'border-yellow-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 bg-yellow-50',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3',
        lg: 'px-5 py-4 text-lg',
      },
      inputType: {
        text: '',
        email: '',
        password: '',
        number: '',
        textarea: 'min-h-[100px] resize-vertical',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      inputType: 'text',
    },
  },
);

// 頭像上傳區域樣式變體
export const profileEditAvatar = cva(
  'relative flex items-center justify-center border-2 border-dashed rounded-full transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'w-20 h-20',
        md: 'w-32 h-32',
        lg: 'w-40 h-40',
      },
      state: {
        default: 'border-gray-300 hover:border-gray-400',
        dragover: 'border-blue-500 bg-blue-50',
        error: 'border-red-400 bg-red-50',
        uploading: 'border-blue-500 bg-blue-100',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);

// 動作按鈕樣式變體
export const profileEditButton = cva(
  'px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline:
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
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
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      width: 'auto',
    },
  },
);

// TypeScript 類型導出
export type ProfileEditContainerProps = VariantProps<
  typeof profileEditContainer
>;
export type ProfileEditSectionProps = VariantProps<typeof profileEditSection>;
export type ProfileEditInputProps = VariantProps<typeof profileEditInput>;
export type ProfileEditAvatarProps = VariantProps<typeof profileEditAvatar>;
export type ProfileEditButtonProps = VariantProps<typeof profileEditButton>;
