import { Star, MessageSquare, Heart } from 'lucide-react';
import Image from 'next/image';

/**
 * 顯示草稿的食譜卡片
 */
export function DraftRecipeCard({
  title = '馬鈴薯烤蛋',
  description = '食譜故事敘述食譜故事敘述食譜故事敘述...',
  imageSrc = '/placeholder.svg',
  likes = 3,
  comments = 2,
  rating = 4.3,
}) {
  return (
    <div className="border rounded-lg p-4 flex">
      <div className="w-36 h-36 bg-gray-200 shrink-0 rounded-md overflow-hidden relative">
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 ml-4 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">
            已儲存
          </span>
        </div>

        <p className="text-gray-500 mb-auto line-clamp-2">{description}</p>

        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center">
            <Heart className="h-5 w-5 mr-1" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-1" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
