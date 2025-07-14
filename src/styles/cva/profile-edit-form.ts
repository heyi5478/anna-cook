import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 個人資料編輯頁面容器樣式變體 - 用於主要頁面佈局
 */
export const profilePageVariants = cva(
  // 基礎樣式
  'flex flex-col min-h-screen',
  {
    variants: {
      background: {
        default: 'bg-neutral-100',
        white: 'bg-white',
        gray: 'bg-gray-50',
      },
      layout: {
        default: '',
        fullHeight: 'min-h-screen',
        centered: 'min-h-screen flex items-center justify-center',
      },
      state: {
        default: '',
        loading: 'opacity-70 pointer-events-none',
        disabled: 'opacity-50',
        error: 'bg-red-50',
      },
    },
    defaultVariants: {
      background: 'default',
      layout: 'default',
      state: 'default',
    },
  },
);

/**
 * 表單容器樣式變體 - 用於主要表單區域佈局
 */
export const profileFormVariants = cva(
  // 基礎樣式
  'space-y-6',
  {
    variants: {
      layout: {
        default: '',
        compact: 'space-y-4',
        spacious: 'space-y-8',
      },
      maxWidth: {
        default: 'flex-1 px-4 py-6 md:max-w-2xl md:mx-auto w-full',
        sm: 'max-w-sm mx-auto px-4 py-6',
        md: 'max-w-md mx-auto px-4 py-6',
        lg: 'max-w-lg mx-auto px-4 py-6',
        full: 'w-full px-4 py-6',
      },
      state: {
        default: '',
        submitting: 'opacity-70',
        disabled: 'opacity-50 pointer-events-none',
        error: 'border border-red-200 rounded p-4 bg-red-50',
      },
    },
    defaultVariants: {
      layout: 'default',
      maxWidth: 'default',
      state: 'default',
    },
  },
);

/**
 * 頭像容器樣式變體 - 用於頭像上傳和顯示區域
 */
export const avatarContainerVariants = cva(
  // 基礎樣式
  'relative',
  {
    variants: {
      size: {
        sm: 'h-20 w-20',
        default: 'h-28 w-28',
        lg: 'h-32 w-32',
        xl: 'h-40 w-40',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
        rounded: 'rounded-xl',
      },
      background: {
        default: 'bg-neutral-200',
        light: 'bg-gray-100',
        dark: 'bg-gray-300',
      },
      layout: {
        default: 'flex justify-center mb-8',
        left: 'flex justify-start mb-8',
        right: 'flex justify-end mb-8',
      },
      state: {
        default: 'overflow-hidden flex items-center justify-center',
        uploading:
          'overflow-hidden flex items-center justify-center opacity-70',
        error:
          'overflow-hidden flex items-center justify-center border-2 border-red-300',
        success:
          'overflow-hidden flex items-center justify-center border-2 border-green-300',
      },
    },
    defaultVariants: {
      size: 'default',
      shape: 'circle',
      background: 'default',
      layout: 'default',
      state: 'default',
    },
  },
);

/**
 * 頭像上傳按鈕樣式變體 - 用於頭像上傳觸發按鈕
 */
export const avatarUploadButtonVariants = cva(
  // 基礎樣式
  'absolute bottom-0 right-0 rounded-full flex items-center justify-center cursor-pointer transition-all',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
      color: {
        default: 'bg-neutral-500 hover:bg-neutral-600',
        primary: 'bg-blue-500 hover:bg-blue-600',
        accent: 'bg-green-500 hover:bg-green-600',
      },
      state: {
        default: '',
        uploading: 'opacity-70 cursor-not-allowed',
        disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
      state: 'default',
    },
  },
);

/**
 * 表單欄位樣式變體 - 用於各種表單輸入欄位
 */
export const profileFieldVariants = cva(
  // 基礎樣式
  '',
  {
    variants: {
      type: {
        default: '',
        textarea: 'resize-none h-32',
        disabled: 'pr-24',
        email: 'pr-24',
      },
      size: {
        sm: 'text-sm p-2',
        default: '',
        lg: 'text-lg p-4',
      },
      state: {
        default: '',
        error: 'border-red-300 bg-red-50 focus:border-red-500',
        disabled: 'opacity-70 cursor-not-allowed bg-gray-100',
        loading: 'opacity-70',
        success: 'border-green-300 bg-green-50',
        verified: 'bg-gray-50',
      },
      width: {
        default: '',
        full: 'w-full',
        auto: 'w-auto',
      },
    },
    defaultVariants: {
      type: 'default',
      size: 'default',
      state: 'default',
      width: 'default',
    },
  },
);

