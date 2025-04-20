import VideoUpload from '@/components/VideoUpload';
import { useAuth } from '@/hooks/auth';

/**
 * 上傳影片頁面
 */
export default function CreateRecipeStep3Page() {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading } = useAuth();

  // 載入中顯示空白內容
  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <VideoUpload
          onSave={(trimmedVideo) => {
            console.log('已儲存剪輯的影片:', trimmedVideo);
            // 這裡可以處理儲存邏輯
          }}
          onCancel={() => {
            console.log('已取消影片剪輯');
            // 這裡可以處理取消邏輯
          }}
        />
      </div>
    </div>
  );
}
