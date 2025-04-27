import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { followUser, unfollowUser } from '@/services/api';

// Toast 樣式
const toastStyles = {
  background: 'white',
  color: '#1F2937',
  border: '1px solid #E5E7EB',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

interface FollowButtonProps {
  userId: number;
  initialIsFollowing: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline';
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

/**
 * 通用追蹤按鈕元件，用於追蹤/取消追蹤作者
 */
export const FollowButton = ({
  userId,
  initialIsFollowing,
  size = 'sm',
  variant = 'outline',
  className = '',
  onFollowChange,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 當 initialIsFollowing 變化時同步更新內部狀態
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  /**
   * 處理追蹤/取消追蹤按鈕點擊
   */
  const atFollowClick = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (isFollowing) {
        // 已追蹤狀態，調用取消追蹤 API
        const response = await unfollowUser(userId);

        if (response.StatusCode === 200) {
          setIsFollowing(false);
          if (onFollowChange) onFollowChange(false);
          toast({
            title: '成功',
            description: '已取消追蹤該作者',
            style: toastStyles,
          });
        } else {
          toast({
            title: '錯誤',
            description: response.msg || '取消追蹤失敗',
            variant: 'destructive',
            style: toastStyles,
          });
        }
      } else {
        // 未追蹤狀態，調用追蹤 API
        const response = await followUser(userId);

        if (response.StatusCode === 200) {
          setIsFollowing(true);
          if (onFollowChange) onFollowChange(true);
          toast({
            title: '成功',
            description: '已成功追蹤該作者',
            style: toastStyles,
          });
        } else {
          toast({
            title: '錯誤',
            description: response.msg || '追蹤失敗',
            variant: 'destructive',
            style: toastStyles,
          });
        }
      }
    } catch (error) {
      console.error('追蹤操作失敗:', error);
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

  /**
   * 獲取按鈕顯示文字
   */
  const getButtonText = () => {
    if (loading) {
      return '處理中...';
    }
    return isFollowing ? '取消追蹤' : '追蹤';
  };

  // 根據追蹤狀態決定額外的樣式
  const followingClass = isFollowing ? 'bg-gray-100' : '';

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${followingClass}`}
      onClick={atFollowClick}
      disabled={loading}
    >
      {getButtonText()}
    </Button>
  );
};

export default FollowButton;
