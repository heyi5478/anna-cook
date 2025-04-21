import { NextPage } from 'next';
import RecipeDraft from '@/components/RecipeDraft';
import { useAuth } from '@/hooks/auth';

/**
 * 食譜草稿頁面
 */
const RecipeDraftPage: NextPage = () => {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading } = useAuth();

  // 載入中顯示空白內容
  if (isLoading) {
    return null;
  }

  return <RecipeDraft />;
};

export default RecipeDraftPage;
