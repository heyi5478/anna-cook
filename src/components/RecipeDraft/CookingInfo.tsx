import type React from 'react';
import { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cookingInfoVariants = cva('flex-1', {
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

type CookingInfoProps = {
  title: string;
  value: string;
  onSave?: (newValue: string) => void;
} & VariantProps<typeof cookingInfoVariants> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * 顯示烹飪相關資訊（時間或人數），支持編輯功能
 */
export const CookingInfo: React.FC<CookingInfoProps> = ({
  title,
  value,
  size,
  variant,
  className,
  onSave,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

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
    setEditedValue(value);
  };

  /**
   * 處理保存編輯事件
   */
  const atSaveEdit = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(editedValue);
    }
  };

  /**
   * 處理輸入值變更事件
   */
  const atValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  return (
    <div
      className={cn(cookingInfoVariants({ size, variant }), className)}
      {...props}
    >
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
        <div className="flex justify-between items-center">
          <span
            className={cn({
              'text-xs': size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
            })}
          >
            {value}
          </span>
          <button type="button" className="p-1" onClick={atEditClick}>
            <Edit size={16} />
          </button>
        </div>
      ) : (
        <div className="flex space-x-1">
          <input
            type="text"
            className={cn('flex-1 p-1 border rounded', {
              'text-xs': size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
            })}
            value={editedValue}
            onChange={atValueChange}
          />
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
  );
};
