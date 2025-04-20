import Image from 'next/image';

/**
 * 顯示單一食譜的數據統計項目
 */
export function RecipeStatsItem({
  title = '馬鈴薯烤蛋',
  rating = 4.5,
  views = 200,
  bookmarks = 5,
  comments = 3,
  shares = 2,
  imageSrc = '/placeholder.svg',
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-20 h-20 bg-gray-200 shrink-0 rounded-md overflow-hidden relative">
          <Image
            src={imageSrc || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium mb-1">{title}</h4>
          <div className="text-sm text-gray-500">
            評分: {rating} • 瀏覽: {views}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 p-3 text-center rounded-md">
          <div className="text-xs text-gray-500 mb-1">收藏</div>
          <div className="text-lg font-medium">{bookmarks}</div>
        </div>
        <div className="bg-gray-50 p-3 text-center rounded-md">
          <div className="text-xs text-gray-500 mb-1">留言</div>
          <div className="text-lg font-medium">{comments}</div>
        </div>
        <div className="bg-gray-50 p-3 text-center rounded-md">
          <div className="text-xs text-gray-500 mb-1">分享</div>
          <div className="text-lg font-medium">{shares}</div>
        </div>
      </div>
    </div>
  );
}
