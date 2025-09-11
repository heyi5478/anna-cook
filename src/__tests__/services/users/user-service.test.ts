import {
  fetchUserProfile,
  fetchCurrentUserProfile,
  updateUserProfile,
  fetchUserRecipes,
  followUser,
  unfollowUser,
} from '@/services/users/user-service';
// HTTP_STATUS 在測試中通過常數使用，無需匯入
import { ERROR_MESSAGES } from '@/lib/constants/messages';
import type {
  UserProfileResponse,
  CurrentUserProfileResponse,
  UpdateUserProfileResponse,
  UserRecipesResponse,
  FollowResponse,
} from '@/types/api';

// Mock 依賴
jest.mock('@/config', () => ({
  getApiConfig: () => ({
    baseUrl: 'https://api.test.com',
  }),
}));

// Mock console methods 以避免測試輸出干擾
const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();
const mockConsoleWarn = jest.fn();
console.log = mockConsoleLog;
console.error = mockConsoleError;
console.warn = mockConsoleWarn;

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// 測試資料
const mockUserProfileResponse: UserProfileResponse = {
  StatusCode: 200,
  userData: {
    userId: 1,
    displayId: 'U001',
    isFollowing: false,
    accountName: 'Test User',
    profilePhoto: '/profile.jpg',
    description: '這是測試用戶',
    recipeCount: 20,
    followerCount: 10,
  },
  authorData: {
    userId: 1,
    displayId: 'U001',
    accountName: 'Test User',
    accountEmail: 'test@example.com',
    profilePhoto: '/profile.jpg',
    description: '這是測試用戶',
    followerCount: 10,
    followingCount: 5,
    favoritedTotal: 20,
    myFavoriteCount: 15,
    averageRating: 4.5,
    totalViewCount: 100,
  },
  msg: 'success',
  newToken: 'new-token-123',
};

const mockCurrentUserProfileResponse: CurrentUserProfileResponse = {
  StatusCode: 200,
  msg: 'success',
  data: {
    userId: 1,
    displayId: 'U001',
    accountName: 'Current User',
    accountEmail: 'current@example.com',
    profilePhoto: '/current-profile.jpg',
    description: '當前登入用戶',
  },
  newToken: 'current-token-456',
};

const mockUpdateUserProfileResponse: UpdateUserProfileResponse = {
  StatusCode: 200,
  msg: '更新成功',
  data: {
    accountName: 'Updated User',
    description: '更新後的描述',
    profilePhoto: '/updated-profile.jpg',
  },
  newToken: 'updated-token-789',
};

const mockUserRecipesResponse: UserRecipesResponse = {
  statusCode: 200,
  hasMore: false,
  recipeCount: 2,
  recipes: [
    {
      recipeId: 1,
      title: '測試食譜1',
      description: '美味的測試食譜',
      portion: 2,
      cookTime: 30,
      rating: 4.8,
      coverPhoto: '/recipe1.jpg',
    },
    {
      recipeId: 2,
      title: '測試食譜2',
      description: '另一個美味食譜',
      portion: 4,
      cookTime: 45,
      rating: 4.2,
      coverPhoto: '/recipe2.jpg',
    },
  ],
};

const mockFollowResponse: FollowResponse = {
  StatusCode: 200,
  msg: '追蹤成功',
  Id: 1,
  newToken: 'follow-token-abc',
};

