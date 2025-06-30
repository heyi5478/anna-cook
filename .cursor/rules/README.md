# Cursor Project Rules 組織架構

本專案使用新的 Cursor Project Rules 格式來管理開發規範和最佳實踐。所有規則按功能領域組織，並根據適用情境分為三種類型。

## 目錄結構

```
.cursor/rules/
├── accessibility/           # 可訪問性標準
├── code-style/             # 程式碼風格和最佳實踐
├── core-behavior/          # 核心 AI 行為規則
├── design-system/          # CVA、shadCN、Tailwind 相關
├── form-handling/          # React Hook Form、Zod 表單處理
├── framework-rules/        # Next.js、React 框架規則
├── state-management/       # Zustand 狀態管理
├── testing-rules/          # Jest 測試規範
└── typescript-rules/       # TypeScript 開發標準
```

## 規則類型說明

### Always Rules (`alwaysApply: true`)
這些規則始終適用於整個專案：
- **代碼註解規範** - 確保所有代碼都有適當註解
- **TypeScript 使用規範** - TypeScript 開發標準
- **Next.js Pages Router** - 框架架構限制

### Auto Attached Rules (`globs: 模式`)
這些規則根據檔案模式自動套用：
- **CVA 元件結構** (`src/components/ui/*.tsx`) - UI 元件開發規範
- **shadCN 整合** (`src/components/ui/*.tsx`) - shadCN 使用標準
- **CSS 維護策略** (`src/styles/**/*.css`) - 樣式管理規範
- **Zustand Store 定義** (`src/stores/**/*.ts`) - 狀態管理規範
- **表單處理標準** (`**/*.{ts,tsx}`) - 表單開發規範
- **Jest 測試規範** (`**/*.{test,spec}.{ts,tsx}`) - 測試開發標準

### Agent Requested Rules (`alwaysApply: false`)
這些規則需要時提供指導：
- **設計系統架構** - 整體架構指導
- **效能優化指南** - 性能最佳實踐
- **可訪問性標準** - WCAG 合規指導

## 規則檔案命名規範

檔案命名格式：`{功能領域}-{具體規則}.mdc`

範例：
- `cva-component-structure.mdc` - CVA 元件結構規範
- `zustand-file-structure.mdc` - Zustand 檔案組織規範
- `jest-testing-standards.mdc` - Jest 測試標準

## 主要規則摘要

### 設計系統
- 使用 CVA + shadCN UI + Tailwind CSS 架構
- 統一的變體命名規範 (size, variant, intent)
- CSS 變數和共享樣式管理

### 狀態管理
- Zustand 檔案結構和命名規範
- Store 定義和類型標註標準
- 元件中的選擇器使用最佳實踐

### 表單處理
- react-hook-form + zod 標準組合
- Schema 定義和類型推導
- 錯誤處理和驗證模式

### 測試規範
- Jest 配置和撰寫標準
- 測試案例命名規範 (正體中文)
- 覆蓋率要求 (80% 以上)

### 可訪問性
- WCAG 合規要求
- ARIA 屬性和鍵盤導航
- 螢幕閱讀器支援

## 使用方式

這些規則會根據您正在編輯的檔案類型自動套用，或在需要特定指導時由 AI 助手參考。Always Rules 始終生效，Auto Attached Rules 根據檔案模式觸發，Agent Requested Rules 在相關情境下提供指導。

## 維護

當專案需求變更或最佳實踐更新時，請相應更新對應的規則檔案。確保規則保持最新且與實際開發流程一致。 