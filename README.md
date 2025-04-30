<div align="center" >
  <img src="./public/big-logo.png" width="200" alt="anna-cook-LOGO" />
</div>
<h1 align="center" style="font-weight: 700">安那煮 | 家傳好菜－Anna Cook</h1>
<div align="center" >
<a href="https://anna-cook.vercel.app/" >專案網址</a >
<span>|</span>
<a href="https://an-na-zhusorganization.gitbook.io/an-na-zhu-anna-cook" >專案文件</a >
</div>
<p align="center" style="font-color: #E64300" >請使用手機版打開頁面</p>

## 專案介紹
我們打造沉浸式影音食譜平台，透過逐步影片引導、簡單文字提示，讓做菜變得像玩一場好懂又直覺的教學遊戲。

分段式影片學習，讓學料理不再手忙腳亂，也成為收藏家傳回憶的時光機。

## 專案功能
- 首頁：展示所有食譜，並提供搜尋功能。
- 食譜詳細頁：提供食譜的詳細資訊，包括步驟、食材、營養成分等。
- 分類頁：提供食譜的分類，方便用戶查找。
- 搜尋頁：提供搜尋功能，方便用戶查找食譜。
- 上傳食譜頁：提供用戶上傳食譜的功能，方便用戶分享自己的食譜。
- 會員功能：提供用戶註冊、登入、忘記密碼、修改密碼、修改個人資料等功能。

## 建議體驗流程
### 上傳者
1. 登入註冊(google)
2. 進入首頁，點擊上傳食譜
3. 填寫食譜資訊，包括食譜名稱、食材、步驟、營養成分等
4. 上傳食譜
5. 進入會員中心，查看食譜草稿上傳狀態
6. 點擊草稿進入草稿編輯頁
7. 檢查草稿資訊，包括食譜名稱、食材、步驟、營養成分等
8. 點擊儲存草稿回到會員中心，點擊發布按鈕發佈草稿
9. 點擊已發佈進入已發佈食譜列表
10. 點擊食譜進入食譜詳細頁
11. 點擊分享按鈕，分享自己的食譜

### 瀏覽者
1. 進入首頁，查看所有食譜
2. 搜尋食譜，找到自己想學的食譜
3. 點擊食譜進入食譜詳細頁
4. 點擊觀看按鈕，觀看食譜教學影片
5. 點擊步驟按鈕，查看食譜步驟影片片段
6. 留言討論，與其他用戶交流心得
7. 收藏食譜，方便下次查看
8. 分享食譜，分享自己的心得

## 專案技術
- UI/UX: **Figma**、**lucide-icons**
- 專案管理：**Notion**、**Gitbook**、**Discord**、**Miro**
- 前端：**Next.js**、**React**、**Tailwind CSS**、**TypeScript**、**Shadcn UI**、**React-hook-form**、**ZOD**、**eslint**、**prettier**
- 後端：**C#**、**ASP.NET Core**、**Microsoft SQL Server**、**Restful API**
- 部署：**Vercel**

## 專案架構
```
anna-cook/
├── public/                     # 靜態資源目錄
│
├── src/                        # 源碼目錄
│   ├── components/             # React 元件
│   │   ├── ui/                 # UI 元件 (shadcn/ui)
│   │   └── common/             # 共用 元件
│   ├── config/                 # 設定檔
│   ├── hooks/                  # Custom React Hooks
│   ├── lib/                    # 共用函式庫
│   ├── pages/                  # Next.js 頁面
│   ├── services/              # API 服務
│   ├── stores/                # Zustand 狀態管理
│   ├── styles/                # 樣式檔案
│   └── types/                 # TypeScript 型別定義
│
├── 設定檔
│   ├── .eslintignore          # ESLint 忽略檔案設定
│   ├── .eslintrc.cjs          # ESLint 規則設定
│   ├── .gitignore             # Git 忽略檔案設定
│   ├── .prettierignore        # Prettier 忽略檔案設定
│   ├── .prettierrc.cjs        # Prettier 格式設定
│   ├── components.json        # shadcn/ui 元件設定
│   ├── next-env.d.ts         # Next.js TypeScript 環境定義
│   ├── next.config.ts        # Next.js 設定
│   ├── postcss.config.mjs    # PostCSS 設定
│   ├── tailwind.config.ts    # Tailwind CSS 設定
│   ├── tsconfig.json         # TypeScript 主要設定
│   └── tsconfig.node.json    # TypeScript Node 環境設定
│
└── package.json              # 專案依賴與腳本設定
```

