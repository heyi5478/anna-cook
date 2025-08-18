import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import StepIndicator from '@/components/common/StepIndicator';
import { RecipeStep2Data } from '@/types/api';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { updateRecipeStep2 } from '@/services/recipes';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
import {
  uploadPageVariants,
  uploadFieldVariants,
  uploadButtonVariants,
  recipeUploadErrorMessageVariants as errorMessageVariants,
  recipeUploadStepContainerVariants as stepContainerVariants,
  recipeUploadLabelVariants as labelVariants,
  recipeUploadTagVariants as tagVariants,
  recipeUploadIngredientRowVariants as ingredientRowVariants,
} from '@/styles/cva';
import { separatorVariants } from '@/styles/cva/recipe-upload';

// 定義表單驗證 schema
const recipeStep2Schema = z.object({
  recipeTitle: z.string().min(2, { message: '食譜標題至少需要 2 個字元' }),
  recipeDescription: z
    .string()
    .min(10, { message: '食譜介紹至少需要 10 個字元' }),
  ingredients: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, { message: VALIDATION_MESSAGES.REQUIRED_INGREDIENT_NAME }),
        amount: z
          .string()
          .min(1, { message: VALIDATION_MESSAGES.REQUIRED_AMOUNT }),
        unit: z.string().optional(),
        isFlavoring: z.boolean().default(false),
      }),
    )
    .min(1, { message: VALIDATION_MESSAGES.MIN_INGREDIENTS }),
  seasonings: z.array(
    z.object({
      name: z
        .string()
        .min(1, { message: VALIDATION_MESSAGES.REQUIRED_SEASONING_NAME_ALT }),
      amount: z
        .string()
        .min(1, { message: VALIDATION_MESSAGES.REQUIRED_AMOUNT }),
      unit: z.string().optional(),
    }),
  ),
  tags: z.array(z.string()).min(1, { message: VALIDATION_MESSAGES.MIN_TAGS }),
  cookingTime: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED_COOKING_TIME }),
  servings: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED_SERVINGS }),
});

// 定義表單資料型別
type RecipeStep2Values = z.infer<typeof recipeStep2Schema>;

