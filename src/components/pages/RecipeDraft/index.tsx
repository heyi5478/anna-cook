import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useUserDisplayId } from '@/hooks/useUserDisplayId';
import { useRecipeDraftStore } from '@/stores/recipes/useRecipeDraftStore';
import type { Ingredient, Seasoning } from '@/types/recipe';
import { recipeFormSchema, type RecipeFormValues } from './schema';
import { IngredientList } from './IngredientList';
import { TagSection } from './TagsSection';
import { CookingInfo } from './CookingInfo';
import { CookingStep } from './CookingSteps';

// API 基礎 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

/**
 * 食譜草稿編輯器元件 - 用於建立和編輯食譜草稿
 * 主要負責視覺呈現和表單管理，商業邏輯由 store 處理
 */
export default function RecipeDraft() {
  const router = useRouter();
  const { recipeId } = router.query;
  const userDisplayId = useUserDisplayId();

  // 從 store 獲取狀態和動作
  const {
    loading,
    saving,
    error,
    recipeImage,
    recipeSteps,
    newTag,
    formData,
    loadRecipeDraft,
    removeStep,
    setNewTag,
    addTag,
    removeTag,
    submitRecipe,
    reset,
  } = useRecipeDraftStore();

  // 初始化表單
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: formData,
  });

  // 獲取食材和調味料陣列控制器
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    update: updateIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: seasoningFields,
    append: appendSeasoning,
    remove: removeSeasoning,
    update: updateSeasoning,
  } = useFieldArray({
    control,
    name: 'seasonings',
  });

  // 載入食譜草稿資料
  useEffect(() => {
    if (!recipeId) {
      return;
    }

    const id = Number(recipeId);
    if (Number.isNaN(id)) {
      return;
    }

    loadRecipeDraft(id);
  }, [recipeId, loadRecipeDraft]);

  // 當組件卸載時重置狀態
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // 當 store 中的 formData 更新時，同步到 react-hook-form
  useEffect(() => {
    if (formData.name) {
      setValue('name', formData.name);
      setValue('description', formData.description);
      setValue('cookingTimeValue', formData.cookingTimeValue);
      setValue('cookingTimeUnit', formData.cookingTimeUnit);
      setValue('servingsValue', formData.servingsValue);
      setValue('servingsUnit', formData.servingsUnit);
      setValue('ingredients', formData.ingredients);
      setValue('seasonings', formData.seasonings);
      setValue('tags', formData.tags);
    }
  }, [formData, setValue]);

  /**
   * 處理食材更新
   */
  const atUpdateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    if (field === 'id') return; // 不允許更新 id 欄位
    const currentIngredient = ingredientFields[index];
    updateIngredient(index, { ...currentIngredient, [field]: value });
  };

  /**
   * 處理調味料更新
   */
  const atUpdateSeasoning = (
    index: number,
    field: keyof Seasoning,
    value: string,
  ) => {
    if (field === 'id') return; // 不允許更新 id 欄位
    const currentSeasoning = seasoningFields[index];
    updateSeasoning(index, { ...currentSeasoning, [field]: value });
  };

  /**
   * 處理新增標籤
   */
  const atAddTag = () => {
    if (newTag.trim()) {
      const currentTags = getValues('tags');
      const newTags = addTag(newTag.trim(), currentTags);
      setValue('tags', newTags);
      setNewTag('');
    }
  };

  /**
   * 處理移除標籤
   */
  const atRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues('tags');
    const newTags = removeTag(tagToRemove, currentTags);
    setValue('tags', newTags);
  };

  /**
   * 處理導航到影片編輯頁面
   */
  const atNavigateToVideoEdit = () => {
    if (recipeId) {
      router.push(`/recipe-draft-video?recipeId=${recipeId}`);
    } else {
      router.push('/recipe-draft-video');
    }
  };

  /**
   * 處理表單提交
   */
  const atSaveRecipe = handleSubmit(async (data) => {
    if (!recipeId) {
      console.error('無法提交草稿：缺少食譜 ID');
      return;
    }

    const result = await submitRecipe(Number(recipeId), data, recipeSteps);

    if (result.success) {
      // 使用 displayId 導轉到用戶頁面，若無 displayId 則導轉到首頁
      if (userDisplayId) {
        router.push(`/user/${userDisplayId}`);
      } else {
        console.warn('未找到用戶 displayId，導轉到首頁');
        router.push('/');
      }
    }
  });

  // 監聽表單值變化
  const formValues = watch();

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* 麵包屑導航 */}
      <div className="p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={userDisplayId ? `/user/${userDisplayId}` : '/'}
              >
                會員中心
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>草稿確認</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 主要內容 */}
      <main className="flex-1 p-4">
        <form className="max-w-md mx-auto" onSubmit={atSaveRecipe}>
          {/* 食譜名稱 */}
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-medium">食譜名稱</h2>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full"
                  placeholder="請輸入食譜名稱"
                  aria-label="食譜名稱"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 封面圖片 */}
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-medium">封面圖片</h2>
            <div className="flex items-center justify-center w-full h-40 bg-gray-200 rounded">
              {recipeImage ? (
                <img
                  src={
                    recipeImage.startsWith('http')
                      ? recipeImage
                      : `${API_BASE_URL}${recipeImage}`
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
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-medium">食譜簡介</h2>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="bg-[#FAFAFA] w-full min-h-[64px]"
                  placeholder="請輸入食譜簡介"
                  aria-label="食譜簡介"
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* 食材和調味料清單 */}
          <IngredientList
            ingredients={ingredientFields}
            seasonings={seasoningFields}
            onUpdateIngredient={atUpdateIngredient}
            onRemoveIngredient={removeIngredient}
            onAddIngredient={() => appendIngredient({ name: '', amount: '' })}
            onUpdateSeasoning={atUpdateSeasoning}
            onRemoveSeasoning={removeSeasoning}
            onAddSeasoning={() => appendSeasoning({ name: '', amount: '' })}
            errors={{
              ingredients: errors.ingredients as any,
              seasonings: errors.seasonings as any,
            }}
          />

          {/* 食譜標籤 */}
          <TagSection
            tags={formValues.tags}
            newTag={newTag}
            onNewTagChange={setNewTag}
            onAddTag={atAddTag}
            onRemoveTag={atRemoveTag}
          />

          {/* 烹飪時間和份量 */}
          <CookingInfo
            cookingTimeValue={formValues.cookingTimeValue}
            cookingTimeUnit={formValues.cookingTimeUnit}
            servingsValue={formValues.servingsValue}
            servingsUnit={formValues.servingsUnit}
            onUpdateCookingTimeValue={(value) =>
              setValue('cookingTimeValue', value)
            }
            onUpdateServingsValue={(value) => setValue('servingsValue', value)}
            errors={{
              cookingTimeValue: errors.cookingTimeValue,
              servingsValue: errors.servingsValue,
            }}
          />

          {/* 料理步驟 */}
          <CookingStep
            steps={recipeSteps}
            onRemoveStep={removeStep}
            onNavigateToVideoEdit={atNavigateToVideoEdit}
          />

          {/* 儲存按鈕 */}
          <Button type="submit" className="w-full mb-4" disabled={saving}>
            {saving ? '正在提交...' : '儲存草稿'}
          </Button>
        </form>
      </main>
    </div>
  );
}
