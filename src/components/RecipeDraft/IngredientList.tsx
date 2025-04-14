import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';

// 型別定義區塊
type Ingredient = {
  name: string;
  amount: string;
  id?: string;
};

type Seasoning = {
  name: string;
  amount: string;
  id?: string;
};

type IngredientListProps = {
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  onUpdateIngredient: (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => void;
  onRemoveIngredient: (index: number) => void;
  onAddIngredient: () => void;
  onUpdateSeasoning: (
    index: number,
    field: keyof Seasoning,
    value: string,
  ) => void;
  onRemoveSeasoning: (index: number) => void;
  onAddSeasoning: () => void;
};

/**
 * 食材清單元件 - 用於管理食譜中的食材和調味料清單
 * 支援新增、編輯和刪除食材及調味料項目
 */
export const IngredientList = ({
  ingredients,
  seasonings,
  onUpdateIngredient,
  onRemoveIngredient,
  onAddIngredient,
  onUpdateSeasoning,
  onRemoveSeasoning,
  onAddSeasoning,
}: IngredientListProps) => {
  /**
   * 渲染單個食材項目
   */
  const renderIngredientItem = (ingredient: Ingredient, index: number) => {
    return (
      <div
        key={
          ingredient.id ||
          `ingredient-${ingredient.name}-${ingredient.amount}-${index}`
        }
        className="flex items-center mb-2"
      >
        <div className="flex items-center flex-1">
          <Input
            value={ingredient.name}
            onChange={(e) => onUpdateIngredient(index, 'name', e.target.value)}
            className="flex-1 mr-2"
            placeholder="食材名稱"
            aria-label={`食材名稱 ${index + 1}`}
          />
          <Input
            value={ingredient.amount}
            onChange={(e) =>
              onUpdateIngredient(index, 'amount', e.target.value)
            }
            className="w-16 mr-2"
            placeholder="數量"
            aria-label={`食材數量 ${index + 1}`}
          />
        </div>
        <button
          onClick={() => onRemoveIngredient(index)}
          className="p-1 text-gray-500"
          aria-label={`移除食材 ${index + 1}`}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    );
  };

  /**
   * 渲染單個調味料項目
   */
  const renderSeasoningItem = (seasoning: Seasoning, index: number) => {
    return (
      <div
        key={
          seasoning.id ||
          `seasoning-${seasoning.name}-${seasoning.amount}-${index}`
        }
        className="flex items-center mb-2"
      >
        <div className="flex items-center flex-1">
          <Input
            value={seasoning.name}
            onChange={(e) => onUpdateSeasoning(index, 'name', e.target.value)}
            className="flex-1 mr-2"
            placeholder="調味料名稱"
            aria-label={`調味料名稱 ${index + 1}`}
          />
          <Input
            value={seasoning.amount}
            onChange={(e) => onUpdateSeasoning(index, 'amount', e.target.value)}
            className="w-16 mr-2"
            placeholder="數量"
            aria-label={`調味料數量 ${index + 1}`}
          />
        </div>
        <button
          onClick={() => onRemoveSeasoning(index)}
          className="p-1 text-gray-500"
          aria-label={`移除調味料 ${index + 1}`}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    );
  };

  /**
   * 處理新增食材按鈕點擊
   */
  const atHandleAddIngredient = () => {
    onAddIngredient();
  };

  /**
   * 處理新增調味料按鈕點擊
   */
  const atHandleAddSeasoning = () => {
    onAddSeasoning();
  };

  return (
    <>
      {/* 食材清單區塊 */}
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-medium">食材清單</h2>

        {/* 食材項目列表 */}
        <div className="ingredients-container">
          {ingredients.map((ingredient, index) =>
            renderIngredientItem(ingredient, index),
          )}
        </div>

        {/* 新增食材按鈕 */}
        <Button
          variant="outline"
          size="sm"
          onClick={atHandleAddIngredient}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" /> 新增食材
        </Button>
      </div>

      {/* 調味料清單區塊 */}
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-medium">調味料清單</h2>

        {/* 調味料項目列表 */}
        <div className="seasonings-container">
          {seasonings.map((seasoning, index) =>
            renderSeasoningItem(seasoning, index),
          )}
        </div>

        {/* 新增調味料按鈕 */}
        <Button
          variant="outline"
          size="sm"
          onClick={atHandleAddSeasoning}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" /> 新增調味料
        </Button>
      </div>
    </>
  );
};
