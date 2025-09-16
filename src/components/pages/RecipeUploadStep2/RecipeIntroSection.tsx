import {
  uploadFieldVariants,
  recipeUploadLabelVariants as labelVariants,
  recipeUploadStepContainerVariants as stepContainerVariants,
  recipeUploadErrorMessageVariants as errorMessageVariants,
} from '@/styles/cva';

// RecipeIntroSection 元件 Props 類型
type RecipeIntroSectionProps = {
  /** 食譜名稱 */
  recipeName?: string;
  /** 註冊輸入欄位的函數 */
  register: any;
  /** 表單錯誤狀態 */
  errors?: any;
  /** 自訂樣式類名 */
  className?: string;
};

/**
 * 食譜介紹區塊元件
 */
export default function RecipeIntroSection({
  recipeName,
  register,
  errors,
  className = '',
}: RecipeIntroSectionProps) {
  return (
    <div className={className}>
      {/* 食譜標題 */}
      <div className={stepContainerVariants({ variant: 'titleSection' })}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{recipeName || '馬鈴薯燉肉'}</h2>
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
          placeholder="食譜簡介料理中加入在生薑燒肉，醬汁香濃厚序，這味甜甜醬醬，豬肉的燒烤味入鍋子！"
          aria-labelledby="recipeDescription-label"
          className={uploadFieldVariants({
            variant: 'textarea',
            state: errors?.recipeDescription ? 'error' : 'default',
          })}
          {...register('recipeDescription')}
        />
        {errors?.recipeDescription && (
          <p className={errorMessageVariants()}>
            {errors.recipeDescription.message}
          </p>
        )}
      </div>
    </div>
  );
}
