import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 定義分類類型
type Category = {
  id: string;
  title: string;
  image: string;
  description: string;
};

// 定義卡片樣式變體
const categoryCardVariants = cva(
  'overflow-hidden', // 基本樣式
  {
    variants: {
      size: {
        sm: 'max-w-[150px]',
        md: 'max-w-[200px]',
        lg: 'max-w-[250px]',
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

// 定義元件 props 類型
export interface CategoryCardProps
  extends VariantProps<typeof categoryCardVariants> {
  category: Category;
  className?: string;
}

/**
 * 顯示食譜分類的卡片元件
 */
export function CategoryCard({
  category,
  size,
  intent,
  className,
}: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <Card className={cn(categoryCardVariants({ size, intent }), className)}>
        <div className="relative h-24">
          <Image
            src={category.image || '/placeholder.svg'}
            alt={category.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-2 text-center">
          <h3 className="font-medium">{category.title}</h3>
          <p className="text-xs text-gray-500">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
