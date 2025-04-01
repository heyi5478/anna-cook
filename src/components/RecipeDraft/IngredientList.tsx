import type React from 'react';
import { useState } from 'react';
import { Edit, Check, X, Plus, Trash } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
};

const ingredientListVariants = cva('px-4 py-2', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    variant: {
      default: 'bg-white',
      outline: 'border rounded-md',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type IngredientListProps = {
  title: string;
  ingredients: Ingredient[];
  onUpdate?: (ingredients: Ingredient[]) => void;
} & VariantProps<typeof ingredientListVariants> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * 顯示食材或調味料清單，支持編輯、新增和刪除
 */
export const IngredientList: React.FC<IngredientListProps> = ({
  title,
  ingredients: initialIngredients,
  size,
  variant,
  className,
  onUpdate,
  ...props
}) => {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(initialIngredients);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  /**
   * 處理開始編輯食材
   */
  const atStartEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setEditName(ingredient.name);
    setEditQuantity(ingredient.quantity);
  };

  /**
   * 處理取消編輯
   */
  const atCancelEdit = () => {
    setEditingId(null);
  };

  /**
   * 處理保存編輯
   */
  const atSaveEdit = () => {
    if (editingId) {
      const updatedIngredients = ingredients.map((item) =>
        item.id === editingId
          ? { ...item, name: editName, quantity: editQuantity }
          : item,
      );
      setIngredients(updatedIngredients);
      if (onUpdate) {
        onUpdate(updatedIngredients);
      }
    }
    setEditingId(null);
  };

  /**
   * 處理新增食材
   */
  const atAddIngredient = () => {
    const newIngredient = {
      id: `ing-${Date.now()}`,
      name: '新食材',
      quantity: '1份',
    };
    const updatedIngredients = [...ingredients, newIngredient];
    setIngredients(updatedIngredients);
    if (onUpdate) {
      onUpdate(updatedIngredients);
    }
    // 立即進入編輯模式
    atStartEdit(newIngredient);
  };

  /**
   * 處理刪除食材
   */
  const atDeleteIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter((item) => item.id !== id);
    setIngredients(updatedIngredients);
    if (onUpdate) {
      onUpdate(updatedIngredients);
    }
  };

  /**
   * 處理編輯食材名稱變更
   */
  const atNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  /**
   * 處理編輯食材數量變更
   */
  const atQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditQuantity(e.target.value);
  };

  return (
    <div
      className={cn(ingredientListVariants({ size, variant }), className)}
      {...props}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className={cn('font-medium', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          {title}
        </h3>
        <button
          type="button"
          className="p-1 bg-gray-100 rounded-full"
          onClick={atAddIngredient}
        >
          <Plus size={16} />
        </button>
      </div>

      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex justify-between items-center">
            {editingId === ingredient.id ? (
              <div className="flex w-full space-x-2">
                <input
                  type="text"
                  className={cn('flex-1 p-1 border rounded', {
                    'text-xs': size === 'sm',
                    'text-sm': size === 'md',
                    'text-base': size === 'lg',
                  })}
                  value={editName}
                  onChange={atNameChange}
                  placeholder="食材名稱"
                />
                <input
                  type="text"
                  className={cn('w-20 p-1 border rounded', {
                    'text-xs': size === 'sm',
                    'text-sm': size === 'md',
                    'text-base': size === 'lg',
                  })}
                  value={editQuantity}
                  onChange={atQuantityChange}
                  placeholder="數量"
                />
                <div className="flex space-x-1">
                  <button
                    type="button"
                    className="p-1 text-green-600"
                    onClick={atSaveEdit}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-red-600"
                    onClick={atCancelEdit}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <span
                    className={cn({
                      'text-xs': size === 'sm',
                      'text-sm': size === 'md',
                      'text-base': size === 'lg',
                    })}
                  >
                    • {ingredient.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span
                    className={cn('mr-4', {
                      'text-xs': size === 'sm',
                      'text-sm': size === 'md',
                      'text-base': size === 'lg',
                    })}
                  >
                    {ingredient.quantity}
                  </span>
                  <button
                    type="button"
                    className="p-1"
                    onClick={() => atStartEdit(ingredient)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-red-500"
                    onClick={() => atDeleteIngredient(ingredient.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
