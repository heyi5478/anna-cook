import { ChevronDown } from 'lucide-react';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Recipe } from './types';

interface AuthorRecipesProps {
  recipes: Recipe[];
  recipeCount: number;
  onLoadMore?: () => void;
}

/**
 * 顯示作者的食譜列表區塊
 */
export const AuthorRecipes = ({
  recipes,
  recipeCount,
  onLoadMore,
}: AuthorRecipesProps) => {
  return (
    <div className="mt-6">
      <div className="bg-white px-4 py-3 mb-2">
        <h2 className="text-lg font-medium">個人食譜</h2>
      </div>

      <div className="px-4">
        <p className="text-sm text-gray-500 mb-2">共{recipeCount}篇食譜</p>

        {/* 食譜列表 */}
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* 更多食譜按鈕 */}
        {recipes.length < recipeCount && (
          <div className="mt-4 flex justify-center">
            <button
              className="flex items-center text-gray-500 py-2"
              onClick={onLoadMore}
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