## 安裝與使用（Installation & Usage）
Clone 專案
```
git clone https://github.com/heyi5478/anna-cook.git
```
進入專案目錄
```
cd anna-cook
```
安裝依賴
```
npm install
```
啟動開發伺服器
```
npm run dev
```

## Git flow 規範
### 分支命名規範：
  | 分支名稱 | 用途 |
  | -------- | ---- |
  | `main`   | 主分支，用於存放正式發佈的版本。 |
  | `feat/功能名稱` | 功能分支，用於開發新功能。 |
  | `fix/修復` | 修復 bug。 |
  | `refactor/重構` | 重構程式碼。 |
  | `style/樣式` | 調整樣式。 |
  | `docs/文件` | 更新文件。 |
  | `chore/其他` | 其他雜項。 |
### 分支開發流程：
  - 分支一律從 `dev` 開出去，做完再發 PR 回 `dev`
  - `dev` 發 PR 回 `main` 並合併
  - 合併後記得 tag PR 網址
  - 每次 release 時，記得 tag 版本號
### commit message 規範
  | type | usage |
  | -------- | ---- |
  | `feat` | 新增功能 |
  | `fix` | 修復 bug |
  | `refactor` | 重構程式碼 |
  | `style` | 調整樣式 |
  | `docs` | 更新文件 |
  | `chore` | 其他雜項 |
  | `test` | 新增測試 |
### PR Naming
  - 分支名稱
  - 用 md 格式描述這次 PR 做了什麼

---

## eslint 規範

### 程式碼風格與格式

- 使用 Prettier 進行程式碼格式化
- 程式碼行長度限制為 120 字元（字串和模板字面量除外）
- 採用 Airbnb 的基本編碼風格指南

### TypeScript 相關規則

- 允許使用 `any` 型別（但建議盡量避免）
- 允許使用 `@ts-ignore` 等註解（但應謹慎使用）
- 變數可以在定義前使用，但必須確保合理性

### Import 與模組導入

- 無需指定檔案副檔名（.js、.jsx、.ts、.tsx）
- 不強制使用 default export（可以使用 named exports）
- 允許在專案中使用開發依賴

### React 與 JSX 規範

- 不強制使用特定的函式元件定義方式（箭頭函式、函式宣告均可）
- 允許使用 JSX spread 屬性傳遞 props：`<Component {...props} />`
- 不需要定義 React 元件的 PropTypes
- Button 元件不需強制指定 type 屬性
- 允許 props 擁有可選屬性（不要求預設值）

### 無障礙性 (A11y) 豁免

- 允許靜態元素有交互事件（如 div 添加 onClick）
- 允許點擊事件無需鍵盤事件配對

### 其他規則

- 允許使用 console 語句（但生產環境應盡量避免）
- 允許使用 require 語句
- 允許在檔案中混合使用 import 和 module.exports

### 實際應用指南

1. 檔案命名

- React 元件檔案使用 `.tsx` 副檔名
- 純 TypeScript 檔案使用 `.ts` 副檔名

2. 導入順序建議

雖然 ESLint 未強制規定，但建議按以下順序組織導入：

- 外部庫和框架（React, Next.js 等）
- 專案內部共用組件/工具
- 型別定義和介面
- 樣式和資源

3. 使用建議

- 使用 VS Code 或其他編輯器的 ESLint 插件，獲取即時錯誤和警告提示
- 提交代碼前運行 `npm run lint` 確保無錯誤

---

## typescript 規範
本專案採用嚴格的 TypeScript 配置，旨在提供型別安全性和開發效率。以下是您需要了解的 TypeScript 規範：

### 編譯目標與環境

- **目標環境**：ES2020，支援現代瀏覽器功能
- **執行環境**：包含 DOM 和 DOM Iterable API
- **模組系統**：使用 ESNext 模組規範
- **JSX 處理**：使用 `preserve` 模式，由 Next.js 處理轉換

### 嚴格性與代碼品質

