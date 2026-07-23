## ADDED Requirements

### Requirement: 路徑參數組成後端 URL 前必須安全處理
API 代理 SHALL 在把路徑參數（如 `recipeId` / `userId` / `displayId`）併入後端 URL 前進行編碼或格式驗證，避免注入或非預期路徑。

#### Scenario: 路徑參數含特殊字元
- **WHEN** 路徑參數包含 `/`、`..` 或其他特殊字元
- **THEN** 該參數被編碼或被拒絕，後端 URL 不會被竄改
