import { Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { followUser, unfollowUser } from '@/services/api';
import { Author } from './types';

// Toast 樣式
const toastStyles = {
  background: 'white',
  color: '#1F2937',
  border: '1px solid #E5E7EB',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
   * 處理追蹤/取消追蹤按鈕點擊
   */
  const atFollowClick = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const userId = parseInt(author.id, 10);

      console.log('AuthorInfo.tsx - 點擊追蹤按鈕 - 當前狀態:', isFollowing);
      console.log('AuthorInfo.tsx - 點擊追蹤按鈕 - userId:', userId);

      if (isFollowing) {
        // 已追蹤狀態，調用取消追蹤 API
        console.log('AuthorInfo.tsx - 準備調用取消追蹤 API');
        const response = await unfollowUser(userId);
        console.log('AuthorInfo.tsx - 取消追蹤 API 回應:', response);

        if (response.StatusCode === 200) {
          setIsFollowing(false);
          console.log('AuthorInfo.tsx - 取消追蹤成功，更新狀態為 false');
          toast({
            title: '成功',
            description: '已取消追蹤該作者',
            style: toastStyles,
          });
        } else {
          console.log('AuthorInfo.tsx - 取消追蹤失敗:', response.msg);
          toast({
            title: '錯誤',
            description: response.msg || '取消追蹤失敗',
            variant: 'destructive',
            style: toastStyles,
          });
        }
      } else {
        // 未追蹤狀態，調用追蹤 API
        console.log('AuthorInfo.tsx - 準備調用追蹤 API');
        const response = await followUser(userId);
        console.log('AuthorInfo.tsx - 追蹤 API 回應:', response);

        if (response.StatusCode === 200) {
          setIsFollowing(true);
          console.log('AuthorInfo.tsx - 追蹤成功，更新狀態為 true');
          toast({
            title: '成功',
            description: '已成功追蹤該作者',
            style: toastStyles,
          });
        } else {
          console.log('AuthorInfo.tsx - 追蹤失敗:', response.msg);
          toast({
            title: '錯誤',
            description: response.msg || '追蹤失敗',
            variant: 'destructive',
            style: toastStyles,
          });
        }
      }
    } catch (error) {
      console.error('AuthorInfo.tsx - 追蹤操作失敗:', error);
      toast({
        title: '錯誤',
        description: '操作失敗，請稍後再試',
        variant: 'destructive',
        style: toastStyles,
      });
    } finally {
      setLoading(false);
    }
  };

  // 根據追蹤狀態決定按鈕樣式
  const buttonVariant = isFollowing ? 'outline' : 'default';
  const buttonClassName = isFollowing
    ? 'w-28 rounded-sm bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
    : 'w-28 rounded-sm bg-gray-800 text-white hover:bg-gray-700';

  // 根據追蹤狀態和載入狀態決定按鈕文字
  let buttonText = '追蹤';
  if (loading) {
    buttonText = '處理中...';
  } else if (isFollowing) {
    buttonText = '取消追蹤';
  }

  // 在渲染時輸出 log，便於確認
  console.log('AuthorInfo.tsx - 渲染按鈕狀態:', {
    isFollowing,
    buttonText,
    buttonVariant,
    buttonClassName,
  });

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

        {/* 追蹤按鈕 - 根據追蹤狀態切換樣式 */}
        <Button
          variant={buttonVariant}
          className={buttonClassName}
          onClick={atFollowClick}
          disabled={loading}
        >
          {buttonText}
        </Button>
      </div>

      {/* 作者簡介 */}
      <div className="mt-8 text-gray-700 text-sm px-4">
        <p className="leading-6">{author.bio}</p>
      </div>
    </div>
  );
};