- **嚴格模式**：啟用 `strict: true`，提供最高程度的型別檢查
- **未使用變數檢查**：禁止未使用的區域變數和參數
- **Switch 陳述式**：禁止 switch case 語句意外貫穿 (fall through)

### 路徑別名與模組解析

- **路徑別名**：使用 `@/` 前綴代替相對路徑，指向 `src/` 目錄
- **模組解析策略**：使用 "bundler" 模式，針對打包工具優化
- **JSON 模組**：允許直接導入 JSON 文件 (resolveJsonModule)

### 注意事項

1. **跳過函式庫檢查**：專案設置 `skipLibCheck: true`，這有助於加快編譯速度，但可能會忽略第三方庫的型別錯誤
2. **增量編譯**：專案啟用 `incremental: true`，加速後續編譯
3. **模組隔離**：由於設置 `isolatedModules: true`，請確保每個文件都是有效的模組（至少包含一個 import 或 export）

遵循這些規範，您可以充分利用 TypeScript 提供的型別安全性，同時保持代碼的一致性和可維護性。如有疑問，可以參考專案中現有的代碼模式或尋求團隊成員的幫助。

本文檔說明專案的主要開發規範與最佳實踐，重點涵蓋 TypeScript 設定、程式碼風格、目錄結構以及其他專案開發注意事項，請各位團隊成員依照以下準則進行開發工作。

### TypeScript 編譯設定

1. tsconfig.json 設定

- **目標與庫**
    - **target** 設為 `ES2020`，表示程式碼會轉譯為符合 ES2020 標準的語法。
    - **lib** 包含 `dom`、`dom.iterable` 與 `ES2020`，確保同時支援瀏覽器 API 與現代 ECMAScript 特性。
- **模組與解析**
    - **module** 設定為 `esnext`，搭配 bundler 模式下的 **moduleResolution** 為 `bundler`，利於與現代前端構建工具整合。
    - 支持 JavaScript 檔案（`allowJs` 為 true），並允許 JSON 模組載入（`resolveJsonModule` 為 true）。
- **檔案與輸出**
    - **noEmit** 為 true，代表僅用作型別檢查與開發提示，不會產生輸出檔案。
    - 使用 **isolatedModules**，確保每個檔案能獨立進行編譯。
- **JSX 與 React**
    - **jsx** 設定為 `preserve`，由 Babel 或其他工具處理 JSX 轉譯。
- **嚴格模式與 Lint**
    - 啟用 `strict` 模式，並檢查未使用的變數與參數（`noUnusedLocals` 與 `noUnusedParameters`）。
    - `noFallthroughCasesInSwitch` 確保 switch-case 語法安全。
- **ES 模組相容性**
    - **esModuleInterop** 為 true，方便 CommonJS 與 ES 模組之間的互操作性。
- **增量編譯**
    - 啟用 `incremental`，可加速重複編譯過程。
- **路徑別名**
    - 利用 `paths` 定義 `@/*` 別名，對應 `./src/*`，方便模組導入。
- **包含與排除**
    - 包含 `next-env.d.ts`、所有 `.ts`、`.tsx` 檔案及 `src` 資料夾。
    - 排除 `node_modules` 目錄，避免不必要的檔案編譯。
- **專案參照**
    - 引用 `tsconfig.node.json` 以支援 Node.js 相關設定。

2. tsconfig.node.json 設定

- **Composite 編譯**
    - 設定 `composite` 為 true，利於建立多專案參照與編譯增量管理。
- **模組解析與匯入**
    - 同樣採用 `module` 為 `ESNext` 與 `moduleResolution` 為 `bundler`，確保與主 tsconfig 保持一致性。
    - 允許 `allowSyntheticDefaultImports`，方便使用 ES 模組語法導入 CommonJS 模組。
- **包含範圍**
    - 僅包含 `next.config.ts`，確保 Node.js 環境設定獨立管理。

---

## 授權資訊

本專案採用 MIT 授權，詳細條款請參考 `LICENSE` 文件。

---

## 貢獻者

- [@heyi5478](https://github.com/heyi5478)

---

## 聯絡方式

- 電子郵件：[steve.work5478@gmail.com](mailto:steve.work5478@gmail.com)
- 聯絡方式：[https://www.linkedin.com/in/ho-steve77](https://www.linkedin.com/in/ho-steve77)

---
