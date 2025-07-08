import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RecipeStatsItemProps } from './types';
import {
  recipeStatsContainerVariants,
  recipeInfoContainerVariants,
  recipeImageContainerVariants,
  recipeImageVariants,
  recipeContentContainerVariants,
  recipeTitleVariants,
  recipeRatingInfoVariants,
  statsGridVariants,
  statsItemCardVariants,
  statsLabelVariants,
  statsValueVariants,
} from './styles';

/**
 * 顯示單一食譜的數據統計項目
 */
export function RecipeStatsItem({
  title,
  rating,
  views,
  bookmarks,
  comments,
  shares,
  imageSrc,
}: RecipeStatsItemProps) {
  return (
    <div className={cn(recipeStatsContainerVariants())}>
      <div className={cn(recipeInfoContainerVariants())}>
        <div className={cn(recipeImageContainerVariants())}>
          <Image
            src={imageSrc || '/placeholder.svg'}
            alt={title}
            fill
            className={cn(recipeImageVariants())}
          />
        </div>
        <div className={cn(recipeContentContainerVariants())}>
          <h4 className={cn(recipeTitleVariants())}>{title}</h4>
          <div className={cn(recipeRatingInfoVariants())}>
            評分: {rating} • 瀏覽: {views}
          </div>
        </div>
      </div>

      <div className={cn(statsGridVariants())}>
        <div className={cn(statsItemCardVariants())}>
          <div className={cn(statsLabelVariants())}>收藏</div>
          <div className={cn(statsValueVariants())}>{bookmarks}</div>
        </div>
        <div className={cn(statsItemCardVariants())}>
          <div className={cn(statsLabelVariants())}>留言</div>
          <div className={cn(statsValueVariants())}>{comments}</div>
        </div>
        <div className={cn(statsItemCardVariants())}>
          <div className={cn(statsLabelVariants())}>分享</div>
          <div className={cn(statsValueVariants())}>{shares}</div>
        </div>
      </div>
    </div>
  );
}
