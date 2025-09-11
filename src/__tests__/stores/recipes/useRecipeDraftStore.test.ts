import { renderHook, act } from '@testing-library/react';
import { useRecipeDraftStore } from '@/stores/recipes/useRecipeDraftStore';
import { fetchRecipeDraft, submitRecipeDraft } from '@/services/recipes';
import { TIME_UNITS, SERVING_UNITS, ERROR_MESSAGES } from '@/lib/constants';
import type { RecipeFormValues } from '@/components/pages/RecipeDraft/schema';
import type { Step } from '@/types/recipe';

// Mock 依賴
jest.mock('@/services/recipes');
jest.mock('@/lib/constants', () => ({
  DEFAULT_FORM_VALUES: {
    RECIPE_FORM: {
      name: '',
      description: '',
      ingredients: [],
      seasonings: [],
      tags: [],
      cookingTimeValue: '30',
      servingsValue: '2',
    },
  },
  TIME_UNITS: {
    MINUTES: 'minutes',
  },
  SERVING_UNITS: {
    PERSON: 'person',
  },
  ERROR_MESSAGES: {
    LOAD_RECIPE_DRAFT_FAILED: '載入食譜草稿失敗',
    LOAD_RECIPE_DRAFT_ERROR: '載入食譜草稿時發生錯誤',
  },
  HTTP_STATUS: {
    OK: 200,
  },
  SUCCESS_MESSAGES: {
    DRAFT_SUBMITTED: '草稿已提交',
  },
  REGEX_PATTERNS: {
    VIMEO_ID: /vimeo\.com\/(?:.*\/)?(\d+)/,
  },
}));

// Mock console methods
const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();
console.log = mockConsoleLog;
console.error = mockConsoleError;

// Mock 服務函式
const mockFetchRecipeDraft = fetchRecipeDraft as jest.MockedFunction<
  typeof fetchRecipeDraft
>;
const mockSubmitRecipeDraft = submitRecipeDraft as jest.MockedFunction<
  typeof submitRecipeDraft
>;

// 測試資料
const mockRecipeDraftData = {
  StatusCode: 200,
  msg: 'success',
  recipe: {
    id: 123,
    recipeId: 123,
    displayId: 'R123',
    recipeName: '測試食譜',
    description: '這是一個測試食譜',
    cookingTime: 30,
    portion: 2,
    coverPhoto: '/test-image.jpg',
    videoId: 'https://vimeo.com/123456789',
    isPublished: false,
  },
  ingredients: [
    {
      ingredientId: 1,
      ingredientName: '雞肉',
      ingredientAmount: 500,
      ingredientUnit: 'g',
      isFlavoring: false,
    },
    {
      ingredientId: 2,
      ingredientName: '鹽',
      ingredientAmount: 1,
      ingredientUnit: 'tsp',
      isFlavoring: true,
    },
  ],
  tags: [
    { tagId: 1, tagName: '家常菜' },
    { tagId: 2, tagName: '簡單' },
  ],
  steps: [
    {
      stepId: 1,
      stepOrder: 1,
      stepDescription: '準備食材',
      videoStart: 0,
      videoEnd: 30,
    },
    {
      stepId: 2,
      stepOrder: 2,
      stepDescription: '開始烹飪',
      videoStart: 30,
      videoEnd: 60,
    },
  ],
};

const mockSubmitResponse = {
  StatusCode: 200,
  msg: '提交成功',
};

