import type { Metadata } from 'next';
import type { IncomingMessage } from 'http';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchUserProfileServer,
  type ServerUserProfileResponse,
} from '@/services';
import { ERROR_MESSAGES } from '@/lib/constants/messages';
import { UserProfileClient } from './user-profile-client';

type PageParams = { displayId: string[] };

// 由 App Router 的 cookies() 組出 cookie 標頭，沿用既有 fetchUserProfileServer(req) 讀取 token
async function buildReqFromCookies(): Promise<IncomingMessage> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return { headers: { cookie: cookieHeader } } as unknown as IncomingMessage;
}

// 錯誤頁（server 端渲染；「返回首頁」改用 Link 以免需要 client）
function UserError({
  statusCode,
  message,
}: {
  statusCode?: number;
  message: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          錯誤 {statusCode}
        </h2>
        <p className="text-neutral-700 mb-6">{message}</p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-block"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}

// 動態 SEO（對應原 generateSEOContent；title 用 absolute 避免與 root template 重複）
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const id = (await params).displayId?.[0];
  if (!id) return {};

  const data = await fetchUserProfileServer(id, await buildReqFromCookies());
  if (data.StatusCode !== 200 || !data.userData) return {};

  const isMe = data.isMe ?? false;
  const name = data.userData.accountName;
  const title = isMe
    ? '我的個人中心｜安那煮 | 家傳好菜－Anna Cook'
    : `${name}的所有食譜｜安那煮 | 家傳好菜－Anna Cook`;
  const description = isMe
    ? '管理我的食譜和個人資料。安那煮Anna Cook食譜教學，讓做菜變簡單。影片食譜一鍵教學，家常食譜一次學會，輕鬆完成美味料理。'
    : `${data.userData.description || `${name}的美味食譜分享`}。安那煮Anna Cook食譜教學，讓做菜變簡單。影片食譜一鍵教學，家常食譜一次學會，輕鬆完成美味料理。`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/user/${id}` },
    keywords: `${name}, 食譜作者, 美味食譜, 料理教學, 影片食譜`,
  };
}

/**
 * 使用者個人頁（Server Component）
 * getServerSideProps → 於 server 端以 cookies() 讀 token 抓取使用者資料（dynamic SSR）
 */
export default async function UserPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const id = (await params).displayId?.[0];
  if (!id) notFound();

  let userProfileData: ServerUserProfileResponse;
  try {
    userProfileData = await fetchUserProfileServer(
      id,
      await buildReqFromCookies(),
    );
  } catch (error) {
    console.error('獲取使用者資料時發生錯誤:', error);
    return <UserError statusCode={500} message="發生未預期的錯誤" />;
  }

  // 400 = 查無此使用者 → 404
  if (userProfileData.StatusCode === 400) notFound();

  // 其他非 200 → 錯誤頁
  if (userProfileData.StatusCode !== 200) {
    return (
      <UserError
        statusCode={userProfileData.StatusCode}
        message={
          userProfileData.msg || ERROR_MESSAGES.FETCH_USER_PROFILE_FAILED
        }
      />
    );
  }

  // 補齊 userData / authorData 預設值（避免 client 端解構錯誤）— 沿用原 getServerSideProps 邏輯
  if (!userProfileData.userData && userProfileData.authorData) {
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
      displayId: id,
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
      displayId: id,
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

  return <UserProfileClient userProfileData={userProfileData} displayId={id} />;
}
