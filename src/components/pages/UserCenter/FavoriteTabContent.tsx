import { useRouter } from 'next/router';
import Image from 'next/image';
import { BookmarkIcon, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { UserFavoriteResponse } from '@/types/api';
import {
  favoriteTabContainerVariants,
  statsCountTextVariants,
  favoriteItemContainerVariants,
  itemImageContainerVariants,
  itemContentAreaVariants,
  itemTitleRowVariants,
  itemTitleVariants,
  itemIconVariants,
  itemDescriptionVariants,
  itemStatsRowVariants,
  statsIconVariants,
  statsItemSpacingVariants,
  loadMoreStateVariants,
  loadMoreButtonVariants,
  tabEmptyStateVariants,
} from '@/styles/cva/user-center';

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
      <div className={cn(tabEmptyStateVariants({ type: 'loading' }))}>
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  if (favoriteError) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'error' }))}>
        {favoriteError}
      </div>
    );
  }

  if (favoriteData.length === 0) {
    return (
      <div className={cn(tabEmptyStateVariants({ type: 'empty' }))}>
        目前沒有收藏的食譜
      </div>
    );
  }

  return (
    <div className={cn(favoriteTabContainerVariants())}>
      <p className={cn(statsCountTextVariants())}>
        共{favoriteTotalCount}篇收藏食譜
      </p>

      {favoriteData.map((recipe: UserFavoriteResponse['data'][0]) => (
        <div
          key={`recipe-${recipe.id}`}
          className={cn(favoriteItemContainerVariants())}
          onClick={() => atRecipeClick(recipe.displayId)}
        >
          <div className={cn(itemImageContainerVariants())}>
            <Image
              src={getFullImageUrl(recipe.coverPhoto)}
              alt={recipe.recipeName}
              fill
              className="object-cover"
            />
          </div>
          <div className={cn(itemContentAreaVariants())}>
            <div className={cn(itemTitleRowVariants())}>
              <h4 className={cn(itemTitleVariants())}>{recipe.recipeName}</h4>
              <BookmarkIcon className={cn(itemIconVariants())} />
            </div>
            <p className={cn(itemDescriptionVariants())}>
              {recipe.description}
            </p>
            <div className={cn(itemStatsRowVariants())}>
              <Users className={cn(statsIconVariants())} />
              <span className={cn(statsItemSpacingVariants())}>
                {recipe.portion}人份
              </span>
              <Clock className={cn(statsIconVariants())} />
              <span className={cn(statsItemSpacingVariants())}>
                {recipe.cookingTime}
              </span>
              <Star className={cn(statsIconVariants())} />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      ))}

      {favoriteLoading && (
        <div className={cn(loadMoreStateVariants({ state: 'loading' }))}>
          載入更多中...
        </div>
      )}

      {favoriteHasMore && !favoriteLoading && (
        <Button
          variant="ghost"
          className={cn(loadMoreButtonVariants())}
          onClick={loadMore}
        >
          <span>更多收藏</span>
        </Button>
      )}
    </div>
  );
}
