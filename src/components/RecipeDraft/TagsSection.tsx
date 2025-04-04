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
 * 標籤區塊元件
 */
export const TagSection = ({
  tags,
  onAddTag,
  onRemoveTag,
}: TagSectionProps) => {
  const [newTag, setNewTag] = useState('');

  /**
   * 處理新增標籤
   */
  const atHandleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="mb-4">
      <h2 className="mb-2 text-lg font-medium">食譜標籤</h2>
      <Card className="p-4">
        <p className="mb-2 text-sm text-gray-500">已選擇 ({tags.length}/5)</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="flex items-center gap-1"
            >
              {tag}
              <button onClick={() => onRemoveTag(tag)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="新增標籤"
            className="flex-1 mr-2"
          />
          <Button onClick={atHandleAddTag} size="sm">
            新增
          </Button>
        </div>
      </Card>
    </div>
  );
};
