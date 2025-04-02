import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * 顯示已追蹤的用戶卡片
 */
export function FollowedUserCard({
  username = '使用者名稱',
  bio = '個人簡介個人簡介個人簡介個人簡介個人簡介個人簡介',
  recipesCount = 15,
  followersCount = 20,
  avatarSrc = '/placeholder.svg',
}) {
  return (
    <div className="border rounded-lg p-4 flex items-center">
      <Avatar className="w-20 h-20">
        <AvatarImage src={avatarSrc} alt={username} />
        <AvatarFallback>
          <User className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>

      <div className="ml-4 flex-1">
        <h3 className="text-xl font-bold mb-1">{username}</h3>
        <p className="text-gray-500 line-clamp-1 mb-2">{bio}</p>
        <div className="flex gap-4">
          <span>{recipesCount} 食譜</span>
          <span>{followersCount} 粉絲</span>
        </div>
      </div>
    </div>
  );
}
