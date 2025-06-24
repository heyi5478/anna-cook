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
1. 進入首頁
2. 點選左上方漢堡功能列表圖示
3. 點選登入/註冊
4. 選擇Gmail註冊登入方式
5. 登入後再點選漢堡功能列
6. 點擊"上傳食譜"
  - **Step1**
    1. 輸入食譜名稱
    2. 選擇上傳食譜封面圖片
    3. 勾選同意隱私權政策
    4. 點選下一步
  - **Step2**
    1. 輸入食譜簡介及食材份量
    2. 自由加入食譜標籤
    3. 填寫份量人數
    4. 點選下一步
  - **Step3**
    1. 上傳食譜影片
    2. 開始編輯單一步驟時間軸
    3. 輸入敘述文字
    4. 待全部步驟都編輯好時，點選全部完成
7. 回到會員中心
8. 於"我的食譜 - 草稿"區域點擊草稿卡片右上方"發佈"按鈕
9. 點擊確認要發佈
10. 成功發佈食譜

### 瀏覽者
1. 進入首頁
2. 點擊上方搜尋
3. 輸入關鍵字"蛋餅"
4. 瀏覽食譜列表
5. 點擊"蛋餅"食譜
6. 瀏覽食譜資訊
7. 點擊教學開始進入步驟
8. 點擊浮動按鈕跳轉上下步驟
9. 點擊畫面右下方快捷列
10. 選取想跳轉到的步驟
11. 跳到最後一步驟
12. 教學結束回到食譜內頁

## 專案技術
- UI/UX: **Figma**、**lucide-icons**
- 專案管理：**Notion**、**Gitbook**、**Discord**、**Miro**
- 前端架構：
  - 框架：**Next.js (Pages Router)**、**React**、**TypeScript**
  - 樣式：**Tailwind CSS**、**Shadcn UI**、**CVA (Class Variance Authority)**
  - 狀態管理：**Zustand** (功能分組架構)
  - 表單處理：**React-hook-form**、**ZOD** (表單驗證)
  - 測試框架：**Jest**、**@testing-library/react** (單元測試)
  - 程式碼品質：**ESLint**、**Prettier**
- 後端：**C#**、**ASP.NET Core**、**Microsoft SQL Server**、**Restful API**
- 部署：**Vercel**

## 專案架構
```
anna-cook/
├── public/                     # 靜態資源目錄
│
├── src/                        # 源碼目錄 (重構後)
│   ├── __tests__/              # 測試檔案目錄
│   │   ├── hooks/              # Custom Hooks 測試
│   │   └── utils/              # 工具函式測試
│   ├── components/             # React 元件 (分層架構)
│   │   ├── ui/                 # UI 基礎元件 (shadcn/ui + CVA)
│   │   ├── common/             # 通用/共用元件
│   │   ├── features/           # 功能特定元件
│   │   ├── pages/              # 頁面專用元件
│   │   └── layout/             # 佈局元件
│   ├── stores/                 # Zustand 狀態管理 (按功能分組)
│   │   ├── recipes/            # 食譜相關狀態
│   │   └── video/              # 影片相關狀態
│   ├── services/               # API 服務層 (按功能分組)
│   │   ├── auth/               # 認證相關服務
│   │   ├── recipes/            # 食譜相關服務
│   │   ├── users/              # 用戶相關服務
│   │   ├── utils/              # 服務工具函式
│   │   ├── server-api.ts       # 通用 API 客戶端
│   │   └── index.ts            # 服務統一匯出
│   ├── hooks/                  # Custom React Hooks
│   ├── lib/                    # 共用函式庫與工具
│   │   ├── constants/          # 常數定義
│   │   ├── utils.ts            # 通用工具函式
│   │   └── auth-middleware.ts  # 認證中間件
│   ├── types/                  # TypeScript 型別定義
│   │   ├── api.ts              # API 型別
│   │   ├── auth.ts             # 認證型別
│   │   ├── recipe.ts           # 食譜型別
│   │   ├── ui.ts               # UI 元件型別
│   │   └── video-editor.ts     # 影片編輯器型別
│   ├── config/                 # 應用程式設定
│   │   └── index.ts            # 設定統一匯出
│   ├── pages/                  # Next.js 頁面 (Pages Router)
│   │   ├── api/                # API 路由
│   │   ├── _app.tsx            # App 元件
│   │   ├── _document.tsx       # Document 元件
│   │   └── [各功能頁面目錄]/    # 功能頁面
│   ├── styles/                 # 樣式檔案
│   │   └── globals.css         # 全域樣式 (Tailwind CSS)
│   └── setupTests.js           # Jest 測試環境設定
│
├── 設定檔
│   ├── .eslintignore          # ESLint 忽略檔案設定
│   ├── .eslintrc.cjs          # ESLint 規則設定
│   ├── .gitignore             # Git 忽略檔案設定
│   ├── .prettierignore        # Prettier 忽略檔案設定
│   ├── .prettierrc.cjs        # Prettier 格式設定
│   ├── components.json        # shadcn/ui 元件設定
│   ├── jest.config.js         # Jest 測試配置
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
clone 專案
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
執行測試
```
npm run test
```
執行測試並監視檔案變更
```
npm run test:watch
```
執行測試並產生覆蓋率報告
```
npm run test:coverage
```

## Git Hooks 自動化品質檢查 (Husky)

本專案使用 **Husky** 來管理 Git hooks，確保程式碼品質和專案穩定性。

### 🔧 已配置的 Git Hooks

#### Pre-commit Hook
在每次 `git commit` 前自動執行：
- **ESLint 檢查**：確保程式碼風格一致
- **快速測試**：執行相關測試案例

#### Pre-push Hook
在每次 `git push` 前自動執行：
- **完整測試套件**：執行所有測試並生成覆蓋率報告
- **專案建構驗證**：確保專案可以成功建構

### 🚀 新團隊成員設定步驟

1. **clone 專案後，安裝依賴**：
   ```bash
   git clone https://github.com/heyi5478/anna-cook.git
   cd anna-cook
   npm install  # 會自動執行 "prepare": "husky" 初始化 hooks
   ```

2. **驗證 Husky 是否正確安裝**：
   ```bash
   npm run hooks:check
   ```

3. **測試 Git hooks**：
   ```bash
   # 測試 pre-commit hook
   npm run pre-commit

   # 測試 pre-push hook
   npm run pre-push
   ```

### ⚠️ 跳過 Hooks 的使用時機

在特殊情況下，可以使用 `--no-verify` 跳過 Git hooks：

```bash
# 跳過 pre-commit hook（緊急修復時）
git commit -m "hotfix: 緊急修復" --no-verify