describe('User Service', () => {
  const originalProcessEnv = process.env;
  let mockProcessEnv: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();

    // Mock 整個 process.env 物件
    mockProcessEnv = {
      ...originalProcessEnv,
      NODE_ENV: 'test',
    } as Record<string, string>;

    Object.defineProperty(process, 'env', {
      value: mockProcessEnv,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // 還原原始的 process.env
    Object.defineProperty(process, 'env', {
      value: originalProcessEnv,
      writable: true,
      configurable: true,
    });
  });

  describe('fetchUserProfile 行為', () => {
    test('應該成功獲取用戶個人檔案', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockUserProfileResponse)),
      });

      const result = await fetchUserProfile('U001');

      expect(mockFetch).toHaveBeenCalledWith('/api/user/U001/profile', {
        method: 'GET',
        credentials: 'include',
      });
      expect(result).toEqual(mockUserProfileResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'User profile fetched successfully',
      );
    });

    test('應該正確處理不存在的用戶', async () => {
      const errorResponse: UserProfileResponse = {
        StatusCode: 404,
        msg: '用戶不存在',
        userData: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      });

      const result = await fetchUserProfile('INVALID');

      expect(result).toEqual(errorResponse);
    });

    test('應該處理無效的 JSON 回應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('Invalid JSON Response'),
      });

      await expect(fetchUserProfile('U001')).rejects.toThrow(
        '回應不是有效的 JSON: Invalid JSON Response',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '解析 JSON 失敗:',
        expect.any(Error),
      );
    });

    test('應該在網路錯誤時拋出異常', async () => {
      const networkError = new Error('Network request failed');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(fetchUserProfile('U001')).rejects.toThrow(
        'Network request failed',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取使用者資料失敗:',
        networkError,
      );
    });
  });

  describe('fetchCurrentUserProfile 行為', () => {
    test('應該成功獲取當前用戶個人檔案', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockCurrentUserProfileResponse),
      });

      const result = await fetchCurrentUserProfile();

      expect(mockFetch).toHaveBeenCalledWith('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
      });
      expect(result).toEqual(mockCurrentUserProfileResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Current user profile fetched successfully',
      );
    });

    test('應該在狀態碼錯誤時拋出異常', async () => {
      const errorResponse = {
        StatusCode: 401,
        msg: '未授權',
        data: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(errorResponse),
      });

      await expect(fetchCurrentUserProfile()).rejects.toThrow('未授權');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取當前用戶資料失敗:',
        expect.any(Error),
      );
    });

    test('應該在沒有錯誤訊息時使用預設錯誤訊息', async () => {
      const errorResponse = {
        StatusCode: 500,
        data: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(errorResponse),
      });

      await expect(fetchCurrentUserProfile()).rejects.toThrow(
        ERROR_MESSAGES.LOAD_USER_DATA_FAILED,
      );
    });

    test('應該處理 JSON 解析錯誤', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(fetchCurrentUserProfile()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('updateUserProfile 行為', () => {
    test('應該成功更新用戶個人資料', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () =>
          Promise.resolve(JSON.stringify(mockUpdateUserProfileResponse)),
      });

      const updateData = {
        accountName: 'New Name',
        description: 'New Description',
      };

      const result = await updateUserProfile(updateData);

      expect(mockFetch).toHaveBeenCalledWith('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockUpdateUserProfileResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'User profile updated successfully',
      );
    });

    test('應該正確處理含頭像的更新請求', async () => {
      const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () =>
          Promise.resolve(JSON.stringify(mockUpdateUserProfileResponse)),
      });

      const updateData = {
        accountName: 'New Name',
      };

      const result = await updateUserProfile(updateData, mockFile);

      const capturedFormData = mockFetch.mock.calls[0][1].body;
      expect(capturedFormData).toBeInstanceOf(FormData);
      expect(result).toEqual(mockUpdateUserProfileResponse);
    });

    test('應該在開發模式下記錄請求資料', async () => {
      mockProcessEnv.NODE_ENV = 'development';
      const mockFile = new File(['test'], 'test-avatar.jpg', {
        type: 'image/jpeg',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () =>
          Promise.resolve(JSON.stringify(mockUpdateUserProfileResponse)),
      });

      const updateData = {
        accountName: 'Dev Test User',
        description: 'Development testing',
      };

      await updateUserProfile(updateData, mockFile);

      expect(mockConsoleLog).toHaveBeenCalledWith('請求資料:', {
        accountName: 'Dev Test User',
        description: 'Development testing',
        profilePhoto: 'test-avatar.jpg',
      });
    });

    test('應該處理僅更新部分資料', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () =>
          Promise.resolve(JSON.stringify(mockUpdateUserProfileResponse)),
      });

      // 只更新描述
      const updateData = {
        description: 'Only description update',
      };

      const result = await updateUserProfile(updateData);

      expect(result).toEqual(mockUpdateUserProfileResponse);
    });

    test('應該在狀態碼錯誤時拋出異常', async () => {
      const errorResponse = {
        StatusCode: 400,
        msg: '資料格式錯誤',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      });

      await expect(updateUserProfile({ accountName: 'Test' })).rejects.toThrow(
        '資料格式錯誤',
      );
    });

    test('應該處理無效的 JSON 回應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('<!DOCTYPE html>'),
      });

      await expect(updateUserProfile({ accountName: 'Test' })).rejects.toThrow(
        '回應不是有效的 JSON: <!DOCTYPE html>',
      );
    });
  });

  describe('fetchUserRecipes 行為', () => {
    test('應該成功獲取用戶食譜列表', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockUserRecipesResponse)),
      });

      const result = await fetchUserRecipes('U001', 1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/user/U001/recipes?page=1',
        { method: 'GET' },
      );
      expect(result).toEqual(mockUserRecipesResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'User recipes fetched successfully',
      );
    });

    test('應該使用預設頁碼 1', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockUserRecipesResponse)),
      });

      await fetchUserRecipes('U001');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/user/U001/recipes?page=1',
        { method: 'GET' },
      );
    });

    test('應該處理 404 用戶不存在的情況', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await fetchUserRecipes('NONEXISTENT');

      expect(result).toEqual({
        statusCode: 404,
        hasMore: false,
        recipeCount: 0,
        recipes: [],
      });
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '找不到使用者 NONEXISTENT 的食譜資料',
      );
    });

    test('應該處理空回應內容', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('   '), // 空白內容
      });

      const result = await fetchUserRecipes('U001');

      expect(result).toEqual({
        statusCode: 200,
        hasMore: false,
        recipeCount: 0,
        recipes: [],
      });
      expect(mockConsoleWarn).toHaveBeenCalledWith('API 回應內容為空');
    });

    test('應該在其他 HTTP 錯誤時拋出異常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchUserRecipes('U001')).rejects.toThrow(
        'HTTP error! status: 500',
      );
    });

    test('應該處理無效的 JSON 回應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('{ invalid json }'),
      });

      await expect(fetchUserRecipes('U001')).rejects.toThrow(
        '回應不是有效的 JSON: { invalid json }',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '解析 JSON 失敗:',
        expect.any(Error),
      );
    });

    test('應該在網路錯誤時拋出異常', async () => {
      const networkError = new Error('Connection timeout');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(fetchUserRecipes('U001')).rejects.toThrow(
        'Connection timeout',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取使用者食譜失敗:',
        networkError,
      );
    });
  });

  describe('followUser 行為', () => {
    test('應該成功追蹤用戶', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockFollowResponse),
      });

      const result = await followUser(123);

      expect(mockFetch).toHaveBeenCalledWith('/api/users/123/follow', {
        method: 'POST',
        credentials: 'include',
      });
      expect(result).toEqual(mockFollowResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith('User followed successfully');
    });

    test('應該處理追蹤失敗的情況', async () => {
      const errorResponse = {
        StatusCode: 400,
        msg: '無法追蹤自己',
        Id: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(errorResponse),
      });

      const result = await followUser(123);

      expect(result).toEqual(errorResponse);
    });

    test('應該在網路錯誤時拋出異常', async () => {
      const networkError = new Error('Request failed');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(followUser(123)).rejects.toThrow('Request failed');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '追蹤使用者失敗:',
        networkError,
      );
    });

    test('應該處理 JSON 解析錯誤', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.reject(new Error('Invalid JSON response')),
      });

      await expect(followUser(123)).rejects.toThrow('Invalid JSON response');
    });
  });

  describe('unfollowUser 行為', () => {
    test('應該成功取消追蹤用戶', async () => {
      const unfollowResponse = {
        ...mockFollowResponse,
        msg: '取消追蹤成功',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(unfollowResponse),
      });

      const result = await unfollowUser(123);

      expect(mockFetch).toHaveBeenCalledWith('/api/users/123/follow', {
        method: 'DELETE',
        credentials: 'include',
      });
      expect(result).toEqual(unfollowResponse);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'User unfollowed successfully',
      );
    });

    test('應該處理取消追蹤失敗的情況', async () => {
      const errorResponse = {
        StatusCode: 400,
        msg: '用戶未在追蹤清單中',
        Id: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(errorResponse),
      });

      const result = await unfollowUser(123);

      expect(result).toEqual(errorResponse);
    });

    test('應該在網路錯誤時拋出異常', async () => {
      const networkError = new Error('Connection lost');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(unfollowUser(123)).rejects.toThrow('Connection lost');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '取消追蹤使用者失敗:',
        networkError,
      );
    });

    test('應該處理 JSON 解析錯誤', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.reject(new Error('Parse error')),
      });

      await expect(unfollowUser(123)).rejects.toThrow('Parse error');
    });
  });

  describe('錯誤處理', () => {
    test('fetchUserProfile 應該正確記錄錯誤', async () => {
      const error = new Error('Test error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(fetchUserProfile('test')).rejects.toThrow('Test error');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取使用者資料失敗:',
        error,
      );
    });

    test('fetchCurrentUserProfile 應該正確記錄錯誤', async () => {
      const error = new Error('Test error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(fetchCurrentUserProfile()).rejects.toThrow('Test error');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取當前用戶資料失敗:',
        error,
      );
    });

    test('updateUserProfile 應該正確記錄錯誤', async () => {
      const error = new Error('Test error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(updateUserProfile({})).rejects.toThrow('Test error');
      expect(mockConsoleError).toHaveBeenCalledWith('更新用戶資料失敗:', error);
    });

    test('fetchUserRecipes 應該正確記錄錯誤', async () => {
      const error = new Error('Test error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(fetchUserRecipes('test')).rejects.toThrow('Test error');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '獲取使用者食譜失敗:',
        error,
      );
    });

    test('followUser 應該正確記錄錯誤', async () => {
      const error = new Error('Test error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(followUser(1)).rejects.toThrow('Test error');
      expect(mockConsoleError).toHaveBeenCalledWith('追蹤使用者失敗:', error);
    });

    test('unfollowUser 應該正確記錄錯誤', async () => {
      const error = new Error('Test error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(unfollowUser(1)).rejects.toThrow('Test error');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '取消追蹤使用者失敗:',
        error,
      );
    });
  });
});
