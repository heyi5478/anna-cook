import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 定義食譜類型
type Recipe = {
  id: string;
  title: string;
  image: string;
  category: string;
  time: number;
  servings: number;
  rating: number;
  description: string;
};

// 定義食譜卡片樣式變體
const recipeCardVariants = cva(
  'flex py-3 border-b', // 基本樣式
  {
    variants: {
      variant: {
        default: '',
        primary: 'bg-orange-50',
        outline: 'border border-orange-200 rounded-md p-2',
      },
      size: {
        sm: 'gap-2',
        md: 'gap-3',
        lg: 'gap-4',
      },
      intent: {
        default: '',
        featured: 'border-l-4 border-l-orange-500 pl-2',
        new: "relative after:content-['NEW'] after:absolute after:top-0 after:right-0 after:bg-orange-500 after:text-white after:text-xs after:px-1 after:py-0.5 after:rounded-bl-md",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      intent: 'default',
    },
  },
);

// 定義元件 props 類型
export interface RecipeCardProps
  extends VariantProps<typeof recipeCardVariants> {
  recipe: Recipe;
  className?: string;
}

/**
 * 顯示食譜內容的卡片元件
 */
export function RecipeCard({
  recipe,
  variant,
  size,
  intent,
  className,
}: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} className="block">
      <div
        className={cn(recipeCardVariants({ variant, size, intent }), className)}
      >
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={recipe.image || '/placeholder.svg'}
            alt={recipe.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-lg">{recipe.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {recipe.description}
          </p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Users size={14} className="mr-1" />
            <span className="mr-3">{recipe.servings} 人份</span>
            <Clock size={14} className="mr-1" />
            <span className="mr-3">{recipe.time} 分鐘</span>
            <Star size={14} className="mr-1" />
            <span>{recipe.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
