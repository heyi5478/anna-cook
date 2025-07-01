import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

/**
 * 統計資料項目類型
 */
export interface StatItem {
  /** 統計標籤 */
  label: string;
  /** 統計數值 */
  value: number;
}

/**
 * 操作按鈕配置類型
 */
export interface ActionButton {
  /** 按鈕文字 */
  text: string;
  /** 按鈕點擊事件 */
  onClick: () => void;
}

/**
 * 用戶資料卡片元件的 Props 類型
 */
export interface UserProfileCardProps {
  /** 用戶名稱 */
  userName: string;
  /** 用戶頭像 URL */
  userAvatar: string;
  /** 統計資料陣列 */
  stats: StatItem[];
  /** 可選的操作按鈕 */
  actionButton?: ActionButton;
}

/**
 * 通用的用戶資料展示卡片元件
 * 用於顯示用戶基本資訊、統計數據和操作按鈕
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
