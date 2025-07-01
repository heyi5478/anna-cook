import Link from 'next/link';
import Image from 'next/image';
import { BookmarkIcon, Users, Clock, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AuthorRecipesResponse,
  UserFavoriteResponse,
  UserFollowResponse,
} from '@/types/api';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { useUserCenter } from '@/hooks/useUserCenter';
import { UserProfileCard } from '@/components/common';
import { RecipeActionBar } from '@/components/features';
import { RecipeStatsItem } from './RecipeStatsItem';
import { PublishedRecipeCard } from './PublishedRecipeCard';
import { DraftRecipeCard } from './DraftRecipeCard';
import { FollowedUserCard } from './FollowedUserCard';
import type { UserCenterProps } from './types';

/**
 * 用戶中心元件
 * 使用 useUserCenter hook 替換所有本地狀態和方法
 */
export default function UserCenter({
  defaultTab,
  userProfileData,
}: UserCenterProps) {
  const router = useRouter();

  // 從 userProfileData 中解構所需資料
  const { userData, authorData } = userProfileData;
  const userName = userData?.accountName || '用戶名稱';
  const userAvatar = userData?.profilePhoto || '/placeholder.svg';
  const followingCount = authorData?.followingCount || 0;
  const followerCount = userData?.followerCount || 0;
  const favoritedTotal = authorData?.favoritedTotal || 0;
  const totalViewCount = authorData?.totalViewCount || 0;
  const averageRating = authorData?.averageRating || 0;
  const displayId = userData?.displayId || '';

  // 使用 useUserCenter hook 替換所有本地狀態和方法
  const {
    isDeleteMode,
    selectedDrafts,
    activeTab,
    deleteDialogOpen,
    deleteLoading,
    deleteSuccess,
    deleteError,
    favoriteTab,
    followData,
    favoriteData,
    followPage,
    favoritePage,
    followHasMore,
    favoriteHasMore,
    followLoading,
    favoriteLoading,
    followError,
    favoriteError,
    followTotalCount,
    favoriteTotalCount,
    publishedRecipes,
    draftRecipes,
    isLoadingPublished,
    isLoadingDrafts,
    error,
    loadPublishedRecipes,
    loadDraftRecipes,
    loadMore,
    atToggleDeleteMode,
    atToggleDraftSelection,
    atShowDeleteConfirm,
    atConfirmDelete,
    atDraftCardClick,
    atNewRecipe,
    handleFavoriteTabChange,
    setActiveTab,
    setDeleteDialogOpen,
    getFullImageUrl,
  } = useUserCenter({
    displayId,
    defaultTab,
  });

  // 數據標籤頁內容 - 顯示食譜統計資訊
  const renderDataContent = () => {
    if (isLoadingPublished) {
      return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (publishedRecipes.length === 0) {
      return <div className="text-center py-8">目前沒有發布的食譜</div>;
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-1">食譜數據</h3>
          <p className="text-neutral-500">深入了解您的食譜表現</p>
        </div>

        {publishedRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => (
          <div
            key={recipe.recipeId}
            className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          >
            <RecipeStatsItem
              title={recipe.title}
              imageSrc={getFullImageUrl(recipe.coverPhoto)}
              views={recipe.viewCount}
              shares={recipe.sharedCount}
              bookmarks={recipe.favoritedCount}
              comments={recipe.commentCount}
              rating={recipe.averageRating}
            />
          </div>
        ))}
      </div>
    );
  };

  // 已發布標籤頁內容
  const renderPublishedContent = () => {
    if (isLoadingPublished) {
      return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (publishedRecipes.length === 0) {
      return <div className="text-center py-8">目前沒有發布的食譜</div>;
    }

    return (
      <div className="space-y-4">
        <p className="text-neutral-500 mb-2">
          共{publishedRecipes.length || 0}篇食譜
        </p>

        {publishedRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => (
          <div
            key={recipe.recipeId}
            className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            onClick={() => router.push(`/recipe-page/${recipe.recipeId}`)}
          >
            <PublishedRecipeCard
              title={recipe.title}
              description={recipe.description}
              imageSrc={getFullImageUrl(recipe.coverPhoto)}
              likes={recipe.favoritedCount}
              comments={recipe.commentCount}
              rating={recipe.averageRating}
              recipeId={recipe.recipeId}
              onStatusChanged={loadPublishedRecipes}
            />
          </div>
        ))}
      </div>
    );
  };

  // 草稿標籤頁內容
  const renderDraftContent = () => {
    if (isLoadingDrafts) {
      return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (draftRecipes.length === 0) {
      return <div className="text-center py-8">目前沒有草稿</div>;
    }

    return (
      <div className="space-y-4">
        {deleteSuccess && (
          <div className="p-3 rounded-md bg-green-50 text-green-700 mb-4">
            {deleteSuccess}
          </div>
        )}

        {deleteError && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 mb-4">
            {deleteError}
          </div>
        )}

        <p className="text-neutral-500 mb-2">
          共{draftRecipes.length || 0}篇食譜
        </p>

        {draftRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => {
          // 計算卡片的 className
          let cardClassName =
            'hover:bg-gray-50 active:bg-gray-100 cursor-pointer rounded-md transition-all';
          if (isDeleteMode && selectedDrafts.includes(recipe.recipeId)) {
            cardClassName =
              'bg-orange-50 border border-orange-200 rounded-md cursor-pointer transition-all';
          }

          return (
            <div key={recipe.recipeId} className="flex items-center">
              {isDeleteMode && (
                <div
                  className={`mr-2 w-6 h-6 flex-shrink-0 border rounded flex items-center justify-center cursor-pointer ${
                    selectedDrafts.includes(recipe.recipeId)
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-neutral-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    atToggleDraftSelection(recipe.recipeId);
                  }}
                >
                  {selectedDrafts.includes(recipe.recipeId) && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              )}
              <div className={`flex-1 ${isDeleteMode ? 'ml-1' : ''}`}>
                <div
                  onClick={() => {
                    if (isDeleteMode) {
                      atToggleDraftSelection(recipe.recipeId);
                    } else {
                      atDraftCardClick(recipe.recipeId);
                    }
                  }}
                  className={cardClassName}
                >
                  <DraftRecipeCard
                    title={recipe.title}
                    description={recipe.description}
                    imageSrc={getFullImageUrl(recipe.coverPhoto)}
                    recipeId={recipe.recipeId}
                    isDeleteMode={isDeleteMode}
                    onStatusChanged={loadDraftRecipes}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {isDeleteMode && (
          <div className="flex justify-between mt-6 space-x-4">
            <Button
              variant="outline"
              onClick={atToggleDeleteMode}
              className="flex-1 border border-neutral-200"
            >
              {COMMON_TEXTS.CANCEL}刪除
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    if (selectedDrafts.length > 0) {
                      atShowDeleteConfirm();
                    }
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={selectedDrafts.length === 0}
                >
                  {COMMON_TEXTS.CONFIRM}
                  {COMMON_TEXTS.DELETE}
                  {selectedDrafts.length > 0
                    ? `(${selectedDrafts.length})`
                    : ''}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md bg-white rounded-lg p-6 border border-gray-200 shadow-lg"
                style={{ maxWidth: '400px' }}
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-neutral-500" />
                  </div>
                  <h2 className="text-lg font-medium text-center mb-6">
                    是否{COMMON_TEXTS.DELETE}所選食譜?
                  </h2>
                  <div className="flex justify-between w-full gap-4">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="flex-1 border border-neutral-300 text-black font-normal"
                      >
                        {COMMON_TEXTS.CANCEL}
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={atConfirmDelete}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-normal"
                      disabled={deleteLoading}
                    >
                      {deleteLoading
                        ? COMMON_TEXTS.SUBMITTING
                        : COMMON_TEXTS.CONFIRM}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  };

  // 渲染「已追蹤」標籤內容
  const renderFollowContent = () => {
    if (followLoading && followPage === 1) {
      return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
    }

    if (followError) {
      return <div className="text-center py-8 text-red-500">{followError}</div>;
    }

    if (followData.length === 0) {
      return <div className="text-center py-8">目前沒有追蹤的用戶</div>;
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-500 mb-1">
          共{followTotalCount}位追蹤中
        </p>

        {followData.map((user: UserFollowResponse['data'][0]) => (
          <div
            key={`followed-${user.id}`}
            className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            onClick={() => router.push(`/user/${user.displayId}`)}
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

        {followLoading && <div className="text-center py-4">載入更多中...</div>}

        {followHasMore && !followLoading && (
          <Button
            variant="ghost"
            className="w-full py-2 flex items-center justify-center gap-1 text-neutral-500"
            onClick={loadMore}
          >
            <span>更多追蹤</span>
          </Button>
        )}
      </div>
    );
  };

  // 渲染「已收藏」標籤內容
  const renderFavoriteContent = () => {
    if (favoriteLoading && favoritePage === 1) {
      return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
    }

    if (favoriteError) {
      return (
        <div className="text-center py-8 text-red-500">{favoriteError}</div>
      );
    }

    if (favoriteData.length === 0) {
      return <div className="text-center py-8">目前沒有收藏的食譜</div>;
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-neutral-500 mb-1">
          共{favoriteTotalCount}篇收藏食譜
        </p>

        {favoriteData.map((recipe: UserFavoriteResponse['data'][0]) => (
          <div
            key={`recipe-${recipe.id}`}
            className="flex border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => router.push(`/recipe/${recipe.displayId}`)}
          >
            <div className="w-20 h-20 bg-gray-200 shrink-0 relative">
              <Image
                src={getFullImageUrl(recipe.coverPhoto)}
                alt={recipe.recipeName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-2">
              <div className="flex justify-between">
                <h4 className="font-medium">{recipe.recipeName}</h4>
                <BookmarkIcon className="h-4 w-4" />
              </div>
              <p className="text-xs text-neutral-500 line-clamp-2">
                {recipe.description}
              </p>
              <div className="flex items-center mt-1 text-xs text-neutral-500">
                <Users className="h-3 w-3 mr-1" />
                <span className="mr-2">{recipe.portion}人份</span>
                <Clock className="h-3 w-3 mr-1" />
                <span className="mr-2">{recipe.cookingTime}</span>
                <Star className="h-3 w-3 mr-1" />
                <span>{recipe.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}

        {favoriteLoading && (
          <div className="text-center py-4">載入更多中...</div>
        )}

        {favoriteHasMore && !favoriteLoading && (
          <Button
            variant="ghost"
            className="w-full py-2 flex items-center justify-center gap-1 text-neutral-500"
            onClick={loadMore}
          >
            <span>更多收藏</span>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/" className="text-neutral-600">
          首頁
        </Link>
        <span className="text-neutral-400">{' > '}</span>
        <span className="text-neutral-800">會員中心</span>
      </div>

      {/* 用戶資料卡片 */}
      <UserProfileCard
        userName={userName}
        userAvatar={userAvatar}
        stats={[
          { label: '追蹤中', value: followingCount },
          { label: '粉絲', value: followerCount },
          { label: '收藏', value: favoritedTotal },
        ]}
        actionButton={{
          text: '編輯個人資料',
          onClick: () => router.push('/user-center-edit'),
        }}
      />

      {/* 我的食譜區 */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">我的食譜</h3>
          <RecipeActionBar
            onNewRecipe={atNewRecipe}
            onDeleteMode={atToggleDeleteMode}
          />
        </div>

        <Tabs
          value={activeTab}
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex justify-between mb-0 w-full rounded-none border-b bg-white p-0 h-auto">
            <TabsTrigger
              value="總覽"
              className={cn(
                'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              總覽
            </TabsTrigger>
            <TabsTrigger
              value="數據"
              className={cn(
                'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              數據
            </TabsTrigger>
            <TabsTrigger
              value="已發布"
              className={cn(
                'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
              </svg>
              已發布
            </TabsTrigger>
            <TabsTrigger
              value="草稿"
              className={cn(
                'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              草稿
            </TabsTrigger>
          </TabsList>
          <TabsContent value="總覽" className="mt-4 px-0">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <h4 className="font-medium mb-1">創作者總覽</h4>
                <p className="text-sm text-neutral-500 mb-4">
                  您的食譜表現情況
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-neutral-500">總瀏覽次數</div>
                    <div className="font-bold">{totalViewCount}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-neutral-500">總收讚次數</div>
                    <div className="font-bold">{favoritedTotal}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-neutral-500">平均評分</div>
                    <div className="font-bold">{averageRating.toFixed(1)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="數據" className="mt-4">
            {renderDataContent()}
          </TabsContent>
          <TabsContent value="已發布" className="mt-4">
            {renderPublishedContent()}
          </TabsContent>
          <TabsContent value="草稿" className="mt-4">
            {renderDraftContent()}
          </TabsContent>
        </Tabs>
      </div>

      {/* 我的最愛 */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-xl font-medium">我的最愛</h3>
        </div>

        <Tabs
          value={favoriteTab}
          onValueChange={handleFavoriteTabChange}
          className="w-full"
        >
          <TabsList className="flex justify-between mb-0 w-full rounded-none border-b bg-white p-0 h-auto">
            <TabsTrigger
              value="已追蹤"
              className={cn(
                'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              已追蹤
            </TabsTrigger>
            <TabsTrigger
              value="已收藏"
              className={cn(
                'flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              已收藏
            </TabsTrigger>
          </TabsList>
          <TabsContent value="已追蹤" className="mt-4 px-0">
            {renderFollowContent()}
          </TabsContent>
          <TabsContent value="已收藏" className="mt-4 px-0">
            {renderFavoriteContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
