import { NextPage } from 'next';
import RecipeDraftVideo from '@/components/RecipeDraftVideo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const RecipeDraftVideoPage: NextPage = () => {
  const router = useRouter();
  const { recipeId } = router.query;
  const parsedRecipeId = recipeId ? Number(recipeId) : undefined;

  useEffect(() => {
    console.log('頁面 URL 參數:', router.query);
    console.log('頁面取得食譜 ID:', parsedRecipeId);
  }, [router.query, parsedRecipeId]);

  return <RecipeDraftVideo recipeId={parsedRecipeId} />;
};

export default RecipeDraftVideoPage;
