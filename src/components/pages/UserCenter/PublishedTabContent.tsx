import { useRouter } from 'next/router';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { AuthorRecipesResponse } from '@/types/api';
import { cn } from '@/lib/utils';
import { PublishedRecipeCard } from './PublishedRecipeCard';
import {
  publishedTabContainerVariants,
  publishedCountTextVariants,
  publishedCardContainerVariants,
  tabEmptyStateVariants,
} from './styles';

interface PublishedTabContentProps {
  isLoadingPublished: boolean;
  error: string | null;
  publishedRecipes: AuthorRecipesResponse['data'];
  getFullImageUrl: (url: string) => string;
  loadPublishedRecipes: () => void;
}

/**
 * 已發布標籤頁內容元件
 */
export function PublishedTabContent({
  isLoadingPublished,
  error,
  publishedRecipes,
  getFullImageUrl,
  loadPublishedRecipes,
}: PublishedTabContentProps) {
  const router = useRouter();

  // 處理點擊事件，導航到食譜詳細頁面
  const handleRecipeClick = (recipeId: string | number) => {
    router.push(`/recipe-page/${recipeId}`);
  };

  // 處理載入狀態
  if (isLoadingPublished) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'loading' }))}>
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  // 處理錯誤狀態
  if (error) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'error' }))}>
        {error}
      </div>
    );
  }

  // 處理空狀態
  if (publishedRecipes.length === 0) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'empty' }))}>
        目前沒有發布的食譜
      </div>
    );
  }

  return (
    <div className={cn(publishedTabContainerVariants())}>
      <p className={cn(publishedCountTextVariants())}>
        共{publishedRecipes.length || 0}篇食譜
      </p>

      {publishedRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => (
        <div
          key={recipe.recipeId}
          className={cn(publishedCardContainerVariants())}
          onClick={() => handleRecipeClick(recipe.recipeId)}
        >
          <PublishedRecipeCard
            title={recipe.title}
            description={recipe.description}
            imageSrc={getFullImageUrl(recipe.coverPhoto)}
            likes={recipe.favoritedCount}
            comments={recipe.commentCount}
            rating={recipe.averageRating}
            recipeId={recipe.recipeId}
            onStatusChanged={loadPublishedRecipes}
          />
        </div>
      ))}
    </div>
  );
}
