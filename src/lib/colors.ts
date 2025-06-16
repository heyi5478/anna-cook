/**
 * 色彩工具函式
 *
 * 提供色彩相關的輔助函式和工具，包含：
 * - 色彩值獲取和轉換
 * - 色階生成和管理
 * - 結構化的色彩類別映射
 * - TypeScript 類型安全支援
 */

import type {
  ColorScale,
  PrimaryColorKey,
  NeutralColorKey,
  FunctionalColorKey,
} from '@/config/colors';

// ============ TypeScript 類型定義 ============

/**
 * 色彩變數名稱類型
 * 包含所有可用的 CSS 變數名稱
 */
export type ColorVariableName =
  | `primary-${ColorScale}`
  | `neutral-${ColorScale}`
  | 'secondary-brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring';

/**
 * 色彩類別前綴類型
 */
export type ColorClassPrefix =
  | 'bg'
  | 'text'
  | 'border'
  | 'ring'
  | 'from'
  | 'to'
  | 'via';

/**
 * 完整的色彩類別名稱類型
 */
export type ColorClassName = `${ColorClassPrefix}-${string}`;

/**
 * 色階對照物件類型
 */
export type ColorScaleMap = Record<ColorScale, string>;

/**
 * 色彩類別分組類型
 */
export type ColorClassGroup = {
  bg: string[];
  text: string[];
  border: string[];
  ring: string[];
};

/**
 * 色彩系統類型
 */
export type ColorSystem = 'primary' | 'neutral' | 'functional' | 'semantic';

// ============ 核心工具函式 ============

/**
 * 獲取指定色彩變數的 HSL 值
 */
export function getColorValue(variableName: ColorVariableName): string {
  return `hsl(var(--${variableName}))`;
}

/**
 * 為指定色彩生成完整的色階對照
 */
export function generateColorScale(
  colorName: 'primary' | 'neutral',
  classPrefix: ColorClassPrefix = 'bg',
): ColorScaleMap {
  const scales: ColorScale[] = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ];

  return scales.reduce((acc, scale) => {
    acc[scale] = `${classPrefix}-${colorName}-${scale}`;
    return acc;
  }, {} as ColorScaleMap);
}

/**
 * 生成色彩的完整類別組 (背景、文字、邊框、環形)
 */
export function generateColorClassGroup(
  colorName: string,
  scale?: string,
): ColorClassGroup {
  const colorRef = scale ? `${colorName}-${scale}` : colorName;

  return {
    bg: [`bg-${colorRef}`],
    text: [`text-${colorRef}`],
    border: [`border-${colorRef}`],
    ring: [`ring-${colorRef}`],
  };
}

/**
 * 檢查色彩名稱是否為有效的色階色彩 (primary 或 neutral)
 */
export function isScaleColor(
  colorName: string,
): colorName is 'primary' | 'neutral' {
  return colorName === 'primary' || colorName === 'neutral';
}

/**
 * 獲取色彩的推薦對比文字顏色
 */
export function getContrastTextColor(
  colorName: string,
  scale?: string,
): string {
  if (colorName === 'primary') {
    const scaleNum = scale ? parseInt(scale, 10) : 600;
    return scaleNum >= 500 ? 'text-primary-50' : 'text-primary-900';
  }

  if (colorName === 'neutral') {
    const scaleNum = scale ? parseInt(scale, 10) : 500;
    return scaleNum >= 500 ? 'text-neutral-50' : 'text-neutral-900';
  }

  // Functional colors
  switch (colorName) {
    case 'secondary-brand':
    case 'success':
    case 'error':
      return 'text-white';
    case 'warning':
      return 'text-neutral-900';
    default:
      return 'text-foreground';
  }
}

// ============ 色彩類別常數 ============

/**
 * 完整的色彩類別映射
 * 提供結構化的色彩類別名稱組織
 */
export const colorClasses = {
  /**
   * Primary Colors - 主要品牌色階類別
   */
  primary: {
    bg: generateColorScale('primary', 'bg'),
    text: generateColorScale('primary', 'text'),
    border: generateColorScale('primary', 'border'),
    ring: generateColorScale('primary', 'ring'),
    semantic: {
      bg: 'bg-primary',
      text: 'text-primary',
      foreground: 'text-primary-foreground',
      border: 'border-primary',
      ring: 'ring-primary',
    },
  },

  /**
   * Neutral Colors - 中性色階類別
   */
  neutral: {
    bg: generateColorScale('neutral', 'bg'),
    text: generateColorScale('neutral', 'text'),
    border: generateColorScale('neutral', 'border'),
    ring: generateColorScale('neutral', 'ring'),
  },

  /**
   * Functional Colors - 功能性色彩類別
   */
  functional: {
    secondaryBrand: {
      bg: 'bg-secondary-brand',
      text: 'text-secondary-brand',
      border: 'border-secondary-brand',
      ring: 'ring-secondary-brand',
    },
    success: {
      bg: 'bg-success',
      text: 'text-success',
      border: 'border-success',
      ring: 'ring-success',
    },
    warning: {
      bg: 'bg-warning',
      text: 'text-warning',
      border: 'border-warning',
      ring: 'ring-warning',
    },
    error: {
      bg: 'bg-error',
      text: 'text-error',
      border: 'border-error',
      ring: 'ring-error',
    },
  },

  /**
   * Semantic Colors - shadCN 語義化色彩類別
   */
  semantic: {
    background: {
      bg: 'bg-background',
      text: 'text-background',
      border: 'border-background',
    },
    foreground: {
      bg: 'bg-foreground',
      text: 'text-foreground',
      border: 'border-foreground',
    },
    card: {
      bg: 'bg-card',
      text: 'text-card',
      foreground: 'text-card-foreground',
      border: 'border-card',
    },
    popover: {
      bg: 'bg-popover',
      text: 'text-popover',
      foreground: 'text-popover-foreground',
      border: 'border-popover',
    },
    secondary: {
      bg: 'bg-secondary',
      text: 'text-secondary',
      foreground: 'text-secondary-foreground',
      border: 'border-secondary',
    },
    muted: {
      bg: 'bg-muted',
      text: 'text-muted',
      foreground: 'text-muted-foreground',
      border: 'border-muted',
    },
    accent: {
      bg: 'bg-accent',
      text: 'text-accent',
      foreground: 'text-accent-foreground',
      border: 'border-accent',
    },
    destructive: {
      bg: 'bg-destructive',
      text: 'text-destructive',
      foreground: 'text-destructive-foreground',
      border: 'border-destructive',
    },
    border: {
      border: 'border-border',
    },
    input: {
      bg: 'bg-input',
      border: 'border-input',
    },
    ring: {
      ring: 'ring-ring',
    },
  },
} as const;

