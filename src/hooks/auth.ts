import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAuthToken, checkAuth } from '@/services/api';

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
    const verifyAuth = async () => {
      try {
        const token = getAuthToken();

        if (!token) {
          // 若無 token，重定向到指定路徑
          router.push(redirectTo);
          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // 使用 API 驗證 token 有效性
        await checkAuth();

        // 驗證成功，設置身份已驗證
        setAuthStatus({
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // 驗證失敗，重定向到登入頁
        console.error('身份驗證失敗:', error);
        router.push(redirectTo);
        setAuthStatus({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    verifyAuth();
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
