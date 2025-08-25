import VideoUpload from '@/components/pages/VideoUpload';
import { useAuth } from '@/hooks/useAuth';
import { COMMON_TEXTS } from '@/lib/constants/messages';

/**
 * 上傳影片頁面
 */
export default function CreateRecipeStep3Page() {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading, isAuthenticated } = useAuth();

  // 載入中顯示載入提示
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600">{COMMON_TEXTS.LOADING}</div>
      </div>
    );
  }

  // 未認證的情況（理論上不會顯示，因為 useAuth 會自動重定向）
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
