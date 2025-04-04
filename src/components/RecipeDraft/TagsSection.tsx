import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

type TagSectionProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

/**
 * 標籤區塊元件 - 用於管理食譜的標籤集合
 * 支援新增和刪除標籤，並顯示標籤數量上限
 */
export const TagSection = ({
  tags,
  onAddTag,
  onRemoveTag,
}: TagSectionProps) => {
  const [newTag, setNewTag] = useState('');

  /**
   * 處理新增標籤事件
   * 驗證輸入值並新增至標籤列表
   */
  const atHandleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  /**
   * 處理輸入框變更事件
   */
  const atHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  /**
   * 處理標籤移除事件
   */
  const atHandleRemoveTag = (tag: string) => {
    onRemoveTag(tag);
  };

  /**
   * 處理輸入框按鍵事件 - 按下 Enter 時新增標籤
   */
  const atHandleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      atHandleAddTag();
    }
  };

  /**
   * 渲染單個標籤元素
   */
  const renderTag = (tag: string) => {
    return (
      <Badge key={tag} variant="outline" className="flex items-center gap-1">
        {tag}
        <button
          onClick={() => atHandleRemoveTag(tag)}
          aria-label={`移除標籤 ${tag}`}
          className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary rounded-full"
        >
          <X className="w-3 h-3" />
        </button>
      </Badge>
    );
  };

  return (
    <div className="mb-4">
      <h2 className="mb-2 text-lg font-medium">食譜標籤</h2>
      <Card className="p-4">
        {/* 標籤計數區 */}
        <p className="mb-2 text-sm text-gray-500">已選擇 ({tags.length}/5)</p>

        {/* 標籤顯示區域 */}
        <div className="flex flex-wrap gap-2 mb-4">{tags.map(renderTag)}</div>

        {/* 標籤輸入區域 */}
        <div className="flex">
          <Input
            value={newTag}
            onChange={atHandleInputChange}
            onKeyPress={atHandleKeyPress}
            placeholder="新增標籤"
            className="flex-1 mr-2"
            aria-label="輸入新標籤"
          />
          <Button
            onClick={atHandleAddTag}
            size="sm"
            aria-label="新增標籤"
            disabled={!newTag.trim()}
          >
            新增
          </Button>
        </div>
      </Card>
    </div>
  );
};
