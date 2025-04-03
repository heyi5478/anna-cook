import type React from 'react';
import { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const editableSectionVariants = cva('relative', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    variant: {
      default: 'bg-white',
      outline: 'border rounded-md p-3',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type EditableSectionProps = {
  title: string;
  content: string;
  onSave?: (newContent: string) => void;
} & VariantProps<typeof editableSectionVariants> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * 可編輯的內容區塊，點擊編輯按鈕後可以進行內容編輯
 */
export const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  content,
  size,
  variant,
  className,
  onSave,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  /**
   * 處理編輯按鈕點擊事件
   */
  const atEditClick = () => {
    setIsEditing(true);
  };

  /**
   * 處理取消編輯事件
   */
  const atCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  /**
   * 處理保存編輯事件
   */
  const atSaveEdit = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(editedContent);
    }
  };

  /**
   * 處理文本內容變更事件
   */
  const atContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  return (
    <div
      className={cn(editableSectionVariants({ size, variant }), className)}
      {...props}
    >
      <div className="flex justify-between items-start">
        <h3
          className={cn('font-medium mb-1', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          {title}
        </h3>
        {!isEditing ? (
          <button type="button" className="p-1" onClick={atEditClick}>
            <Edit size={16} />
          </button>
        ) : (
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-1 text-green-600"
              onClick={atSaveEdit}
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              className="p-1 text-red-600"
              onClick={atCancelEdit}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <p
          className={cn('text-gray-700', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          {content}
        </p>
      ) : (
        <textarea
          className="w-full p-2 border rounded"
          value={editedContent}
          onChange={atContentChange}
          rows={3}
        />
      )}
    </div>
  );
};
