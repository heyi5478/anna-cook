import { COMMON_TEXTS } from '@/lib/constants/messages';

// 項目類型定義 (支援食材和調料)
type ListItem = {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  isFlavoring?: boolean;
};

// IngredientList 元件 Props 類型
type IngredientListProps = {
  /** 項目列表 */
  fields: ListItem[];
  /** 新增項目的函數 */
  onAdd: () => void;
  /** 移除項目的函數 */
  onRemove: (index: number) => void;
  /** 註冊輸入欄位的函數 */
  register: any;
  /** 表單錯誤狀態 */
  errors?: any;
  /** 是否為調料模式 */
  isSeasoningMode?: boolean;
  /** 標題文字 */
  title?: string;
  /** 新增按鈕文字 */
  addButtonText?: string;
  /** 輸入框 placeholder */
  itemPlaceholder?: string;
};

/**
 * 動態食材/調料列表元件
 */
export default function IngredientList({
  fields,
  onAdd,
  onRemove,
  register,
  errors,
  isSeasoningMode = false,
  title = '所需食材',
  addButtonText = '食材',
  itemPlaceholder = '食材',
}: IngredientListProps) {
  // 取得對應的註冊名稱前綴
  const fieldPrefix = isSeasoningMode ? 'seasonings' : 'ingredients';

  return (
    <div className="mb-6">
      <h2 className="block text-base font-normal text-neutral-700 leading-6 mb-4">
        {title}
      </h2>

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex gap-2 items-center border border-neutral-300 bg-neutral-100 p-4 rounded-lg">
              {/* 食材/調料名稱 */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={itemPlaceholder}
                  className="w-full bg-transparent border-none outline-none placeholder-neutral-400"
                  {...register(`${fieldPrefix}.${index}.name`)}
                />
              </div>

              {/* 分隔線 */}
              <div className="w-0 h-6 border-l border-neutral-300" />

              {/* 份量 */}
              <div className="w-20 text-center">
                <input
                  type="text"
                  placeholder="份量"
                  className="w-full bg-transparent border-none outline-none text-center placeholder-neutral-400"
                  {...register(`${fieldPrefix}.${index}.amount`)}
                />
              </div>

              {/* 刪除按鈕 */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={`${COMMON_TEXTS.DELETE}${itemPlaceholder}`}
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

            {/* 項目間的分隔線 */}
            {index < fields.length - 1 && (
              <div className="my-3 border-t border-dashed border-neutral-300" />
            )}
          </div>
        ))}

        {/* 新增按鈕 */}
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center justify-start gap-2 p-4 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 transition-colors"
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
          <span>{addButtonText}</span>
        </button>

        {/* 錯誤訊息顯示 */}
        {errors && errors[fieldPrefix] && (
          <p className="mt-2 text-sm text-red-500">
            {errors[fieldPrefix].message}
          </p>
        )}
      </div>
    </div>
  );
}
