import type React from 'react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import StepIndicator from '@/components/common/StepIndicator';
import { RecipeFormData } from '@/types/api';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { uploadRecipeBasic } from '@/services/recipes';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
import {
  SUPPORTED_IMAGE_TYPES,
  FILE_VALIDATION_MESSAGES,
} from '@/lib/constants/file';
import {
  uploadPageVariants,
  uploadFieldVariants,
  uploadButtonVariants,
  recipeUploadErrorMessageVariants as errorMessageVariants,
  recipeUploadAreaVariants as uploadAreaVariants,
  recipeUploadStepContainerVariants as stepContainerVariants,
  recipeUploadLabelVariants as labelVariants,
  recipeUploadInputIconVariants as inputIconVariants,
  recipeUploadSuccessMessageVariants as successMessageVariants,
} from '@/styles/cva';

// 定義表單驗證 schema
const recipeFormSchema = z.object({
  recipeName: z.string().min(2, { message: '食譜名稱至少需要 2 個字元' }),
  // 使用自定義驗證器而非 refine 來處理檔案上傳
  coverImage: z
    .any()
    .optional()
    .superRefine((value, ctx) => {
      // 這個檢查會在 UI 上處理，而不是依賴 Zod
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.REQUIRED_COVER_IMAGE,
        });
        return;
      }

      // 檢查是否為有效的 File 物件
      if (!(value instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.SELECT_VALID_IMAGE,
        });
        return;
      }

      // 檢查檔案類型
      if (!SUPPORTED_IMAGE_TYPES.includes(value.type as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: FILE_VALIDATION_MESSAGES.INVALID_IMAGE_TYPE,
        });
      }
    }),
  agreement: z.literal(true, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.AGREE_TERMS }),
  }),
});

// 定義表單資料型別
type RecipeFormValues = z.infer<typeof recipeFormSchema>;