/**
 * 驗證狀態標籤樣式變體 - 用於電子郵件驗證狀態顯示
 */
export const verificationBadgeVariants = cva(
  // 基礎樣式
  'absolute right-3 top-1/2 transform -translate-y-1/2 text-sm flex items-center',
  {
    variants: {
      status: {
        verified: 'text-green-600',
        unverified: 'text-yellow-600',
        error: 'text-red-600',
        neutral: 'text-neutral-500',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      status: 'verified',
      size: 'default',
    },
  },
);

/**
 * 按鈕樣式變體 - 用於各種按鈕狀態和類型
 */
export const profileButtonVariants = cva(
  // 基礎樣式
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        primary: 'bg-neutral-600 hover:bg-neutral-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        outline: 'border border-gray-300 hover:bg-gray-50',
        destructive: 'bg-red-500 hover:bg-red-600 text-white',
        success: 'bg-green-500 hover:bg-green-600 text-white',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        default: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
        full: 'w-full px-4 py-2',
      },
      state: {
        default: '',
        loading: 'opacity-70 cursor-not-allowed',
        disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
        submitting: 'opacity-70 cursor-wait',
        success: 'bg-green-500 hover:bg-green-600',
      },
      spacing: {
        default: '',
        top: 'mt-4',
        bottom: 'mb-4',
        group: 'pt-6 space-y-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
      spacing: 'default',
    },
  },
);

/**
 * 載入狀態樣式變體 - 用於載入狀態顯示
 */
export const loadingStateVariants = cva(
  // 基礎樣式
  'flex justify-center items-center min-h-screen',
  {
    variants: {
      layout: {
        default: 'flex justify-center items-center min-h-screen',
        compact: 'flex justify-center items-center min-h-[200px]',
        center: 'text-center',
      },
      spinner: {
        default:
          'animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mx-auto mb-4',
        small:
          'animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900 mx-auto mb-2',
        large:
          'animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900 mx-auto mb-6',
      },
      text: {
        default: 'text-neutral-600',
        muted: 'text-neutral-500',
        dark: 'text-neutral-800',
      },
    },
    defaultVariants: {
      layout: 'default',
      spinner: 'default',
      text: 'default',
    },
  },
);

/**
 * 錯誤狀態樣式變體 - 用於錯誤狀態顯示
 */
export const errorStateVariants = cva(
  // 基礎樣式
  'flex justify-center items-center min-h-screen',
  {
    variants: {
      layout: {
        default: 'text-center bg-red-50 p-6 rounded-lg max-w-md',
        fullscreen: 'text-center bg-red-50 p-8 rounded-lg max-w-lg',
        inline: 'text-center bg-red-50 p-4 rounded border',
      },
      severity: {
        error: 'text-red-500',
        warning: 'text-orange-500',
        info: 'text-blue-500',
      },
      title: {
        default: 'text-xl mb-4',
        large: 'text-2xl mb-6',
        small: 'text-lg mb-2',
      },
      description: {
        default: 'text-neutral-700 mb-4',
        muted: 'text-neutral-600 mb-4',
        dark: 'text-neutral-800 mb-4',
      },
    },
    defaultVariants: {
      layout: 'default',
      severity: 'error',
      title: 'default',
      description: 'default',
    },
  },
);

/**
 * 對話框樣式變體 - 用於確認對話框
 */
export const dialogVariants = cva(
  // 基礎樣式
  '',
  {
    variants: {
      background: {
        default: 'bg-white',
        neutral: 'bg-neutral-100',
        light: 'bg-gray-50',
      },
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
      },
    },
    defaultVariants: {
      background: 'neutral',
      size: 'default',
    },
  },
);

/**
 * 麵包屑導航樣式變體 - 用於頁面導航
 */
