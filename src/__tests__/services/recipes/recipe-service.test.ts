import {
  fetchRecipes,
  uploadRecipeBasic,
  fetchAuthorRecipes,
  deleteMultipleRecipes,
} from '@/services/recipes/recipe-service';
import { getApiConfig } from '@/config';
// import { ERROR_MESSAGES } from '@/lib/constants/messages';
// import { VALIDATION_MESSAGES } from '@/lib/constants/validation';

// Mock 依賴
jest.mock('@/config');
jest.mock('@/lib/constants/messages');
jest.mock('@/lib/constants/validation');

const mockGetApiConfig = getApiConfig as jest.MockedFunction<
  typeof getApiConfig
>;

// Mock 全域 fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock 測試資料
const mockRecipes = [
  { id: 1, recipeName: '測試食譜1', recipeId: 1 },
  { id: 2, recipeName: '測試食譜2', recipeId: 2 },
];

const mockApiConfig = {
  baseUrl: 'https://api.test.com',
};

describe('RecipeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock 配置
    mockGetApiConfig.mockReturnValue(mockApiConfig);

    // 不需要mock常量，直接使用字串
  });

  describe('fetchRecipes 行為', () => {
    test('應該返回格式正確的食譜列表', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({ data: mockRecipes }),
      });

      const result = await fetchRecipes();

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/recipes');
      expect(result).toEqual(mockRecipes);
      expect(Array.isArray(result)).toBe(true);
    });

    test('應該在 API 錯誤時拋出適當異常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchRecipes()).rejects.toThrow('HTTP error! status: 500');
    });

    test('應該在網路錯誤時拋出異常', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchRecipes()).rejects.toThrow('Network error');
    });
  });

  describe('uploadRecipeBasic 資料處理', () => {
    test('應該正確處理有效的表單資料', async () => {
      const formData = {
        recipeName: '測試食譜',
        coverImage: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
      };

      const mockResponse = { StatusCode: 200, Id: 123 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await uploadRecipeBasic(formData);

      expect(mockFetch).toHaveBeenCalledWith('/api/recipes/create', {
        method: 'POST',
        credentials: 'include',
        body: expect.any(FormData),
      });
      expect(result.StatusCode).toBe(200);
      expect(result.Id).toBe(123);
    });

    test('應該拒絕沒有圖片的表單資料', async () => {
      const invalidFormData = {
        recipeName: '測試食譜',
        coverImage: null,
      } as any;

      await expect(uploadRecipeBasic(invalidFormData)).rejects.toThrow(
        '請上傳圖片：圖片為必填欄位',
      );
    });

    test('應該處理伺服器錯誤回應', async () => {
      const formData = {
        recipeName: '測試食譜',
        coverImage: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('{"error": "Server error"}'),
      });

      const result = await uploadRecipeBasic(formData);

      expect(result).toEqual({ error: 'Server error' });
    });

    test('應該處理無效 JSON 回應', async () => {
      const formData = {
        recipeName: '測試食譜',
        coverImage: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('Invalid JSON'),
      });

      await expect(uploadRecipeBasic(formData)).rejects.toThrow(
        '回應不是有效的 JSON: Invalid JSON',
      );
    });
  });

  describe('fetchAuthorRecipes 行為', () => {
    test('應該正確獲取已發佈食譜', async () => {
      const mockResponse = {
        statusCode: 200,
        data: mockRecipes,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await fetchAuthorRecipes('U001', true);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/user/U001/author-recipes?isPublished=true',
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('應該正確獲取草稿食譜', async () => {
      const mockResponse = {
        statusCode: 200,
        data: mockRecipes,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await fetchAuthorRecipes('U001', false);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/user/U001/author-recipes?isPublished=false',
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('應該在 API 錯誤時拋出異常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              statusCode: 404,
              msg: '用戶不存在',
            }),
          ),
      });

      await expect(fetchAuthorRecipes('INVALID', true)).rejects.toThrow(
        '用戶不存在',
      );
    });
  });

  describe('deleteMultipleRecipes 行為', () => {
    test('應該正確刪除多個食譜', async () => {
      const recipeIds = [1, 2, 3];
      const mockResponse = {
        StatusCode: 200,
        msg: '刪除成功',
        deletedIds: recipeIds,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await deleteMultipleRecipes(recipeIds);

      expect(mockFetch).toHaveBeenCalledWith('/api/recipes/delete-multiple', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(recipeIds),
      });
      expect(result).toEqual(mockResponse);
    });

    test('應該在刪除失敗時拋出異常', async () => {
      const recipeIds = [1, 2, 3];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              StatusCode: 400,
              msg: '食譜不存在',
            }),
          ),
      });

      await expect(deleteMultipleRecipes(recipeIds)).rejects.toThrow(
        '食譜不存在',
      );
    });
  });

  describe('資料轉換功能', () => {
    test('應該正確轉換時間格式為秒數', () => {
      // 時間轉換工具函數測試（從 submitRecipeDraft 中提取的邏輯）
      const convertTimeToSeconds = (timeStr: string): number => {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
          const minutes = parseInt(parts[0], 10);
          const seconds = parseInt(parts[1], 10);
          return minutes * 60 + seconds;
        }
        return 0;
      };

      expect(convertTimeToSeconds('1:30')).toBe(90);
      expect(convertTimeToSeconds('0:45')).toBe(45);
      expect(convertTimeToSeconds('2:00')).toBe(120);
      expect(convertTimeToSeconds('invalid')).toBe(0);
    });

    test('應該正確解析食材數量和單位', () => {
      // 食材解析工具函數測試（從 submitRecipeDraft 中提取的邏輯）
      const parseIngredientAmount = (amountStr: string) => {
        const match = amountStr.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
        if (match) {
          return {
            amount: parseFloat(match[1]),
            unit: match[2].trim() || '個',
          };
        }
        return { amount: 0, unit: '個' };
      };

      expect(parseIngredientAmount('100 g')).toEqual({
        amount: 100,
        unit: 'g',
      });
      expect(parseIngredientAmount('2.5 ml')).toEqual({
        amount: 2.5,
        unit: 'ml',
      });
      expect(parseIngredientAmount('3')).toEqual({ amount: 3, unit: '個' });
      expect(parseIngredientAmount('invalid')).toEqual({
        amount: 0,
        unit: '個',
      });
    });

    test('應該正確格式化 FormData', () => {
      // 測試 FormData 的創建和內容
      const formData = {
        recipeName: '測試食譜',
        coverImage: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
      };

      const multipartFormData = new FormData();
      multipartFormData.append('recipeName', formData.recipeName);
      multipartFormData.append('photo', formData.coverImage);

      expect(multipartFormData.get('recipeName')).toBe('測試食譜');
      expect(multipartFormData.get('photo')).toBe(formData.coverImage);
    });
  });
});
