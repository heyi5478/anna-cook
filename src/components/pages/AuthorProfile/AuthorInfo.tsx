import { Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/common/FollowButton';
import { Author } from './types';

interface AuthorInfoProps {
  author: Author;
  onShareClick: () => void;
}

/**
 * 顯示作者個人資料區塊，包含頭像、名稱、簡介及互動按鈕
 */
export const AuthorInfo = ({ author, onShareClick }: AuthorInfoProps) => {
  // 顯示 author 的值，Debug 用
  console.log('AuthorInfo.tsx - author:', author);

  // 使用從 props 傳入的 isFollowing 狀態
  const [isFollowing, setIsFollowing] = useState(author.isFollowing);

  // 顯示追蹤狀態初始值
  console.log('AuthorInfo.tsx - author.isFollowing:', author.isFollowing);
  console.log('AuthorInfo.tsx - 初始 isFollowing 狀態:', isFollowing);

  // 當 author.isFollowing 變化時同步更新內部狀態
  useEffect(() => {
    console.log(
      'AuthorInfo.tsx - useEffect 觸發 - author.isFollowing 變更為:',
      author.isFollowing,
    );
    setIsFollowing(author.isFollowing);
  }, [author.isFollowing]);

  /**
   * 處理追蹤狀態變更
   */
  const atFollowChange = (newFollowingState: boolean) => {
    setIsFollowing(newFollowingState);
    console.log('AuthorInfo.tsx - 追蹤狀態變更為:', newFollowingState);
  };

  // 在渲染時輸出 log，便於確認
  console.log('AuthorInfo.tsx - 渲染按鈕狀態:', { isFollowing });

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

        {/* 追蹤按鈕 - 使用通用的 FollowButton 元件 */}
        <FollowButton
          userId={parseInt(author.id, 10)}
          initialIsFollowing={isFollowing}
          variant={isFollowing ? 'outline' : 'default'}
          className={
            isFollowing
              ? 'w-28 rounded-sm bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              : 'w-28 rounded-sm bg-gray-800 text-white hover:bg-gray-700'
          }
          onFollowChange={atFollowChange}
        />
      </div>

      {/* 作者簡介 */}
      <div className="mt-8 text-gray-700 text-sm px-4">
        <p className="leading-6">{author.bio}</p>
      </div>
    </div>
  );
};
