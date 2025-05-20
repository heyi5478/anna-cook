// 匯出 utils 工具
export * from './utils/http';

// 匯出認證服務模組
export * from './auth';

// 匯出食譜服務模組
export * from './recipes';

// 匯出用戶服務模組
export * from './users';

// 伺服器端 API - 明確匯出函數
export {
  getServerToken,
  getAuthTokenForServer,
  fetchUserProfileServer,
  fetchUserRecipesServer,
  fetchAuthorRecipesServer,
} from './server-api';

// 伺服器端 API - 明確匯出類型，並使用命名空間避免衝突
export type {
  UserProfileResponse as ServerUserProfileResponse,
  UserRecipesResponse as ServerUserRecipesResponse,
  AuthorRecipesResponse as ServerAuthorRecipesResponse,
} from './server-api';
