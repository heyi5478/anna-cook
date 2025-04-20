import { Star, MessageSquare, Heart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

/**
 * 顯示已發布的食譜卡片
 */
export function PublishedRecipeCard({
  title = '馬鈴薯烤蛋',
  description = '食譜故事敘述食譜故事敘述食譜故事敘述...',
  imageSrc = '/placeholder.svg',
  likes = 3,
  comments = 2,
  rating = 4.3,
}) {
  return (
    <div className="border rounded-lg p-4 flex relative">
      <div className="w-28 h-28 bg-gray-200 shrink-0 rounded-md overflow-hidden relative">
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 ml-4 flex flex-col">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-auto line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      <Button
        variant="destructive"
        className="absolute top-4 right-4 px-4 py-1 h-8 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-normal text-sm"
      >
        轉發佈
      </Button>
    </div>
  );
}
