import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  userCardContainerVariants,
  userAvatarContainerVariants,
  userInfoContainerVariants,
  usernameVariants,
  userBioVariants,
  userStatsVariants,
} from '@/styles/cva/user-center';
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
    <div className={cn(userCardContainerVariants())}>
      <Avatar className={cn(userAvatarContainerVariants())}>
        <AvatarImage src={avatarSrc} alt={username} />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>

      <div className={cn(userInfoContainerVariants())}>
        <h3 className={cn(usernameVariants())}>{username}</h3>
        <p className={cn(userBioVariants())}>{bio}</p>
        <div className={cn(userStatsVariants())}>
          <span>{recipesCount} 食譜</span>
          <span>{followersCount} 粉絲</span>
        </div>
      </div>
    </div>
  );
}
