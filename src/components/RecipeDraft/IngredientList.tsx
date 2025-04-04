import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';

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
 * 食材清單元件
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
  return (
    <>
      {/* 食材清單 */}
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-medium">食材清單</h2>
        {ingredients.map((ingredient, index) => (
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
                onChange={(e) =>
                  onUpdateIngredient(index, 'name', e.target.value)
                }
                className="flex-1 mr-2"
                placeholder="食材名稱"
              />
              <Input
                value={ingredient.amount}
                onChange={(e) =>
                  onUpdateIngredient(index, 'amount', e.target.value)
                }
                className="w-16 mr-2"
                placeholder="數量"
              />
            </div>
            <button
              onClick={() => onRemoveIngredient(index)}
              className="p-1 text-gray-500"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddIngredient}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" /> 新增食材
        </Button>
      </div>

      {/* 調味料清單 */}
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-medium">調味料清單</h2>
        {seasonings.map((seasoning, index) => (
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
                onChange={(e) =>
                  onUpdateSeasoning(index, 'name', e.target.value)
                }
                className="flex-1 mr-2"
                placeholder="調味料名稱"
              />
              <Input
                value={seasoning.amount}
                onChange={(e) =>
                  onUpdateSeasoning(index, 'amount', e.target.value)
                }
                className="w-16 mr-2"
                placeholder="數量"
              />
            </div>
            <button
              onClick={() => onRemoveSeasoning(index)}
              className="p-1 text-gray-500"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        <Button
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
