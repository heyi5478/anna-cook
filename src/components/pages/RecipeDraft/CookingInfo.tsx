import { Input } from '@/components/ui/input';
import {
  draftSectionVariants,
  draftFieldVariants,
  draftLabelVariants,
  errorMessageVariants,
} from '@/styles/cva/recipe-draft';

type CookingInfoProps = {
  cookingTimeValue: string;
  cookingTimeUnit: string;
  servingsValue: string;
  servingsUnit: string;
  onUpdateCookingTimeValue: (value: string) => void;
  onUpdateServingsValue: (value: string) => void;
  errors?: {
    cookingTimeValue?: { message?: string };
    servingsValue?: { message?: string };
  };
};

/**
 * 烹飪資訊元件 - 顯示與編輯烹飪時間和適合份量
 * 純視覺組件，不包含商業邏輯
 * 使用 CVA 樣式系統統一管理樣式變體
 */
export const CookingInfo = ({
  cookingTimeValue,
  cookingTimeUnit,
  servingsValue,
  servingsUnit,
  onUpdateCookingTimeValue,
  onUpdateServingsValue,
  errors,
}: CookingInfoProps) => {
  return (
    <div
      className={draftSectionVariants({ layout: 'grid', spacing: 'default' })}
    >
      {/* 烹飪時間區塊 - 使用 CVA 樣式變體 */}
      <div>
        <h2
          className={draftLabelVariants({
            size: 'default',
            spacing: 'default',
          })}
        >
          烹飪時間
        </h2>
        <div className="flex items-center">
          <Input
            type="text"
            value={cookingTimeValue}
            onChange={(e) => onUpdateCookingTimeValue(e.target.value)}
            className={draftFieldVariants({ size: 'default' })}
            placeholder="時間"
            aria-label="烹飪時間"
          />
          <span>{cookingTimeUnit}</span>
        </div>
        {/* 烹飪時間錯誤訊息顯示 - 使用 CVA 錯誤樣式 */}
        {errors?.cookingTimeValue && (
          <p
            className={errorMessageVariants({ size: 'sm', spacing: 'default' })}
          >
            {errors.cookingTimeValue.message}
          </p>
        )}
      </div>

      {/* 適合人份區塊 - 使用 CVA 樣式變體 */}
      <div>
        <h2
          className={draftLabelVariants({
            size: 'default',
            spacing: 'default',
          })}
        >
          份量
        </h2>
        <div className="flex items-center">
          <Input
            type="text"
            value={servingsValue}
            onChange={(e) => onUpdateServingsValue(e.target.value)}
            className={draftFieldVariants({ size: 'default' })}
            placeholder="份量"
            aria-label="份量"
          />
          <span>{servingsUnit}</span>
        </div>
        {/* 份量錯誤訊息顯示 - 使用 CVA 錯誤樣式 */}
        {errors?.servingsValue && (
          <p
            className={errorMessageVariants({ size: 'sm', spacing: 'default' })}
          >
            {errors.servingsValue.message}
          </p>
        )}
      </div>
    </div>
  );
};
