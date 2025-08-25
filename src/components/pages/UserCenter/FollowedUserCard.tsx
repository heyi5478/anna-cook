import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FollowedUserCardProps } from './types';

/**
 * 顯示已追蹤的用戶卡片
 */
export function FollowedUserCard({
  username,
  bio,
  recipesCount,
  followersCount,
  avatarSrc,
}: FollowedUserCardProps) {
  return (
    <div className="flex items-center bg-white rounded-lg border p-4 space-x-4">
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={avatarSrc} alt={username} />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-neutral-900 mb-1 truncate">
          {username}
        </h3>
        <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{bio}</p>
        <div className="flex items-center text-xs text-neutral-500 space-x-4">
          <span>{recipesCount} 食譜</span>
          <span>{followersCount} 粉絲</span>
        </div>
      </div>
    </div>
  );
}
