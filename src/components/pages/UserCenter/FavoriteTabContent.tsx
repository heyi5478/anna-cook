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

  if (favoriteLoading && favoritePage === 1) {
    return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
  }

  if (favoriteError) {
    return <div className="text-center py-8 text-red-500">{favoriteError}</div>;
  }

  if (favoriteData.length === 0) {
    return <div className="text-center py-8">目前沒有收藏的食譜</div>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-500 mb-1">
        共{favoriteTotalCount}篇收藏食譜
      </p>

      {favoriteData.map((recipe: UserFavoriteResponse['data'][0]) => (
        <div
          key={`recipe-${recipe.id}`}
          className="flex border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => router.push(`/recipe/${recipe.displayId}`)}
        >
          <div className="w-20 h-20 bg-gray-200 shrink-0 relative">
            <Image
              src={getFullImageUrl(recipe.coverPhoto)}
              alt={recipe.recipeName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-2">
            <div className="flex justify-between">
              <h4 className="font-medium">{recipe.recipeName}</h4>
              <BookmarkIcon className="h-4 w-4" />
            </div>
            <p className="text-xs text-neutral-500 line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex items-center mt-1 text-xs text-neutral-500">
              <Users className="h-3 w-3 mr-1" />
              <span className="mr-2">{recipe.portion}人份</span>
              <Clock className="h-3 w-3 mr-1" />
              <span className="mr-2">{recipe.cookingTime}</span>
              <Star className="h-3 w-3 mr-1" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      ))}

      {favoriteLoading && <div className="text-center py-4">載入更多中...</div>}

      {favoriteHasMore && !favoriteLoading && (
        <Button
          variant="ghost"
          className="w-full py-2 flex items-center justify-center gap-1 text-neutral-500"
          onClick={loadMore}
        >
          <span>更多收藏</span>
        </Button>
      )}
    </div>
  );
}
