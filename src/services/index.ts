// 客戶端 API
export * from './api';

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
