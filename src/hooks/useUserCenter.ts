import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AuthorRecipesResponse,
  UserFavoriteResponse,
  UserFollowResponse,
} from '@/types/api';
import {
  fetchAuthorRecipes,
  fetchUserFavoriteFollow,
  deleteMultipleRecipes,
} from '@/services/recipes';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';
import type { FavoriteTabType } from '@/components/pages/UserCenter/types';

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
 * useUserCenter Hook 參數類型
 */
interface UseUserCenterParams {
  /** 用戶顯示 ID */
  displayId: string;
  /** 預設顯示的標籤，不提供則顯示"總覽" */
  defaultTab?: string;
}

/**
 * useUserCenter Hook 返回值類型
 */
interface UseUserCenterReturn {
  // 刪除相關狀態
  isDeleteMode: boolean;
  selectedDrafts: number[];
  deleteDialogOpen: boolean;
  deleteLoading: boolean;
  deleteSuccess: string | null;
  deleteError: string | null;

  // 標籤相關狀態
  activeTab: string;

  // 我的最愛相關狀態
  favoriteTab: FavoriteTabType;
  followData: UserFollowResponse['data'];
  favoriteData: UserFavoriteResponse['data'];
  followPage: number;
  favoritePage: number;
  followHasMore: boolean;
  favoriteHasMore: boolean;
  followLoading: boolean;
  favoriteLoading: boolean;
  followError: string | null;
  favoriteError: string | null;
  followTotalCount: number;
  favoriteTotalCount: number;

  // 食譜資料狀態
  publishedRecipes: AuthorRecipesResponse['data'];
  draftRecipes: AuthorRecipesResponse['data'];
  isLoadingPublished: boolean;
  isLoadingDrafts: boolean;
  error: string | null;

  // 方法
  loadPublishedRecipes: () => Promise<void>;
  loadDraftRecipes: () => Promise<void>;
  loadFollowData: (page: number) => Promise<void>;
  loadFavoriteData: (page: number) => Promise<void>;
  loadMore: () => void;
  atToggleDeleteMode: () => void;
  atToggleDraftSelection: (recipeId: number) => void;
  atShowDeleteConfirm: () => void;
  atConfirmDelete: () => Promise<void>;
  atDraftCardClick: (id: number) => void;
  atNewRecipe: () => void;
  handleFavoriteTabChange: (value: string) => void;
  setActiveTab: (tab: string) => void;
  setDeleteDialogOpen: (open: boolean) => void;

  // 工具函數
  getFullImageUrl: (path: string) => string;
  mapApiRecipeData: (recipes: any[]) => any[];
}

/**
 * 用戶中心狀態管理自定義 Hook
 * 包含食譜載入、刪除管理、我的最愛等所有邏輯
 * @param params Hook 參數
 * @returns 所有狀態和操作方法
 */
export const useUserCenter = ({
  displayId,
  defaultTab,
}: UseUserCenterParams): UseUserCenterReturn => {
  const router = useRouter();

  // 刪除相關狀態
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 標籤相關狀態
  const [activeTab, setActiveTab] = useState(defaultTab || '總覽');

  // 我的最愛相關狀態
  const [favoriteTab, setFavoriteTab] = useState<FavoriteTabType>('已追蹤');
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
      setError(
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.LOAD_PUBLISHED_RECIPES_FAILED,
      );
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
      setError(
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.LOAD_DRAFT_RECIPES_FAILED,
      );
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
          setFollowData((prev: UserFollowResponse['data']) => [
            ...prev,
            ...typedResponse.data,
          ]);
        }
        setFollowPage(page);
        setFollowHasMore(typedResponse.hasMore);
        setFollowTotalCount(typedResponse.totalCount);
      }
    } catch (err) {
      console.error('載入追蹤的用戶失敗:', err);
      setFollowError(
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.LOAD_FOLLOWED_USERS_FAILED,
      );
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
          setFavoriteData((prev: UserFavoriteResponse['data']) => [
            ...prev,
            ...typedResponse.data,
          ]);
        }
        setFavoritePage(page);
        setFavoriteHasMore(typedResponse.hasMore);
        setFavoriteTotalCount(typedResponse.totalCount);
      }
    } catch (err) {
      console.error('載入收藏的食譜失敗:', err);
      setFavoriteError(
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.LOAD_FAVORITE_RECIPES_FAILED,
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
      setDeleteSuccess(
        `成功${COMMON_TEXTS.DELETE} ${response.deletedIds.length} 個食譜`,
      );

      // 重新載入草稿列表
      await loadDraftRecipes();

      // 關閉刪除模式並清空選擇
      setIsDeleteMode(false);
      setSelectedDrafts([]);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('刪除食譜失敗:', err);
      setDeleteError(
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.DELETE_MULTIPLE_RECIPES_FAILED,
      );
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

  /**
   * 處理「我的最愛」標籤切換
   */
  const handleFavoriteTabChange = (value: string) => {
    setFavoriteTab(value as FavoriteTabType);
  };

  return {
    // 刪除相關狀態
    isDeleteMode,
    selectedDrafts,
    deleteDialogOpen,
    deleteLoading,
    deleteSuccess,
    deleteError,

    // 標籤相關狀態
    activeTab,

    // 我的最愛相關狀態
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

    // 食譜資料狀態
    publishedRecipes,
    draftRecipes,
    isLoadingPublished,
    isLoadingDrafts,
    error,

    // 方法
    loadPublishedRecipes,
    loadDraftRecipes,
    loadFollowData,
    loadFavoriteData,
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

    // 工具函數
    getFullImageUrl,
    mapApiRecipeData,
  };
};
