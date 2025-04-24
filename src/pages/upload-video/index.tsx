import VideoUpload from '@/components/VideoUpload';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

/**
 * 上傳影片頁面
 */
export default function CreateRecipeStep3Page() {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading } = useAuth();
  const router = useRouter();

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
            // 儲存後跳轉到用戶中心的草稿頁
            router.push('/user-center?tab=草稿');
          }}
          onCancel={() => {
            console.log('已取消影片剪輯');
            // 取消編輯後跳轉到用戶中心的草稿頁
            router.push('/user-center?tab=草稿');
          }}
        />
      </div>
    </div>
  );
}
