import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { uploadRecipeBasic, type RecipeFormData } from '@/services/api';
import StepIndicator from '@/components/ui/StepIndicator';

// 定義表單驗證 schema
const recipeFormSchema = z.object({
  recipeName: z.string().min(2, { message: '食譜名稱至少需要 2 個字元' }),
  coverImage: z.any().optional(),
  agreement: z.literal(true, {
    errorMap: () => ({ message: '請同意條款才能繼續' }),
  }),
});

// 定義表單資料型別
type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export default function RecipeUploadForm() {
  // 設定目前步驟狀態
  const [currentStep, setCurrentStep] = useState(1);

  // 設定預覽圖片狀態
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 設定載入狀態
  const [isLoading, setIsLoading] = useState(false);

  // 設定錯誤訊息
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      recipeName: '',
      agreement: undefined,
    },
  });

  /**
   * 處理表單提交
   */
  const atSubmit = async (data: RecipeFormValues) => {
    // 清除先前的錯誤訊息
    setErrorMsg(null);

    console.log('表單提交開始', { data, isValid });

    try {
      setIsLoading(true);

      // 檢查表單資料
      if (!data.recipeName || data.recipeName.length < 2) {
        console.error('食譜名稱錯誤', data.recipeName);
        setErrorMsg('食譜名稱至少需要 2 個字元');
        return;
      }

      if (!data.agreement) {
        console.error('未同意條款');
        setErrorMsg('請同意條款才能繼續');
        return;
      }

      // 準備上傳資料
      const uploadData: RecipeFormData = {
        recipeName: data.recipeName,
      };

      // 檢查圖片
      if (data.coverImage) {
        console.log('準備上傳圖片:', data.coverImage);

        if (data.coverImage instanceof File) {
          uploadData.coverImage = data.coverImage;
          console.log('圖片已添加到上傳資料中');
        } else if (
          data.coverImage instanceof FileList &&
          data.coverImage.length > 0
        ) {
          const [file] = Array.from(data.coverImage);
          uploadData.coverImage = file;
          console.log('從 FileList 中提取圖片添加到上傳資料中');
        } else {
          console.warn('圖片格式無效，跳過圖片上傳:', data.coverImage);
        }
      } else {
        console.log('未選擇圖片，僅上傳食譜名稱');
      }

      console.log('最終上傳資料:', uploadData);

      // 呼叫 API 上傳食譜基本資料
      const result = await uploadRecipeBasic(uploadData);

      console.log('API 上傳結果:', result);

      if (result && result.StatusCode === 200) {
        // 前往下一步
        console.log('上傳成功，前往下一步');
        setCurrentStep(2);
      } else {
        // API 回傳錯誤
        console.error('API 回傳錯誤:', result);
        setErrorMsg(result?.msg || '上傳失敗，請稍後再試');
      }
    } catch (error) {
      console.error('上傳發生異常:', error);
      setErrorMsg(
        error instanceof Error ? error.message : '上傳過程中發生錯誤',
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理圖片上傳
   */
  const atImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('選擇了圖片:', file.name, file.type, file.size);

      // 建立檔案預覽
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('沒有選擇圖片或圖片無效');
      setImagePreview(null);
    }
  };

  /**
   * 表單提交錯誤處理
   */
  const atError = (formErrors: any) => {
    console.error('表單驗證錯誤:', formErrors);
    if (formErrors.recipeName) {
      setErrorMsg(formErrors.recipeName.message);
    } else if (formErrors.agreement) {
      setErrorMsg(formErrors.agreement.message);
    } else if (formErrors.coverImage) {
      setErrorMsg('圖片上傳有誤，請重新選擇圖片');
      console.error('圖片錯誤詳情:', formErrors.coverImage);
    } else {
      setErrorMsg('表單填寫有誤，請檢查後重新提交');
    }
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
        <span className="text-gray-500">上傳食譜名稱</span>
      </nav>

      {/* 步驟指示器 */}
      <StepIndicator currentStep={currentStep} />

      {/* 錯誤訊息顯示 */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* 表單 */}
      <form onSubmit={handleSubmit(atSubmit, atError)}>
        {/* 食譜名稱輸入 */}
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="recipeName"
            className="block text-lg font-medium mb-2"
          >
            輸入食譜名稱
          </label>
          <div className="relative">
            <input
              id="recipeName"
              type="text"
              placeholder="在此輸入食譜名稱"
              className={cn(
                'w-full px-10 py-3 border rounded-md bg-gray-50',
                errors.recipeName ? 'border-red-500' : 'border-gray-300',
              )}
              {...register('recipeName')}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
            </div>
          </div>
          {errors.recipeName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.recipeName.message}
            </p>
          )}
        </div>

        {/* 上傳封面圖片 */}
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="coverImage"
            className="block text-lg font-medium mb-2"
          >
            上傳封面圖片
          </label>
          <div
            className="border border-gray-300 rounded-md bg-gray-50 p-4 h-64 flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById('coverImage')?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="預覽圖片"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="mt-2 text-sm text-center">
                  點擊上傳圖片
                  <br />
                  (選填)
                </span>
              </div>
            )}
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              className="hidden"
              {...register('coverImage', {
                onChange: atImageChange,
                setValueAs: (value) => {
                  // 如果是 FileList，返回第一個檔案
                  if (value && value instanceof FileList && value.length > 0) {
                    return value[0];
                  }
                  // 如果已經是 File 或其他值，直接返回
                  return value;
                },
              })}
            />
          </div>
          {imagePreview && (
            <p className="mt-1 text-sm text-green-500">
              已選擇圖片，可點擊重新選擇
            </p>
          )}
          {!imagePreview && (
            <p className="mt-1 text-sm text-gray-500">
              圖片格式: JPG, PNG (選填)
            </p>
          )}
        </div>

        {/* 同意條款 */}
        <div className="mb-6">
          <label htmlFor="agreement" className="flex items-center">
            <input
              id="agreement"
              type="checkbox"
              className={cn(
                'w-5 h-5 mr-2',
                errors.agreement ? 'border-red-500' : '',
              )}
              {...register('agreement')}
            />
            <span className="text-sm">我已同意XX公司隱私及著作權條款</span>
          </label>
          {errors.agreement && (
            <p className="mt-1 text-sm text-red-500">
              {errors.agreement.message}
            </p>
          )}
        </div>

        {/* 顯示表單狀態（開發用） */}
        <div className="mb-6 p-2 bg-gray-100 rounded text-xs text-gray-700">
          表單狀態: {isSubmitting ? '提交中' : '未提交'} | 驗證狀態:{' '}
          {isValid ? '有效' : '無效'} | 載入狀態:{' '}
          {isLoading ? '載入中' : '未載入'}
        </div>

        {/* 下一步按鈕 */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className={cn(
            'w-full py-3 text-white rounded-md transition-colors',
            isLoading || isSubmitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-400 hover:bg-gray-500',
          )}
        >
          {isLoading ? '上傳中...' : '下一步'}
        </button>
      </form>
    </div>
  );
}
