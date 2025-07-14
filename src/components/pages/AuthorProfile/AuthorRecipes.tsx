import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/features/RecipeCard';
import { fetchUserRecipes } from '@/services/users';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';
import { cn } from '@/lib/utils';
import {
  recipesSectionVariants,
  recipeTitleVariants,
  recipeListVariants,
  loadMoreButtonVariants,
  loadingStateVariants,
} from '@/styles/cva/author-profile';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

interface AuthorRecipesProps {
  displayId: string;
  isMe?: boolean; // 表示是否為當前登入使用者
}

/**
 * 顯示作者的食譜列表區塊
 */
export const AuthorRecipes = ({
  displayId,
  isMe = false, // 預設值為 false
}: AuthorRecipesProps) => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 載入使用者食譜資料
   */
  const loadRecipes = async (pageNum: number = 1) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchUserRecipes(displayId, pageNum);

      if (pageNum === 1) {
        // 初次載入，設置食譜列表
        setRecipes(data.recipes);
      } else {
        // 加載更多，合併食譜列表
        setRecipes((prev) => [...prev, ...data.recipes]);
      }

      setRecipeCount(data.recipeCount);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.LOAD_RECIPE_FAILED,
      );
      console.error('載入食譜失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 處理載入更多食譜事件
   */
  const atLoadMore = () => {
    if (!hasMore || loading) return;
    loadRecipes(page + 1);
  };

  // 初次載入時獲取食譜資料
  useEffect(() => {
    loadRecipes();
  }, [displayId]);

  // 將API回傳的資料轉換為RecipeCard所需格式
  const formatRecipeForCard = (apiRecipe: any) => ({
    id: apiRecipe.recipeId.toString(),
    title: apiRecipe.title,
    image: apiRecipe.coverPhoto
      ? `${apiBaseUrl}${apiRecipe.coverPhoto}`
      : '/images/recipe-placeholder.jpg',
    description: apiRecipe.description,
    time: apiRecipe.cookTime,
    cookingTime: apiRecipe.cookTime,
    servings: apiRecipe.portion,
    rating: apiRecipe.rating || 0,
    category: '',
  });

  // 渲染食譜列表內容
  const renderRecipeList = () => {
    if (recipes.length > 0) {
      return recipes.map((recipe) => (
        <RecipeCard
          key={recipe.recipeId}
          recipe={formatRecipeForCard(recipe)}
        />
      ));
    }

    if (loading && page === 1) {
      return (
        <p className={cn(loadingStateVariants({ state: 'loading' }))}>
          {COMMON_TEXTS.LOADING}
        </p>
      );
    }

    if (error) {
      return (
        <p className={cn(loadingStateVariants({ state: 'error' }))}>{error}</p>
      );
    }

    return (
      <p className={cn(loadingStateVariants({ state: 'empty' }))}>尚無食譜</p>
    );
  };

  return (
    <div
      className={cn(
        recipesSectionVariants({
          background: isMe ? 'gray' : 'default',
        }),
      )}
    >
      <div className={cn(recipeTitleVariants())}>
        <h2 className="text-lg font-medium">
          {isMe ? '我的食譜' : '個人食譜'}
        </h2>
      </div>

      <div className="px-4">
        <p className="text-sm text-neutral-500 mb-2">共{recipeCount}篇食譜</p>

        {/* 食譜列表 */}
        <div className={cn(recipeListVariants())}>{renderRecipeList()}</div>

        {/* 載入中狀態 */}
        {loading && page > 1 && (
          <p
            className={cn(
              loadingStateVariants({ state: 'loading', size: 'compact' }),
            )}
          >
            {COMMON_TEXTS.LOADING}
          </p>
        )}

        {/* 更多食譜按鈕 */}
        {hasMore && !loading && (
          <div className="mt-4 flex justify-center">
            <button
              className={cn(loadMoreButtonVariants())}
              onClick={atLoadMore}
            >
              <span className="mr-1">更多食譜</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
