// JWT token 的客戶端存取器（getAuthToken / updateAuthToken）已移除。
// token 一律由伺服器端 HttpOnly cookie 保存，不再寫入 localStorage 或
// JavaScript 可讀的 cookie（見 openspec change: security-hardening-tier-a）。
export {};
