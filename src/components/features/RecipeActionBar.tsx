import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMMON_TEXTS } from '@/lib/constants/messages';

/**
 * 食譜操作按鈕列元件的 Props 類型
 */
export interface RecipeActionBarProps {
  /** 新增食譜按鈕點擊事件 */
  onNewRecipe: () => void;
  /** 切換刪除模式事件 */
  onDeleteMode: () => void;
}

/**
 * 食譜操作按鈕列元件
 * 包含「新增」和「刪除草稿」按鈕
 */
export function RecipeActionBar({
  onNewRecipe,
  onDeleteMode,
}: RecipeActionBarProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="h-10 rounded-lg flex items-center gap-1 bg-white font-normal"
        onClick={onNewRecipe}
      >
        <Plus className="h-5 w-5" />
        <span>新增</span>
      </Button>
      <Button
        variant="outline"
        className="h-10 rounded-lg flex items-center gap-1 bg-white font-normal"
        onClick={onDeleteMode}
      >
        <Trash2 className="h-5 w-5" />
        <span>{COMMON_TEXTS.DELETE}草稿</span>
      </Button>
    </div>
  );
}
