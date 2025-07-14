import { COMMON_TEXTS } from '@/lib/constants/messages';
import { AuthorRecipesResponse } from '@/types/api';
import { cn } from '@/lib/utils';
import {
  dataTabContainerVariants,
  dataTitleVariants,
  dataDescriptionVariants,
  dataCardContainerVariants,
  tabEmptyStateVariants,
} from '@/styles/cva/user-center';
import { RecipeStatsItem } from './RecipeStatsItem';

interface DataTabContentProps {
  isLoadingPublished: boolean;
  error: string | null;
  publishedRecipes: AuthorRecipesResponse['data'];
  getFullImageUrl: (url: string) => string;
}

/**
 * 數據標籤頁內容元件 - 顯示食譜統計資訊
 */
export function DataTabContent({
  isLoadingPublished,
  error,
  publishedRecipes,
  getFullImageUrl,
}: DataTabContentProps) {
  if (isLoadingPublished) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'loading' }))}>
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'error' }))}>
        {error}
      </div>
    );
  }

  if (publishedRecipes.length === 0) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'empty' }))}>
        目前沒有發布的食譜
      </div>
    );
  }

  return (
    <div className={cn(dataTabContainerVariants())}>
      <div>
        <h3 className={cn(dataTitleVariants())}>食譜數據</h3>
        <p className={cn(dataDescriptionVariants())}>深入了解您的食譜表現</p>
      </div>

      {publishedRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => (
        <div key={recipe.recipeId} className={cn(dataCardContainerVariants())}>
          <RecipeStatsItem
            title={recipe.title}
            imageSrc={getFullImageUrl(recipe.coverPhoto)}
            views={recipe.viewCount}
            shares={recipe.sharedCount}
            bookmarks={recipe.favoritedCount}
            comments={recipe.commentCount}
            rating={recipe.averageRating}
          />
        </div>
      ))}
    </div>
  );
}
