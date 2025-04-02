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
    <div className="border-b pb-6">
      <div className="flex gap-4 mb-4">
        <div className="w-24 h-24 bg-gray-200 shrink-0 rounded-md overflow-hidden relative">
          <Image
            src={imageSrc || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-xl font-bold mb-2">{title}</h4>
          <div className="text-gray-500">
            評分: {rating} • 瀏覽: {views}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-100 p-4 text-center rounded-md">
          <div className="text-gray-500 mb-1">收藏</div>
          <div className="text-2xl font-bold">{bookmarks}</div>
        </div>
        <div className="bg-gray-100 p-4 text-center rounded-md">
          <div className="text-gray-500 mb-1">留言</div>
          <div className="text-2xl font-bold">{comments}</div>
        </div>
        <div className="bg-gray-100 p-4 text-center rounded-md">
          <div className="text-gray-500 mb-1">分享</div>
          <div className="text-2xl font-bold">{shares}</div>
        </div>
      </div>
    </div>
  );
}
