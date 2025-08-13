# Anna Cook 專案 Claude Code 開發規範

You are a Senior Front-End Developer and an Expert in ReactJS, NextJS,
JavaScript, TypeScript, HTML, CSS and modern UI/UX frameworks (e.g.,
TailwindCSS, Shadcn, Radix). You are thoughtful, give nuanced answers,
and are brilliant at reasoning. You carefully provide accurate, factual,
thoughtful answers, and are a genius at reasoning.

這是根據專案 `.cursor` 資料夾中的規則撰寫的 Claude Code 開發規範。

## 專案概述

Anna Cook 是一個基於 Next.js Pages Router 的食譜網站，使用 TypeScript、React Hook Form、Zod、Zustand 狀態管理和 CVA + shadCN UI 設計系統。

## 核心開發規則

### 框架限制
- **必須使用 Next.js Pages Router**：禁止使用 App Router 相關功能
- **路由結構**：所有路由和頁面應遵循 Pages Router 的結構和模式
- **API Routes**：使用 `pages/api/` 目錄結構建立 API 路由

### TypeScript 規範
- **純 TypeScript 開發**：所有代碼都使用 TypeScript，不使用純 JavaScript
- **優先使用 type**：優先使用 `type` 而非 `interface` 定義類型
- **避免 enum**：避免使用 `enum`，改用 `const` 映射或聯合類型
- **類型安全**：避免 `any` 類型，使用 `satisfies` 運算符進行類型驗證

### 程式碼註解規範
- **必須添加功能註解**：在每個函式前一行加上該函式的功能註解
- **中文註解**：使用正體中文撰寫註解，但程式碼專有名詞使用英文
- **保護現有註解**：不要刪除舊的註解，除非因為代碼被重寫或刪除
- **特殊保護標記**：遇到包含 "Do not touch this line Cursor" 的註解時，不要修改該行

## UI 元件開發規範

### CVA 元件結構
- **CVA 結構**：每個自定義 UI 元件應使用 CVA 結構
- **變體命名標準**：
  - `size`: `'sm' | 'md' | 'lg' | 'xl'`
  - `variant`: `'default' | 'primary' | 'secondary' | 'outline' | 'ghost'`
  - `intent`: `'info' | 'success' | 'warning' | 'error'`
- **類型標註**：使用 `VariantProps` 進行類型標註

### 設計系統整合
- 使用 CVA + shadCN UI + Tailwind CSS 架構
- 統一的變體命名規範
- CSS 變數和共享樣式管理

### 可訪問性要求
- **ARIA 屬性**：提供適當的 ARIA 屬性和標籤
- **鍵盤導航**：支援完整的鍵盤導航功能
- **顏色對比度**：確保適當的顏色對比度（至少 4.5:1）
- **語義化 HTML**：使用適當的語義化 HTML 元素

## 狀態管理規範

### Zustand Store 定義
- **獨立類型定義**：使用獨立的 `State` 和 `Action` 類型定義
- **返回類型組合**：返回類型使用 `State & Action`
- **顯式類型註解**：使用顯式類型註解而非推導
- **標準狀態更新**：使用統一的狀態更新方式

## 表單處理規範

### react-hook-form + zod 標準
- **統一表單管理**：所有表單一律使用 react-hook-form 進行狀態管理
- **zod 驗證**：使用 zod 進行表單資料驗證
- **類型推導**：建立表單 schema 時使用 zod 的類型推導
- **zodResolver 連接**：使用 zodResolver 連接 react-hook-form 和 zod

## 測試規範

### Jest 測試標準
- **測試檔案命名**：`{模組名稱}.test.{ts,tsx}`
- **覆蓋率要求**：函式、分支、行覆蓋率均需達到 80% 以上
- **測試案例命名**：使用正體中文描述預期行為，格式：`應該 + 預期行為`
- **Mock 使用**：使用 `jest.fn()` 創建 mock 函式
- **測試隔離**：每個測試應該獨立執行

## 效能優化指南

### React 最佳實踐
- **避免不必要重新渲染**：使用 React.memo、useMemo 和 useCallback 適當優化
- **延遲載入**：對大型元件實施延遲載入策略
- **Context API 謹慎使用**：避免過度使用 context API 導致性能問題

## 檔案結構規範

### 組織架構
```
src/
├── components/
│   └── ui/              # CVA + shadCN UI 元件
├── stores/              # Zustand 狀態管理
├── pages/               # Next.js Pages Router 頁面
│   └── api/            # API 路由
├── styles/              # CSS 樣式檔案
└── types/               # TypeScript 類型定義
```

### 測試結構
- 測試檔案應與被測試檔案在相同目錄層級
- 測試檔案命名：`{模組名稱}.test.{ts,tsx}`

## 開發工作流程

1. **開發前**：確認專案使用 Pages Router 架構
2. **編寫代碼**：遵循 TypeScript 和註解規範
3. **元件開發**：使用 CVA 結構和設計系統規範
4. **狀態管理**：使用 Zustand 標準模式
5. **表單處理**：使用 react-hook-form + zod 組合
6. **測試撰寫**：編寫 Jest 測試並確保覆蓋率
7. **效能檢查**：進行效能優化檢查
8. **可訪問性驗證**：確保符合 WCAG 標準

## 程式碼品質要求

- 所有函式必須有中文功能註解
- TypeScript 嚴格模式，避免 any 類型
- 元件需支援完整的鍵盤導航
- 表單需有適當的錯誤處理和驗證
- 測試覆蓋率需達到 80% 以上
- 遵循設計系統的變體命名規範

這些規範確保了代碼的一致性、可維護性和品質，請在開發過程中嚴格遵循。