import { renderHook, waitFor, act } from '@testing-library/react';
import { useUserCenter } from '@/hooks/useUserCenter';
import {
  fetchAuthorRecipes,
  fetchUserFavoriteFollow,
  deleteMultipleRecipes,
} from '@/services/recipes';

// Mock 外部依賴
const mockRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    pathname: '/user-center',
  }),
}));
jest.mock('@/services/recipes');
const mockFetchAuthorRecipes = fetchAuthorRecipes as jest.MockedFunction<
  typeof fetchAuthorRecipes
>;
const mockFetchUserFavoriteFollow =
  fetchUserFavoriteFollow as jest.MockedFunction<
    typeof fetchUserFavoriteFollow
  >;
const mockDeleteMultipleRecipes = deleteMultipleRecipes as jest.MockedFunction<
  typeof deleteMultipleRecipes
>;

// Mock 路由推送函數已在上面定義

// Mock 測試資料
const mockPublishedRecipes = [
  {
    id: 1,
    recipeId: 1,
    title: '測試食譜1',
    description: '測試描述1',
    isPublished: true,
    sharedCount: 0,
    rating: 5,
    viewCount: 100,
    averageRating: 4.5,
    commentCount: 10,
    favoritedCount: 5,
    coverPhoto: '/test1.jpg',
  },
  {
    id: 2,
    recipeId: 2,
    title: '測試食譜2',
    description: '測試描述2',
    isPublished: true,
    sharedCount: 0,
    rating: 4,
    viewCount: 80,
    averageRating: 4.0,
    commentCount: 8,
    favoritedCount: 3,
    coverPhoto: '/test2.jpg',
  },
  {
    id: 3,
    recipeId: 3,
    title: '測試食譜3',
    description: '測試描述3',
    isPublished: true,
    sharedCount: 0,
    rating: 5,
    viewCount: 120,
    averageRating: 4.8,
    commentCount: 12,
    favoritedCount: 8,
    coverPhoto: '/test3.jpg',
  },
];

const mockDraftRecipes = [
  {
    id: 4,
    recipeId: 4,
    title: '草稿食譜1',
    description: '草稿描述1',
    isPublished: false,
    sharedCount: 0,
    rating: 0,
    viewCount: 0,
    averageRating: 0,
    commentCount: 0,
    favoritedCount: 0,
    coverPhoto: '/draft1.jpg',
  },
  {
    id: 5,
    recipeId: 5,
    title: '草稿食譜2',
    description: '草稿描述2',
    isPublished: false,
    sharedCount: 0,
    rating: 0,
    viewCount: 0,
    averageRating: 0,
    commentCount: 0,
    favoritedCount: 0,
    coverPhoto: '/draft2.jpg',
  },
];

const mockFollowData = [
  {
    id: 1,
    displayId: 'U001',
    name: '用戶A',
    profilePhoto: '/userA.jpg',
    description: '用戶A的描述',
    followedUserRecipeCount: 5,
    followedUserFollowerCount: 10,
  },
  {
    id: 2,
    displayId: 'U002',
    name: '用戶B',
    profilePhoto: '/userB.jpg',
    description: '用戶B的描述',
    followedUserRecipeCount: 3,
    followedUserFollowerCount: 7,
  },
];

const mockFavoriteData = [
  {
    id: 1,
    displayId: 'U001',
    recipeName: '收藏食譜1',
    description: '收藏描述1',
    portion: 2,
    cookingTime: '30',
    rating: 5,
    coverPhoto: '/favorite1.jpg',
  },
  {
    id: 2,
    displayId: 'U002',
    recipeName: '收藏食譜2',
    description: '收藏描述2',
    portion: 4,
    cookingTime: '45',
    rating: 4,
    coverPhoto: '/favorite2.jpg',
  },
];

