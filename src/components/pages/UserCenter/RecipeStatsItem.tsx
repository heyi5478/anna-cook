import Image from 'next/image';
import { RecipeStatsItemProps } from './types';

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
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 mr-4 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={imageSrc || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-neutral-900 mb-1 truncate">
            {title}
          </h4>
          <div className="text-sm text-neutral-600">
            評分: {rating} • 瀏覽: {views}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-neutral-50 rounded-lg p-3 text-center">
          <div className="text-xs text-neutral-600 mb-1">收藏</div>
          <div className="text-lg font-semibold text-neutral-900">
            {bookmarks}
          </div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3 text-center">
          <div className="text-xs text-neutral-600 mb-1">留言</div>
          <div className="text-lg font-semibold text-neutral-900">
            {comments}
          </div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3 text-center">
          <div className="text-xs text-neutral-600 mb-1">分享</div>
          <div className="text-lg font-semibold text-neutral-900">{shares}</div>
        </div>
      </div>
    </div>
  );
}
