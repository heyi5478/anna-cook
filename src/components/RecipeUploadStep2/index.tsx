import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 定義表單驗證 schema
const recipeStep2Schema = z.object({
  recipeTitle: z.string().min(2, { message: '食譜標題至少需要 2 個字元' }),
  recipeDescription: z
    .string()
    .min(10, { message: '食譜介紹至少需要 10 個字元' }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, { message: '請輸入食材名稱' }),
        amount: z.string().min(1, { message: '請輸入數量' }),
        unit: z.string().optional(),
      }),
    )
    .min(1, { message: '至少需要一項食材' }),
  seasonings: z.array(
    z.object({
      name: z.string().min(1, { message: '請輸入調料名稱' }),
      amount: z.string().min(1, { message: '請輸入數量' }),
      unit: z.string().optional(),
    }),
  ),
  tags: z.array(z.string()).optional(),
  cookingTime: z.string().min(1, { message: '請輸入烹調時間' }),
  servings: z.string().min(1, { message: '請輸入人份數' }),
});

// 定義表單資料型別
type RecipeStep2Values = z.infer<typeof recipeStep2Schema>;

export default function RecipeUploadStep2() {
  // 設定目前步驟狀態
  const [currentStep, setCurrentStep] = useState(2);

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeStep2Values>({
    resolver: zodResolver(recipeStep2Schema),
    defaultValues: {
      recipeTitle: '馬鈴薯燉肉',
      recipeDescription:
        '食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！',
      ingredients: [{ name: '馬鈴薯', amount: '2', unit: '顆' }],
      seasonings: [{ name: '初榨醬油', amount: '1', unit: '小匙' }],
      cookingTime: '120',
      servings: '4',
    },
  });

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

  // 處理表單提交
  const atSubmit = (data: RecipeStep2Values) => {
    console.log('表單資料:', data);
    setCurrentStep(3);
  };

  // 添加新食材
  const atAddIngredient = () => {
    appendIngredient({ name: '', amount: '', unit: '' });
  };

  // 添加新調料
  const atAddSeasoning = () => {
    appendSeasoning({ name: '', amount: '', unit: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 麵包屑導航 */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="hover:underline">
          首頁
        </Link>
        <span>&gt;</span>
        <Link href="/recipes" className="hover:underline">
          建立食譜
        </Link>
        <span>&gt;</span>
        <span className="text-gray-500">上傳食譜資訊</span>
      </nav>

      {/* 步驟指示器 */}
      <div className="mb-10">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200" />

          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10',
                  currentStep >= step
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-500',
                )}
              >
                {step}
              </div>
              <span className="mt-2 text-sm font-medium">Step {step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 表單 */}
      <form onSubmit={handleSubmit(atSubmit)}>
        {/* 食譜標題 */}
        <div className="mb-6 border-t border-b border-dashed border-gray-300 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">馬鈴薯燉肉</h2>
            <button
              type="button"
              className="text-gray-500"
              aria-label="編輯食譜標題"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 食譜介紹 */}
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="recipeDescription"
            className="block text-lg font-medium mb-2"
          >
            輸入食譜介紹
          </label>
          <textarea
            id="recipeDescription"
            rows={10}
            className={cn(
              'w-full p-3 border rounded-md bg-gray-50',
              errors.recipeDescription ? 'border-red-500' : 'border-gray-300',
            )}
            {...register('recipeDescription')}
          />
          {errors.recipeDescription && (
            <p className="mt-1 text-sm text-red-500">
              {errors.recipeDescription.message}
            </p>
          )}
        </div>

        {/* 所需食材 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">所需食材</h2>

          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="食材"
                  className={cn(
                    'w-full p-2 border rounded-md',
                    errors.ingredients?.[index]?.name
                      ? 'border-red-500'
                      : 'border-gray-300',
                  )}
                  {...register(`ingredients.${index}.name`)}
                />
              </div>
              <div className="w-16">
                <input
                  type="text"
                  placeholder="數量"
                  className={cn(
                    'w-full p-2 border rounded-md',
                    errors.ingredients?.[index]?.amount
                      ? 'border-red-500'
                      : 'border-gray-300',
                  )}
                  {...register(`ingredients.${index}.amount`)}
                />
              </div>
              <div className="w-16">
                <input
                  type="text"
                  placeholder="單位"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...register(`ingredients.${index}.unit`)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-gray-500"
                aria-label="刪除食材"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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

          <button
            type="button"
            onClick={atAddIngredient}
            className="flex items-center text-gray-500 mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            <span className="ml-1">食材</span>
          </button>
        </div>

        {/* 所需調料 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">所需調料</h2>

          {seasoningFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="調料"
                  className={cn(
                    'w-full p-2 border rounded-md',
                    errors.seasonings?.[index]?.name
                      ? 'border-red-500'
                      : 'border-gray-300',
                  )}
                  {...register(`seasonings.${index}.name`)}
                />
              </div>
              <div className="w-16">
                <input
                  type="text"
                  placeholder="數量"
                  className={cn(
                    'w-full p-2 border rounded-md',
                    errors.seasonings?.[index]?.amount
                      ? 'border-red-500'
                      : 'border-gray-300',
                  )}
                  {...register(`seasonings.${index}.amount`)}
                />
              </div>
              <div className="w-16">
                <input
                  type="text"
                  placeholder="單位"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...register(`seasonings.${index}.unit`)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSeasoning(index)}
                className="text-gray-500"
                aria-label="刪除調料"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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

          <button
            type="button"
            onClick={atAddSeasoning}
            className="flex items-center text-gray-500 mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            <span className="ml-1">調料</span>
          </button>
        </div>

        {/* 食譜標籤 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">食譜標籤</h2>
          <div className="bg-gray-200 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span>增加新標籤 (0/5)</span>
            </div>
            <input
              type="text"
              placeholder="輸入自訂標籤"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            />
          </div>
        </div>

        {/* 烹調時間和人份 */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="cookingTime"
              className="block text-lg font-medium mb-2"
            >
              烹調時間
            </label>
            <div className="flex items-center">
              <input
                id="cookingTime"
                type="number"
                className={cn(
                  'w-full p-2 border rounded-md',
                  errors.cookingTime ? 'border-red-500' : 'border-gray-300',
                )}
                {...register('cookingTime')}
              />
              <span className="ml-2">分鐘</span>
            </div>
            {errors.cookingTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.cookingTime.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="servings"
              className="block text-lg font-medium mb-2"
            >
              幾人份
            </label>
            <div className="flex items-center">
              <input
                id="servings"
                type="number"
                className={cn(
                  'w-full p-2 border rounded-md',
                  errors.servings ? 'border-red-500' : 'border-gray-300',
                )}
                {...register('servings')}
              />
              <span className="ml-2">人份</span>
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
          className="w-full py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
        >
          下一步
        </button>
      </form>
    </div>
  );
}
