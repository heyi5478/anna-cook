# structured-data-rendering Specification

## Purpose
TBD - created by archiving change security-hardening-tier-a. Update Purpose after archive.
## Requirements
### Requirement: JSON-LD 輸出必須跳脫 HTML 敏感字元
系統 SHALL 在把結構化資料（JSON-LD）以 `dangerouslySetInnerHTML` 寫入 `<script type="application/ld+json">` 之前，跳脫 `<`、`>`、`&` 以及 U+2028／U+2029，使任何欄位值都無法突破 `<script>` 標籤。

#### Scenario: 食譜名稱含 script 關閉標籤
- **WHEN** 某食譜名稱為 `蛋炒飯</script><script>alert(1)</script>` 且被渲染到食譜詳細頁
- **THEN** 輸出的 JSON-LD 中 `<` 以 `<` 表示，瀏覽器不會執行任何被注入的腳本

#### Scenario: 一般內容語意不變
- **WHEN** 結構化資料只含一般文字（無 HTML 敏感字元）
- **THEN** 輸出仍為合法且語意相同的 JSON-LD，結構化資料的解析結果不變

