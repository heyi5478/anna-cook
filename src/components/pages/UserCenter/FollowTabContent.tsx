import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { UserFollowResponse } from '@/types/api';
import { FollowedUserCard } from './FollowedUserCard';

interface FollowTabContentProps {
  followLoading: boolean;
  followError: string | null;
  followData: UserFollowResponse['data'];
  followPage: number;
  followHasMore: boolean;
  followTotalCount: number;
  getFullImageUrl: (url: string) => string;
  loadMore: () => void;
}

/**
 * 已追蹤標籤頁內容元件
 */
export function FollowTabContent({
  followLoading,
  followError,
  followData,
  followPage,
  followHasMore,
  followTotalCount,
  getFullImageUrl,
  loadMore,
}: FollowTabContentProps) {
  const router = useRouter();

  /**
   * 處理用戶項目點擊事件
   */
  const atUserClick = (displayId: string) => {
    router.push(`/user/${displayId}`);
  };

  if (followLoading && followPage === 1) {
    return (
      <div className="text-center py-8 text-neutral-500">
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  if (followError) {
    return <div className="text-center py-8 text-red-500">{followError}</div>;
  }

  if (followData.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        目前沒有追蹤的用戶
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-neutral-500 mb-2">共{followTotalCount}位追蹤中</p>

      {followData.map((user: UserFollowResponse['data'][0]) => (
        <div
          key={`followed-${user.id}`}
          className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          onClick={() => atUserClick(user.displayId)}
        >
          <FollowedUserCard
            username={user.name}
            bio={user.description}
            recipesCount={user.followedUserRecipeCount}
            followersCount={user.followedUserFollowerCount}
            avatarSrc={getFullImageUrl(user.profilePhoto)}
          />
        </div>
      ))}

      {followLoading && (
        <div className="text-center py-4 text-neutral-500">載入更多中...</div>
      )}

      {followHasMore && !followLoading && (
        <Button
          variant="ghost"
          className="w-full mt-4 border border-neutral-200 hover:bg-neutral-50"
          onClick={loadMore}
        >
          <span>更多追蹤</span>
        </Button>
      )}
    </div>
  );
}