describe('useRecipeDraftStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();

    // 重置 store 狀態
    const { result } = renderHook(() => useRecipeDraftStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('初始狀態', () => {
    test('應該返回正確的初始狀態', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      expect(result.current.loading).toBe(false);
      expect(result.current.saving).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.recipeId).toBe(null);
      expect(result.current.recipeImage).toBe(null);
      expect(result.current.recipeSteps).toEqual([]);
      expect(result.current.newTag).toBe('');
      expect(result.current.formData).toEqual({
        name: '',
        description: '',
        ingredients: [],
        seasonings: [],
        tags: [],
        cookingTimeValue: '30',
        cookingTimeUnit: TIME_UNITS.MINUTES,
        servingsValue: '2',
        servingsUnit: SERVING_UNITS.PERSON,
      });
    });
  });

  describe('基本狀態管理', () => {
    test('應該正確設置載入狀態', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);
    });

    test('應該正確設置錯誤狀態', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      act(() => {
        result.current.setError('測試錯誤');
      });

      expect(result.current.error).toBe('測試錯誤');
    });

    test('應該正確設置食譜ID', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      act(() => {
        result.current.setRecipeId(123);
      });

      expect(result.current.recipeId).toBe(123);
    });

    test('應該正確設置食譜圖片', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      act(() => {
        result.current.setRecipeImage('/test-image.jpg');
      });

      expect(result.current.recipeImage).toBe('/test-image.jpg');
    });

    test('應該正確設置食譜步驟', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const testSteps: Step[] = [
        {
          id: '1',
          description: '測試步驟',
          startTime: '0:00',
          endTime: '0:30',
        },
      ];

      act(() => {
        result.current.setRecipeSteps(testSteps);
      });

      expect(result.current.recipeSteps).toEqual(testSteps);
    });
  });

  describe('步驟管理', () => {
    test('應該正確移除指定步驟', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const testSteps: Step[] = [
        {
          id: '1',
          description: '步驟1',
          startTime: '0:00',
          endTime: '0:30',
        },
        {
          id: '2',
          description: '步驟2',
          startTime: '0:30',
          endTime: '1:00',
        },
        {
          id: '3',
          description: '步驟3',
          startTime: '1:00',
          endTime: '1:30',
        },
      ];

      act(() => {
        result.current.setRecipeSteps(testSteps);
      });

      act(() => {
        result.current.removeStep(1);
      });

      expect(result.current.recipeSteps).toHaveLength(2);
      expect(result.current.recipeSteps[0].description).toBe('步驟1');
      expect(result.current.recipeSteps[1].description).toBe('步驟3');
    });

    test('應該在移除不存在的步驟時保持步驟列表不變', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const testSteps: Step[] = [
        {
          id: '1',
          description: '步驟1',
          startTime: '0:00',
          endTime: '0:30',
        },
      ];

      act(() => {
        result.current.setRecipeSteps(testSteps);
      });

      act(() => {
        result.current.removeStep(5);
      });

      expect(result.current.recipeSteps).toHaveLength(1);
      expect(result.current.recipeSteps[0].description).toBe('步驟1');
    });
  });

  describe('標籤管理', () => {
    test('應該正確設置新標籤', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      act(() => {
        result.current.setNewTag('新標籤');
      });

      expect(result.current.newTag).toBe('新標籤');
    });

    test('應該正確添加新標籤', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const currentTags = ['標籤1', '標籤2'];

      const newTags = result.current.addTag('標籤3', currentTags);

      expect(newTags).toEqual(['標籤1', '標籤2', '標籤3']);
    });

    test('應該防止添加重複標籤', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const currentTags = ['標籤1', '標籤2'];

      const newTags = result.current.addTag('標籤1', currentTags);

      expect(newTags).toEqual(['標籤1', '標籤2']);
    });

    test('應該防止添加空標籤', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const currentTags = ['標籤1', '標籤2'];

      const newTags = result.current.addTag('', currentTags);

      expect(newTags).toEqual(['標籤1', '標籤2']);
    });

    test('應該正確移除標籤', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const currentTags = ['標籤1', '標籤2', '標籤3'];

      const newTags = result.current.removeTag('標籤2', currentTags);

      expect(newTags).toEqual(['標籤1', '標籤3']);
    });

    test('應該在移除不存在的標籤時保持標籤列表不變', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const currentTags = ['標籤1', '標籤2'];

      const newTags = result.current.removeTag('不存在的標籤', currentTags);

      expect(newTags).toEqual(['標籤1', '標籤2']);
    });
  });

  describe('表單資料管理', () => {
    test('應該正確設置表單資料', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const testFormData: RecipeFormValues = {
        name: '測試食譜',
        description: '測試描述',
        ingredients: [{ id: '1', name: '雞肉', amount: '500g' }],
        seasonings: [{ id: '2', name: '鹽', amount: '1tsp' }],
        tags: ['家常菜'],
        cookingTimeValue: '45',
        cookingTimeUnit: TIME_UNITS.MINUTES,
        servingsValue: '4',
        servingsUnit: SERVING_UNITS.PERSON,
      };

      act(() => {
        result.current.setFormData(testFormData);
      });

      expect(result.current.formData).toEqual(testFormData);
    });

    test('應該正確更新單一表單欄位', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      act(() => {
        result.current.updateFormField('name', '新食譜名稱');
      });

      expect(result.current.formData.name).toBe('新食譜名稱');
      expect(result.current.formData.description).toBe(''); // 其他欄位保持不變
    });

    test('應該正確更新複雜表單欄位', () => {
      const { result } = renderHook(() => useRecipeDraftStore());
      const newIngredients = [{ id: '1', name: '牛肉', amount: '300g' }];

      act(() => {
        result.current.updateFormField('ingredients', newIngredients);
      });

      expect(result.current.formData.ingredients).toEqual(newIngredients);
    });
  });

  describe('載入食譜草稿', () => {
    test('應該成功載入食譜草稿資料', async () => {
      mockFetchRecipeDraft.mockResolvedValueOnce(mockRecipeDraftData);

      const { result } = renderHook(() => useRecipeDraftStore());

      await act(async () => {
        await result.current.loadRecipeDraft(123);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.recipeId).toBe(123);
      expect(result.current.formData.name).toBe('測試食譜');
      expect(result.current.formData.description).toBe('這是一個測試食譜');
      expect(result.current.formData.ingredients).toHaveLength(1);
      expect(result.current.formData.seasonings).toHaveLength(1);
      expect(result.current.formData.tags).toEqual(['家常菜', '簡單']);
      expect(result.current.recipeImage).toBe('/test-image.jpg');
      expect(result.current.recipeSteps).toHaveLength(2);
    });

    test('應該在 API 錯誤時設置錯誤狀態', async () => {
      const errorResponse = {
        StatusCode: 404,
        msg: '食譜不存在',
        recipe: {} as any,
        ingredients: [],
        tags: [],
        steps: [],
      };
      mockFetchRecipeDraft.mockResolvedValueOnce(errorResponse);

      const { result } = renderHook(() => useRecipeDraftStore());

      await act(async () => {
        await result.current.loadRecipeDraft(999);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('食譜不存在');
      expect(result.current.recipeId).toBe(999);
    });

    test('應該在網路錯誤時設置錯誤狀態', async () => {
      const networkError = new Error('Network error');
      mockFetchRecipeDraft.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useRecipeDraftStore());

      await act(async () => {
        await result.current.loadRecipeDraft(123);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(ERROR_MESSAGES.LOAD_RECIPE_DRAFT_ERROR);
      expect(mockConsoleError).toHaveBeenCalledWith(
        ERROR_MESSAGES.LOAD_RECIPE_DRAFT_FAILED,
        networkError,
      );
    });

    test('應該正確提取 Vimeo ID', async () => {
      const dataWithVimeoUrl = {
        ...mockRecipeDraftData,
        recipe: {
          ...mockRecipeDraftData.recipe,
          videoId: 'https://vimeo.com/987654321',
        },
      };
      mockFetchRecipeDraft.mockResolvedValueOnce(dataWithVimeoUrl);

      const { result } = renderHook(() => useRecipeDraftStore());

      await act(async () => {
        await result.current.loadRecipeDraft(123);
      });

      expect(result.current.recipeSteps[0]).toHaveProperty(
        'vimeoId',
        '987654321',
      );
    });

    test('應該處理沒有 videoId 的情況', async () => {
      const dataWithoutVideo = {
        ...mockRecipeDraftData,
        recipe: {
          ...mockRecipeDraftData.recipe,
          videoId: undefined,
        },
      };
      mockFetchRecipeDraft.mockResolvedValueOnce(dataWithoutVideo);

      const { result } = renderHook(() => useRecipeDraftStore());

      await act(async () => {
        await result.current.loadRecipeDraft(123);
      });

      expect(result.current.recipeSteps[0]).toHaveProperty('vimeoId', '');
    });
  });

  describe('提交食譜', () => {
    test('應該成功提交食譜草稿', async () => {
      mockSubmitRecipeDraft.mockResolvedValueOnce(mockSubmitResponse);

      const { result } = renderHook(() => useRecipeDraftStore());
      const testFormData: RecipeFormValues = {
        name: '測試食譜',
        description: '測試描述',
        ingredients: [{ id: '1', name: '雞肉', amount: '500g' }],
        seasonings: [{ id: '2', name: '鹽', amount: '1tsp' }],
        tags: ['家常菜'],
        cookingTimeValue: '30',
        cookingTimeUnit: TIME_UNITS.MINUTES,
        servingsValue: '2',
        servingsUnit: SERVING_UNITS.PERSON,
      };
      const testSteps: Step[] = [
        {
          id: '1',
          description: '準備食材',
          startTime: '0:00',
          endTime: '0:30',
        },
      ];

      const submitResult = await act(async () => {
        return result.current.submitRecipe(123, testFormData, testSteps);
      });

      expect(result.current.saving).toBe(false);
      expect(submitResult.success).toBe(true);
      expect(mockSubmitRecipeDraft).toHaveBeenCalledWith(123, {
        recipeName: '測試食譜',
        recipeIntro: '測試描述',
        cookingTime: 30,
        portion: 2,
        ingredients: [
          { name: '雞肉', amount: '500g', isFlavoring: false },
          { name: '鹽', amount: '1tsp', isFlavoring: true },
        ],
        tags: ['家常菜'],
        steps: [
          { description: '準備食材', startTime: '0:00', endTime: '0:30' },
        ],
      });
    });

    test('應該在提交失敗時返回錯誤', async () => {
      const errorResponse = {
        StatusCode: 400,
        msg: '提交失敗',
      };
      mockSubmitRecipeDraft.mockResolvedValueOnce(errorResponse);

      const { result } = renderHook(() => useRecipeDraftStore());
      const testFormData: RecipeFormValues = {
        name: '測試食譜',
        description: '',
        ingredients: [],
        seasonings: [],
        tags: [],
        cookingTimeValue: '30',
        cookingTimeUnit: TIME_UNITS.MINUTES,
        servingsValue: '2',
        servingsUnit: SERVING_UNITS.PERSON,
      };

      const submitResult = await act(async () => {
        return result.current.submitRecipe(123, testFormData, []);
      });

      expect(result.current.saving).toBe(false);
      expect(result.current.error).toBe('提交失敗');
      expect(submitResult.success).toBe(false);
    });

    test('應該在網路錯誤時處理異常', async () => {
      const networkError = new Error('Network error');
      mockSubmitRecipeDraft.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useRecipeDraftStore());
      const testFormData: RecipeFormValues = {
        name: '測試食譜',
        description: '',
        ingredients: [],
        seasonings: [],
        tags: [],
        cookingTimeValue: '30',
        cookingTimeUnit: TIME_UNITS.MINUTES,
        servingsValue: '2',
        servingsUnit: SERVING_UNITS.PERSON,
      };

      const submitResult = await act(async () => {
        return result.current.submitRecipe(123, testFormData, []);
      });

      expect(result.current.saving).toBe(false);
      expect(result.current.error).toBe('提交食譜草稿時發生錯誤');
      expect(submitResult.success).toBe(false);
    });

    test('應該正確處理時間格式轉換', async () => {
      mockSubmitRecipeDraft.mockResolvedValueOnce(mockSubmitResponse);

      const { result } = renderHook(() => useRecipeDraftStore());
      const testFormData: RecipeFormValues = {
        name: '測試食譜',
        description: '',
        ingredients: [],
        seasonings: [],
        tags: [],
        cookingTimeValue: 'invalid',
        cookingTimeUnit: TIME_UNITS.MINUTES,
        servingsValue: 'invalid',
        servingsUnit: SERVING_UNITS.PERSON,
      };
      const testSteps: Step[] = [
        {
          id: '1',
          description: '測試步驟',
          startTime: 0,
          endTime: 30,
        },
      ];

      await act(async () => {
        await result.current.submitRecipe(123, testFormData, testSteps);
      });

      expect(mockSubmitRecipeDraft).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          cookingTime: 0, // 無效字串轉換為 0
          portion: 0, // 無效字串轉換為 0
          steps: [
            {
              description: '測試步驟',
              startTime: '0:00',
              endTime: '30',
            },
          ],
        }),
      );
    });
  });

  describe('工具函式', () => {
    test('應該正確格式化秒數為 MM:SS 格式', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      expect(result.current.formatTimeFromSeconds(0)).toBe('0:00');
      expect(result.current.formatTimeFromSeconds(30)).toBe('0:30');
      expect(result.current.formatTimeFromSeconds(60)).toBe('1:00');
      expect(result.current.formatTimeFromSeconds(90)).toBe('1:30');
      expect(result.current.formatTimeFromSeconds(3600)).toBe('60:00');
    });

    test('應該處理小數秒數', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      expect(result.current.formatTimeFromSeconds(30.7)).toBe('0:30');
      expect(result.current.formatTimeFromSeconds(90.9)).toBe('1:30');
    });
  });

  describe('重置狀態', () => {
    test('應該重置所有狀態到初始值', () => {
      const { result } = renderHook(() => useRecipeDraftStore());

      // 設置一些非初始值
      act(() => {
        result.current.setLoading(true);
        result.current.setError('測試錯誤');
        result.current.setRecipeId(123);
        result.current.setRecipeImage('/test.jpg');
        result.current.setNewTag('測試標籤');
      });

      // 重置狀態
      act(() => {
        result.current.reset();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.saving).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.recipeId).toBe(null);
      expect(result.current.recipeImage).toBe(null);
      expect(result.current.recipeSteps).toEqual([]);
      expect(result.current.newTag).toBe('');
      expect(result.current.formData.name).toBe('');
    });
  });
});
