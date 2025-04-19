import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAuthToken } from '@/services/api';

export type AuthStatus = {
  isAuthenticated: boolean | null;
  isLoading: boolean;
};

/**
 * 提供身份驗證檢查的自定義 Hook
 * @param redirectTo 未授權時重定向的路徑
 * @returns 身份驗證狀態
 */
export const useAuth = (redirectTo: string = '/login'): AuthStatus => {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      // 若無 token，重定向到指定路徑
      router.push(redirectTo);
      setAuthStatus({
        isAuthenticated: false,
        isLoading: false,
      });
    } else {
      // 有 token，設置身份已驗證
      setAuthStatus({
        isAuthenticated: true,
        isLoading: false,
      });
    }
  }, [router, redirectTo]);

  return authStatus;
};

/**
 * 判斷使用者是否已登入
 * @returns boolean 是否已登入
 */
export const isUserLoggedIn = (): boolean => {
  const token = getAuthToken();
  return !!token;
};
