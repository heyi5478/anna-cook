import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { checkAuth } from '@/services/auth';
import type { AuthStatus } from '@/types/auth';

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
    // 防止在 SSR 中執行
    if (typeof window === 'undefined') return;

    const verifyAuth = async () => {
      try {
        // 檢查 localStorage 是否有用戶資料（提供更快的初始狀態）
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setAuthStatus({
              isAuthenticated: true,
              isLoading: false,
              userData,
            });
          } catch (e) {
            console.error('解析儲存的用戶資料失敗:', e);
          }
        }

        // 使用 API 驗證身份 (無需檢查 token 存在性)
        console.log('驗證身份中...');
        const response = await checkAuth();

        console.log('身份驗證成功:', response);

        // 驗證成功，設置身份已驗證
        setAuthStatus({
          isAuthenticated: true,
          isLoading: false,
          userData: response.userData,
        });

        // 更新 localStorage 中的用戶資料
        localStorage.setItem('userData', JSON.stringify(response.userData));
      } catch (error) {
        console.error('身份驗證失敗:', error);

        // 清除 localStorage 中可能過期的資料
        localStorage.removeItem('userData');

        // 驗證失敗，重定向到登入頁
        if (router.pathname !== redirectTo) {
          console.log(`重定向到 ${redirectTo}`);
          router.push(redirectTo);
        }

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
 * 判斷使用者是否已登入（僅用於客戶端快速檢查，不可靠）
 * @returns boolean 是否可能已登入
 */
export const isUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 檢查 localStorage 是否有用戶資料
  const userData = localStorage.getItem('userData');
  return !!userData;
};
