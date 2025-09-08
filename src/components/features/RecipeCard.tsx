import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/ui';
import type { Recipe } from '@/types/recipe';

// 管理食譜卡片容器的樣式變體
const recipeCardVariants = cva('overflow-hidden w-full mb-4', {
  variants: {
    spacing: {
      default: '',
    },
    interactive: {
      default: '',
    },
    background: {
      default: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
    interactive: 'default',
    background: 'default',
  },
});

// 管理食譜卡片內容區域的樣式變體
const recipeContentVariants = cva('flex flex-row items-center bg-neutral-50', {
  variants: {
    spacing: {
      default: '',
    },
    interactive: {
      default: '',
    },
    background: {
      default: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
    interactive: 'default',
    background: 'default',
  },
});

export type RecipeCardProps = {
  recipe: Recipe;
  className?: string;
} & VariantProps<typeof recipeCardVariants>;

/**
 * 顯示食譜內容的卡片元件，包含圖片、標題、描述和食譜相關資訊
 */
export function RecipeCard({
  recipe,
  className,
  spacing,
  interactive,
  background,
  ...props
}: RecipeCardProps) {
  /**
   * 渲染食譜的圖片部分
   */
  function renderImage() {
    return (
      <div className="relative w-24 h-24 my-4 ml-4 mr-0 flex-shrink-0">
        <Image
          src={recipe.image || '/placeholder.svg'}
          alt={recipe.title || recipe.recipeName || '食譜圖片'}
          fill
          className="object-cover rounded-md"
        />
      </div>
    );
  }

  /**
   * 渲染食譜的資訊部分
   */
  function renderInfo() {
    return (
      <div className="flex flex-wrap items-center justify-end gap-4 text-neutral-500 overflow-hidden">
        <div className="flex items-center gap-2">
          <Users className="h-[20px] w-[20px] text-neutral-400 flex-shrink-0" />
          <span className="text-[14px] truncate">{recipe.servings} 人份</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-[20px] w-[20px] text-neutral-400 flex-shrink-0" />
          <span className="text-[14px] truncate">{recipe.time} 分鐘</span>
        </div>

        <div className="flex items-center gap-2 max-[400px]:hidden">
          <Star className="h-[20px] w-[20px] text-amber-400 flex-shrink-0" />
          <span className="text-[14px] truncate">{recipe.rating}</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/recipe-page/${recipe.id}`} className="block">
      <Card
        className={cn(
          recipeCardVariants({ spacing, interactive, background }),
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            recipeContentVariants({ spacing, interactive, background }),
          )}
        >
          {renderImage()}
          <CardContent className="flex-1 px-4 py-6">
            <h2 className="text-[22px] font-bold text-neutral-800 mb-2">
              {recipe.title}
            </h2>
            <p className="text-[14px] text-neutral-600 mb-4 line-clamp-1">
              {recipe.description}
            </p>
            {renderInfo()}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
