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
  uploadButtonVariants,
  recipeUploadErrorMessageVariants as errorMessageVariants,
  recipeUploadStepContainerVariants as stepContainerVariants,
} from '@/styles/cva';

// 引入拆分的子元件
import RecipeIntroSection from './RecipeIntroSection';
import IngredientList from './IngredientList';
import TagsSection from './TagsSection';
import CookingInfo from './CookingInfo';

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

  // 設定標籤
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
        {/* 食譜介紹區塊 */}
        <RecipeIntroSection
          recipeName={recipeName}
          register={register}
          errors={errors}
        />

        {/* 所需食材 */}
        <IngredientList
          fields={ingredientFields}
          onAdd={atAddIngredient}
          onRemove={removeIngredient}
          register={register}
          errors={errors}
          isSeasoningMode={false}
          title="所需食材"
          addButtonText="食材"
          itemPlaceholder="食材"
        />

        {/* 所需調料 */}
        <IngredientList
          fields={seasoningFields}
          onAdd={atAddSeasoning}
          onRemove={removeSeasoning}
          register={register}
          errors={errors}
          isSeasoningMode
          title="所需調料"
          addButtonText="調料"
          itemPlaceholder="調料"
        />

        {/* 食譜標籤 */}
        <TagsSection
          tags={tags}
          setTags={setTags}
          setValue={setValue}
          errors={errors}
          maxTags={5}
          title="食譜標籤"
        />

        {/* 烹調時間和人份 */}
        <CookingInfo register={register} errors={errors} />

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
