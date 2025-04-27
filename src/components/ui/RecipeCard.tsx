import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// 定義食譜類型
export type Recipe = {
  id: string;
  title: string;
  image: string;
  category: string;
  time: number;
  servings: number;
  rating: number;
  description: string;
};

export type RecipeCardProps = {
  recipe: Recipe;
  className?: string;
};

/**
 * 顯示食譜內容的卡片元件，包含圖片、標題、描述和食譜相關資訊
 */
export function RecipeCard({ recipe, className }: RecipeCardProps) {
  /**
   * 渲染食譜的圖片部分
   */
  function renderImage() {
    return (
      <div className="relative w-24 h-24 my-4 ml-4 mr-0 flex-shrink-0">
        <Image
          src={recipe.image || '/placeholder.svg'}
          alt={recipe.title}
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
      <div className="flex flex-wrap items-center justify-end gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="h-[20px] w-[20px] text-gray-400" />
          <span className="text-[14px]">{recipe.servings} 人份</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-[20px] w-[20px] text-gray-400" />
          <span className="text-[14px]">{recipe.time} 分鐘</span>
        </div>

        <div className="flex items-center gap-2">
          <Star className="h-[20px] w-[20px] text-amber-400" />
          <span className="text-[14px]">{recipe.rating}</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/recipe-page/${recipe.id}`} className="block">
      <Card className={`overflow-hidden w-full mb-4 ${className || ''}`}>
        <div className="flex flex-row items-center bg-[#FAFAFA]">
          {renderImage()}
          <CardContent className="flex-1 px-4 py-6">
            <h2 className="text-[22px] font-bold text-gray-800 mb-2">
              {recipe.title}
            </h2>
            <p className="text-[14px] text-gray-600 mb-4 line-clamp-1">
              {recipe.description}
            </p>
            {renderInfo()}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
