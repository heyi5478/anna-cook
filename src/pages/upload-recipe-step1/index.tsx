import { NextPage } from 'next';
import RecipeUploadForm from '@/components/RecipeUploadStep1';
import { useAuth } from '@/hooks/auth';

/**
 * 上傳食譜第一步頁面
 */
const CreateRecipePage: NextPage = () => {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading } = useAuth();

  // 載入中顯示空白內容
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <RecipeUploadForm />
    </div>
  );
};

export default CreateRecipePage;
