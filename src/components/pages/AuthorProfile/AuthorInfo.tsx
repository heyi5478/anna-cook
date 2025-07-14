import { Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/features/FollowButton';
import { cn } from '@/lib/utils';
import type { Author } from '@/types/recipe';
import {
  authorCardVariants,
  authorInfoVariants,
  authorStatsVariants,
  authorBioVariants,
  shareButtonVariants,
} from '@/styles/cva/author-profile';

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
  const [isFollowing, setIsFollowing] = useState(author.isFollowing || false);

  // 顯示追蹤狀態初始值
  console.log('AuthorInfo.tsx - author.isFollowing:', author.isFollowing);
  console.log('AuthorInfo.tsx - 初始 isFollowing 狀態:', isFollowing);

  // 當 author.isFollowing 變化時同步更新內部狀態
  useEffect(() => {
    console.log(
      'AuthorInfo.tsx - useEffect 觸發 - author.isFollowing 變更為:',
      author.isFollowing,
    );
    setIsFollowing(author.isFollowing || false);
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
    <div className={cn(authorCardVariants())}>
      <div className={cn(authorInfoVariants())}>
        {/* 分享按鈕 */}
        <button
          className={cn(shareButtonVariants())}
          onClick={onShareClick}
          aria-label="分享"
        >
          <Share2 className="h-6 w-6 text-neutral-500" />
          <span className="sr-only">分享</span>
        </button>

        {/* 作者頭像 */}
        <Avatar className="h-24 w-24 mb-3">
          <AvatarImage
            src={author.avatar || author.profilePhoto}
            alt={author.name}
          />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* 作者名稱 */}
        <h1 className="text-xl font-bold mb-3">{author.name}</h1>

        {/* 食譜和粉絲數量 */}
        <div className={cn(authorStatsVariants())}>
          <span>{author.recipeCount || 0} 食譜</span>
          <span>{author.followerCount || author.followersCount || 0} 粉絲</span>
        </div>

        {/* 追蹤按鈕 - 使用通用的 FollowButton 元件 */}
        <FollowButton
          userId={
            typeof author.id === 'string' ? parseInt(author.id, 10) : author.id
          }
          initialIsFollowing={isFollowing}
          variant={isFollowing ? 'outline' : 'default'}
          className={
            isFollowing
              ? 'w-28 rounded-sm bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100'
              : 'w-28 rounded-sm bg-neutral-800 text-white hover:bg-neutral-700'
          }
          onFollowChange={atFollowChange}
        />
      </div>

      {/* 作者簡介 */}
      <div className={cn(authorBioVariants())}>
        <p className="leading-6">{author.bio || author.description}</p>
      </div>
    </div>
  );
};
