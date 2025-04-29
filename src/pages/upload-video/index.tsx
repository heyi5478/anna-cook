import VideoUpload from '@/components/VideoUpload';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * 上傳影片頁面
 */
export default function CreateRecipeStep3Page() {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userDisplayId, setUserDisplayId] = useState<string | null>(null);

  // 從 localStorage 獲取用戶 displayId
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUserDisplayId(parsedUserData.displayId || null);
      }
    } catch (error) {
      console.error('獲取用戶資料失敗:', error);
    }
  }, []);

  // 載入中顯示載入提示
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">載入中...</div>
      </div>
    );
  }

  // 未認證的情況（理論上不會顯示，因為 useAuth 會自動重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <VideoUpload
          onSave={(trimmedVideo) => {
            console.log('已儲存剪輯的影片:', trimmedVideo);
            // 不主動導向，讓 VideoUpload 組件內的邏輯處理導向
          }}
          onCancel={() => {
            console.log('已取消影片剪輯');
            // 取消編輯後跳轉到用戶頁面
            if (userDisplayId) {
              router.push(`/user/${userDisplayId}`);
            } else {
              // 如果沒有取得 displayId，則導向首頁
              router.push('/');
            }
          }}
        />
      </div>
    </div>
  );
}
