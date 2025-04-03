'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type Tag = {
  id: string;
  name: string;
};

const tagsSectionVariants = cva('px-4 py-2', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    variant: {
      default: 'bg-white',
      outline: 'border rounded-md',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type TagsSectionProps = VariantProps<typeof tagsSectionVariants> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * 顯示烹調標籤區域，支持添加和刪除標籤
 */
export const TagsSection: React.FC<TagsSectionProps> = ({
  size,
  variant,
  className,
  ...props
}) => {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: '熱炒類' },
    { id: '2', name: '家常菜' },
  ]);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxTags = 5;

  /**
   * 處理刪除標籤
   */
  const atRemoveTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  /**
   * 處理添加標籤
   */
  const atAddTag = () => {
    if (newTagName.trim() && tags.length < maxTags) {
      setTags([
        ...tags,
        { id: Date.now().toString(), name: newTagName.trim() },
      ]);
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  /**
   * 處理取消添加標籤
   */
  const atCancelAddTag = () => {
    setIsAddingTag(false);
    setNewTagName('');
  };

  /**
   * 處理標籤名稱變更
   */
  const atTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagName(e.target.value);
  };

  /**
   * 當 isAddingTag 為 true 時，安全地聚焦輸入框
   */
  useEffect(() => {
    if (isAddingTag && inputRef.current) {
      // 短暫延遲確保螢幕閱讀器有時間宣告界面變更
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAddingTag]);

  return (
    <div
      className={cn(tagsSectionVariants({ size, variant }), className)}
      {...props}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className={cn('font-medium', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          烹調標籤
        </h3>
        {!isAddingTag && tags.length < maxTags && (
          <button
            type="button"
            className="p-1 bg-gray-100 rounded-full"
            onClick={() => setIsAddingTag(true)}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="bg-gray-200 p-2 rounded">
        <div
          className={cn('text-gray-500 mb-1', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          已標籤 ({tags.length}/{maxTags})
        </div>

        <div className="grid grid-cols-2 gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white p-2 rounded flex justify-between items-center"
            >
              <span
                className={cn({
                  'text-xs': size === 'sm',
                  'text-sm': size === 'md',
                  'text-base': size === 'lg',
                })}
              >
                {tag.name}
              </span>
              <button
                type="button"
                className="text-gray-500 hover:text-red-500"
                onClick={() => atRemoveTag(tag.id)}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {isAddingTag && (
            <div className="bg-white p-1 rounded flex items-center">
              <input
                ref={inputRef}
                type="text"
                className={cn('flex-1 p-1 border-none outline-none', {
                  'text-xs': size === 'sm',
                  'text-sm': size === 'md',
                  'text-base': size === 'lg',
                })}
                value={newTagName}
                onChange={atTagNameChange}
                placeholder="新標籤"
              />
              <button
                type="button"
                className="text-green-500 px-1"
                onClick={atAddTag}
              >
                <Plus size={14} />
              </button>
              <button
                type="button"
                className="text-red-500 px-1"
                onClick={atCancelAddTag}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
