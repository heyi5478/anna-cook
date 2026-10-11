# Anna Cook 首頁靜態展示版

這是 Day27 練習 S3＋CloudFront 的獨立展示版，保留 Anna Cook 的 Logo、橘色視覺與首頁橫幅。食譜是本地範例資料，搜尋、分類切換和食譜內容展開都在瀏覽器執行；不連接正式後端、登入、上傳、GTM 或 Service Worker。

正式網站仍使用根目錄的 `src/app` 與 standalone 部署。展示版有自己的 `app`、Next.js、TypeScript、CSS 和 ESLint 設定，共用根目錄既有依賴；不需要第二份 lockfile。

## 建置與預覽

在 **anna-cook 根目錄** 執行。使用 Node.js 22.14 以上的 22.x 版本，與既有 CI 的 Node 22 對齊：

```bash
npm ci
npm run build:static-demo
npx serve examples/static-demo/out
```

已安裝與 lockfile 一致的依賴時，可省略 `npm ci`。`build:static-demo` 會先複製指定的本地素材，再從 `examples/static-demo` 執行 Next.js 靜態匯出。預覽請開啟終端機顯示的網址。

**這裡使用 `npm run build:static-demo`，不要使用 `STATIC_EXPORT=true npm run build`。** 後者仍會建置正式網站，遇到需要伺服器的登入 API 和動態頁面。展示版已固定使用 `output: 'export'`，不用另外設定環境變數，也不需要 `.env`。

開發展示版時則執行：

```bash
npm run dev:static-demo
```

開啟 `http://localhost:3001`。開發伺服器與 `out` 靜態預覽是不同的用途；上傳前仍要重新執行 `npm run build:static-demo`。

## 上傳到 Day27 的 S3

成功後，上傳的是 **`examples/static-demo/out/` 裡的全部內容**，不是 `.next/`，也不是專案根目錄的 `out/`：

```bash
BUCKET=your-static-demo-bucket
aws s3 sync examples/static-demo/out/ "s3://$BUCKET/" --region ap-east-2
```

bucket 名稱和 region 換成自己的設定。沿用 Day27 的私有 S3、Block Public Access、CloudFront S3 origin、OAC 和 bucket policy。CloudFront 的 Default root object 設為 `index.html`，用 distribution 的 HTTPS 網址開啟首頁。

本展示版只有首頁；互動不會導向 `/login`、`/api` 或不存在的食譜路由。不用設定 SPA 全站回退或子路徑改寫。`404.html` 會一起輸出，但自訂錯誤回應仍需另外在 CloudFront 設定。

再次更新時重新 build、上傳；如果仍看到舊畫面，再使用 Day27 的 invalidation 步驟。範例沒有建立、修改或刪除 AWS 資源的自動部署程式。

## 驗收

- `examples/static-demo/out/index.html`、`404.html`、`_next/static/` 和橫幅素材都存在。
- 首頁樣式、Logo 和圖片正常，手機和桌機不會出現橫向溢出。
- 搜尋、最新／人氣／經典分類、食譜內容展開能操作。
- 瀏覽器不應發出 `/api/*`、正式後端或 Google 分析請求；圖片也直接讀取靜態檔案，不依賴 `/_next/image`。
- CloudFront 網址能讀取首頁；匿名直接讀取 S3 檔案仍被拒絕。

## 素材與維護

`prepare-assets.mts` 只複製根目錄 `public` 中既有的指定素材。產生的 `public/`、`.next/`、`out/` 都不提交 Git；圖片若要更換，請更新素材清單並重新 build。展示內容與使用的影像裁切是示範，沒有抓取真實會員或私人食譜資料。

參考：[Next.js 15 靜態匯出](https://nextjs.org/docs/15/app/guides/static-exports)、[Next.js CLI](https://nextjs.org/docs/15/app/api-reference/cli/next)。
