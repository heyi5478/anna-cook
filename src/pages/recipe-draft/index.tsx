import { NextPage } from 'next';
import RecipeDraft from '@/components/pages/RecipeDraft';
import { useAuth } from '@/hooks/useAuth';
import { COMMON_TEXTS } from '@/lib/constants/messages';

/**
 * 食譜草稿頁面
 */
const RecipeDraftPage: NextPage = () => {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading, isAuthenticated } = useAuth();

  // 載入中顯示載入提示
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">{COMMON_TEXTS.LOADING}</div>
      </div>
    );
  }

  // 未認證的情況（理論上不會顯示，因為 useAuth 會自動重定向）
  if (!isAuthenticated) {
    return null;
  }

  return <RecipeDraft />;
};

export default RecipeDraftPage;
