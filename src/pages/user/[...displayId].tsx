import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import UserCenter from '@/components/UserCenter';
import { AuthorProfile } from '@/components/AuthorProfile';
import { fetchUserProfile } from '@/services/api';
import { mockAuthor } from '@/components/AuthorProfile/types';

interface UserPageProps {
  userProfileData: {
    StatusCode: number;
    isMe: boolean;
    userData: {
      userId: number;
      displayId: string;
      isFollowing: boolean;
      accountName: string;
      profilePhoto: string;
      userIntro: string;
      recipeCount: number;
      followerCount: number;
    } | null;
    authorData: {
      userId: number;
      displayId: string;
      accountName: string;
      followingCount: number;
      followerCount: number;
      favoritedTotal: number;
      myFavoriteCount: number;
      averageRating: number;
      totalViewCount: number;
    } | null;
  };
  displayId: string;
}

/**
 * 使用者個人頁面
 */
export default function UserPage({
  userProfileData,
  displayId,
}: UserPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean | null>(null);

  // 監聽 URL 參數變化，用於設置 UserCenter 的標籤
  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as string);
    }
  }, [router.query]);

  // 在客戶端判斷是否為當前登入使用者
  useEffect(() => {
    // 從靜態生成的資料中先取得預設值
    setIsCurrentUser(userProfileData.isMe);

    // 使用 API 檢查是否為當前登入使用者
    const checkCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/check-current-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ displayId }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsCurrentUser(data.isCurrentUser);
        }
      } catch (error) {
        console.error('檢查當前用戶時發生錯誤:', error);
        // 保持預設值不變
      }
    };

    checkCurrentUser();
  }, [displayId, userProfileData.isMe]);

  // 如果資料尚未載入或發生錯誤
  if (!userProfileData || userProfileData.StatusCode !== 200) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>找不到該使用者資料</p>
      </div>
    );
  }

  // 判斷是顯示個人中心還是作者頁面
  const { userData } = userProfileData;

  // 轉換 API 資料為 AuthorProfile 所需的格式
  const author = userData
    ? {
        id: userData.userId.toString(),
        name: userData.accountName,
        avatar: userData.profilePhoto,
        bio: userData.userIntro || '',
        recipeCount: userData.recipeCount,
        followerCount: userData.followerCount,
        isFollowing: userData.isFollowing,
      }
    : mockAuthor;

  // 在客戶端渲染前可能未確定是否為本人
  if (isCurrentUser === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        載入中...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {isCurrentUser ? '我的個人中心' : `${author.name}的個人頁面`}
        </title>
        <meta
          name="description"
          content={`查看${isCurrentUser ? '我的' : `${author.name}的`}食譜和個人資料`}
        />
      </Head>

      <Header />
      <div className="min-h-screen bg-gray-50">
        {isCurrentUser ? (
          // 顯示使用者中心
          <UserCenter
            defaultTab={activeTab}
            userProfileData={userProfileData}
          />
        ) : (
          // 顯示作者頁面
          <AuthorProfile author={author} isMe={false} displayId={displayId} />
        )}
      </div>
      <Footer />
    </>
  );
}

/**
 * 靜態生成頁面的資料
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { displayId } = params || {};

  // 確保 displayId 是陣列且有至少一個元素
  if (!Array.isArray(displayId) || displayId.length === 0) {
    return {
      notFound: true,
    };
  }

  try {
    // 呼叫 API 獲取使用者資料
    const userProfileData = await fetchUserProfile(displayId[0]);

    if (userProfileData.StatusCode !== 200) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        userProfileData,
        displayId: displayId[0],
      },
      // 每小時重新生成頁面
      revalidate: 3600,
    };
  } catch (error) {
    console.error('獲取使用者資料時發生錯誤:', error);
    return {
      notFound: true,
    };
  }
};

/**
 * 定義哪些頁面需要預先生成
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // 這裡可以獲取熱門用戶來預先生成
  // 目前僅預先生成一個範例用戶頁面
  return {
    paths: [{ params: { displayId: ['M000002'] } }],
    // 對未預先生成的路徑，等待生成後再顯示
    fallback: 'blocking',
  };
};