// 食譜上傳第一步主組件
export default function RecipeUploadForm() {
  // 初始化路由器
  const router = useRouter();

  // 設定目前步驟狀態
  const [currentStep] = useState(1);

  // 設定預覽圖片狀態
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 設定選擇的檔案
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 設定載入狀態
  const [isLoading, setIsLoading] = useState(false);

  // 設定錯誤訊息
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      recipeName: '',
      agreement: undefined,
    },
  });

  // 當選擇的檔案改變時，更新表單值
  useEffect(() => {
    if (selectedFile) {
      setValue('coverImage', selectedFile, { shouldValidate: true });
    }
  }, [selectedFile, setValue]);

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
        setErrorMsg(VALIDATION_MESSAGES.AGREE_TERMS);
        return;
      }

      // 檢查圖片（使用已經處理好的檔案）
      if (!selectedFile) {
        console.error('未上傳封面圖片');
        setErrorMsg(VALIDATION_MESSAGES.REQUIRED_COVER_IMAGE);
        return;
      }

      // 儲存食譜名稱到 localStorage
      localStorage.setItem('recipeName', data.recipeName);

      // 準備上傳資料
      const uploadData: RecipeFormData = {
        recipeName: data.recipeName,
        coverImage: selectedFile,
      };

      console.log('最終上傳資料:', uploadData);

      // 呼叫 API 上傳食譜基本資料
      const result = await uploadRecipeBasic(uploadData);

      console.log('API 上傳結果:', result);

      if (result && result.StatusCode === 200) {
        // 上傳成功後跳轉到步驟2頁面，並帶上創建的食譜 ID
        console.log('上傳成功，跳轉到步驟2頁面');
        router.push({
          pathname: '/upload-recipe-step2',
          query: { recipeId: result.Id },
        });
      } else {
        // API 回傳錯誤
        console.error('API 回傳錯誤:', result);
        setErrorMsg(
          result?.msg || `${ERROR_MESSAGES.UPLOAD_FAILED}，請稍後再試`,
        );
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
      // 檢查檔案格式
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
        console.error('不支援的圖片格式:', file.type);
        setErrorMsg(FILE_VALIDATION_MESSAGES.INVALID_IMAGE_TYPE);
        setImagePreview(null);
        setSelectedFile(null);
        return;
      }

      console.log('選擇了圖片:', file.name, file.type, file.size);

      // 設定選擇的檔案
      setSelectedFile(file);

      // 建立檔案預覽
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('沒有選擇圖片或圖片無效');
      setImagePreview(null);
      setSelectedFile(null);
    }
  };

  /**
   * 表單提交錯誤處理
   */
  const atError = (formErrors: any) => {
    console.error('表單驗證錯誤:', formErrors);
    if (formErrors.recipeName) {
      setErrorMsg(formErrors.recipeName.message);
    } else if (formErrors.coverImage) {
      setErrorMsg(formErrors.coverImage.message);
    } else if (formErrors.agreement) {
      setErrorMsg(formErrors.agreement.message);
    } else {
      setErrorMsg('表單填寫有誤，請檢查後重新提交');
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
            <BreadcrumbPage className="text-neutral-500">
              上傳食譜名稱
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
      <form onSubmit={handleSubmit(atSubmit, atError)}>
        {/* 食譜名稱輸入 */}
        <div className={stepContainerVariants()}>
          <div className={labelVariants()} id="recipeName-label">
            輸入食譜名稱
          </div>
          <div className="relative">
            <input
              id="recipeName"
              type="text"
              placeholder="在此輸入食譜名稱"
              aria-labelledby="recipeName-label"
              className={cn(
                uploadFieldVariants({
                  variant: 'iconInput',
                  state: errors.recipeName ? 'error' : 'default',
                }),
              )}
              {...register('recipeName')}
            />
            <div
              className={inputIconVariants({
                color: errors.recipeName ? 'error' : 'default',
              })}
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
            </div>
          </div>
          {errors.recipeName && (
            <p className={errorMessageVariants()}>
              {errors.recipeName.message}
            </p>
          )}
        </div>

        {/* 上傳封面圖片 */}
        <div className={stepContainerVariants()}>
          <div className={labelVariants()}>
            上傳封面圖片<span className="text-red-500 ml-1">*</span>
          </div>
          <div
            className={uploadAreaVariants({
              state: (() => {
                if (errors.coverImage) return 'error';
                if (imagePreview) return 'success';
                return 'default';
              })(),
            })}
            onClick={() => document.getElementById('coverImage')?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="預覽圖片"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-neutral-500 flex flex-col items-center">
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
                  <span className="text-red-500">(必填)</span>
                </span>
              </div>
            )}
            <input
              id="coverImage"
              type="file"
              accept={SUPPORTED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={atImageChange}
              // 不再使用 register 直接綁定檔案欄位，我們將手動處理檔案上傳
            />
          </div>
          {errors.coverImage && (
            <p className={errorMessageVariants()}>
              {errors.coverImage.message?.toString() ||
                VALIDATION_MESSAGES.UPLOAD_COVER_IMAGE}
            </p>
          )}
          {imagePreview && (
            <p className={successMessageVariants()}>
              已選擇圖片，可點擊重新選擇
            </p>
          )}
          {!imagePreview && !errors.coverImage && (
            <p className="mt-1 text-sm text-neutral-500">
              圖片格式: JPG, PNG (必填)
            </p>
          )}
        </div>

        {/* 同意條款 */}
        <div className={stepContainerVariants()}>
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
            <p className={errorMessageVariants()}>{errors.agreement.message}</p>
          )}
        </div>

        {/* 顯示表單狀態（開發用） */}
        <div className="mb-6 p-2 bg-neutral-100 rounded text-xs text-neutral-700">
          表單狀態: {isSubmitting ? '提交中' : '未提交'} | 驗證狀態:{' '}
          {isValid ? '有效' : '無效'} | 載入狀態:{' '}
          {isLoading ? '載入中' : '未載入'}
        </div>

        {/* 下一步按鈕 */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className={uploadButtonVariants({
            variant: 'primary',
            state: isLoading || isSubmitting ? 'loading' : 'default',
          })}
        >
          {isLoading ? COMMON_TEXTS.UPLOADING : '下一步'}
        </button>
      </form>
    </div>
  );
}
