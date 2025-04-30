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
6. 點擊”上傳食譜”
**Step1**
a. 輸入食譜名稱
b. 選擇上傳食譜封面圖片
c. 勾選同意隱私權政策
d. 點選下一步
**Step2**
a. 輸入食譜簡介及食材份量
b. 自由加入食譜標籤
c. 填寫份量人數
d. 點選下一步
**Step3**
a. 上傳食譜影片
b. 開始編輯單一步驟時間軸
c. 輸入敘述文字
d. 待全部步驟都編輯好時，點選全部完成

7. 回到會員中心
8. 於”我的食譜 - 草稿”區域點擊草稿卡片右上方”發佈”按鈕
9. 點擊確認要發佈
10. 成功發佈食譜

### 瀏覽者
1. 進入首頁
2. 點擊上方搜尋
3. 輸入關鍵字”蛋餅”
4. 瀏覽食譜列表
5. 點擊”蛋餅”食譜
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

## 授權資訊

本專案採用 MIT 授權，詳細條款請參考 `LICENSE` 文件。

## 貢獻者

- [@heyi5478](https://github.com/heyi5478)

## 聯絡方式

- 電子郵件：[steve.work5478@gmail.com](mailto:steve.work5478@gmail.com)
- 聯絡方式：[https://www.linkedin.com/in/ho-steve77](https://www.linkedin.com/in/ho-steve77)

---
如果這個專案對你有幫助，請給它一個星星 ⭐ ，謝謝！

