/**
 * 色票展示元件
 * 用於展示和測試新的色票配置系統
 */
import React from 'react';

/**
 * 單一色票展示元件
 */
const ColorSwatch: React.FC<{
  name: string;
  className: string;
  description?: string;
}> = ({ name, className, description }) => (
  <div className="flex flex-col items-center space-y-2">
    <div
      className={`w-16 h-16 rounded-lg border-2 border-neutral-200 ${className}`}
      title={`${name}: ${description || 'No description'}`}
    />
    <div className="text-center">
      <p className="text-sm font-medium text-neutral-900">{name}</p>
      {description && <p className="text-xs text-neutral-500">{description}</p>}
    </div>
  </div>
);

/**
 * 色階組展示元件
 */
const ColorScaleGroup: React.FC<{
  title: string;
  colors: Array<{ name: string; className: string; description?: string }>;
}> = ({ title, colors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
    <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
      {colors.map((color) => (
        <ColorSwatch
          key={color.name}
          name={color.name}
          className={color.className}
          description={color.description}
        />
      ))}
    </div>
  </div>
);

/**
 * 主要的色票展示元件
 */
export const ColorPalette: React.FC = () => {
  // Primary Colors 色階
  const primaryColors = [
    { name: '50', className: 'bg-primary-50', description: '最淺' },
    { name: '100', className: 'bg-primary-100' },
    { name: '200', className: 'bg-primary-200' },
    { name: '300', className: 'bg-primary-300' },
    { name: '400', className: 'bg-primary-400' },
    { name: '500', className: 'bg-primary-500', description: '基準色' },
    { name: '600', className: 'bg-primary-600', description: '品牌主色' },
    { name: '700', className: 'bg-primary-700' },
    { name: '800', className: 'bg-primary-800' },
    { name: '900', className: 'bg-primary-900', description: '最深' },
  ];

  // Neutral Colors 色階
  const neutralColors = [
    { name: '50', className: 'bg-neutral-50', description: '最淺' },
    { name: '100', className: 'bg-neutral-100' },
    { name: '200', className: 'bg-neutral-200' },
    { name: '300', className: 'bg-neutral-300' },
    { name: '400', className: 'bg-neutral-400' },
    { name: '500', className: 'bg-neutral-500', description: '中性' },
    { name: '600', className: 'bg-neutral-600' },
    { name: '700', className: 'bg-neutral-700' },
    { name: '800', className: 'bg-neutral-800' },
    { name: '900', className: 'bg-neutral-900', description: '最深' },
  ];

  // Functional Colors
  const functionalColors = [
    {
      name: 'Secondary Brand',
      className: 'bg-secondary-brand',
      description: '品牌次要色',
    },
    { name: 'Success', className: 'bg-success', description: '成功狀態' },
    { name: 'Warning', className: 'bg-warning', description: '警告狀態' },
    { name: 'Error', className: 'bg-error', description: '錯誤狀態' },
  ];

  // Semantic Colors (shadCN)
  const semanticColors = [
    {
      name: 'Background',
      className: 'bg-background border-2 border-neutral-300',
      description: '背景色',
    },
    { name: 'Foreground', className: 'bg-foreground', description: '前景色' },
    {
      name: 'Card',
      className: 'bg-card border-2 border-neutral-300',
      description: '卡片背景',
    },
    {
      name: 'Secondary',
      className: 'bg-secondary',
      description: 'shadCN 次要色',
    },
    { name: 'Muted', className: 'bg-muted', description: '靜音色' },
    { name: 'Accent', className: 'bg-accent', description: '強調色' },
    { name: 'Border', className: 'bg-border', description: '邊框色' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* 標題 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">色票配置系統</h1>
        <p className="text-neutral-600">
          完整的品牌色彩規範，包含 Primary、Neutral 和 Functional Colors
        </p>
      </div>

      {/* Primary Colors */}
      <ColorScaleGroup
        title="Primary Colors - 主要品牌色階"
        colors={primaryColors}
      />

      {/* Neutral Colors */}
      <ColorScaleGroup
        title="Neutral Colors - 中性色階"
        colors={neutralColors}
      />

      {/* Functional Colors */}
      <ColorScaleGroup
        title="Functional Colors - 功能性顏色"
        colors={functionalColors}
      />

      {/* Semantic Colors */}
      <ColorScaleGroup
        title="Semantic Colors - 語義化顏色 (shadCN)"
        colors={semanticColors}
      />

      {/* 使用範例 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-neutral-900">使用範例</h3>

        {/* 按鈕範例 */}
        <div className="space-y-4">
          <h4 className="font-medium text-neutral-800">按鈕樣式</h4>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary-brand text-white rounded-lg hover:bg-secondary-brand/90 transition-colors">
              Secondary Brand Button
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
              Secondary Button (shadCN)
            </button>
            <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors">
              Success Button
            </button>
            <button className="px-4 py-2 bg-warning text-neutral-900 rounded-lg hover:bg-warning/90 transition-colors">
              Warning Button
            </button>
            <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors">
              Error Button
            </button>
          </div>
        </div>

        {/* 卡片範例 */}
        <div className="space-y-4">
          <h4 className="font-medium text-neutral-800">卡片樣式</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <h5 className="font-semibold text-card-foreground">預設卡片</h5>
              <p className="text-muted-foreground text-sm">
                使用 semantic colors
              </p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-2">
              <h5 className="font-semibold text-primary-900">品牌色卡片</h5>
              <p className="text-primary-700 text-sm">使用 primary colors</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2">
              <h5 className="font-semibold text-neutral-900">中性色卡片</h5>
              <p className="text-neutral-600 text-sm">使用 neutral colors</p>
            </div>
          </div>
        </div>
      </div>

      {/* 使用說明 */}
      <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">使用方式</h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <p>
            <strong>Brand Color System (Tailwind Classes):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                bg-primary-600
              </code>{' '}
              - 品牌主色背景
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                text-neutral-900
              </code>{' '}
              - 深色文字
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                border-primary-200
              </code>{' '}
              - 淺色品牌邊框
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                bg-secondary-brand
              </code>{' '}
              - 品牌次要色背景
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">bg-success</code> -
              成功狀態背景
            </li>
          </ul>
          <p className="mt-4">
            <strong>Semantic Colors (shadCN 相容):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <code className="bg-neutral-200 px-1 rounded">bg-secondary</code>{' '}
              - shadCN 次要色 (中性色)
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">bg-muted</code> -
              靜音色
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">bg-accent</code> -
              強調色
            </li>
          </ul>
          <p className="mt-4">
            <strong>CSS Variables:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                hsl(var(--primary-600))
              </code>{' '}
              - 直接使用 CSS 變數
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                hsl(var(--secondary-brand))
              </code>{' '}
              - 品牌次要色變數
            </li>
            <li>
              <code className="bg-neutral-200 px-1 rounded">
                hsl(var(--neutral-500))
              </code>{' '}
              - 中性色變數
            </li>
          </ul>
        </div>

        {/* 色彩區分說明 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ 重要區分</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>
              <strong>secondary-brand</strong>: 品牌次要色 (#00A5E6, 藍色) -
              用於品牌識別
            </p>
            <p>
              <strong>secondary</strong>: shadCN 語義化次要色 (中性色) - 用於 UI
              元件
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
