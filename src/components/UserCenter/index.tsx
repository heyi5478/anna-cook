import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Plus,
  BookmarkIcon,
  Users,
  Clock,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { fetchAuthorRecipes, type AuthorRecipesResponse } from '@/services/api';
import { RecipeStatsItem } from './RecipeStatsItem';
import { PublishedRecipeCard } from './PublishedRecipeCard';
import { DraftRecipeCard } from './DraftRecipeCard';
import { FollowedUserCard } from './FollowedUserCard';

/**
 * 顯示單一食譜卡片元件
 */
function RecipeCard() {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <div className="w-20 h-20 bg-gray-200 shrink-0 relative">
        <Image
          src="/placeholder.svg"
          alt="食譜縮圖"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 p-2">
        <div className="flex justify-between">
          <h4 className="font-medium">馬鈴薯烤蛋</h4>
          <BookmarkIcon className="h-4 w-4" />
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          食譜故事說明食譜故事說明食譜故事說明...
        </p>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <Users className="h-3 w-3 mr-1" />
          <span className="mr-2">2人份</span>
          <Clock className="h-3 w-3 mr-1" />
          <span className="mr-2">30分鐘</span>
          <Star className="h-3 w-3 mr-1" />
          <span>4.3</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 用戶中心元件
 * @param defaultTab 預設顯示的標籤，不提供則顯示"總覽"
 * @param userProfileData 用戶資料，包含用戶基本資訊及作者數據
 */
interface UserCenterProps {
  defaultTab?: string;
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
}

export default function UserCenter({
  defaultTab,
  userProfileData,
}: UserCenterProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState(defaultTab || '總覽');
  const router = useRouter();

  // 食譜資料狀態
  const [publishedRecipes, setPublishedRecipes] = useState<
    AuthorRecipesResponse['data']
  >([]);
  const [draftRecipes, setDraftRecipes] = useState<
    AuthorRecipesResponse['data']
  >([]);
  const [isLoadingPublished, setIsLoadingPublished] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // 當URL參數變化時更新activeTab
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // 當標籤變化時，根據不同的標籤載入相應的數據
  useEffect(() => {
    if (displayId) {
      if (activeTab === '已發布' || activeTab === '數據') {
        loadPublishedRecipes();
      }
      if (activeTab === '草稿') {
        loadDraftRecipes();
      }
    }
  }, [activeTab, displayId]);

  /**
   * 載入已發佈的食譜
   */
  const loadPublishedRecipes = async () => {
    try {
      setIsLoadingPublished(true);
      setError(null);

      const response = await fetchAuthorRecipes(displayId, true);
      setPublishedRecipes(response.data);
    } catch (err) {
      console.error('載入已發佈食譜失敗:', err);
      setError(err instanceof Error ? err.message : '載入已發佈食譜失敗');
    } finally {
      setIsLoadingPublished(false);
    }
  };

  /**
   * 載入草稿食譜
   */
  const loadDraftRecipes = async () => {
    try {
      setIsLoadingDrafts(true);
      setError(null);

      const response = await fetchAuthorRecipes(displayId, false);
      setDraftRecipes(response.data);
    } catch (err) {
      console.error('載入草稿食譜失敗:', err);
      setError(err instanceof Error ? err.message : '載入草稿食譜失敗');
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  /**
   * 處理刪除模式切換
   */
  const atToggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setSelectedDrafts([]);
  };

  /**
   * 處理草稿選擇狀態變更
   */
  const atToggleDraftSelection = (recipeId: number) => {
    setSelectedDrafts((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  };

  /**
   * 處理刪除所選草稿
   */
  const atConfirmDelete = () => {
    // 實際應用中這裡會呼叫API刪除選中的草稿
    console.log('刪除草稿：', selectedDrafts);
    setIsDeleteMode(false);
    setSelectedDrafts([]);
  };

  /**
   * 處理食譜草稿卡片點擊事件
   */
  const atDraftCardClick = (id: number) => {
    if (!isDeleteMode) {
      router.push(`/recipe-draft?recipeId=${id}`);
    }
  };

  /**
   * 轉到新增食譜頁面
   */
  const atNewRecipe = () => {
    router.push('/create-recipe');
  };

  // 數據標籤頁內容 - 顯示食譜統計資訊
  const renderDataContent = () => {
    if (isLoadingPublished) {
      return <div className="text-center py-8">載入中...</div>;
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
          <p className="text-gray-500">深入了解您的食譜表現</p>
        </div>

        {publishedRecipes.map((recipe) => (
          <RecipeStatsItem
            key={recipe.recipeId}
            title={recipe.title}
            imageSrc={recipe.coverPhoto}
            views={recipe.viewCount}
            shares={recipe.sharedCount}
            bookmarks={recipe.favoritedCount}
            comments={recipe.commentCount}
            rating={recipe.averageRating}
          />
        ))}
      </div>
    );
  };

  // 已發布標籤頁內容
  const renderPublishedContent = () => {
    if (isLoadingPublished) {
      return <div className="text-center py-8">載入中...</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (publishedRecipes.length === 0) {
      return <div className="text-center py-8">目前沒有發布的食譜</div>;
    }

    return (
      <div className="space-y-4">
        <p className="text-gray-500 mb-2">
          共{publishedRecipes.length || 0}篇食譜
        </p>

        {publishedRecipes.map((recipe) => (
          <PublishedRecipeCard
            key={recipe.recipeId}
            title={recipe.title}
            description={recipe.description}
            imageSrc={recipe.coverPhoto}
            likes={recipe.favoritedCount}
            comments={recipe.commentCount}
            rating={recipe.averageRating}
          />
        ))}
      </div>
    );
  };

  // 草稿標籤頁內容
  const renderDraftContent = () => {
    if (isLoadingDrafts) {
      return <div className="text-center py-8">載入中...</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (draftRecipes.length === 0) {
      return <div className="text-center py-8">目前沒有草稿</div>;
    }

    return (
      <div className="space-y-4">
        <p className="text-gray-500 mb-2">共{draftRecipes.length || 0}篇食譜</p>

        {draftRecipes.map((recipe) => (
          <div key={recipe.recipeId} className="flex items-center">
            {isDeleteMode && (
              <div
                className={`mr-2 w-6 h-6 flex-shrink-0 border rounded flex items-center justify-center cursor-pointer ${
                  selectedDrafts.includes(recipe.recipeId)
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-300'
                }`}
                onClick={() => atToggleDraftSelection(recipe.recipeId)}
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
                onClick={() =>
                  !isDeleteMode && atDraftCardClick(recipe.recipeId)
                }
              >
                <DraftRecipeCard
                  title={recipe.title}
                  description={recipe.description}
                  imageSrc={recipe.coverPhoto}
                />
              </div>
            </div>
          </div>
        ))}

        {isDeleteMode && (
          <div className="flex justify-between mt-6 space-x-4">
            <Button
              variant="outline"
              onClick={atToggleDeleteMode}
              className="flex-1 border border-gray-200"
            >
              取消刪除
            </Button>
            <Button
              variant="destructive"
              onClick={atConfirmDelete}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={selectedDrafts.length === 0}
            >
              確認刪除
              {selectedDrafts.length > 0 ? `(${selectedDrafts.length})` : ''}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/" className="text-gray-600">
          首頁
        </Link>
        <span className="text-gray-400">{' > '}</span>
        <span className="text-gray-800">食譜中心</span>
      </div>

      <div className="flex flex-col items-center pb-4">
        <Avatar className="w-16 h-16 mb-2">
          <AvatarImage src={userAvatar} alt={`${userName}的頭像`} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">{userName}</h2>

        <div className="flex justify-center gap-6 my-2 text-sm text-gray-500">
          <div className="text-center">
            <div>{followingCount}</div>
            <div>追蹤中</div>
          </div>
          <div className="text-center">
            <div>{followerCount}</div>
            <div>粉絲</div>
          </div>
          <div className="text-center">
            <div>{favoritedTotal}</div>
            <div>收藏</div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-2 rounded-lg font-normal text-gray-700"
        >
          編輯個人資料
        </Button>
      </div>

      {/* 我的食譜區 */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">我的食譜</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-lg flex items-center gap-1 bg-white font-normal"
              onClick={atNewRecipe}
            >
              <Plus className="h-5 w-5" />
              <span>新增</span>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-lg flex items-center gap-1 bg-white font-normal"
              onClick={atToggleDeleteMode}
            >
              <Trash2 className="h-5 w-5" />
              <span>刪除草稿</span>
            </Button>
          </div>
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
                <p className="text-sm text-gray-500 mb-4">您的食譜表現情況</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">總瀏覽次數</div>
                    <div className="font-bold">{totalViewCount}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">總收讚次數</div>
                    <div className="font-bold">{favoritedTotal}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">平均評分</div>
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

        <Tabs defaultValue="已追蹤" className="w-full">
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
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-1">
                共{followingCount}位追蹤中
              </p>

              {[1, 2, 3].map((item) => (
                <FollowedUserCard key={item} />
              ))}

              <Button
                variant="ghost"
                className="w-full py-2 flex items-center justify-center gap-1 text-gray-500"
              >
                <span>更多追蹤</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="已收藏" className="mt-4 px-0">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-1">
                共{authorData?.myFavoriteCount || 0}篇收藏食譜
              </p>

              {[1, 2, 3].map((item) => (
                <RecipeCard key={item} />
              ))}

              <Button
                variant="ghost"
                className="w-full py-2 flex items-center justify-center gap-1 text-gray-500"
              >
                <span>更多收藏</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
