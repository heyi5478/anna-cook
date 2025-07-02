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
    <div className="border rounded-lg p-4 flex items-center">
      <Avatar className="w-14 h-14 mr-3">
        <AvatarImage src={avatarSrc} alt={username} />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h3 className="text-lg font-medium">{username}</h3>
        <p className="text-neutral-500 text-sm line-clamp-1 mb-1">{bio}</p>
        <div className="flex gap-4 text-sm text-neutral-500">
          <span>{recipesCount} 食譜</span>
          <span>{followersCount} 粉絲</span>
        </div>
      </div>
    </div>
  );
}
