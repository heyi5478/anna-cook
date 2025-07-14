import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  draftSectionVariants,
  draftFieldVariants,
  draftLabelVariants,
  tagItemVariants,
} from '@/styles/cva/recipe-draft';

type TagSectionProps = {
  tags: string[];
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  maxTags?: number;
};

/**
 * 標籤區塊元件 - 顯示和管理食譜的標籤集合
 * 純視覺組件，不包含內部狀態管理
 * 使用 CVA 樣式系統統一管理樣式變體
 */
export const TagSection = ({
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  maxTags = 5,
}: TagSectionProps) => {
  /**
   * 處理輸入框按鍵事件 - 按下 Enter 時新增標籤
   */
  const atHandleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  /**
   * 渲染單個標籤元素 - 使用 CVA 標籤樣式
   */
  const renderTag = (tag: string) => {
    return (
      <Badge key={tag} className={tagItemVariants({ item: 'default' })}>
        {tag}
        <button
          type="button"
          onClick={() => onRemoveTag(tag)}
          className={tagItemVariants({ button: 'default' })}
          aria-label={`移除標籤 ${tag}`}
        >
          <X className={tagItemVariants({ icon: 'sm' })} />
        </button>
      </Badge>
    );
  };

  const canAddTag = newTag.trim() && tags.length < maxTags;

  return (
    <div className={draftSectionVariants({ spacing: 'default' })}>
      <h2
        id="tags-heading"
        className={draftLabelVariants({ size: 'default', spacing: 'default' })}
      >
        食譜標籤
      </h2>

      {/* 標籤顯示區域 - 使用 CVA 標籤容器樣式 */}
      <div className={tagItemVariants({ container: 'default' })}>
        {tags.map(renderTag)}
      </div>

      {/* 標籤輸入區域 - 使用 flex 布局 */}
      <div className="flex">
        <Input
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyPress={atHandleKeyPress}
          className={draftFieldVariants({ size: 'flex' })}
          placeholder="輸入標籤"
          aria-labelledby="tags-heading"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddTag}
          disabled={!canAddTag}
        >
          新增
        </Button>
      </div>

      {/* 標籤數量提示 - 使用 CVA 小文字樣式 */}
      <p
        className={`${draftLabelVariants({
          size: 'sm',
          weight: 'normal',
          spacing: 'default',
        })} text-neutral-500`}
      >
        已選擇 ({tags.length}/{maxTags})
      </p>
    </div>
  );
};