# 跳過 pre-push hook（CI/CD 會進行檢查時）
git push --no-verify
```

**⚠️ 注意**：跳過 hooks 只應在緊急情況下使用，務必確保後續修正品質問題。

### 📋 手動執行品質檢查

```bash
# 執行所有品質檢查（等同於 pre-push）
npm run quality:all

# 僅執行 ESLint 檢查
npm run lint

# 僅執行測試
npm run test

# 僅執行建構檢查
npm run build
```

### 🛠️ 故障排除

如果 Git hooks 沒有正常工作：

1. **重新安裝 Husky**：
   ```bash
   npm run hooks:reinstall
   ```

2. **檢查 hooks 檔案權限**：
   ```bash
   ls -la .husky/
   # 應該看到 pre-commit 和 pre-push 具有執行權限 (-rwxr-xr-x)
   ```

3. **手動設定權限**：
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/pre-push
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

## 測試規範
### 測試覆蓋率要求
- 函式覆蓋率：80% 以上
- 分支覆蓋率：80% 以上  
- 行覆蓋率：80% 以上
- 語句覆蓋率：80% 以上

### 測試檔案組織
- 測試檔案命名：`{模組名稱}.test.ts`
- 測試檔案位置：`src/__tests__/` 目錄下，按功能分類
- 每個工具模組都應有對應的測試檔案

### 測試撰寫規範
- 使用 Jest 框架進行單元測試
- 測試名稱使用正體中文描述預期行為
- 格式：`應該 + 預期行為` 或 `當 + 條件 + 時應該 + 結果`
- 在每個測試函式前加上中文功能註解
- 遵循 Arrange-Act-Assert (AAA) 模式
### PR Naming
  - 分支名稱
  - 用 md 格式描述這次 PR 做了什麼

## 授權資訊

本專案採用 MIT 授權，詳細條款請參考 `LICENSE` 文件。

## 貢獻者

- [@heyi5478](https://github.com/heyi5478)

## 聯絡方式

- 電子郵件：[steve.work5478@gmail.com](mailto:steve.work5478@gmail.com)
- 聯絡方式：[https://www.linkedin.com/in/ho-steve77](https://www.linkedin.com/in/ho-steve77)

---
如果這個專案對你有幫助，請給它一個星星 ⭐ ，謝謝！

