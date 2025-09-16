// CookingInfo 元件 Props 類型
type CookingInfoProps = {
  /** 註冊輸入欄位的函數 */
  register: any;
  /** 表單錯誤狀態 */
  errors?: any;
  /** 自訂樣式類名 */
  className?: string;
};

/**
 * 烹調資訊區塊元件 (烹調時間和人份)
 */
export default function CookingInfo({
  register,
  errors,
  className = '',
}: CookingInfoProps) {
  return (
    <div
      className={`flex justify-between items-start max-w-md mx-auto mb-10 ${className}`}
    >
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
            errors?.cookingTime
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
        {errors?.cookingTime && (
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
            errors?.servings
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
        {errors?.servings && (
          <p className="mt-1 text-sm text-red-500">{errors.servings.message}</p>
        )}
      </div>
    </div>
  );
}
