import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import UserCenter from '@/components/pages/UserCenter';
import { AuthorProfile } from '@/components/pages/AuthorProfile';
import { mockAuthor } from '@/components/pages/AuthorProfile/types';
import { fetchUserProfileServer, ServerUserProfileResponse } from '@/services';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';

interface UserPageProps {
  userProfileData?: ServerUserProfileResponse;
  displayId?: string;
  errorMessage?: string;
  statusCode?: number;
}

/**
 * 使用者個人頁面
 */
export default function UserPage({
  userProfileData,
  displayId,
  errorMessage,
  statusCode,
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

  // 從伺服器生成的資料中獲取預設值
  useEffect(() => {
    // 若有使用者資料則設定初始值
    if (userProfileData?.isMe !== undefined) {
      setIsCurrentUser(userProfileData.isMe);
    }

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
  }, [displayId, userProfileData?.isMe]);

  // 如果有錯誤，顯示錯誤頁面
  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            錯誤 {statusCode}
          </h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  // 確保有用戶資料
  if (!userProfileData || !displayId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>找不到該使用者資料</p>
      </div>
    );
  }

  // 判斷是顯示個人中心還是作者頁面
  const { userData } = userProfileData;
  console.log('[...displayId].tsx - userData:', userData);

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

  // 顯示 author 的值，Debug 用
  console.log('[...displayId].tsx - author:', {
    ...author,
  });

  // 在客戶端渲染前可能未確定是否為本人
  if (isCurrentUser === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {COMMON_TEXTS.LOADING}
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

      <div className="min-h-screen bg-gray-50">
        {isCurrentUser ? (
          // 顯示使用者中心
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
          // 顯示作者頁面
          <AuthorProfile
            author={{
              ...author,
              // 移除 URL 參數模擬，使用 API 返回的實際 isFollowing 狀態
              isFollowing: author.isFollowing,
            }}
            isMe={false}
            displayId={displayId}
          />
        )}
      </div>
    </>
  );
}

/**
 * 伺服器端渲染頁面的資料
 * 使用專門為伺服器端設計的 API 函數
 */
export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const { displayId } = params || {};

  // 確保 displayId 是陣列且有至少一個元素
  if (!Array.isArray(displayId) || displayId.length === 0) {
    return {
      notFound: true,
    };
  }

  try {
    // 使用專門的伺服器端 API 函數獲取使用者資料
    const userProfileData = await fetchUserProfileServer(displayId[0], req);

    // 檢查回應狀態碼
    if (userProfileData.StatusCode !== 200) {
      // 如果是 400 代表查無此使用者，回傳 notFound
      if (userProfileData.StatusCode === 400) {
        console.log(`查無使用者 ${displayId[0]}`);
        return {
          notFound: true,
        };
      }

      // 其他錯誤則返回錯誤頁面
      return {
        props: {
          errorMessage:
            userProfileData.msg || ERROR_MESSAGES.FETCH_USER_PROFILE_FAILED,
          statusCode: userProfileData.StatusCode,
        },
      };
    }

    // 在伺服器端記錄資料，方便調試
    console.log('伺服器端獲取的用戶資料:', {
      isMe: userProfileData.isMe,
      userData: userProfileData.userData ? '存在' : '不存在',
      authorData: userProfileData.authorData ? '存在' : '不存在',
      userDisplayId: userProfileData.userData?.displayId || '無',
    });

    // 確保 userData 和 authorData 至少為空物件而非 null
    // 這樣在 client-side 元件中不會有解構錯誤
    if (!userProfileData.userData && userProfileData.authorData) {
      // 如果 userData 不存在但 authorData 存在，使用 authorData 填充 userData
      userProfileData.userData = {
        userId: userProfileData.authorData.userId,
        displayId: userProfileData.authorData.displayId,
        isFollowing: false,
        accountName: userProfileData.authorData.accountName,
        profilePhoto: userProfileData.authorData.profilePhoto,
        description: userProfileData.authorData.description,
        recipeCount: 0,
        followerCount: userProfileData.authorData.followerCount,
      };
    } else if (!userProfileData.userData) {
      userProfileData.userData = {
        userId: 0,
        displayId: displayId[0],
        isFollowing: false,
        accountName: '',
        profilePhoto: '',
        description: '',
        recipeCount: 0,
        followerCount: 0,
      };
    }

    if (!userProfileData.authorData) {
      userProfileData.authorData = {
        userId: 0,
        displayId: displayId[0],
        accountName: '',
        accountEmail: '',
        profilePhoto: '',
        description: '',
        followingCount: 0,
        followerCount: 0,
        favoritedTotal: 0,
        myFavoriteCount: 0,
        averageRating: 0,
        totalViewCount: 0,
      };
    }

    return {
      props: {
        userProfileData,
        displayId: displayId[0],
      },
    };
  } catch (error) {
    console.error('獲取使用者資料時發生錯誤:', error);
    return {
      props: {
        errorMessage: '發生未預期的錯誤',
        statusCode: 500,
      },
    };
  }
};