export const breadcrumbVariants = cva(
  // 基礎樣式
  'px-4 py-3',
  {
    variants: {
      layout: {
        default: '',
        compact: 'px-2 py-2',
        spacious: 'px-6 py-4',
      },
      background: {
        default: '',
        light: 'bg-gray-50',
        white: 'bg-white',
        transparent: 'bg-transparent',
      },
      state: {
        default: '',
        sticky: 'sticky top-0 z-10',
        fixed: 'fixed top-0 left-0 right-0 z-10',
      },
    },
    defaultVariants: {
      layout: 'default',
      background: 'default',
      state: 'default',
    },
  },
);

// TypeScript 類型定義
export type ProfilePageVariants = VariantProps<typeof profilePageVariants>;
export type ProfileFormVariants = VariantProps<typeof profileFormVariants>;
export type AvatarContainerVariants = VariantProps<
  typeof avatarContainerVariants
>;
export type AvatarUploadButtonVariants = VariantProps<
  typeof avatarUploadButtonVariants
>;
export type ProfileFieldVariants = VariantProps<typeof profileFieldVariants>;
export type VerificationBadgeVariants = VariantProps<
  typeof verificationBadgeVariants
>;
export type ProfileButtonVariants = VariantProps<typeof profileButtonVariants>;
export type LoadingStateVariants = VariantProps<typeof loadingStateVariants>;
export type ErrorStateVariants = VariantProps<typeof errorStateVariants>;
export type DialogVariants = VariantProps<typeof dialogVariants>;
export type BreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;

// 預設樣式組合 - 常用樣式的快速訪問
export const profileStyles = {
  // 頁面佈局
  page: {
    default: profilePageVariants(),
    loading: profilePageVariants({ state: 'loading' }),
    error: profilePageVariants({ state: 'error' }),
  },

  // 表單佈局
  form: {
    default: profileFormVariants(),
    main: profileFormVariants({ maxWidth: 'default' }),
    compact: profileFormVariants({ layout: 'compact' }),
    submitting: profileFormVariants({ state: 'submitting' }),
  },

  // 頭像區域
  avatar: {
    container: avatarContainerVariants(),
    wrapper: avatarContainerVariants({ layout: 'default' }),
    image: avatarContainerVariants({ state: 'default' }),
    uploadButton: avatarUploadButtonVariants(),
    uploading: avatarUploadButtonVariants({ state: 'uploading' }),
  },

  // 表單欄位
  field: {
    default: profileFieldVariants(),
    textarea: profileFieldVariants({ type: 'textarea' }),
    email: profileFieldVariants({ type: 'email', state: 'verified' }),
    error: profileFieldVariants({ state: 'error' }),
    disabled: profileFieldVariants({ state: 'disabled' }),
  },

  // 驗證標籤
  verification: {
    verified: verificationBadgeVariants({ status: 'verified' }),
    unverified: verificationBadgeVariants({ status: 'unverified' }),
  },

  // 按鈕樣式
  button: {
    primary: profileButtonVariants({ variant: 'primary', size: 'full' }),
    secondary: profileButtonVariants({ variant: 'outline', size: 'full' }),
    submit: profileButtonVariants({ variant: 'primary', size: 'full' }),
    cancel: profileButtonVariants({ variant: 'outline', size: 'full' }),
    destructive: profileButtonVariants({ variant: 'destructive' }),
    buttonGroup: profileButtonVariants({ spacing: 'group' }),
    submitting: profileButtonVariants({ state: 'submitting' }),
  },

  // 載入狀態
  loading: {
    default: loadingStateVariants(),
    center: loadingStateVariants({ layout: 'center' }),
    spinner: loadingStateVariants({ spinner: 'default' }),
    text: loadingStateVariants({ text: 'default' }),
  },

  // 錯誤狀態
  error: {
    default: errorStateVariants(),
    fullscreen: errorStateVariants({ layout: 'fullscreen' }),
    title: errorStateVariants({ title: 'default' }),
    description: errorStateVariants({ description: 'default' }),
  },

  // 對話框
  dialog: {
    default: dialogVariants(),
    neutral: dialogVariants({ background: 'neutral' }),
  },

  // 麵包屑
  breadcrumb: {
    default: breadcrumbVariants(),
    compact: breadcrumbVariants({ layout: 'compact' }),
  },
};
