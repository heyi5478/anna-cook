'use client';

import { useSearchParams } from 'next/navigation';
import UserCenter from '@/components/pages/UserCenter';
import { AuthorProfile } from '@/components/pages/AuthorProfile';
import { mockAuthor } from '@/components/pages/AuthorProfile/types';
import type { ServerUserProfileResponse } from '@/services';

type UserProfileClientProps = {
  userProfileData: ServerUserProfileResponse;
  displayId: string;
};

/**
 * 使用者頁互動層（client）：依後端 isMe 顯示個人中心或作者頁；?tab 決定 UserCenter 分頁
 */
export function UserProfileClient({
  userProfileData,
  displayId,
}: UserProfileClientProps) {
  // 原 router.query.tab → useSearchParams（頁面為 dynamic，不需額外 Suspense）
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab') ?? undefined;

  const { userData } = userProfileData;
  // 是否本人：一律以後端（驗簽後）回傳的 isMe 為準
  const isCurrentUser = userProfileData.isMe ?? false;

  // 轉換 API 資料為 AuthorProfile 所需的格式
  const author = userData
    ? {
        id: userData.userId.toString(),
        name: userData.accountName,
        avatar: userData.profilePhoto,
        bio: userData.description || '',
        recipeCount: userData.recipeCount,
        followerCount: userData.followerCount,
        isFollowing: userData.isFollowing,
      }
    : mockAuthor;

  return (
    <div className="min-h-screen bg-gray-50">
      {isCurrentUser ? (
        <UserCenter
          defaultTab={activeTab}
          userProfileData={{
            StatusCode: userProfileData.StatusCode,
            isMe: userProfileData.isMe,
            userData: userProfileData.userData ?? null,
            authorData: userProfileData.authorData ?? null,
          }}
        />
      ) : (
        <AuthorProfile
          author={{
            ...author,
            isFollowing: author.isFollowing,
          }}
          isMe={false}
          displayId={displayId}
        />
      )}
    </div>
  );
}
