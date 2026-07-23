## ADDED Requirements

### Requirement: 食譜煮菜頁需保持螢幕喚醒
在食譜煮菜頁，應用程式 SHALL 於頁面可見時請求 Screen Wake Lock，使螢幕不自動熄滅；於頁面隱藏或離開時 SHALL 釋放該 lock。不支援 Wake Lock 的環境 MUST 優雅降級而不產生錯誤。

#### Scenario: 煮菜時螢幕不熄滅
- **WHEN** 使用者停留在食譜煮菜頁且分頁為可見
- **THEN** 系統取得 Wake Lock，螢幕於閒置時不自動變暗或熄滅

#### Scenario: 離開頁面釋放
- **WHEN** 使用者切換分頁、切到背景或離開煮菜頁
- **THEN** 系統釋放 Wake Lock，恢復裝置預設的螢幕逾時行為

#### Scenario: 不支援時降級
- **WHEN** 瀏覽器不支援 Screen Wake Lock API
- **THEN** 頁面功能正常，不因缺少 Wake Lock 而報錯
