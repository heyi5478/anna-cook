import { Input } from '@/components/ui/input';
import { Check, Edit } from 'lucide-react';

type CookingInfoProps = {
  cookingTimeValue: string;
  cookingTimeUnit: string;
  cookingTime: string;
  servingsValue: string;
  servingsUnit: string;
  servings: string;
  isEditingCookingTime: boolean;
  isEditingServings: boolean;
  onUpdateCookingTimeValue: (value: string) => void;
  onUpdateServingsValue: (value: string) => void;
  onToggleEditCookingTime: () => void;
  onToggleEditServings: () => void;
};

/**
 * 烹飪資訊元件 - 顯示與編輯烹飪時間和適合份量
 */
export const CookingInfo = ({
  cookingTimeValue,
  cookingTimeUnit,
  cookingTime,
  servingsValue,
  servingsUnit,
  servings,
  isEditingCookingTime,
  isEditingServings,
  onUpdateCookingTimeValue,
  onUpdateServingsValue,
  onToggleEditCookingTime,
  onToggleEditServings,
}: CookingInfoProps) => {
  /**
   * 渲染時間編輯區塊
   */
  const renderTimeEditSection = () => {
    return isEditingCookingTime ? (
      <div className="flex items-center border rounded overflow-hidden">
        <Input
          type="text"
          value={cookingTimeValue}
          onChange={(e) => onUpdateCookingTimeValue(e.target.value)}
          className="border-0 flex-1"
          autoFocus
        />
        <div className="px-3 py-2 bg-gray-100 text-gray-500">
          {cookingTimeUnit}
        </div>
      </div>
    ) : (
      <div className="p-2 bg-white border rounded">{cookingTime}</div>
    );
  };

  /**
   * 渲染份量編輯區塊
   */
  const renderServingsEditSection = () => {
    return isEditingServings ? (
      <div className="flex items-center border rounded overflow-hidden">
        <Input
          type="text"
          value={servingsValue}
          onChange={(e) => onUpdateServingsValue(e.target.value)}
          className="border-0 flex-1"
          autoFocus
        />
        <div className="px-3 py-2 bg-gray-100 text-gray-500">
          {servingsUnit}
        </div>
      </div>
    ) : (
      <div className="p-2 bg-white border rounded">{servings}</div>
    );
  };

  return (
    <div className="flex mb-4 space-x-4">
      {/* 烹飪時間區塊 */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">烹飪時間</h2>
          <button className="p-1" onClick={onToggleEditCookingTime}>
            {isEditingCookingTime ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
          </button>
        </div>
        {renderTimeEditSection()}
      </div>

      {/* 適合人份區塊 */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">適合人份</h2>
          <button className="p-1" onClick={onToggleEditServings}>
            {isEditingServings ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
          </button>
        </div>
        {renderServingsEditSection()}
      </div>
    </div>
  );
};