/**
 * 所有可用的背景色彩類別
 */
export const backgroundColorClasses = [
  // Primary colors
  ...Object.values(colorClasses.primary.bg),
  colorClasses.primary.semantic.bg,

  // Neutral colors
  ...Object.values(colorClasses.neutral.bg),

  // Functional colors
  colorClasses.functional.secondaryBrand.bg,
  colorClasses.functional.success.bg,
  colorClasses.functional.warning.bg,
  colorClasses.functional.error.bg,

  // Semantic colors
  colorClasses.semantic.background.bg,
  colorClasses.semantic.card.bg,
  colorClasses.semantic.popover.bg,
  colorClasses.semantic.secondary.bg,
  colorClasses.semantic.muted.bg,
  colorClasses.semantic.accent.bg,
  colorClasses.semantic.destructive.bg,
] as const;

/**
 * 所有可用的文字色彩類別
 */
export const textColorClasses = [
  // Primary colors
  ...Object.values(colorClasses.primary.text),
  colorClasses.primary.semantic.text,
  colorClasses.primary.semantic.foreground,

  // Neutral colors
  ...Object.values(colorClasses.neutral.text),

  // Functional colors
  colorClasses.functional.secondaryBrand.text,
  colorClasses.functional.success.text,
  colorClasses.functional.warning.text,
  colorClasses.functional.error.text,

  // Semantic colors
  colorClasses.semantic.foreground.text,
  colorClasses.semantic.card.foreground,
  colorClasses.semantic.popover.foreground,
  colorClasses.semantic.secondary.foreground,
  colorClasses.semantic.muted.foreground,
  colorClasses.semantic.accent.foreground,
  colorClasses.semantic.destructive.foreground,
] as const;

// ============ 快捷工具函式 ============

/**
 * 快速獲取 primary 色彩的 CSS 值
 */
export function primary(scale: PrimaryColorKey): string {
  return getColorValue(`primary-${scale}`);
}

/**
 * 快速獲取 neutral 色彩的 CSS 值
 */
export function neutral(scale: NeutralColorKey): string {
  return getColorValue(`neutral-${scale}`);
}

/**
 * 快速獲取 functional 色彩的 CSS 值
 */
export function functional(
  colorName: FunctionalColorKey | 'secondary-brand',
): string {
  return getColorValue(colorName as ColorVariableName);
}

// ============ 色彩組合工具 ============

/**
 * 預定義的色彩組合方案
 */
export const colorCombinations = {
  /**
   * 按鈕色彩組合
   */
  buttons: {
    primary: {
      default: 'bg-primary-600 text-primary-50 hover:bg-primary-700',
      outline: 'border-primary-600 text-primary-600 hover:bg-primary-50',
      ghost: 'text-primary-600 hover:bg-primary-50',
    },
    secondary: {
      default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border-secondary text-secondary-foreground hover:bg-secondary',
      ghost: 'text-secondary-foreground hover:bg-secondary',
    },
    success: {
      default: 'bg-success text-white hover:bg-success/90',
      outline: 'border-success text-success hover:bg-success/10',
      ghost: 'text-success hover:bg-success/10',
    },
    warning: {
      default: 'bg-warning text-neutral-900 hover:bg-warning/90',
      outline: 'border-warning text-warning hover:bg-warning/10',
      ghost: 'text-warning hover:bg-warning/10',
    },
    error: {
      default: 'bg-error text-white hover:bg-error/90',
      outline: 'border-error text-error hover:bg-error/10',
      ghost: 'text-error hover:bg-error/10',
    },
  },

  /**
   * 卡片色彩組合
   */
  cards: {
    default: 'bg-card text-card-foreground border-border',
    primary: 'bg-primary-50 text-primary-900 border-primary-200',
    neutral: 'bg-neutral-50 text-neutral-900 border-neutral-200',
    muted: 'bg-muted text-muted-foreground border-border',
  },

  /**
   * 狀態色彩組合
   */
  status: {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
    info: 'bg-secondary-brand/10 text-secondary-brand border-secondary-brand/20',
  },
} as const;

/**
 * 根據色彩組合名稱獲取對應的類別字串
 */
export function getColorCombination(
  category: keyof typeof colorCombinations,
  variant: string,
  style?: string,
): string {
  const combination = colorCombinations[category] as any;

  if (!combination?.[variant]) {
    console.warn(`Color combination not found: ${category}.${variant}`);
    return '';
  }

  if (style && combination[variant][style]) {
    return combination[variant][style];
  }

  if (typeof combination[variant] === 'string') {
    return combination[variant];
  }

  // 返回 default 樣式或第一個可用樣式
  return (
    combination[variant].default || Object.values(combination[variant])[0] || ''
  );
}