// 食譜上傳第二步主組件
export default function RecipeUploadStep2() {
  // 初始化路由器取得 recipeId
  const router = useRouter();
  const { recipeId } = router.query;

  // 設定載入狀態
  const [isLoading, setIsLoading] = useState(false);

  // 設定錯誤訊息
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 設定目前步驟狀態
  const [currentStep] = useState(2);

  // 設定自訂標籤
  const [customTag, setCustomTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 從 localStorage 取得食譜名稱
  const [recipeName, setRecipeName] = useState<string>('');

  // 在元件載入時從 localStorage 讀取食譜名稱
  useEffect(() => {
    const storedRecipeName = localStorage.getItem('recipeName');
    if (storedRecipeName) {
      setRecipeName(storedRecipeName);
    }
  }, []);

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<RecipeStep2Values>({
    resolver: zodResolver(recipeStep2Schema),
    defaultValues: {
      recipeTitle: recipeName || '馬鈴薯燉肉',
      recipeDescription: '',
      ingredients: [{ name: '', amount: '', unit: '', isFlavoring: false }],
      seasonings: [{ name: '', amount: '', unit: '' }],
      tags: [],
      cookingTime: '120',
      servings: '4',
    },
  });

  // 同步 tags state 和表單值
  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  // 使用 useFieldArray 管理動態食材列表
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  // 使用 useFieldArray 管理動態調料列表
  const {
    fields: seasoningFields,
    append: appendSeasoning,
    remove: removeSeasoning,
  } = useFieldArray({
    control,
    name: 'seasonings',
  });

  /**
   * 處理表單提交
   */
  const atSubmit = async (data: RecipeStep2Values) => {
    // 清除先前的錯誤訊息
    setErrorMsg(null);

    try {
      setIsLoading(true);

      if (!recipeId) {
        setErrorMsg('無法取得食譜 ID，請回到步驟一重新開始');
        return;
      }

      console.log('表單資料:', data);

      // 將表單資料轉換為 API 需要的格式
      const apiData: RecipeStep2Data = {
        recipeIntro: data.recipeDescription,
        cookingTime: parseInt(data.cookingTime, 10),
        portion: parseInt(data.servings, 10),
        ingredients: [
          // 將食材和調料合併，並區分 isFlavoring
          ...data.ingredients
            .filter((item) => item.name.trim() && item.amount.trim())
            .map((item) => {
              const amount = parseFloat(item.amount.trim());
              if (Number.isNaN(amount) || amount <= 0) {
                throw new Error(`食材「${item.name}」的數量無效`);
              }
              return {
                ingredientName: item.name.trim(),
                ingredientAmount: amount,
                ingredientUnit: item.unit?.trim() || 'g',
                isFlavoring: false,
              };
            }),
          ...data.seasonings
            .filter((item) => item.name.trim() && item.amount.trim())
            .map((item) => {
              const amount = parseFloat(item.amount.trim());
              if (Number.isNaN(amount) || amount <= 0) {
                throw new Error(`調料「${item.name}」的數量無效`);
              }
              return {
                ingredientName: item.name.trim(),
                ingredientAmount: amount,
                ingredientUnit: item.unit?.trim() || 'g',
                isFlavoring: true,
              };
            }),
        ],
        tags: data.tags,
      };

      console.log('API 請求資料:', apiData);

      // 呼叫 API 更新食譜詳細資訊
      const result = await updateRecipeStep2(
        parseInt(recipeId as string, 10),
        apiData,
      );

      console.log('API 回應結果:', result);

      if (result && result.StatusCode === 200) {
        // 更新成功後跳轉到步驟3頁面
        console.log('更新成功，跳轉到上傳影片頁面');
        router.push({
          pathname: '/upload-video',
          query: { recipeId: result.Id },
        });
      } else {
        // API 回傳錯誤
        console.error('API 回傳錯誤:', result);
        setErrorMsg(
          result?.msg || `${ERROR_MESSAGES.UPDATE_RECIPE_FAILED}，請稍後再試`,
        );
      }
    } catch (error) {
      console.error('更新食譜詳細資訊發生異常:', error);
      setErrorMsg(
        error instanceof Error ? error.message : '更新過程中發生錯誤',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 添加新食材
  const atAddIngredient = () => {
    appendIngredient({ name: '', amount: '', unit: '', isFlavoring: false });
  };

  // 添加新調料
  const atAddSeasoning = () => {
    appendSeasoning({ name: '', amount: '', unit: '' });
  };

  /**
   * 添加標籤
   */
  const atAddTag = () => {
    if (
      customTag.trim() &&
      !tags.includes(customTag.trim()) &&
      tags.length < 5
    ) {
      const newTags = [...tags, customTag.trim()];
      setTags(newTags);
      setValue('tags', newTags); // 同步更新表單值
      setCustomTag('');
    }
  };

  /**
   * 移除標籤
   */
  const atRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags); // 同步更新表單值
  };

  /**
   * 處理標籤輸入按 Enter 鍵
   */
  const atTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      atAddTag();
    }
  };

  return (
    <div className={uploadPageVariants()}>
      {/* 麵包屑導航 */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:underline">
              首頁
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/upload-step1" className="hover:underline">
              建立食譜
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-neutral-500">
              上傳食譜資訊
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 步驟指示器 */}
      <div className={stepContainerVariants()}>
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* 錯誤訊息顯示 */}
      {errorMsg && (
        <div className={errorMessageVariants({ variant: 'banner' })}>
          {errorMsg}
        </div>
      )}

      {/* 表單 */}
      <form onSubmit={handleSubmit(atSubmit)}>
        {/* 食譜標題 */}
        <div className={stepContainerVariants({ variant: 'titleSection' })}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              {recipeName || '馬鈴薯燉肉'}
            </h2>
          </div>
        </div>

        {/* 食譜介紹 */}
        <div className={stepContainerVariants()}>
          <div className={labelVariants()} id="recipeDescription-label">
            輸入食譜介紹
          </div>
          <textarea
            id="recipeDescription"
            rows={10}
            placeholder="食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！"
            aria-labelledby="recipeDescription-label"
            className={uploadFieldVariants({
              variant: 'textarea',
              state: errors.recipeDescription ? 'error' : 'default',
            })}
            {...register('recipeDescription')}
          />
          {errors.recipeDescription && (
            <p className={errorMessageVariants()}>
              {errors.recipeDescription.message}
            </p>
          )}
        </div>

        {/* 所需食材 */}
        <div className="mb-6">
          <h2 className={labelVariants()}>所需食材</h2>

          <div
            className={stepContainerVariants({
              variant: 'ingredientsContainer',
            })}
          >
            {ingredientFields.map((field, index) => (
              <div key={field.id}>
                <div
                  className={ingredientRowVariants({
                    variant: field.name ? 'filled' : 'empty',
                  })}
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="食材"
                      className="w-full bg-transparent border-none outline-none placeholder-neutral-400"
                      {...register(`ingredients.${index}.name`)}
                    />
                  </div>
                  <div className="w-0 h-6 border-l border-neutral-300" />
                  <div className="w-20 text-center">
                    <input
                      type="text"
                      placeholder="份量"
                      className="w-full bg-transparent border-none outline-none text-center placeholder-neutral-400"
                      {...register(`ingredients.${index}.amount`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={`${COMMON_TEXTS.DELETE}食材`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
                {index < ingredientFields.length - 1 && (
                  <div
                    className={separatorVariants({
                      variant: 'dashed',
                      spacing: 'sm',
                    })}
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={atAddIngredient}
              className={uploadButtonVariants({
                variant: 'addIngredient',
                size: 'default',
              })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m12 8 0 8" />
                <path d="m8 12 8 0" />
              </svg>
              <span>食材</span>
            </button>
          </div>
        </div>

        {/* 所需調料 */}
        <div className="mb-6">
          <h2 className={labelVariants()}>所需調料</h2>

          <div
            className={stepContainerVariants({
              variant: 'ingredientsContainer',
            })}
          >
            {seasoningFields.map((field, index) => (
              <div key={field.id}>
                <div
                  className={ingredientRowVariants({
                    variant: field.name ? 'filled' : 'empty',
                  })}
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="調料"
                      className="w-full bg-transparent border-none outline-none placeholder-neutral-400"
                      {...register(`seasonings.${index}.name`)}
                    />
                  </div>
                  <div className="w-0 h-6 border-l border-neutral-300" />
                  <div className="w-20 text-center">
                    <input
                      type="text"
                      placeholder="份量"
                      className="w-full bg-transparent border-none outline-none text-center placeholder-neutral-400"
                      {...register(`seasonings.${index}.amount`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSeasoning(index)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={`${COMMON_TEXTS.DELETE}調料`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
                {index < seasoningFields.length - 1 && (
                  <div
                    className={separatorVariants({
                      variant: 'dashed',
                      spacing: 'sm',
                    })}
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={atAddSeasoning}
              className={uploadButtonVariants({
                variant: 'addIngredient',
                size: 'default',
              })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m12 8 0 8" />
                <path d="m8 12 8 0" />
              </svg>
              <span>調料</span>
            </button>
          </div>
        </div>

        {/* 食譜標籤 */}
        <div className={stepContainerVariants()}>
          <h2 className={labelVariants()}>食譜標籤</h2>
          <div className={stepContainerVariants({ variant: 'infoSection' })}>
            <div className="flex justify-between items-center mb-2">
              <span>增加新標籤 ({tags.length}/5)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="輸入自訂標籤"
                className={uploadFieldVariants({
                  variant: 'input',
                  state: 'default',
                })}
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={atTagKeyDown}
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                className={uploadButtonVariants({
                  variant: 'secondary',
                  state:
                    !customTag.trim() || tags.length >= 5
                      ? 'disabled'
                      : 'default',
                  size: 'sm',
                })}
                onClick={atAddTag}
                disabled={!customTag.trim() || tags.length >= 5}
              >
                新增
              </button>
            </div>

            {/* 已新增的標籤 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className={tagVariants({ variant: 'removable' })}
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="ml-1 text-neutral-500"
                      onClick={() => atRemoveTag(tag)}
                      aria-label={`移除標籤 ${tag}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.tags && (
              <p className={errorMessageVariants()}>{errors.tags.message}</p>
            )}
          </div>
        </div>

        {/* 烹調時間和人份 */}
        <div className="flex justify-between items-start max-w-md mx-auto mb-10">
          {/* 烹調時間 */}
          <div className="flex-1 max-w-[186px]">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="cookingTime"
              className="block text-base font-normal text-neutral-700 leading-6 mb-2"
            >
              烹調時間
            </label>
            <div
              className={`border rounded-lg px-4 py-2 min-h-[44px] ${
                errors.cookingTime
                  ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200'
                  : 'border-neutral-400 hover:border-neutral-500 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200'
              }`}
            >
              <div className="flex items-center justify-between w-full h-full">
                <input
                  id="cookingTime"
                  type="number"
                  className="flex-1 bg-transparent border-none outline-none text-base font-normal text-neutral-500 placeholder:text-neutral-400 min-w-0"
                  placeholder="120"
                  {...register('cookingTime')}
                />
                <span className="text-base font-normal text-neutral-700 ml-3 flex-shrink-0">
                  分鐘
                </span>
              </div>
            </div>
            {errors.cookingTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.cookingTime.message}
              </p>
            )}
          </div>

          {/* 分隔線 */}
          <div className="w-0 h-[72px] border-l border-neutral-50 mx-2 mt-2.5" />

          {/* 人份 */}
          <div className="flex-1 max-w-[186px]">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="servings"
              className="block text-base font-normal text-neutral-700 leading-6 mb-2"
            >
              幾人份
            </label>
            <div
              className={`border rounded-lg px-4 py-2 min-h-[44px] ${
                errors.servings
                  ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200'
                  : 'border-neutral-400 hover:border-neutral-500 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200'
              }`}
            >
              <div className="flex items-center justify-between w-full h-full">
                <input
                  id="servings"
                  type="number"
                  className="flex-1 bg-transparent border-none outline-none text-base font-normal text-neutral-500 placeholder:text-neutral-400 min-w-0"
                  placeholder="4"
                  {...register('servings')}
                />
                <span className="text-base font-normal text-neutral-700 ml-3 flex-shrink-0">
                  人份
                </span>
              </div>
            </div>
            {errors.servings && (
              <p className="mt-1 text-sm text-red-500">
                {errors.servings.message}
              </p>
            )}
          </div>
        </div>

        {/* 下一步按鈕 */}
        <button
          type="submit"
          disabled={isLoading}
          className={uploadButtonVariants({
            variant: 'primary',
            state: isLoading ? 'loading' : 'default',
          })}
        >
          {isLoading ? COMMON_TEXTS.SUBMITTING : '下一步'}
        </button>
      </form>
    </div>
  );
}
