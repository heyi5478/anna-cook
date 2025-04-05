import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';
import { EditableSection } from './EditableSection';
import { CookingInfo } from './CookingInfo';
import { IngredientList } from './IngredientList';
import { TagSection } from './TagsSection';
import { CookingStep } from './CookingSteps';

// 類型定義區塊
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

type Step = {
  description: string;
  startTime: string;
  endTime: string;
  video?: string;
  vimeoId?: string;
  id?: string;
};

type Recipe = {
  name: string;
  image: string | null;
  description: string;
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  tags: string[];
  cookingTime: string;
  cookingTimeValue: string;
  cookingTimeUnit: string;
  servings: string;
  servingsValue: string;
  servingsUnit: string;
  steps: Step[];
};

type EditState = {
  name: boolean;
  description: boolean;
  cookingTime: boolean;
  servings: boolean;
};

/**
 * 食譜草稿編輯器元件 - 用於建立和編輯食譜草稿
 */
export default function RecipeDraft() {
  // 初始化食譜狀態
  const [recipe, setRecipe] = useState<Recipe>({
    name: '馬鈴薯料理',
    image: null,
    description:
      '食譜簡介料理中加入在生薑做菜，薑汁香醇的，這味道回甘超人難忘！',
    ingredients: [
      { name: '馬鈴薯', amount: '2個' },
      { name: '馬鈴薯', amount: '2個' },
      { name: '馬鈴薯', amount: '2個' },
    ],
    seasonings: [
      { name: '胡椒鹽', amount: '2匙' },
      { name: '胡椒鹽', amount: '2匙' },
      { name: '胡椒鹽', amount: '2匙' },
    ],
    tags: ['馬鈴薯', '馬鈴薯'],
    cookingTime: '30 分鐘',
    cookingTimeValue: '30',
    cookingTimeUnit: '分鐘',
    servings: '2人份',
    servingsValue: '2',
    servingsUnit: '人份',
    steps: [
      {
        description: '將馬鈴薯切塊',
        startTime: '0:12',
        endTime: '0:30',
        vimeoId: '76979871',
      },
      {
        description: '加入調味料拌勻',
        startTime: '0:31',
        endTime: '0:45',
        vimeoId: '76979871',
      },
      {
        description: '放入烤箱烘烤',
        startTime: '0:46',
        endTime: '1:20',
        vimeoId: '76979871',
      },
    ],
  });

  // 編輯狀態管理
  const [editState, setEditState] = useState<EditState>({
    name: false,
    description: false,
    cookingTime: false,
    servings: false,
  });

  /**
   * 切換指定欄位的編輯狀態
   */
  const atToggleEdit = (field: keyof EditState) => {
    setEditState({
      ...editState,
      [field]: !editState[field],
    });
  };

  /**
   * 更新食譜名稱
   */
  const atUpdateName = (name: string) => {
    setRecipe({ ...recipe, name });
  };

  /**
   * 更新食譜描述
   */
  const atUpdateDescription = (description: string) => {
    setRecipe({ ...recipe, description });
  };

  /**
   * 更新食材屬性
   */
  const atUpdateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  /**
   * 移除指定食材
   */
  const atRemoveIngredient = (index: number) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  /**
   * 新增空白食材
   */
  const atAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }],
    });
  };

  /**
   * 更新調味料屬性
   */
  const atUpdateSeasoning = (
    index: number,
    field: keyof Seasoning,
    value: string,
  ) => {
    const updatedSeasonings = [...recipe.seasonings];
    updatedSeasonings[index] = { ...updatedSeasonings[index], [field]: value };
    setRecipe({ ...recipe, seasonings: updatedSeasonings });
  };

  /**
   * 移除指定調味料
   */
  const atRemoveSeasoning = (index: number) => {
    const updatedSeasonings = recipe.seasonings.filter((_, i) => i !== index);
    setRecipe({ ...recipe, seasonings: updatedSeasonings });
  };

  /**
   * 新增空白調味料
   */
  const atAddSeasoning = () => {
    setRecipe({
      ...recipe,
      seasonings: [...recipe.seasonings, { name: '', amount: '' }],
    });
  };

  /**
   * 新增標籤至食譜
   */
  const atAddTag = (tag: string) => {
    if (tag && !recipe.tags.includes(tag)) {
      setRecipe({
        ...recipe,
        tags: [...recipe.tags, tag],
      });
    }
  };

  /**
   * 從食譜中移除標籤
   */
  const atRemoveTag = (tag: string) => {
    setRecipe({
      ...recipe,
      tags: recipe.tags.filter((t) => t !== tag),
    });
  };

  /**
   * 更新烹飪時間數值並重新計算顯示文字
   */
  const atUpdateCookingTimeValue = (value: string) => {
    // 確保只能輸入數字
    if (/^\d*$/.test(value)) {
      const cookingTime = `${value} ${recipe.cookingTimeUnit}`;
      setRecipe({
        ...recipe,
        cookingTimeValue: value,
        cookingTime,
      });
    }
  };

  /**
   * 更新份量數值並重新計算顯示文字
   */
  const atUpdateServingsValue = (value: string) => {
    // 確保只能輸入數字
    if (/^\d*$/.test(value)) {
      const servings = `${value}${recipe.servingsUnit}`;
      setRecipe({
        ...recipe,
        servingsValue: value,
        servings,
      });
    }
  };

  /**
   * 移除指定烹飪步驟
   */
  const atRemoveStep = (index: number) => {
    const updatedSteps = recipe.steps.filter((_, i) => i !== index);
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  /**
   * 儲存食譜草稿至後端
   */
  const atSaveRecipe = () => {
    console.log('儲存食譜:', recipe);
    // 這裡可以實作儲存到後端的邏輯
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 頂部導航 */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <span className="font-bold">Logo</span>
          <span className="text-gray-500">關鍵字搜尋</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full" aria-label="搜尋">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full" aria-label="個人資料">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* 麵包屑導航 */}
      <div className="flex items-center p-4 text-sm text-gray-500 bg-white">
        <span>首頁</span>
        <span className="mx-2">{'>'}</span>
        <span>建立食譜</span>
        <span className="mx-2">{'>'}</span>
        <span>基礎設定</span>
      </div>

      {/* 主要內容 */}
      <main className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          {/* 食譜名稱 */}
          <EditableSection
            title="食譜名稱"
            isEditing={editState.name}
            onToggleEdit={() => atToggleEdit('name')}
            editView={
              <Input
                value={recipe.name}
                onChange={(e) => atUpdateName(e.target.value)}
                className="w-full"
                autoFocus
              />
            }
            displayView={
              <div className="p-2 bg-white border rounded">{recipe.name}</div>
            }
          />

          {/* 封面圖片 */}
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-medium">封面圖片</h2>
            <div className="flex items-center justify-center w-full h-40 bg-gray-200 rounded">
              {recipe.image ? (
                <img
                  src={recipe.image || '/placeholder.svg'}
                  alt="食譜封面"
                  className="object-cover w-full h-full rounded"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* 食譜簡介 */}
          <EditableSection
            title="食譜簡介"
            isEditing={editState.description}
            onToggleEdit={() => atToggleEdit('description')}
            editView={
              <Textarea
                value={recipe.description}
                onChange={(e) => atUpdateDescription(e.target.value)}
                className="w-full"
                autoFocus
              />
            }
            displayView={
              <div className="p-2 bg-white border rounded min-h-[100px]">
                {recipe.description}
              </div>
            }
          />

          {/* 食材和調味料清單 */}
          <IngredientList
            ingredients={recipe.ingredients}
            seasonings={recipe.seasonings}
            onUpdateIngredient={atUpdateIngredient}
            onRemoveIngredient={atRemoveIngredient}
            onAddIngredient={atAddIngredient}
            onUpdateSeasoning={atUpdateSeasoning}
            onRemoveSeasoning={atRemoveSeasoning}
            onAddSeasoning={atAddSeasoning}
          />

          {/* 食譜標籤 */}
          <TagSection
            tags={recipe.tags}
            onAddTag={atAddTag}
            onRemoveTag={atRemoveTag}
          />

          {/* 烹飪時間和份量 */}
          <CookingInfo
            cookingTimeValue={recipe.cookingTimeValue}
            cookingTimeUnit={recipe.cookingTimeUnit}
            cookingTime={recipe.cookingTime}
            servingsValue={recipe.servingsValue}
            servingsUnit={recipe.servingsUnit}
            servings={recipe.servings}
            isEditingCookingTime={editState.cookingTime}
            isEditingServings={editState.servings}
            onUpdateCookingTimeValue={atUpdateCookingTimeValue}
            onUpdateServingsValue={atUpdateServingsValue}
            onToggleEditCookingTime={() => atToggleEdit('cookingTime')}
            onToggleEditServings={() => atToggleEdit('servings')}
          />

          {/* 料理步驟 */}
          <CookingStep steps={recipe.steps} onRemoveStep={atRemoveStep} />

          {/* 儲存按鈕 */}
          <Button onClick={atSaveRecipe} className="w-full mb-4">
            儲存草稿
          </Button>
        </div>
      </main>
    </div>
  );
}
