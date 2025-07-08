import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserCenter } from '@/hooks/useUserCenter';
import { UserProfileCard } from '@/components/common';
import { RecipeActionBar } from '@/components/features';
import { DataTabContent } from './DataTabContent';
import { PublishedTabContent } from './PublishedTabContent';
import { DraftTabContent } from './DraftTabContent';
import { FollowTabContent } from './FollowTabContent';
import { FavoriteTabContent } from './FavoriteTabContent';
import {
  breadcrumbVariants,
  tabTriggerVariants,
  tabContentVariants,
  cardContainerVariants,
  statsItemVariants,
  sectionTitleVariants,
  sectionContainerVariants,
  tabsListVariants,
} from './styles';
import type { UserCenterProps } from './types';

/**
 * 用戶中心主元件
 * 提供用戶個人資料管理、食譜管理、收藏和追蹤功能
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

  // 使用 useUserCenter hook 管理所有狀態和業務邏輯
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

  return (
    <div className="bg-white p-4">
      {/* 麵包屑導航 */}
      <div className={cn(breadcrumbVariants())}>
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
      <div className={cn(sectionContainerVariants())}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={cn(sectionTitleVariants({ spacing: 'withMargin' }))}>
            我的食譜
          </h3>
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
          <TabsList className={cn(tabsListVariants())}>
            <TabsTrigger value="總覽" className={cn(tabTriggerVariants())}>
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
            <TabsTrigger value="數據" className={cn(tabTriggerVariants())}>
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
            <TabsTrigger value="已發布" className={cn(tabTriggerVariants())}>
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
            <TabsTrigger value="草稿" className={cn(tabTriggerVariants())}>
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
          <TabsContent value="總覽" className={cn(tabContentVariants())}>
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <h4 className="font-medium mb-1">創作者總覽</h4>
                <p className="text-sm text-neutral-500 mb-4">
                  您的食譜表現情況
                </p>

                <div className={cn(cardContainerVariants())}>
                  <div className={cn(statsItemVariants())}>
                    <div className="text-sm text-neutral-500">總瀏覽次數</div>
                    <div className="font-bold">{totalViewCount}</div>
                  </div>
                  <div className={cn(statsItemVariants())}>
                    <div className="text-sm text-neutral-500">總收讚次數</div>
                    <div className="font-bold">{favoritedTotal}</div>
                  </div>
                  <div className={cn(statsItemVariants())}>
                    <div className="text-sm text-neutral-500">平均評分</div>
                    <div className="font-bold">{averageRating.toFixed(1)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="數據" className={cn(tabContentVariants())}>
            <DataTabContent
              isLoadingPublished={isLoadingPublished}
              error={error}
              publishedRecipes={publishedRecipes}
              getFullImageUrl={getFullImageUrl}
            />
          </TabsContent>
          <TabsContent value="已發布" className={cn(tabContentVariants())}>
            <PublishedTabContent
              isLoadingPublished={isLoadingPublished}
              error={error}
              publishedRecipes={publishedRecipes}
              getFullImageUrl={getFullImageUrl}
              loadPublishedRecipes={loadPublishedRecipes}
            />
          </TabsContent>
          <TabsContent value="草稿" className={cn(tabContentVariants())}>
            <DraftTabContent
              isLoadingDrafts={isLoadingDrafts}
              error={error}
              draftRecipes={draftRecipes}
              isDeleteMode={isDeleteMode}
              selectedDrafts={selectedDrafts}
              deleteDialogOpen={deleteDialogOpen}
              deleteLoading={deleteLoading}
              deleteSuccess={deleteSuccess}
              deleteError={deleteError}
              getFullImageUrl={getFullImageUrl}
              loadDraftRecipes={loadDraftRecipes}
              atToggleDraftSelection={atToggleDraftSelection}
              atDraftCardClick={atDraftCardClick}
              atToggleDeleteMode={atToggleDeleteMode}
              atShowDeleteConfirm={atShowDeleteConfirm}
              atConfirmDelete={atConfirmDelete}
              setDeleteDialogOpen={setDeleteDialogOpen}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* 我的最愛區 */}
      <div className={cn(sectionContainerVariants({ spacing: 'relaxed' }))}>
        <div className="mb-4">
          <h3 className={cn(sectionTitleVariants())}>我的最愛</h3>
        </div>

        <Tabs
          value={favoriteTab}
          onValueChange={handleFavoriteTabChange}
          className="w-full"
        >
          <TabsList className={cn(tabsListVariants())}>
            <TabsTrigger value="已追蹤" className={cn(tabTriggerVariants())}>
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
            <TabsTrigger value="已收藏" className={cn(tabTriggerVariants())}>
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
          <TabsContent
            value="已追蹤"
            className={cn(tabContentVariants({ padding: 'none' }))}
          >
            <FollowTabContent
              followLoading={followLoading}
              followError={followError}
              followData={followData}
              followPage={followPage}
              followHasMore={followHasMore}
              followTotalCount={followTotalCount}
              getFullImageUrl={getFullImageUrl}
              loadMore={loadMore}
            />
          </TabsContent>
          <TabsContent
            value="已收藏"
            className={cn(tabContentVariants({ padding: 'none' }))}
          >
            <FavoriteTabContent
              favoriteLoading={favoriteLoading}
              favoriteError={favoriteError}
              favoriteData={favoriteData}
              favoritePage={favoritePage}
              favoriteHasMore={favoriteHasMore}
              favoriteTotalCount={favoriteTotalCount}
              getFullImageUrl={getFullImageUrl}
              loadMore={loadMore}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
