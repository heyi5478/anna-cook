'use client';

import { useAuth } from '@/hooks/useAuth';
import VideoUpload from '@/components/pages/VideoUpload';
import { COMMON_TEXTS } from '@/lib/constants/messages';

// 上傳影片頁：登入守衛（未登入時 useAuth 會自動導回登入頁）
export default function UploadVideoPage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600">{COMMON_TEXTS.LOADING}</div>
      </div>
    );
  }

  // 未認證（理論上不會顯示，useAuth 會自動重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-neutral-50">
      <div className="w-full max-w-md">
        <VideoUpload
          onSave={(trimmedVideo) => {
            console.log('已儲存剪輯的影片:', trimmedVideo);
            // 不主動導向，讓 VideoUpload 組件內的邏輯處理導向
          }}
        />
      </div>
    </div>
  );
}
