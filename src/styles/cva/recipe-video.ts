import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 旋轉提示覆蓋層樣式變體
 */
export const rotationPromptOverlayVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center transition-all duration-300',
  {
    variants: {
      state: {
        hidden: 'opacity-0 pointer-events-none',
        visible: 'opacity-100',
        entering: 'opacity-0 animate-in fade-in duration-300',
        exiting: 'opacity-100 animate-out fade-out duration-300',
      },
      backdrop: {
        none: '',
        blur: 'backdrop-blur-sm',
        darkBlur: 'backdrop-blur-sm bg-black/20',
        lightBlur: 'backdrop-blur-sm bg-white/10',
      },
    },
    defaultVariants: {
      state: 'hidden',
      backdrop: 'darkBlur',
    },
  },
);

/**
 * 提示內容容器樣式變體
 */
export const rotationPromptContentVariants = cva(
  'bg-neutral-800 text-white rounded-lg shadow-xl border border-neutral-700 transition-transform duration-300',
  {
    variants: {
      size: {
        compact: 'p-4 max-w-xs',
        normal: 'p-6 max-w-sm',
        large: 'p-8 max-w-md',
      },
      animation: {
        none: '',
        bounce: 'animate-bounce',
        pulse: 'animate-pulse',
        scale: 'animate-in zoom-in-95 duration-300',
      },
      theme: {
        dark: 'bg-neutral-800 text-white border-neutral-700',
        light: 'bg-white text-neutral-800 border-neutral-200',
        accent: 'bg-blue-900 text-blue-50 border-blue-700',
      },
    },
    defaultVariants: {
      size: 'normal',
      animation: 'scale',
      theme: 'dark',
    },
  },
);

/**
 * 旋轉圖示動畫樣式變體
 */
export const rotationIconVariants = cva('mx-auto transition-all duration-300', {
  variants: {
    size: {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16',
      extraLarge: 'w-20 h-20',
    },
    animation: {
      none: '',
      spin: 'animate-spin',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      wiggle: 'animate-[wiggle_1s_ease-in-out_infinite]',
    },
    color: {
      default: 'text-white',
      muted: 'text-neutral-300',
      accent: 'text-blue-400',
      warning: 'text-yellow-400',
    },
  },
  defaultVariants: {
    size: 'large',
    animation: 'spin',
    color: 'default',
  },
});

/**
 * 提示文字樣式變體
 */
export const rotationTextVariants = cva(
  'text-center transition-colors duration-300',
  {
    variants: {
      type: {
        title: 'text-lg font-semibold mb-2',
        description: 'text-sm text-neutral-300 mb-3',
        instruction: 'text-xs text-neutral-400',
      },
      emphasis: {
        normal: '',
        highlighted: 'font-medium',
        bold: 'font-bold',
        muted: 'opacity-75',
      },
      spacing: {
        tight: 'leading-tight',
        normal: 'leading-normal',
        relaxed: 'leading-relaxed',
      },
    },
    defaultVariants: {
      type: 'description',
      emphasis: 'normal',
      spacing: 'normal',
    },
  },
);

/**
 * 影片頁面容器樣式變體
 */
export const videoPageContainerVariants = cva(
  'relative w-full mx-auto transition-all duration-300',
  {
    variants: {
      layout: {
        mobile: 'max-w-full px-4',
        tablet: 'max-w-2xl px-6',
        desktop: 'max-w-4xl px-8',
        fullscreen: 'max-w-full px-0',
      },
      orientation: {
        portrait: 'min-h-screen flex flex-col',
        landscape: 'min-h-screen flex flex-row',
        auto: 'min-h-screen',
      },
      state: {
        normal: '',
        loading: 'opacity-75 pointer-events-none',
        error: 'bg-red-50 border border-red-200',
        disabled: 'opacity-50 pointer-events-none',
      },
      background: {
        default: 'bg-white',
        neutral: 'bg-neutral-50',
        dark: 'bg-neutral-900 text-white',
        transparent: 'bg-transparent',
      },
    },
    defaultVariants: {
      layout: 'desktop',
      orientation: 'auto',
      state: 'normal',
      background: 'default',
    },
  },
);

/**
 * 影片播放器容器樣式變體
 */
export const videoPlayerContainerVariants = cva(
  'relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg',
  {
    variants: {
      size: {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        fullWidth: 'w-full',
      },
      state: {
        loading: 'animate-pulse bg-neutral-200',
        ready: 'bg-black',
        playing: 'bg-black',
        paused: 'bg-black',
        error: 'bg-red-100 border-2 border-red-300',
      },
      interaction: {
        normal: 'cursor-pointer',
        disabled: 'cursor-not-allowed opacity-50',
        loading: 'cursor-wait',
      },
    },
    defaultVariants: {
      size: 'large',
      state: 'ready',
      interaction: 'normal',
    },
  },
);

/**
 * 響應式設計樣式變體
 */
export const responsiveVariants = cva('transition-all duration-300', {
  variants: {
    breakpoint: {
      mobile: 'block md:hidden',
      tablet: 'hidden md:block lg:hidden',
      desktop: 'hidden lg:block',
      all: 'block',
    },
    visibility: {
      show: 'block',
      hide: 'hidden',
      responsive: 'block md:hidden lg:block',
    },
  },
  defaultVariants: {
    breakpoint: 'all',
    visibility: 'show',
  },
});

/**
 * 動畫過渡樣式變體
 */
export const animationVariants = cva('transition-all', {
  variants: {
    duration: {
      fast: 'duration-150',
      normal: 'duration-300',
      slow: 'duration-500',
      slower: 'duration-700',
    },
    easing: {
      linear: 'ease-linear',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
      bounce: 'ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
    },
    type: {
      fade: 'transition-opacity',
      slide: 'transition-transform',
      scale: 'transition-transform',
      color: 'transition-colors',
      all: 'transition-all',
    },
  },
  defaultVariants: {
    duration: 'normal',
    easing: 'inOut',
    type: 'all',
  },
});

// ================== TypeScript 類型定義 ==================

export type RotationPromptOverlayVariantsProps = VariantProps<
  typeof rotationPromptOverlayVariants
>;
export type RotationPromptContentVariantsProps = VariantProps<
  typeof rotationPromptContentVariants
>;
export type RotationIconVariantsProps = VariantProps<
  typeof rotationIconVariants
>;
export type RotationTextVariantsProps = VariantProps<
  typeof rotationTextVariants
>;
export type VideoPageContainerVariantsProps = VariantProps<
  typeof videoPageContainerVariants
>;
export type VideoPlayerContainerVariantsProps = VariantProps<
  typeof videoPlayerContainerVariants
>;
export type ResponsiveVariantsProps = VariantProps<typeof responsiveVariants>;
export type AnimationVariantsProps = VariantProps<typeof animationVariants>;
