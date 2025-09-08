import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/ui';
import { Star } from 'lucide-react';

// 定義分類類型
type Category = {
  id: string;
  title: string;
  image: string;
  description: string;
  rating?: number;
  index?: number;
};

// 管理分類卡片容器的樣式變體
const categoryCardVariants = cva('overflow-hidden h-full rounded-lg', {
  variants: {
    size: {
      sm: 'max-w-[130px]',
      md: 'max-w-[180px]',
      lg: 'max-w-[220px]',
    },
    intent: {
      default: '',
      featured: 'border-2 border-orange-300',
    },
  },
  defaultVariants: {
    size: 'md',
    intent: 'default',
  },
});

// 管理連結容器的樣式變體
const categoryLinkVariants = cva(
  'pl-4 min-w-[150px] transition-transform duration-300 hover:scale-105 relative',
  {
    variants: {
      size: {
        sm: 'min-w-[130px]',
        md: 'min-w-[150px]',
        lg: 'min-w-[180px]',
      },
      spacing: {
        default: 'pl-4',
        compact: 'pl-2',
        spacious: 'pl-6',
      },
    },
    defaultVariants: {
      size: 'md',
      spacing: 'default',
    },
  },
);

// 管理索引徽章的樣式變體，使用 Tailwind 色票系統的漸層色彩
const indexBadgeVariants = cva(
  'absolute left-0 top-0 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
  {
    variants: {
      colorIndex: {
        1: 'bg-primary-900',
        2: 'bg-primary-700',
        3: 'bg-primary-600',
        4: 'bg-primary-500',
        5: 'bg-primary-400',
        6: 'bg-primary-300',
        default: 'bg-primary-500',
      },
      size: {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
      },
    },
    defaultVariants: {
      colorIndex: 'default',
      size: 'md',
    },
  },
);

// 定義元件 props 類型，整合所有 cva 變體
export interface CategoryCardProps
  extends VariantProps<typeof categoryCardVariants>,
    Pick<VariantProps<typeof categoryLinkVariants>, 'spacing'> {
  category: Category;
  className?: string;
  linkClassName?: string;
  index?: number;
  badgeSize?: VariantProps<typeof indexBadgeVariants>['size'];
}

/**
 * 根據索引號獲取對應的顏色變體鍵值
 */
function getColorIndexVariant(
  index: number,
): VariantProps<typeof indexBadgeVariants>['colorIndex'] {
  if (index >= 1 && index <= 6) {
    return index as 1 | 2 | 3 | 4 | 5 | 6;
  }
  return 'default';
}

/**
 * 顯示食譜分類的卡片元件，支援多種尺寸和樣式變體
 */
export function CategoryCard({
  category,
  size,
  intent,
  spacing,
  className,
  linkClassName,
  index,
  badgeSize,
}: CategoryCardProps) {
  // 使用傳入的 index 或 category 中的 index，如果都沒有則設為 null
  const displayIndex = index || category.index || null;
  const rating = category.rating || '';

  return (
    <Link
      href={`/recipe-page/${category.id}`}
      className={cn(categoryLinkVariants({ size, spacing }), linkClassName)}
    >
      {/* 顯示編號徽章 */}
      {displayIndex !== null && (
        <div
          className={cn(
            indexBadgeVariants({
              colorIndex: getColorIndexVariant(displayIndex),
              size: badgeSize || size,
            }),
          )}
        >
          {displayIndex}
        </div>
      )}

      <Card className={cn(categoryCardVariants({ size, intent }), className)}>
        <div className="relative bg-[#FAFAFA]">
          {/* 圖片容器 - 維持方形比例 */}
          <div className="relative aspect-square w-full">
            <Image
              src={category.image || '/placeholder.svg'}
              alt={category.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 內容區域 - 評分、標題和描述 */}
          <div className="p-2 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-neutral-500 mb-2">
              <Star className="h-[20px] w-[20px] text-amber-400" />
              <span className="text-sm">{rating}</span>
            </div>

            <h3 className="font-medium text-base truncate w-full">
              {category.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 truncate w-full">
              {category.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
