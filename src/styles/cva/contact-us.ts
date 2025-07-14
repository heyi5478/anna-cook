import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 聯絡我們頁面容器樣式變體 - 用於主要頁面佈局
 */
export const contactPageVariants = cva(
  // 基礎樣式
  '',
  {
    variants: {
      layout: {
        default: '',
        fullHeight: 'min-h-screen',
        centered: 'min-h-screen flex items-center justify-center',
      },
      spacing: {
        default: 'px-4 pb-20',
        compact: 'px-2 pb-10',
        spacious: 'px-6 pb-24',
      },
      state: {
        default: '',
        loading: 'opacity-70 pointer-events-none',
        disabled: 'opacity-50',
        error: 'bg-red-50',
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
 * 表單容器樣式變體 - 用於表單整體佈局
 */
export const contactFormVariants = cva(
  // 基礎樣式
  'space-y-4',
  {
    variants: {
      layout: {
        default: '',
        compact: 'space-y-2',
        spacious: 'space-y-6',
        grid: 'grid grid-cols-1 gap-4',
      },
      maxWidth: {
        default: '',
        sm: 'max-w-sm mx-auto',
        md: 'max-w-md mx-auto',
        lg: 'max-w-lg mx-auto',
        full: 'w-full',
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
 * 區塊容器樣式變體 - 用於頁面內容區塊
 */
export const contactSectionVariants = cva(
  // 基礎樣式
  '',
  {
    variants: {
      type: {
        default: '',
        title: 'text-2xl font-bold mb-4',
        logo: 'flex justify-center my-6',
        logoBox: 'bg-neutral-100 px-8 py-3 rounded',
        description: 'text-neutral-700 mb-6',
        buttonGroup: 'space-y-2 pt-4',
      },
      spacing: {
        default: 'mb-4',
        tight: 'mb-2',
        loose: 'mb-6',
        none: 'mb-0',
      },
      alignment: {
        default: '',
        center: 'text-center',
        left: 'text-left',
        right: 'text-right',
      },
      state: {
        default: '',
        highlighted: 'bg-blue-50 p-4 rounded',
        muted: 'opacity-70',
        error: 'text-red-600',
      },
    },
    defaultVariants: {
      type: 'default',
      spacing: 'default',
      alignment: 'default',
      state: 'default',
    },
  },
);

/**
 * 表單欄位樣式變體 - 用於各種表單輸入欄位
 */
export const contactFieldVariants = cva(
  // 基礎樣式
  '',
  {
    variants: {
      type: {
        default: '',
        textarea: 'min-h-[150px]',
        select: '',
        input: '',
      },
      size: {
        sm: 'text-sm',
        default: '',
        lg: 'text-lg p-4',
      },
      state: {
        default: '',
        error: 'border-red-300 bg-red-50 focus:border-red-500',
        disabled: 'opacity-50 cursor-not-allowed bg-gray-100',
        loading: 'opacity-70',
        success: 'border-green-300 bg-green-50',
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
 * 按鈕樣式變體 - 用於各種按鈕狀態和類型
 */
export const contactButtonVariants = cva(
  // 基礎樣式
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        primary: 'bg-neutral-500 hover:bg-neutral-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        outline: 'border border-gray-300 hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
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
        both: 'my-4',
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
 * 麵包屑導航樣式變體 - 用於頁面導航
 */
export const contactBreadcrumbVariants = cva(
  // 基礎樣式
  'p-4',
  {
    variants: {
      layout: {
        default: '',
        compact: 'p-2',
        spacious: 'p-6',
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

/**
 * 表單標籤樣式變體 - 用於表單欄位標籤
 */
export const contactLabelVariants = cva(
  // 基礎樣式
  'font-medium',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
      color: {
        default: 'text-gray-700',
        muted: 'text-gray-500',
        error: 'text-red-600',
        success: 'text-green-600',
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: '',
      },
      state: {
        default: '',
        disabled: 'opacity-50',
        focused: 'text-blue-600',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
      required: false,
      state: 'default',
    },
  },
);

// TypeScript 類型定義
export type ContactPageVariants = VariantProps<typeof contactPageVariants>;
export type ContactFormVariants = VariantProps<typeof contactFormVariants>;
export type ContactSectionVariants = VariantProps<
  typeof contactSectionVariants
>;
export type ContactFieldVariants = VariantProps<typeof contactFieldVariants>;
export type ContactButtonVariants = VariantProps<typeof contactButtonVariants>;
export type ContactBreadcrumbVariants = VariantProps<
  typeof contactBreadcrumbVariants
>;
export type ContactLabelVariants = VariantProps<typeof contactLabelVariants>;

// 預設樣式組合 - 常用樣式的快速訪問
export const contactStyles = {
  // 頁面佈局
  page: {
    default: contactPageVariants(),
    main: contactPageVariants({ spacing: 'default' }),
    loading: contactPageVariants({ state: 'loading' }),
  },

  // 表單佈局
  form: {
    default: contactFormVariants(),
    compact: contactFormVariants({ layout: 'compact' }),
    spacious: contactFormVariants({ layout: 'spacious' }),
    submitting: contactFormVariants({ state: 'submitting' }),
  },

  // 區塊樣式
  section: {
    title: contactSectionVariants({ type: 'title' }),
    logo: contactSectionVariants({ type: 'logo' }),
    logoBox: contactSectionVariants({ type: 'logoBox' }),
    description: contactSectionVariants({ type: 'description' }),
    buttonGroup: contactSectionVariants({ type: 'buttonGroup' }),
  },

  // 表單欄位
  field: {
    default: contactFieldVariants(),
    textarea: contactFieldVariants({ type: 'textarea' }),
    error: contactFieldVariants({ state: 'error' }),
    disabled: contactFieldVariants({ state: 'disabled' }),
  },

  // 按鈕樣式
  button: {
    primary: contactButtonVariants({ variant: 'primary', size: 'full' }),
    secondary: contactButtonVariants({ variant: 'outline', size: 'full' }),
    submit: contactButtonVariants({ variant: 'primary', size: 'full' }),
    cancel: contactButtonVariants({ variant: 'outline', size: 'full' }),
    loading: contactButtonVariants({ state: 'loading' }),
  },

  // 麵包屑
  breadcrumb: {
    default: contactBreadcrumbVariants(),
    compact: contactBreadcrumbVariants({ layout: 'compact' }),
    sticky: contactBreadcrumbVariants({ state: 'sticky' }),
  },

  // 標籤
  label: {
    default: contactLabelVariants(),
    required: contactLabelVariants({ required: true }),
    error: contactLabelVariants({ color: 'error' }),
  },
};
