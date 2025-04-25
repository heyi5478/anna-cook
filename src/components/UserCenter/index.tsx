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
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import {
  fetchAuthorRecipes,
  type AuthorRecipesResponse,
  deleteMultipleRecipes,
  fetchUserFavoriteFollow,
  type UserFavoriteResponse,
  type UserFollowResponse,
} from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { RecipeStatsItem } from './RecipeStatsItem';
import { PublishedRecipeCard } from './PublishedRecipeCard';
import { DraftRecipeCard } from './DraftRecipeCard';
import { FollowedUserCard } from './FollowedUserCard';

// 獲取 API 基礎 URL
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

/**
 * 將相對路徑轉換為完整的圖片 URL
 */
const getFullImageUrl = (path: string) => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path; // 已經是完整URL
  return `${apiBaseUrl}${path}`;
};

/**
 * 映射 API 回傳的資料到元件所需的格式
 * 主要處理 id 欄位到 recipeId 的映射
 */
const mapApiRecipeData = (recipes: any[]) => {
  return recipes.map((recipe) => ({
    ...recipe,
    recipeId: recipe.id, // 確保 recipeId 欄位存在
  }));
};

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 我的最愛相關狀態
  const [favoriteTab, setFavoriteTab] = useState<'已追蹤' | '已收藏'>('已追蹤');
  const [followData, setFollowData] = useState<UserFollowResponse['data']>([]);
  const [favoriteData, setFavoriteData] = useState<
    UserFavoriteResponse['data']
  >([]);
  const [followPage, setFollowPage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);
  const [followHasMore, setFollowHasMore] = useState(false);
  const [favoriteHasMore, setFavoriteHasMore] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [followTotalCount, setFollowTotalCount] = useState(0);
  const [favoriteTotalCount, setFavoriteTotalCount] = useState(0);

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

  // 當 favoriteTab 變化時載入資料
  useEffect(() => {
    if (displayId) {
      if (favoriteTab === '已追蹤') {
        loadFollowData(1);
      } else {
        loadFavoriteData(1);
      }
    }
  }, [favoriteTab, displayId]);

  /**
   * 載入已發佈的食譜
   */
  const loadPublishedRecipes = async () => {
    try {
      setIsLoadingPublished(true);
      setError(null);

      const response = await fetchAuthorRecipes(displayId, true);
      setPublishedRecipes(mapApiRecipeData(response.data));
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
      setDraftRecipes(mapApiRecipeData(response.data));
    } catch (err) {
      console.error('載入草稿食譜失敗:', err);
      setError(err instanceof Error ? err.message : '載入草稿食譜失敗');
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  /**
   * 載入追蹤的用戶資料
   */
  const loadFollowData = async (page: number) => {
    if (!displayId) return;

    try {
      setFollowLoading(true);
      setFollowError(null);

      const response = await fetchUserFavoriteFollow(displayId, 'follow', page);

      // 型別守衛：判斷回應是否為 UserFollowResponse
      if (
        'data' in response &&
        response.data[0] &&
        'name' in response.data[0]
      ) {
        const typedResponse = response as UserFollowResponse;
        if (page === 1) {
          // 第一頁：替換全部資料
          setFollowData(typedResponse.data);
        } else {
          // 其他頁：添加到現有資料
          setFollowData((prev) => [...prev, ...typedResponse.data]);
        }
        setFollowPage(page);
        setFollowHasMore(typedResponse.hasMore);
        setFollowTotalCount(typedResponse.totalCount);
      }
    } catch (err) {
      console.error('載入追蹤的用戶失敗:', err);
      setFollowError(err instanceof Error ? err.message : '載入追蹤的用戶失敗');
    } finally {
      setFollowLoading(false);
    }
  };

  /**
   * 載入收藏的食譜資料
   */
  const loadFavoriteData = async (page: number) => {
    if (!displayId) return;

    try {
      setFavoriteLoading(true);
      setFavoriteError(null);

      const response = await fetchUserFavoriteFollow(
        displayId,
        'favorite',
        page,
      );

      // 型別守衛：判斷回應是否為 UserFavoriteResponse
      if (
        'data' in response &&
        response.data[0] &&
        'recipeName' in response.data[0]
      ) {
        const typedResponse = response as UserFavoriteResponse;
        if (page === 1) {
          // 第一頁：替換全部資料
          setFavoriteData(typedResponse.data);
        } else {
          // 其他頁：添加到現有資料
          setFavoriteData((prev) => [...prev, ...typedResponse.data]);
        }
        setFavoritePage(page);
        setFavoriteHasMore(typedResponse.hasMore);
        setFavoriteTotalCount(typedResponse.totalCount);
      }
    } catch (err) {
      console.error('載入收藏的食譜失敗:', err);
      setFavoriteError(
        err instanceof Error ? err.message : '載入收藏的食譜失敗',
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  /**
   * 載入更多追蹤的用戶或收藏的食譜
   */
  const loadMore = () => {
    if (favoriteTab === '已追蹤') {
      loadFollowData(followPage + 1);
    } else {
      loadFavoriteData(favoritePage + 1);
    }
  };

  /**
   * 處理刪除模式切換
   */
  const atToggleDeleteMode = () => {
    // 如果當前不是草稿頁籤，先切換到草稿頁籤
    if (activeTab !== '草稿') {
      setActiveTab('草稿');
    }

    // 然後切換刪除模式
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
   * 處理確認刪除對話框
   */
  const atShowDeleteConfirm = () => {
    setDeleteDialogOpen(true);
  };

  /**
   * 處理刪除所選草稿
   */
  const atConfirmDelete = async () => {
    if (selectedDrafts.length === 0) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);
      setDeleteSuccess(null);

      // 調用 API 刪除食譜
      const response = await deleteMultipleRecipes(selectedDrafts);

      // 設置成功訊息
      setDeleteSuccess(`成功刪除 ${response.deletedIds.length} 個食譜`);

      // 重新載入草稿列表
      await loadDraftRecipes();

      // 關閉刪除模式並清空選擇
      setIsDeleteMode(false);
      setSelectedDrafts([]);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('刪除食譜失敗:', err);
      setDeleteError(err instanceof Error ? err.message : '刪除食譜失敗');
    } finally {
      setDeleteLoading(false);
    }
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
          <div
            key={recipe.recipeId}
            className="hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
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

        <p className="text-gray-500 mb-2">共{draftRecipes.length || 0}篇食譜</p>

        {draftRecipes.map((recipe) => {
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
                      : 'border-gray-300'
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
              className="flex-1 border border-gray-200"
            >
              取消刪除
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
                  確認刪除
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
                    <AlertCircle className="h-6 w-6 text-gray-500" />
                  </div>
                  <h2 className="text-lg font-medium text-center mb-6">
                    是否刪除所選食譜?
                  </h2>
                  <div className="flex justify-between w-full gap-4">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="flex-1 border border-gray-300 text-black font-normal"
                      >
                        取消
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={atConfirmDelete}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-normal"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? '處理中...' : '確認'}
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

  // 處理「我的最愛」標籤切換
  const handleFavoriteTabChange = (value: string) => {
    setFavoriteTab(value as '已追蹤' | '已收藏');
  };

  // 渲染「已追蹤」標籤內容
  const renderFollowContent = () => {
    if (followLoading && followPage === 1) {
      return <div className="text-center py-8">載入中...</div>;
    }

    if (followError) {
      return <div className="text-center py-8 text-red-500">{followError}</div>;
    }

    if (followData.length === 0) {
      return <div className="text-center py-8">目前沒有追蹤的用戶</div>;
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 mb-1">
          共{followTotalCount}位追蹤中
        </p>

        {followData.map((user) => (
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
            className="w-full py-2 flex items-center justify-center gap-1 text-gray-500"
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
      return <div className="text-center py-8">載入中...</div>;
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
        <p className="text-sm text-gray-500 mb-1">
          共{favoriteTotalCount}篇收藏食譜
        </p>

        {favoriteData.map((recipe) => (
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
              <p className="text-xs text-gray-500 line-clamp-2">
                {recipe.description}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
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
            className="w-full py-2 flex items-center justify-center gap-1 text-gray-500"
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
          onClick={() => router.push('/user-center-edit')}
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
