## Context

e2e 套件（`tests/e2e/**`，19 個檔、~150 個 `test()`）以 Playwright 撰寫，跨 6 個專案（no-auth ×2、auth ×4）。診斷（2026-07-23）發現兩層問題：

1. **認證從未供裝**：`setup` 專案匹配 0 檔 → `tests/.auth/user.json` 不存在 → 所有 auth 測試 `ENOENT` 即死。
2. **測試對照的是另一個 App**：測試需 216 個 `data-testid`，App 僅有 3 個（Button 變體）；抽樣功能掛鉤 0 命中。實測 `/upload-video` 畫面正常，證明「畫面沒問題、是測試對不上」，且大量測試瞄準**尚未實作**的功能。

登入真實流程為 `/signin-email` →（`POST /api/auth/email/login` → 後端 `/auth/login`，body `{AccountEmail, Password}`）→ 設 `HttpOnly` `token` cookie。此流程已用測試帳號實測可行。

## Goals / Non-Goals

**Goals:**
- 讓認證 setup 可重現地產生已登入 storageState（憑證走環境變數）。
- 讓 `npx playwright test` 收斂為「保留集全綠 + 未實作集 skipped + 0 非預期失敗」。
- 為保留的真實流程建立穩定、有紀錄的測試掛鉤與 fixture。

**Non-Goals:**
- 不新建 216 個掛鉤或未實作功能（播放器／時間軸／縮圖／頻寬監測）。
- 不變更任何產品行為。
- 不在本變更內把 quarantine 的功能「做出來」（另立 backlog）。

## Decisions

1. **認證以真實登入供裝（採 A 的精神但範圍極小）**：改寫 `auth.setup.ts` 走 `/signin-email`，憑證讀 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`，成功判斷＝導回 `/` 且持有 `token` cookie。避免（a）寫死密碼進版控、（b）依賴不存在的 `user-menu` 掛鉤。
2. **不採「純 A」也不採「純 B」，改採 triage**：
   - **純 A（把 216 個掛鉤全補上）不成立**——多數掛鉤沒有對應元素，等於要先「蓋出」整組未實作功能才能掛 testid，那是被生成測試牽著做產品。
   - **純 B（把 148 個測試全改寫對應現有 UI）不成立**——無法把測試改去檢查不存在的 `bandwidth-indicator` 等；那些測試沒有真實標的。
   - 結論：**逐檔分類**，只保留有真實對應的流程（先確定 `upload/*`），其餘 `test.skip` 並記錄原因為 backlog。
3. **隱藏 file input 用 `setInputFiles`，不斷言可見**：真實 `#video-upload` 為 `hidden`（點外層拖放區觸發）；Playwright 對隱藏 input 仍可 `setInputFiles`。修正測試 helper 的錯誤斷言。
4. **少量、有紀錄的 `data-testid`**：只為**保留集**真實元素加掛鉤（如 `video-upload-input` / `video-upload-dropzone`），而非全套 216 個。

## Risks / Trade-offs

- [大量測試被 skip 會讓「覆蓋率」看起來下降] → 但這是誠實反映：原本是 ~592 紅燈測空氣功能。以 backlog 清單保留意圖，功能實作時再解 skip。
- [在 `src` 加 `data-testid` 動到產品碼] → 僅新增屬性、無行為影響；範圍限保留集元素。
- [CI 需要測試帳號 secrets] → 以 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` 提供；缺少時 setup 明確失敗而非用寫死值。
- [測試帳號 / 後端可用性] → 認證依賴 `anna-cook-backend`；後端不可用時 setup 失敗會連鎖，需在 CI 前置健康檢查。

## Migration Plan

1. 先落地認證 Foundation（第 1 節），確認 `setup` 產生 storageState。
2. 盤點分類（第 2 節），把未實作集 `test.skip`——此時全套即可「綠 + skipped」。
3. 補 upload 保留集的掛鉤／斷言／fixture（第 3 節）使其真綠。
4. 回滾＝revert 測試與設定變更；`data-testid` 屬性可獨立保留（無害）。

## Open Questions

- `upload/*` 之外，`editor` / `thumbnails` 是否有**部分**真實對應（如 `recipe-video` 的編輯步驟）可納入保留集？需第 2 節盤點確認。
- fixture 影片採「提交小型樣本」或「setup 動態產生（ffmpeg）」？影響 repo 體積與 CI 相依。
- CI 測試帳號的來源與輪替策略（共用測試帳號 vs 每次 seed）。
