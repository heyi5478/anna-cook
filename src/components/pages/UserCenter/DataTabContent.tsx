import { COMMON_TEXTS } from '@/lib/constants/messages';
import { AuthorRecipesResponse } from '@/types/api';
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
    return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (publishedRecipes.length === 0) {
    return <div className="text-center py-8">目前沒有發布的食譜</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1">食譜數據</h3>
        <p className="text-neutral-500">深入了解您的食譜表現</p>
      </div>

      {publishedRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => (
        <div
          key={recipe.recipeId}
          className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
        >
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
