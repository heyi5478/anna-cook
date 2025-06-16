import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
   * 渲染單個標籤元素
   */
  const renderTag = (tag: string) => {
    return (
      <Badge key={tag} className="mr-2 mb-2">
        {tag}
        <button
          type="button"
          onClick={() => onRemoveTag(tag)}
          className="ml-1 text-xs"
          aria-label={`移除標籤 ${tag}`}
        >
          <X className="w-3 h-3" />
        </button>
      </Badge>
    );
  };

  const canAddTag = newTag.trim() && tags.length < maxTags;

  return (
    <div className="mb-4">
      <h2 id="tags-heading" className="mb-2 text-lg font-medium">
        食譜標籤
      </h2>

      {/* 標籤顯示區域 */}
      <div className="flex flex-wrap mb-2">{tags.map(renderTag)}</div>

      {/* 標籤輸入區域 */}
      <div className="flex">
        <Input
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyPress={atHandleKeyPress}
          className="bg-[#FAFAFA] flex-1 mr-2"
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

      {/* 標籤數量提示 */}
      <p className="mt-1 text-sm text-neutral-500">
        已選擇 ({tags.length}/{maxTags})
      </p>
    </div>
  );
};
