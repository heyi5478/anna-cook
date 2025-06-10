import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useId } from 'react';
import type { Ingredient, Seasoning } from '@/types/recipe';

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
  errors?: {
    ingredients?: Array<{
      name?: { message?: string };
      amount?: { message?: string };
    }>;
    seasonings?: Array<{
      name?: { message?: string };
      amount?: { message?: string };
    }>;
  };
};

/**
 * 食材清單元件 - 顯示和管理食譜中的食材和調味料清單
 * 純視覺組件，不包含商業邏輯
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
  errors,
}: IngredientListProps) => {
  const uniqueIdPrefix = useId();

  /**
   * 渲染單個食材項目
   */
  const renderIngredientItem = (ingredient: Ingredient, index: number) => {
    const itemKey = ingredient.id || `${uniqueIdPrefix}-ingredient-${index}`;
    const nameError = errors?.ingredients?.[index]?.name?.message;
    const amountError = errors?.ingredients?.[index]?.amount?.message;

    return (
      <div key={itemKey} className="mb-2">
        <div className="flex items-center">
          <div className="flex items-center flex-1">
            <Input
              value={ingredient.name}
              onChange={(e) =>
                onUpdateIngredient(index, 'name', e.target.value)
              }
              className="bg-[#FAFAFA] flex-1 mr-2"
              placeholder="食材名稱"
              aria-label={`食材名稱 ${index + 1}`}
            />
            <Input
              value={ingredient.amount}
              onChange={(e) =>
                onUpdateIngredient(index, 'amount', e.target.value)
              }
              className="bg-[#FAFAFA] w-16 mr-2"
              placeholder="數量"
              aria-label={`食材數量 ${index + 1}`}
            />
          </div>
          <button
            type="button"
            onClick={() => onRemoveIngredient(index)}
            className="p-1 text-gray-500"
            aria-label={`移除食材 ${index + 1}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* 錯誤訊息顯示 */}
        {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        {amountError && (
          <p className="mt-1 text-sm text-red-500">{amountError}</p>
        )}
      </div>
    );
  };

  /**
   * 渲染單個調味料項目
   */
  const renderSeasoningItem = (seasoning: Seasoning, index: number) => {
    const itemKey = seasoning.id || `${uniqueIdPrefix}-seasoning-${index}`;
    const nameError = errors?.seasonings?.[index]?.name?.message;
    const amountError = errors?.seasonings?.[index]?.amount?.message;

    return (
      <div key={itemKey} className="mb-2">
        <div className="flex items-center">
          <div className="flex items-center flex-1">
            <Input
              value={seasoning.name}
              onChange={(e) => onUpdateSeasoning(index, 'name', e.target.value)}
              className="bg-[#FAFAFA] flex-1 mr-2"
              placeholder="調味料名稱"
              aria-label={`調味料名稱 ${index + 1}`}
              aria-labelledby="seasonings-heading"
            />
            <Input
              value={seasoning.amount}
              onChange={(e) =>
                onUpdateSeasoning(index, 'amount', e.target.value)
              }
              className="bg-[#FAFAFA] w-16 mr-2"
              placeholder="數量"
              aria-label={`調味料數量 ${index + 1}`}
              aria-labelledby="seasonings-heading"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemoveSeasoning(index)}
            className="p-1 text-gray-500"
            aria-label={`移除調味料 ${index + 1}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* 錯誤訊息顯示 */}
        {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        {amountError && (
          <p className="mt-1 text-sm text-red-500">{amountError}</p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 食材清單區塊 */}
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-medium">食材清單</h2>
        <div className="ingredients-container">
          {ingredients.map((ingredient, index) =>
            renderIngredientItem(ingredient, index),
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddIngredient}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" /> 新增食材
        </Button>
      </div>

      {/* 調味料清單區塊 */}
      <div className="mb-4">
        <h2 id="seasonings-heading" className="mb-2 text-lg font-medium">
          調味料清單
        </h2>
        <div className="seasonings-container">
          {seasonings.map((seasoning, index) =>
            renderSeasoningItem(seasoning, index),
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddSeasoning}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" /> 新增調味料
        </Button>
      </div>
    </>
  );
};
