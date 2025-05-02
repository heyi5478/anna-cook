import { useState, useEffect } from 'react';

/**
 * 從 localStorage 中獲取用戶的 displayId
 * @returns {string} 用戶的 displayId，若不存在則返回空字串
 */
export function useUserDisplayId(): string {
  const [displayId, setDisplayId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setDisplayId(userData.displayId || '');
        }
      } catch (err) {
        console.error('解析 localStorage 中的 userData 失敗:', err);
      }
    }
  }, []);

  return displayId;
}
