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
import { COMMON_TEXTS } from '@/lib/constants/messages';
import {
  draftPageVariants,
  draftSectionVariants,
  draftFieldVariants,
  draftLabelVariants,
  errorMessageVariants,
  loadingStateVariants,
  videoContainerVariants,
  spacingVariants,
  draftStyles,
} from '@/styles/cva/recipe-draft';
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
 * 使用 CVA 樣式系統統一管理所有樣式變體
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

  /**
   * 載入狀態顯示 - 使用 CVA 載入狀態樣式
   */
  if (loading) {
    return (
      <div
        className={loadingStateVariants({
          layout: 'default',
          state: 'loading',
        })}
      >
        <div className={loadingStateVariants({ text: 'default' })}>
          載入食譜草稿中...
        </div>
      </div>
    );
  }

  /**
   * 錯誤狀態顯示 - 使用 CVA 錯誤狀態樣式
   */
  if (error) {
    return (
      <div
        className={loadingStateVariants({ layout: 'column', state: 'error' })}
      >
        <div
          className={errorMessageVariants({ size: 'xl', state: 'critical' })}
        >
          {error}
        </div>
        <Button onClick={() => router.push('/')}>回首頁</Button>
      </div>
    );
  }

  return (
    <div className={draftPageVariants({ layout: 'default' })}>
      {/* 麵包屑導航區域 - 使用 CVA 間距樣式 */}
      <div className={spacingVariants({ padding: 'default' })}>
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

      {/* 主要內容區域 - 使用 CVA 區塊容器樣式 */}
      <main className={draftSectionVariants({ layout: 'mainContent' })}>
        <form
          className={draftSectionVariants({ layout: 'formContainer' })}
          onSubmit={atSaveRecipe}
        >
          {/* 食譜名稱區塊 - 使用 CVA 表單區塊樣式 */}
          <div className={draftSectionVariants({ spacing: 'default' })}>
            <h2
              className={draftLabelVariants({
                size: 'default',
                spacing: 'default',
              })}
            >
              食譜名稱
            </h2>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className={draftFieldVariants({ size: 'full' })}
                  placeholder="請輸入食譜名稱"
                  aria-label="食譜名稱"
                />
              )}
            />
            {errors.name && (
              <p
                className={errorMessageVariants({
                  size: 'sm',
                  spacing: 'default',
                })}
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* 封面圖片區塊 - 使用 CVA 影片容器樣式 */}
          <div className={draftSectionVariants({ spacing: 'default' })}>
            <h2
              className={draftLabelVariants({
                size: 'default',
                spacing: 'default',
              })}
            >
              封面圖片
            </h2>
            <div
              className={videoContainerVariants({
                size: 'default',
                background: 'light',
                aspect: 'video',
              })}
            >
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
                <ImageIcon className="w-8 h-8 text-neutral-400" />
              )}
            </div>
          </div>

          {/* 食譜簡介區塊 - 使用 CVA 表單欄位樣式 */}
          <div className={draftSectionVariants({ spacing: 'default' })}>
            <h2
              className={draftLabelVariants({
                size: 'default',
                spacing: 'default',
              })}
            >
              食譜簡介
            </h2>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className={draftFieldVariants({
                    type: 'textarea',
                    size: 'full',
                  })}
                  placeholder="請輸入食譜簡介"
                  aria-label="食譜簡介"
                />
              )}
            />
            {errors.description && (
              <p
                className={errorMessageVariants({
                  size: 'sm',
                  spacing: 'default',
                })}
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* 食材和調味料清單 - 保持子組件介面不變 */}
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

          {/* 食譜標籤 - 保持子組件介面不變 */}
          <TagSection
            tags={formValues.tags}
            newTag={newTag}
            onNewTagChange={setNewTag}
            onAddTag={atAddTag}
            onRemoveTag={atRemoveTag}
          />

          {/* 烹飪時間和份量 - 保持子組件介面不變 */}
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

          {/* 料理步驟 - 保持子組件介面不變 */}
          <CookingStep
            steps={recipeSteps}
            onRemoveStep={removeStep}
            onNavigateToVideoEdit={atNavigateToVideoEdit}
          />

          {/* 儲存按鈕區域 - 使用 CVA 預設按鈕樣式 */}
          <Button
            type="submit"
            className={draftStyles.button.submitButton}
            disabled={saving}
          >
            {saving ? COMMON_TEXTS.SUBMITTING : `${COMMON_TEXTS.SAVE}草稿`}
          </Button>
        </form>
      </main>
    </div>
  );
}
