import type { ReactNode } from 'react';
import { Check, Edit } from 'lucide-react';

type EditableSectionProps = {
  title: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  editView: ReactNode;
  displayView: ReactNode;
};

/**
 * 可編輯區塊元件 - 提供一個可切換編輯/顯示模式的通用容器
 * 適用於需要內容可編輯功能的區塊，如標題、描述等
 */
export const EditableSection = ({
  title,
  isEditing,
  onToggleEdit,
  editView,
  displayView,
}: EditableSectionProps) => {
  /**
   * 渲染編輯/儲存按鈕
   */
  const renderActionButton = () => {
    return (
      <button
        className="p-1"
        onClick={onToggleEdit}
        aria-label={isEditing ? '儲存' : '編輯'}
      >
        {isEditing ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Edit className="w-4 h-4" />
        )}
      </button>
    );
  };

  return (
    <div className="mb-4">
      {/* 標題列與動作按鈕 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">{title}</h2>
        {renderActionButton()}
      </div>

      {/* 內容區域 - 根據狀態顯示編輯或顯示視圖 */}
      <div className="content-container">
        {isEditing ? editView : displayView}
      </div>
    </div>
  );
};
