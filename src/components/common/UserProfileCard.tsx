import { User } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/ui';
import type { UserProfileCardProps as BaseUserProfileCardProps } from '@/components/pages/UserCenter/types';

// 管理用戶資料卡片主容器的樣式變體
const userProfileCardVariants = cva('flex flex-col items-center', {
  variants: {
    size: {
      default: 'pb-4',
    },
    avatarSize: {
      default: '',
    },
    layout: {
      default: '',
    },
  },
  defaultVariants: {
    size: 'default',
    avatarSize: 'default',
    layout: 'default',
  },
});

// 管理頭像容器的樣式變體
const avatarContainerVariants = cva('', {
  variants: {
    size: {
      default: 'w-16 h-16 mb-2',
    },
    layout: {
      default: '',
    },
  },
  defaultVariants: {
    size: 'default',
    layout: 'default',
  },
});

// 管理統計資訊區域的樣式變體
const statsContainerVariants = cva(
  'flex justify-center gap-6 my-2 text-sm text-neutral-500',
  {
    variants: {
      size: {
        default: '',
      },
      layout: {
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
      layout: 'default',
    },
  },
);

export type UserProfileCardProps = BaseUserProfileCardProps &
  VariantProps<typeof userProfileCardVariants> & {
    className?: string;
  };

/**
 * 通用的用戶資料展示卡片元件
 */
export function UserProfileCard({
  userName,
  userAvatar,
  stats,
  actionButton,
  className,
  size,
  avatarSize,
  layout,
  ...props
}: UserProfileCardProps) {
  return (
    <div
      className={cn(
        userProfileCardVariants({ size, avatarSize, layout }),
        className,
      )}
      {...props}
    >
      <Avatar
        className={cn(
          avatarContainerVariants({ size: avatarSize || size, layout }),
        )}
      >
        <AvatarImage src={userAvatar} alt={`${userName}的頭像`} />
        <AvatarFallback>
          <User className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-medium">{userName}</h2>

      <div className={cn(statsContainerVariants({ size, layout }))}>
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
