import { useRouter } from 'next/router';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { AuthorRecipesResponse } from '@/types/api';
import { PublishedRecipeCard } from './PublishedRecipeCard';

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
    <div className="space-y-4">
      <p className="text-neutral-500 mb-2">
        共{publishedRecipes.length || 0}篇食譜
      </p>

      {publishedRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => (
        <div
          key={recipe.recipeId}
          className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          onClick={() => router.push(`/recipe-page/${recipe.recipeId}`)}
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
