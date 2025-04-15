import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { fetchRecipeDraft } from '@/services/api';
import { EditableSection } from './EditableSection';
import { CookingInfo } from './CookingInfo';
import { IngredientList } from './IngredientList';
import { TagSection } from './TagsSection';
import { CookingStep } from './CookingSteps';

// API 基礎 URL
const API_BASE_URL = 'http://13.71.34.213';

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
  const router = useRouter();
  const { recipeId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化食譜狀態
  const [recipe, setRecipe] = useState<Recipe>({
    name: '',
    image: null,
    description: '',
    ingredients: [],
    seasonings: [],
    tags: [],
    cookingTime: '',
    cookingTimeValue: '',
    cookingTimeUnit: '分鐘',
    servings: '',
    servingsValue: '',
    servingsUnit: '人份',
    steps: [],
  });

  // 編輯狀態管理
  const [editState, setEditState] = useState<EditState>({
    name: false,
    description: false,
    cookingTime: false,
    servings: false,
  });

  // 從 API 獲取食譜草稿資料
  useEffect(() => {
    console.log('useEffect 執行，recipeId:', recipeId);

    async function loadRecipeDraft() {
      if (!recipeId) {
        console.log('沒有 recipeId 參數，不進行 API 請求');
        setLoading(false);
        setError('請確認網址中包含正確的食譜 ID');
        return;
      }

      console.log('開始獲取食譜草稿，ID:', recipeId);

      try {
        setLoading(true);
        setError(null);

        const id = Number(recipeId);
        if (Number.isNaN(id)) {
          console.log('ID 轉換為數字失敗:', recipeId);
          setError('無效的食譜 ID');
          setLoading(false);
          return;
        }

        console.log('調用 fetchRecipeDraft API，recipeId:', id);
        const draftData = await fetchRecipeDraft(id);
        console.log('API 回應資料:', draftData);

        if (draftData.StatusCode !== 200) {
          setError(draftData.msg);
          setLoading(false);
          return;
        }

        // 轉換 API 資料為元件所需格式
        const { recipe: recipeData, ingredients, tags, steps } = draftData;

        setRecipe({
          name: recipeData.recipeName,
          image: recipeData.coverPhoto || null,
          description: recipeData.description || '',
          ingredients: ingredients
            .filter((item) => !item.isFlavoring)
            .map((item) => ({
              name: item.ingredientName,
              amount: `${item.ingredientAmount} ${item.ingredientUnit}`,
              id: item.ingredientId.toString(),
            })),
          seasonings: ingredients
            .filter((item) => item.isFlavoring)
            .map((item) => ({
              name: item.ingredientName,
              amount: `${item.ingredientAmount} ${item.ingredientUnit}`,
              id: item.ingredientId.toString(),
            })),
          tags: tags.map((tag) => tag.tagName),
          cookingTime: `${recipeData.cookingTime} 分鐘`,
          cookingTimeValue: recipeData.cookingTime.toString(),
          cookingTimeUnit: '分鐘',
          servings: `${recipeData.portion}人份`,
          servingsValue: recipeData.portion.toString(),
          servingsUnit: '人份',
          steps: steps.map((step) => ({
            description: step.stepDescription,
            startTime: formatTimeFromSeconds(step.videoStart),
            endTime: formatTimeFromSeconds(step.videoEnd),
            id: step.stepId.toString(),
          })),
        });
      } catch (err) {
        console.error('獲取食譜草稿失敗:', err);
        setError('獲取食譜草稿時發生錯誤');
      } finally {
        console.log('載入流程結束，設置 loading = false');
        setLoading(false);
      }
    }

    loadRecipeDraft();
  }, [recipeId]);

  /**
   * 將秒數格式化為 MM:SS 格式
   */
  const formatTimeFromSeconds = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">載入食譜草稿中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="text-xl font-semibold text-red-500">{error}</div>
        <Button onClick={() => router.push('/')}>回首頁</Button>
      </div>
    );
  }

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
                  src={
                    recipe.image.startsWith('http')
                      ? recipe.image
                      : `${API_BASE_URL}${recipe.image}`
                  }
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
