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
 * 可編輯區塊元件
 */
export const EditableSection = ({
  title,
  isEditing,
  onToggleEdit,
  editView,
  displayView,
}: EditableSectionProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">{title}</h2>
        <button className="p-1" onClick={onToggleEdit}>
          {isEditing ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Edit className="w-4 h-4" />
          )}
        </button>
      </div>
      {isEditing ? editView : displayView}
    </div>
  );
};
