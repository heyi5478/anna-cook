import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { fetchRecipeDraft, submitRecipeDraft } from '@/services/api';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { CookingStep } from './CookingSteps';

// API 基礎 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

// 類型定義區塊
type Step = {
  description: string;
  startTime: string;
  endTime: string;
  video?: string;
  vimeoId?: string;
  id?: string;
};

// 表單驗證 Schema
const recipeFormSchema = z.object({
  name: z.string().min(1, '請輸入食譜名稱'),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, '請輸入食材名稱'),
      amount: z.string(),
      id: z.string().optional(),
    }),
  ),
  seasonings: z.array(
    z.object({
      name: z.string().min(1, '請輸入調味料名稱'),
      amount: z.string(),
      id: z.string().optional(),
    }),
  ),
  tags: z.array(z.string()),
  cookingTimeValue: z.string().regex(/^\d*$/, '請輸入數字'),
  cookingTimeUnit: z.string(),
  servingsValue: z.string().regex(/^\d*$/, '請輸入數字'),
  servingsUnit: z.string(),
});

// 表單值型別
type RecipeFormValues = z.infer<typeof recipeFormSchema>;

/**
 * 食譜草稿編輯器元件 - 用於建立和編輯食譜草稿
 */
export default function RecipeDraft() {
  const router = useRouter();
  const { recipeId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [recipeSteps, setRecipeSteps] = useState<Step[]>([]);
  const [newTag, setNewTag] = useState('');

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
    defaultValues: {
      name: '',
      description: '',
      ingredients: [],
      seasonings: [],
      tags: [],
      cookingTimeValue: '',
      cookingTimeUnit: '分鐘',
      servingsValue: '',
      servingsUnit: '人份',
    },
  });

  // 獲取食材和調味料陣列控制器
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: seasoningFields,
    append: appendSeasoning,
    remove: removeSeasoning,
  } = useFieldArray({
    control,
    name: 'seasonings',
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

        // 從 videoId 中提取 Vimeo ID
        let vimeoId = '';
        if (recipeData.videoId) {
          // 假設 videoId 格式為 "/videos/1075575886"
          const match = recipeData.videoId.match(/\/videos\/(\d+)/);
          if (match && match[1]) {
            const [, extractedId] = match;
            vimeoId = extractedId;
            console.log('提取的 Vimeo ID:', vimeoId);
          }
        }

        // 設置表單值
        setValue('name', recipeData.recipeName);
        setValue('description', recipeData.description || '');
        setValue('cookingTimeValue', recipeData.cookingTime.toString());
        setValue('cookingTimeUnit', '分鐘');
        setValue('servingsValue', recipeData.portion.toString());
        setValue('servingsUnit', '人份');

        // 設置食材
        setValue(
          'ingredients',
          ingredients
            .filter((item) => !item.isFlavoring)
            .map((item) => ({
              name: item.ingredientName,
              amount: `${item.ingredientAmount} ${item.ingredientUnit}`,
              id: item.ingredientId.toString(),
            })),
        );

        // 設置調味料
        setValue(
          'seasonings',
          ingredients
            .filter((item) => item.isFlavoring)
            .map((item) => ({
              name: item.ingredientName,
              amount: `${item.ingredientAmount} ${item.ingredientUnit}`,
              id: item.ingredientId.toString(),
            })),
        );

        // 設置標籤
        setValue(
          'tags',
          tags.map((tag) => tag.tagName),
        );

        // 設置圖片
        setRecipeImage(recipeData.coverPhoto || null);

        // 設置步驟
        setRecipeSteps(
          steps.map((step) => ({
            description: step.stepDescription,
            startTime: formatTimeFromSeconds(step.videoStart),
            endTime: formatTimeFromSeconds(step.videoEnd),
            id: step.stepId.toString(),
            vimeoId,
          })),
        );
      } catch (err) {
        console.error('獲取食譜草稿失敗:', err);
        setError('獲取食譜草稿時發生錯誤');
      } finally {
        console.log('載入流程結束，設置 loading = false');
        setLoading(false);
      }
    }

    loadRecipeDraft();
  }, [recipeId, setValue]);

  /**
   * 將秒數格式化為 MM:SS 格式
   */
  const formatTimeFromSeconds = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * 添加新標籤
   */
  const atAddTag = () => {
    if (newTag && !getValues('tags').includes(newTag)) {
      const currentTags = getValues('tags');
      setValue('tags', [...currentTags, newTag]);
      setNewTag('');
    }
  };

  /**
   * 移除標籤
   */
  const atRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues('tags');
    setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  /**
   * 移除指定烹飪步驟
   */
  const atRemoveStep = (index: number) => {
    setRecipeSteps(recipeSteps.filter((_, i) => i !== index));
  };

  /**
   * 儲存食譜草稿至後端
   */
  const atSaveRecipe = handleSubmit(async (data) => {
    try {
      console.log('正在提交食譜草稿:', data);

      if (!recipeId) {
        console.error('無法提交草稿：缺少食譜 ID');
        return;
      }

      // 設置提交中狀態
      setSaving(true);

      // 準備提交的資料
      const submitData = {
        recipeName: data.name,
        recipeIntro: data.description,
        cookingTime: parseInt(data.cookingTimeValue, 10) || 0,
        portion: parseInt(data.servingsValue, 10) || 0,
        ingredients: [
          // 食材列表 (非調味料)
          ...data.ingredients.map((item) => ({
            name: item.name,
            amount: item.amount,
            isFlavoring: false,
          })),
          // 調味料列表
          ...data.seasonings.map((item) => ({
            name: item.name,
            amount: item.amount,
            isFlavoring: true,
          })),
        ],
        tags: data.tags,
        steps: recipeSteps.map((step) => ({
          description: step.description,
          startTime: step.startTime,
          endTime: step.endTime,
        })),
      };

      // 呼叫 API 提交草稿
      const response = await submitRecipeDraft(Number(recipeId), submitData);

      // 處理回應
      if (response.StatusCode === 200) {
        console.log('草稿提交成功:', response);

        // 跳轉到用戶中心頁面
        router.push('/user-center');
      } else {
        console.error('草稿提交失敗:', response);
      }
    } catch (err) {
      console.error('提交過程發生錯誤:', err);
    } finally {
      // 結束提交狀態
      setSaving(false);
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
                  className="w-full min-h-[100px]"
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

          {/* 食材清單 */}
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-medium">食材清單</h2>
            {ingredientFields.map((item, index) => (
              <div key={item.id} className="flex items-center mb-2">
                <div className="flex items-center flex-1">
                  <Controller
                    name={`ingredients.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="flex-1 mr-2"
                        placeholder="食材名稱"
                        aria-label={`食材名稱 ${index + 1}`}
                      />
                    )}
                  />
                  <Controller
                    name={`ingredients.${index}.amount`}
                    control={control}
                    render={({ field: amountField }) => (
                      <Input
                        {...amountField}
                        className="w-16 mr-2"
                        placeholder="數量"
                        aria-label={`食材數量 ${index + 1}`}
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-1 text-gray-500"
                  aria-label={`移除食材 ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendIngredient({ name: '', amount: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> 新增食材
            </Button>
          </div>

          {/* 調味料清單 */}
          <div className="mb-4">
            <h2 id="seasonings-heading" className="mb-2 text-lg font-medium">
              調味料清單
            </h2>
            {seasoningFields.map((item, index) => (
              <div key={item.id} className="flex items-center mb-2">
                <div className="flex items-center flex-1">
                  <Controller
                    name={`seasonings.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="flex-1 mr-2"
                        placeholder="調味料名稱"
                        aria-label={`調味料名稱 ${index + 1}`}
                        aria-labelledby="seasonings-heading"
                      />
                    )}
                  />
                  <Controller
                    name={`seasonings.${index}.amount`}
                    control={control}
                    render={({ field: amountField }) => (
                      <Input
                        {...amountField}
                        className="w-16 mr-2"
                        placeholder="數量"
                        aria-label={`調味料數量 ${index + 1}`}
                        aria-labelledby="seasonings-heading"
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSeasoning(index)}
                  className="p-1 text-gray-500"
                  aria-label={`移除調味料 ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSeasoning({ name: '', amount: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> 新增調味料
            </Button>
          </div>

          {/* 食譜標籤 */}
          <div className="mb-4">
            <h2 id="tags-heading" className="mb-2 text-lg font-medium">
              食譜標籤
            </h2>
            <div className="flex flex-wrap mb-2">
              {watch('tags').map((tag) => (
                <Badge key={tag} className="mr-2 mb-2">
                  {tag}
                  <button
                    type="button"
                    onClick={() => atRemoveTag(tag)}
                    className="ml-1 text-xs"
                    aria-label={`移除標籤 ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 mr-2"
                placeholder="輸入標籤"
                aria-labelledby="tags-heading"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={atAddTag}
                disabled={!newTag}
              >
                新增
              </Button>
            </div>
          </div>

          {/* 烹飪時間和份量 */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <h2 className="mb-2 text-lg font-medium">烹飪時間</h2>
              <div className="flex items-center">
                <Controller
                  name="cookingTimeValue"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      className="w-20 mr-2"
                      placeholder="時間"
                      aria-label="烹飪時間"
                    />
                  )}
                />
                <span>{formValues.cookingTimeUnit}</span>
              </div>
              {errors.cookingTimeValue && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.cookingTimeValue.message}
                </p>
              )}
            </div>
            <div>
              <h2 className="mb-2 text-lg font-medium">份量</h2>
              <div className="flex items-center">
                <Controller
                  name="servingsValue"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      className="w-20 mr-2"
                      placeholder="份量"
                      aria-label="份量"
                    />
                  )}
                />
                <span>{formValues.servingsUnit}</span>
              </div>
              {errors.servingsValue && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.servingsValue.message}
                </p>
              )}
            </div>
          </div>

          {/* 料理步驟 */}
          <CookingStep steps={recipeSteps} onRemoveStep={atRemoveStep} />

          {/* 儲存按鈕 */}
          <Button type="submit" className="w-full mb-4" disabled={saving}>
            {saving ? '正在提交...' : '儲存草稿'}
          </Button>
        </form>
      </main>
    </div>
  );
}
