import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export type ReviewDisplayProps = {
  /**
   * 評論內容
   */
  comment: string;
  /**
   * 使用者名稱
   */
  username?: string;
  /**
   * 整體評分
   */
  userRating?: number;
  /**
   * 使用者頭像圖片URL
   */
  userAvatar?: string;
  /**
   * 自定義類別
   */
  className?: string;
};

/**
 * 顯示單一食譜評論的元件
 */
export function ReviewDisplay({
  comment,
  username = '使用者名稱',
  userRating = 4.3,
  userAvatar,
  className = '',
}: ReviewDisplayProps) {
  // 獲取頭像顯示文字（使用者名稱的前兩個字）
  const avatarText = username.substring(0, 2).toUpperCase();

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 bg-gray-300">
          {userAvatar ? <AvatarImage src={userAvatar} alt={username} /> : null}
          <AvatarFallback>{avatarText}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{username}</h3>
          <p className="mt-2 text-neutral-700">
            {comment ||
              '詳細說明您對這道食譜的想法。料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！食譜料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！'}
          </p>

          <div className="flex items-center justify-end mt-3">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="ml-1 text-sm">{userRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
