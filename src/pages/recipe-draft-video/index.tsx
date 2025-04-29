import { NextPage } from 'next';
import RecipeDraftVideo from '@/components/RecipeDraftVideo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * 食譜草稿影片頁面
 */
const RecipeDraftVideoPage: NextPage = () => {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { recipeId } = router.query;
  const parsedRecipeId = recipeId ? Number(recipeId) : undefined;

  useEffect(() => {
    console.log('頁面 URL 參數:', router.query);
    console.log('頁面取得食譜 ID:', parsedRecipeId);
  }, [router.query, parsedRecipeId]);

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

  return <RecipeDraftVideo recipeId={parsedRecipeId} />;
};

export default RecipeDraftVideoPage;
