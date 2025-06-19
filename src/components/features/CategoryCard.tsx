import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
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

// 定義卡片樣式變體
const categoryCardVariants = cva(
  'overflow-hidden h-full rounded-lg', // 基本樣式
  {
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
  },
);

// 定義連結容器樣式
const categoryLinkVariants = cva(
  'pl-4 min-w-[150px] transition-transform duration-300 hover:scale-105 relative', // 新增的基本樣式
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/**
 * 根據索引號返回對應的背景顏色
 */
const getIndexColor = (index: number): string => {
  switch (index) {
    case 1:
      return 'bg-[#C02A00]';
    case 2:
      return 'bg-[#FF4E0B]';
    case 3:
      return 'bg-[#FF855B]';
    case 4:
      return 'bg-[#FF9F7D]'; // 延續漸層顏色
    case 5:
      return 'bg-[#FFBBA0]'; // 延續漸層顏色
    case 6:
      return 'bg-[#FFD7C3]'; // 延續漸層顏色
    default:
      return 'bg-orange-500'; // 預設顏色
  }
};

// 定義元件 props 類型
export interface CategoryCardProps
  extends VariantProps<typeof categoryCardVariants> {
  category: Category;
  className?: string;
  linkClassName?: string;
  index?: number;
}

/**
 * 顯示食譜分類的卡片元件
 */
export function CategoryCard({
  category,
  size,
  intent,
  className,
  linkClassName,
  index,
}: CategoryCardProps) {
  // 使用傳入的 index 或 category 中的 index，如果都沒有則設為 null
  const displayIndex = index || category.index || null;
  const rating = category.rating || '';

  return (
    <Link
      href={`/recipe-page/${category.id}`}
      className={cn(categoryLinkVariants({ size }), linkClassName)}
    >
      {/* 顯示編號圓圈 */}
      {displayIndex !== null && (
        <div
          className={`absolute left-0 top-0 z-10 w-8 h-8 ${getIndexColor(displayIndex)} rounded-full flex items-center justify-center text-white font-bold`}
        >
          {displayIndex}
        </div>
      )}

      <Card className={cn(categoryCardVariants({ size, intent }), className)}>
        <div className="relative bg-[#FAFAFA]">
          {/* 將圖片容器改為方形 */}
          <div className="relative aspect-square w-full">
            <Image
              src={category.image || '/placeholder.svg'}
              alt={category.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 評分區域 */}
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
