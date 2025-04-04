import { Input } from '@/components/ui/input';

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
 * 烹飪資訊元件
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
  return (
    <div className="flex mb-4 space-x-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">烹飪時間</h2>
          <button className="p-1" onClick={onToggleEditCookingTime}>
            {isEditingCookingTime ? (
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
                className="w-4 h-4 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
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
                className="w-4 h-4"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
          </button>
        </div>
        {isEditingCookingTime ? (
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
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">適合人份</h2>
          <button className="p-1" onClick={onToggleEditServings}>
            {isEditingServings ? (
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
                className="w-4 h-4 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
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
                className="w-4 h-4"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
          </button>
        </div>
        {isEditingServings ? (
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
        )}
      </div>
    </div>
  );
};
