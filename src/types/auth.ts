/**
 * 認證狀態類型
 */
export type AuthStatus = {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  userData?: UserData;
};

/**
 * 用戶資料類型
 */
export type UserData = {
  id: number;
  displayId: string;
  accountEmail: string;
  accountName: string;
  profilePhoto: string;
  role: number;
  loginProvider?: number;
  description?: string;
};

/**
 * 登入供應商類型
 */
export type LoginProvider = 'google' | 'email' | 'facebook';
