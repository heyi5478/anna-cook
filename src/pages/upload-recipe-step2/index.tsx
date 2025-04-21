import RecipeUploadStep2 from '@/components/RecipeUploadStep2';
import { useAuth } from '@/hooks/auth';

/**
 * 上傳食譜第二步頁面
 */
export default function CreateRecipeStep2Page() {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading } = useAuth();

  // 載入中顯示空白內容
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <RecipeUploadStep2 />
    </div>
  );
}
