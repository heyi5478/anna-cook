import { useState } from 'react';
import {
  uploadFieldVariants,
  uploadButtonVariants,
  recipeUploadLabelVariants as labelVariants,
  recipeUploadTagVariants as tagVariants,
  recipeUploadStepContainerVariants as stepContainerVariants,
  recipeUploadErrorMessageVariants as errorMessageVariants,
} from '@/styles/cva';

// TagsSection 元件 Props 類型
type TagsSectionProps = {
  /** 當前標籤列表 */
  tags: string[];
  /** 設置標籤列表的函數 */
  setTags: (tags: string[]) => void;
  /** 設置表單值的函數 */
  setValue: any;
  /** 表單錯誤狀態 */
  errors?: any;
  /** 最大標籤數量 */
  maxTags?: number;
  /** 標題文字 */
  title?: string;
};

/**
 * 標籤管理區塊元件
 */
export default function TagsSection({
  tags,
  setTags,
  setValue,
  errors,
  maxTags = 5,
  title = '食譜標籤',
}: TagsSectionProps) {
  // 設定自訂標籤輸入
  const [customTag, setCustomTag] = useState('');

  /**
   * 添加標籤
   */
  const atAddTag = () => {
    if (
      customTag.trim() &&
      !tags.includes(customTag.trim()) &&
      tags.length < maxTags
    ) {
      const newTags = [...tags, customTag.trim()];
      setTags(newTags);
      setValue('tags', newTags); // 同步更新表單值
      setCustomTag('');
    }
  };

  /**
   * 移除標籤
   */
  const atRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags); // 同步更新表單值
  };

  /**
   * 處理標籤輸入按 Enter 鍵
   */
  const atTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      atAddTag();
    }
  };

  return (
    <div className={stepContainerVariants()}>
      <h2 className={labelVariants()}>{title}</h2>
      <div className={stepContainerVariants({ variant: 'infoSection' })}>
        <div className="flex justify-between items-center mb-2">
          <span>
            增加新標籤 ({tags.length}/{maxTags})
          </span>
        </div>

        {/* 標籤輸入區域 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="輸入自訂標籤"
            className={uploadFieldVariants({
              variant: 'input',
              state: 'default',
            })}
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={atTagKeyDown}
            disabled={tags.length >= maxTags}
          />
          <button
            type="button"
            className={uploadButtonVariants({
              variant: 'secondary',
              state:
                !customTag.trim() || tags.length >= maxTags
                  ? 'disabled'
                  : 'default',
              size: 'sm',
            })}
            onClick={atAddTag}
            disabled={!customTag.trim() || tags.length >= maxTags}
          >
            新增
          </button>
        </div>

        {/* 已新增的標籤 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <div key={tag} className={tagVariants({ variant: 'removable' })}>
                <span>{tag}</span>
                <button
                  type="button"
                  className="ml-1 text-neutral-500"
                  onClick={() => atRemoveTag(tag)}
                  aria-label={`移除標籤 ${tag}`}
                >
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
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 錯誤訊息顯示 */}
        {errors && errors.tags && (
          <p className={errorMessageVariants()}>{errors.tags.message}</p>
        )}
      </div>
    </div>
  );
}
