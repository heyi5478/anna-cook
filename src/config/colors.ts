/**
 * 色票配置系統
 *
 * 定義整個設計系統的色彩規範，包含：
 * - Primary Colors: 主要品牌色階 (50-900)
 * - Neutral Colors: 中性色階 (50-900)
 * - Functional Colors: 功能性顏色 (secondary, success, warning, error)
 *
 * 所有色彩值來自設計師提供的設計規格
 * 使用 const assertions 確保類型安全
 */

/**
 * Primary Colors - 主要品牌色階
 * 從淺到深的完整色階，用於主要 UI 元素
 */
export const primaryColors = {
  50: '#FCE8E6',
  100: '#F7BDB8',
  200: '#F2928A',
  300: '#ED675C',
  400: '#E83C2E',
  500: '#E31100',
  600: '#C02A00',
  700: '#9D2200',
  800: '#7A1A00',
  900: '#571200',
} as const;

/**
 * Neutral Colors - 中性色階
 * 用於文字、背景和邊框的中性色彩
 */
export const neutralColors = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
} as const;

/**
 * Functional Colors - 功能性顏色
 * 用於特定功能和狀態指示的色彩
 */
export const functionalColors = {
  // 次要品牌色
  secondary: '#00A5E6',

  // 成功狀態色
  success: '#22C55E',

  // 警告狀態色
  warning: '#FDE047',

  // 錯誤狀態色
  error: '#FF4E0B',
} as const;

/**
 * 完整的色票配置
 * 集合所有色彩定義
 */
export const colors = {
  primary: primaryColors,
  neutral: neutralColors,
  ...functionalColors,
} as const;

// ============ TypeScript 類型定義 ============

/**
 * 色階等級類型
 * 定義所有可用的色階級別
 */
export type ColorScale =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

/**
 * Primary Colors 類型
 * 基於 primaryColors 物件推導的類型
 */
export type PrimaryColor = typeof primaryColors;

/**
 * Primary Colors 鍵值類型
 * 所有 primary 色階的鍵名
 */
export type PrimaryColorKey = keyof PrimaryColor;

/**
 * Primary Colors 值類型
 * 所有 primary 色階的色彩值
 */
export type PrimaryColorValue = PrimaryColor[PrimaryColorKey];

/**
 * Neutral Colors 類型
 * 基於 neutralColors 物件推導的類型
 */
export type NeutralColor = typeof neutralColors;

/**
 * Neutral Colors 鍵值類型
 * 所有 neutral 色階的鍵名
 */
export type NeutralColorKey = keyof NeutralColor;

/**
 * Neutral Colors 值類型
 * 所有 neutral 色階的色彩值
 */
export type NeutralColorValue = NeutralColor[NeutralColorKey];

/**
 * Functional Colors 類型
 * 基於 functionalColors 物件推導的類型
 */
export type FunctionalColor = typeof functionalColors;

/**
 * Functional Colors 鍵值類型
 * 所有功能性顏色的鍵名
 */
export type FunctionalColorKey = keyof FunctionalColor;

/**
 * Functional Colors 值類型
 * 所有功能性顏色的色彩值
 */
export type FunctionalColorValue = FunctionalColor[FunctionalColorKey];

/**
 * 完整的色票類型
 * 基於 colors 物件推導的類型
 */
export type Colors = typeof colors;

/**
 * 所有色票鍵值類型
 * 包含所有可用的色彩鍵名
 */
export type ColorKey = keyof Colors;

/**
 * 色彩值聯合類型
 * 所有可能的色彩值的聯合類型
 */
export type ColorValue =
  | PrimaryColorValue
  | NeutralColorValue
  | FunctionalColorValue;

/**
 * 色彩配置物件類型
 * 用於型別檢查色彩配置物件
 */
export type ColorConfig = {
  [K in ColorKey]: K extends 'primary' | 'neutral'
    ? Record<ColorScale, string>
    : string;
};

// ============ 工具函式 ============

/**
 * 獲取指定的 primary 色階
 * @param scale - 色階等級
 * @returns 對應的色彩值
 */
export const getPrimaryColor = (scale: PrimaryColorKey): PrimaryColorValue => {
  return primaryColors[scale];
};

/**
 * 獲取指定的 neutral 色階
 * @param scale - 色階等級
 * @returns 對應的色彩值
 */
export const getNeutralColor = (scale: NeutralColorKey): NeutralColorValue => {
  return neutralColors[scale];
};

/**
 * 獲取指定的功能性顏色
 * @param colorKey - 功能性顏色鍵名
 * @returns 對應的色彩值
 */
export const getFunctionalColor = (
  colorKey: FunctionalColorKey,
): FunctionalColorValue => {
  return functionalColors[colorKey];
};

/**
 * 檢查是否為有效的 HEX 色彩值
 * @param color - 要檢查的色彩值
 * @returns 是否為有效的 HEX 色彩值
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * 驗證色票配置的完整性
 * @returns 驗證結果物件
 */
export const validateColorConfig = () => {
  const errors: string[] = [];

  // 檢查 primary colors
  Object.entries(primaryColors).forEach(([key, value]) => {
    if (!isValidHexColor(value)) {
      errors.push(`Primary color ${key} has invalid hex value: ${value}`);
    }
  });

  // 檢查 neutral colors
  Object.entries(neutralColors).forEach(([key, value]) => {
    if (!isValidHexColor(value)) {
      errors.push(`Neutral color ${key} has invalid hex value: ${value}`);
    }
  });

  // 檢查 functional colors
  Object.entries(functionalColors).forEach(([key, value]) => {
    if (!isValidHexColor(value)) {
      errors.push(`Functional color ${key} has invalid hex value: ${value}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 預設匯出
export default colors;
