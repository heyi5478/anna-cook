import { Plus, Trash2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COMMON_TEXTS } from '@/lib/constants/messages';

// 管理操作列容器的佈局樣式變體
const actionBarVariants = cva('flex gap-2', {
  variants: {
    layout: {
      horizontal: '',
      vertical: 'flex-col',
    },
    spacing: {
      default: 'gap-2',
      compact: 'gap-1',
      relaxed: 'gap-4',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    spacing: 'default',
  },
});

// 管理操作按鈕的樣式變體
const actionButtonVariants = cva(
  'h-10 rounded-lg flex items-center gap-1 bg-white font-normal',
  {
    variants: {
      size: {
        default: 'h-10',
        sm: 'h-8 text-sm',
        lg: 'h-12',
      },
      style: {
        default: 'gap-1',
        compact: 'gap-0',
        spacious: 'gap-2',
      },
    },
    defaultVariants: {
      size: 'default',
      style: 'default',
    },
  },
);

/**
 * 食譜操作按鈕列元件的 Props 類型
 */
export interface RecipeActionBarProps
  extends VariantProps<typeof actionBarVariants> {
  /** 新增食譜按鈕點擊事件 */
  onNewRecipe: () => void;
  /** 切換刪除模式事件 */
  onDeleteMode: () => void;
  /** 自訂容器樣式 */
  className?: string;
  /** 按鈕尺寸變體 */
  buttonSize?: VariantProps<typeof actionButtonVariants>['size'];
  /** 按鈕樣式變體 */
  buttonStyle?: VariantProps<typeof actionButtonVariants>['style'];
}

/**
 * 食譜操作按鈕列元件，支援多種佈局和樣式變體
 */
export function RecipeActionBar({
  onNewRecipe,
  onDeleteMode,
  layout,
  spacing,
  className,
  buttonSize,
  buttonStyle,
}: RecipeActionBarProps) {
  return (
    <div className={cn(actionBarVariants({ layout, spacing }), className)}>
      <Button
        variant="outline"
        className={cn(
          actionButtonVariants({ size: buttonSize, style: buttonStyle }),
        )}
        onClick={onNewRecipe}
      >
        <Plus className="h-5 w-5" />
        <span>新增</span>
      </Button>
      <Button
        variant="outline"
        className={cn(
          actionButtonVariants({ size: buttonSize, style: buttonStyle }),
        )}
        onClick={onDeleteMode}
      >
        <Trash2 className="h-5 w-5" />
        <span>{COMMON_TEXTS.DELETE}草稿</span>
      </Button>
    </div>
  );
}
