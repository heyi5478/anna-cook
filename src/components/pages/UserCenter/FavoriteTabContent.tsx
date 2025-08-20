import { useRouter } from 'next/router';
import Image from 'next/image';
import { BookmarkIcon, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { UserFavoriteResponse } from '@/types/api';

interface FavoriteTabContentProps {
  favoriteLoading: boolean;
  favoriteError: string | null;
  favoriteData: UserFavoriteResponse['data'];
  favoritePage: number;
  favoriteHasMore: boolean;
  favoriteTotalCount: number;
  getFullImageUrl: (url: string) => string;
  loadMore: () => void;
}

/**
 * 已收藏標籤頁內容元件
 */
export function FavoriteTabContent({
  favoriteLoading,
  favoriteError,
  favoriteData,
  favoritePage,
  favoriteHasMore,
  favoriteTotalCount,
  getFullImageUrl,
  loadMore,
}: FavoriteTabContentProps) {
  const router = useRouter();

  /**
   * 處理食譜項目點擊事件
   */
  const atRecipeClick = (displayId: string) => {
    router.push(`/recipe/${displayId}`);
  };

  if (favoriteLoading && favoritePage === 1) {
    return (
      <div className="text-center py-8 text-neutral-500">
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  if (favoriteError) {
    return <div className="text-center py-8 text-red-500">{favoriteError}</div>;
  }

  if (favoriteData.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        目前沒有收藏的食譜
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-neutral-500 mb-2">共{favoriteTotalCount}篇收藏食譜</p>

      {favoriteData.map((recipe: UserFavoriteResponse['data'][0]) => (
        <div
          key={`recipe-${recipe.id}`}
          className="flex bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => atRecipeClick(recipe.displayId)}
        >
          <div className="relative w-20 h-20 mr-4 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={getFullImageUrl(recipe.coverPhoto)}
              alt={recipe.recipeName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-base font-medium text-neutral-900 truncate">
                {recipe.recipeName}
              </h4>
              <BookmarkIcon className="h-5 w-5 text-orange-500 ml-2 flex-shrink-0" />
            </div>
            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex items-center text-xs text-neutral-500 space-x-4">
              <Users className="h-4 w-4" />
              <span className="mr-4">{recipe.portion}人份</span>
              <Clock className="h-4 w-4" />
              <span className="mr-4">{recipe.cookingTime}</span>
              <Star className="h-4 w-4" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      ))}

      {favoriteLoading && (
        <div className="text-center py-4 text-neutral-500">載入更多中...</div>
      )}

      {favoriteHasMore && !favoriteLoading && (
        <Button
          variant="ghost"
          className="w-full mt-4 border border-neutral-200 hover:bg-neutral-50"
          onClick={loadMore}
        >
          <span>更多收藏</span>
        </Button>
      )}
    </div>
  );
}
