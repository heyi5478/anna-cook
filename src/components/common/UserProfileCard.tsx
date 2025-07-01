import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { UserProfileCardProps } from '@/components/pages/UserCenter/types';

/**
 * 通用的用戶資料展示卡片元件
 */
export function UserProfileCard({
  userName,
  userAvatar,
  stats,
  actionButton,
}: UserProfileCardProps) {
  return (
    <div className="flex flex-col items-center pb-4">
      <Avatar className="w-16 h-16 mb-2">
        <AvatarImage src={userAvatar} alt={`${userName}的頭像`} />
        <AvatarFallback>
          <User className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-medium">{userName}</h2>

      <div className="flex justify-center gap-6 my-2 text-sm text-neutral-500">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div>{stat.value}</div>
            <div>{stat.label}</div>
          </div>
        ))}
      </div>

      {actionButton && (
        <Button
          variant="outline"
          className="w-full mt-2 rounded-lg font-normal text-neutral-700"
          onClick={actionButton.onClick}
        >
          {actionButton.text}
        </Button>
      )}
    </div>
  );
}
