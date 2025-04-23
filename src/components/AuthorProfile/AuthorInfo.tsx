import { Share2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Author } from './types';

interface AuthorInfoProps {
  author: Author;
  onFollowClick: () => void;
  onShareClick: () => void;
}

/**
 * 顯示作者個人資料區塊，包含頭像、名稱、簡介及互動按鈕
 */
export const AuthorInfo = ({
  author,
  onFollowClick,
  onShareClick,
}: AuthorInfoProps) => {
  return (
    <div className="bg-white p-4">
      <div className="flex flex-col items-center relative mb-4">
        {/* 分享按鈕 */}
        <button
          className="absolute right-0 top-4"
          onClick={onShareClick}
          aria-label="分享"
        >
          <Share2 className="h-6 w-6 text-gray-500" />
          <span className="sr-only">分享</span>
        </button>

        {/* 作者頭像 */}
        <Avatar className="h-24 w-24 mb-3">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* 作者名稱 */}
        <h1 className="text-xl font-bold mb-3">{author.name}</h1>

        {/* 食譜和粉絲數量 */}
        <div className="flex gap-4 mb-4 text-sm text-gray-500">
          <span>{author.recipeCount} 食譜</span>
          <span>{author.followerCount} 粉絲</span>
        </div>

        {/* 追蹤按鈕 */}
        <Button
          variant="outline"
          className="w-28 rounded-sm bg-gray-800 text-white hover:bg-gray-700"
          onClick={onFollowClick}
        >
          {author.isFollowing ? '已追蹤' : '追蹤'}
        </Button>
      </div>

      {/* 作者簡介 */}
      <div className="mt-8 text-gray-700 text-sm px-4">
        <p className="leading-6">{author.bio}</p>
      </div>
    </div>
  );
};