describe('useUserCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 重置路由 mock
    jest.clearAllMocks();

    // 設置預設的 API Mock 回應
    mockFetchAuthorRecipes.mockResolvedValue({
      data: mockPublishedRecipes,
      statusCode: 200,
      totalCount: 3,
    });

    mockFetchUserFavoriteFollow.mockResolvedValue({
      StatusCode: 200,
      msg: '獲取成功',
      data: mockFollowData,
      hasMore: false,
      totalCount: 2,
    });

    mockDeleteMultipleRecipes.mockResolvedValue({
      StatusCode: 200,
      msg: '刪除成功',
      deletedIds: [1, 2],
    });
  });

  describe('初始狀態', () => {
    test('應該返回正確的初始狀態', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      expect(result.current.isDeleteMode).toBe(false);
      expect(result.current.activeTab).toBe('總覽');
      expect(result.current.selectedDrafts).toEqual([]);
      expect(result.current.deleteDialogOpen).toBe(false);
      expect(result.current.deleteLoading).toBe(false);
      expect(result.current.deleteSuccess).toBe(null);
      expect(result.current.deleteError).toBe(null);
      expect(result.current.favoriteTab).toBe('已追蹤');
      expect(result.current.publishedRecipes).toEqual([]);
      expect(result.current.draftRecipes).toEqual([]);
      expect(result.current.isLoadingPublished).toBe(false);
      expect(result.current.isLoadingDrafts).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('應該使用提供的預設標籤', () => {
      const { result } = renderHook(() =>
        useUserCenter({ displayId: 'U001', defaultTab: '已發布' }),
      );

      expect(result.current.activeTab).toBe('已發布');
    });
  });

  describe('食譜載入行為', () => {
    test('應該成功載入已發佈食譜資料', async () => {
      const { result } = renderHook(() =>
        useUserCenter({ displayId: 'U001', defaultTab: '已發布' }),
      );

      await waitFor(() => {
        expect(result.current.isLoadingPublished).toBe(false);
        expect(result.current.publishedRecipes).toHaveLength(3);
        expect(result.current.publishedRecipes[0]).toHaveProperty(
          'recipeId',
          1,
        );
      });
    });

    test('應該成功載入草稿食譜資料', async () => {
      mockFetchAuthorRecipes.mockResolvedValue({
        data: mockDraftRecipes,
        statusCode: 200,
        totalCount: 2,
      });

      const { result } = renderHook(() =>
        useUserCenter({ displayId: 'U001', defaultTab: '草稿' }),
      );

      await waitFor(() => {
        expect(result.current.isLoadingDrafts).toBe(false);
        expect(result.current.draftRecipes).toHaveLength(2);
      });
    });

    test('應該在載入已發佈食譜失敗時顯示錯誤訊息', async () => {
      mockFetchAuthorRecipes.mockRejectedValue(new Error('網路錯誤'));

      const { result } = renderHook(() =>
        useUserCenter({ displayId: 'U001', defaultTab: '已發布' }),
      );

      await waitFor(() => {
        expect(result.current.error).toBe('網路錯誤');
        expect(result.current.isLoadingPublished).toBe(false);
      });
    });

    test('應該在載入草稿食譜失敗時顯示錯誤訊息', async () => {
      mockFetchAuthorRecipes.mockRejectedValue(new Error('載入失敗'));

      const { result } = renderHook(() =>
        useUserCenter({ displayId: 'U001', defaultTab: '草稿' }),
      );

      await waitFor(() => {
        expect(result.current.error).toBe('載入失敗');
        expect(result.current.isLoadingDrafts).toBe(false);
      });
    });
  });

  describe('刪除功能行為', () => {
    test('應該正確切換刪除模式狀態', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atToggleDeleteMode();
      });

      expect(result.current.isDeleteMode).toBe(true);
      expect(result.current.activeTab).toBe('草稿');
      expect(result.current.selectedDrafts).toEqual([]);
    });

    test('應該正確管理選中的草稿項目', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atToggleDraftSelection(1);
      });
      expect(result.current.selectedDrafts).toContain(1);

      act(() => {
        result.current.atToggleDraftSelection(2);
      });
      expect(result.current.selectedDrafts).toEqual([1, 2]);

      act(() => {
        result.current.atToggleDraftSelection(1);
      });
      expect(result.current.selectedDrafts).toEqual([2]);
    });

    test('應該正確顯示刪除確認對話框', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atShowDeleteConfirm();
      });

      expect(result.current.deleteDialogOpen).toBe(true);
    });

    test('應該成功執行批次刪除', async () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      // 選中項目
      act(() => {
        result.current.atToggleDraftSelection(1);
        result.current.atToggleDraftSelection(2);
      });

      await act(async () => {
        await result.current.atConfirmDelete();
      });

      expect(result.current.deleteLoading).toBe(false);
      expect(result.current.deleteSuccess).toContain('成功刪除');
      expect(result.current.selectedDrafts).toEqual([]);
      expect(result.current.isDeleteMode).toBe(false);
      expect(result.current.deleteDialogOpen).toBe(false);
    });

    test('應該在刪除失敗時顯示錯誤訊息', async () => {
      mockDeleteMultipleRecipes.mockRejectedValue(new Error('刪除失敗'));

      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atToggleDraftSelection(1);
      });

      await act(async () => {
        await result.current.atConfirmDelete();
      });

      expect(result.current.deleteError).toBe('刪除失敗');
      expect(result.current.deleteLoading).toBe(false);
    });

    test('應該在沒有選中項目時不執行刪除', async () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      await act(async () => {
        await result.current.atConfirmDelete();
      });

      expect(mockDeleteMultipleRecipes).not.toHaveBeenCalled();
    });
  });

  describe('頁面導航行為', () => {
    test('應該在非刪除模式下導航到食譜編輯頁面', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atDraftCardClick(123);
      });

      expect(mockRouterPush).toHaveBeenCalledWith('/recipe-draft?recipeId=123');
    });

    test('應該在刪除模式下不導航', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atToggleDeleteMode();
      });

      // 重置 mock 以清除之前測試的調用記錄
      mockRouterPush.mockClear();

      act(() => {
        result.current.atDraftCardClick(123);
      });

      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    test('應該導航到新增食譜頁面', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.atNewRecipe();
      });

      expect(mockRouterPush).toHaveBeenCalledWith('/create-recipe');
    });
  });

  describe('我的最愛功能行為', () => {
    test('應該正確切換我的最愛標籤', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.handleFavoriteTabChange('已收藏');
      });

      expect(result.current.favoriteTab).toBe('已收藏');
    });

    test('應該載入追蹤用戶資料', async () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      await waitFor(() => {
        expect(result.current.followData).toHaveLength(2);
        expect(result.current.followLoading).toBe(false);
      });
    });

    test('應該載入收藏食譜資料', async () => {
      mockFetchUserFavoriteFollow.mockResolvedValue({
        StatusCode: 200,
        msg: '獲取成功',
        data: mockFavoriteData,
        hasMore: false,
        totalCount: 2,
      });

      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      act(() => {
        result.current.handleFavoriteTabChange('已收藏');
      });

      await waitFor(() => {
        expect(result.current.favoriteData).toHaveLength(2);
        expect(result.current.favoriteLoading).toBe(false);
      });
    });
  });

  describe('工具函數', () => {
    test('應該提供 getFullImageUrl 工具函數', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      expect(typeof result.current.getFullImageUrl).toBe('function');
    });

    test('應該提供 mapApiRecipeData 工具函數', () => {
      const { result } = renderHook(() => useUserCenter({ displayId: 'U001' }));

      expect(typeof result.current.mapApiRecipeData).toBe('function');
    });
  });
});
