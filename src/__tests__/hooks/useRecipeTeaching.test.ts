import { renderHook, waitFor } from '@testing-library/react';
import { useRecipeTeaching } from '@/hooks/useRecipeTeaching';
import { fetchRecipeTeaching } from '@/services/recipes';
import { HTTP_STATUS } from '@/lib/constants';

// Mock services
jest.mock('@/services/recipes', () => ({
  fetchRecipeTeaching: jest.fn(),
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

// Mock console
const originalConsoleError = console.error;

describe('useRecipeTeaching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('初始狀態和基本行為', () => {
    // 測試初始狀態
    test('應該返回初始狀態', () => {
      const { result } = renderHook(() => useRecipeTeaching());

      expect(result.current).toEqual({
        teachingData: null,
        steps: [],
        videoId: '',
        loading: true,
        error: null,
      });
    });

    // 測試無 recipeId 時不發送請求
    test('應該在沒有 recipeId 時不發送 API 請求', async () => {
      const { result } = renderHook(() => useRecipeTeaching());

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      expect(fetchRecipeTeaching).not.toHaveBeenCalled();
      expect(result.current).toEqual({
        teachingData: null,
        steps: [],
        videoId: '',
        loading: true,
        error: null,
      });
    });

    // 測試 recipeId 為 0 時不發送請求
    test('應該在 recipeId 為 0 時不發送 API 請求', async () => {
      const { result } = renderHook(() => useRecipeTeaching(0));

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      expect(fetchRecipeTeaching).not.toHaveBeenCalled();
    });
  });

  describe('成功獲取教學資訊', () => {
    // 測試成功獲取完整教學資訊
    test('應該成功獲取教學資訊並設置所有狀態', async () => {
      const mockTeachingData = {
        recipeId: 1,
        recipeName: '測試食譜',
        video: '/videos/123456',
        steps: [
          {
            id: 1,
            description: '步驟 1',
            stepOrder: 1,
            startTime: 0,
            endTime: 30,
          },
          {
            id: 2,
            description: '步驟 2',
            stepOrder: 2,
            startTime: 30,
            endTime: 60,
          },
        ],
      };

      const mockResponse = {
        StatusCode: HTTP_STATUS.OK,
        data: mockTeachingData,
        msg: '成功',
      };

      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchRecipeTeaching).toHaveBeenCalledWith(1);
      expect(result.current).toEqual({
        teachingData: mockTeachingData,
        steps: mockTeachingData.steps,
        videoId: '123456',
        loading: false,
        error: null,
      });
    });

    // 測試無視頻時的處理
    test('應該處理沒有視頻的教學資訊', async () => {
      const mockTeachingData = {
        recipeId: 1,
        recipeName: '測試食譜',
        video: null,
        steps: [
          {
            id: 1,
            description: '步驟 1',
            stepOrder: 1,
            startTime: 0,
            endTime: 30,
          },
        ],
      };

      const mockResponse = {
        StatusCode: HTTP_STATUS.OK,
        data: mockTeachingData,
        msg: '成功',
      };

      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.videoId).toBe('');
      expect(result.current.teachingData).toEqual(mockTeachingData);
    });
  });

  describe('視頻 ID 解析', () => {
    const createMockResponse = (videoPath: string) => ({
      StatusCode: HTTP_STATUS.OK,
      data: {
        recipeId: 1,
        recipeName: '測試食譜',
        video: videoPath,
        steps: [],
      },
      msg: '成功',
    });

    // 測試從路徑提取視頻 ID
    test('應該從視頻路徑 "/videos/123456" 提取視頻 ID', async () => {
      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(
        createMockResponse('/videos/123456'),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.videoId).toBe('123456');
    });

    // 測試從 Vimeo URL 提取視頻 ID
    test('應該從 Vimeo URL 提取視頻 ID', async () => {
      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(
        createMockResponse('https://vimeo.com/789012'),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.videoId).toBe('789012');
    });

    // 測試從帶斜線結尾的路徑提取視頻 ID
    test('應該從帶斜線結尾的路徑提取視頻 ID', async () => {
      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(
        createMockResponse('/videos/456789/'),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.videoId).toBe('456789');
    });

    // 測試無法提取視頻 ID 時使用完整路徑
    test('應該在無法提取視頻 ID 時使用完整路徑', async () => {
      const customVideoPath = 'custom-video-path';
      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(
        createMockResponse(customVideoPath),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.videoId).toBe(customVideoPath);
    });

    // 測試複雜的 Vimeo URL
    test('應該從複雜的 Vimeo URL 提取視頻 ID', async () => {
      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(
        createMockResponse('https://player.vimeo.com/video/987654?h=abcd1234'),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // 根據目前的正則表達式，player.vimeo.com/video/ 格式不會被匹配
      // 所以會使用完整路徑作為 videoId
      expect(result.current.videoId).toBe(
        'https://player.vimeo.com/video/987654?h=abcd1234',
      );
    });
  });

  describe('錯誤處理', () => {
    // 測試 API 返回非成功狀態碼
    test('應該處理 API 返回的錯誤狀態碼', async () => {
      const mockResponse = {
        StatusCode: HTTP_STATUS.BAD_REQUEST,
        data: null,
        msg: '請求參數錯誤',
      };

      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toEqual({
        teachingData: null,
        steps: [],
        videoId: '',
        loading: false,
        error: '請求參數錯誤',
      });
    });

    // 測試 API 返回成功但無資料
    test('應該處理 API 返回成功但無資料的情況', async () => {
      const mockResponse = {
        StatusCode: HTTP_STATUS.OK,
        data: null,
        msg: '無資料',
      };

      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('無資料');
    });

    // 測試 API 返回錯誤但無訊息
    test('應該處理 API 返回錯誤但無訊息的情況', async () => {
      const mockResponse = {
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: null,
        msg: '',
      };

      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('無法加載教學資訊');
    });

    // 測試網路錯誤
    test('應該處理網路錯誤', async () => {
      const networkError = new Error('Network Error');
      (fetchRecipeTeaching as jest.Mock).mockRejectedValue(networkError);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        '獲取教學資訊失敗:',
        networkError,
      );
      expect(result.current).toEqual({
        teachingData: null,
        steps: [],
        videoId: '',
        loading: false,
        error: '無法加載教學資訊，請稍後再試',
      });
    });

    // 測試 API 拋出異常
    test('應該處理 API 拋出的異常', async () => {
      const apiError = new Error('API Server Error');
      (fetchRecipeTeaching as jest.Mock).mockRejectedValue(apiError);

      const { result } = renderHook(() => useRecipeTeaching(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith('獲取教學資訊失敗:', apiError);
      expect(result.current.error).toBe('無法加載教學資訊，請稍後再試');
    });
  });

  describe('依賴變更處理', () => {
    // 測試 recipeId 變更時重新獲取資料
    test('應該在 recipeId 變更時重新獲取資料', async () => {
      const mockResponse1 = {
        StatusCode: HTTP_STATUS.OK,
        data: {
          recipeId: 1,
          recipeName: '食譜 1',
          video: '/videos/111',
          steps: [
            {
              id: 1,
              description: '步驟 1',
              stepOrder: 1,
              startTime: 0,
              endTime: 30,
            },
          ],
        },
        msg: '成功',
      };

      const mockResponse2 = {
        StatusCode: HTTP_STATUS.OK,
        data: {
          recipeId: 2,
          recipeName: '食譜 2',
          video: '/videos/222',
          steps: [
            {
              id: 2,
              description: '步驟 2',
              stepOrder: 1,
              startTime: 0,
              endTime: 45,
            },
          ],
        },
        msg: '成功',
      };

      (fetchRecipeTeaching as jest.Mock)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const { result, rerender } = renderHook(
        ({ recipeId }) => useRecipeTeaching(recipeId),
        { initialProps: { recipeId: 1 } },
      );

      // 等待第一次請求完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchRecipeTeaching).toHaveBeenCalledWith(1);
      expect(result.current.teachingData?.recipeName).toBe('食譜 1');
      expect(result.current.videoId).toBe('111');

      // 變更 recipeId
      rerender({ recipeId: 2 });

      // 應該重新開始載入
      expect(result.current.loading).toBe(true);

      // 等待第二次請求完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchRecipeTeaching).toHaveBeenCalledWith(2);
      expect(fetchRecipeTeaching).toHaveBeenCalledTimes(2);
      expect(result.current.teachingData?.recipeName).toBe('食譜 2');
      expect(result.current.videoId).toBe('222');
    });

    // 測試從有效 recipeId 變更為無效 recipeId
    test('應該在從有效 recipeId 變更為無效 recipeId 時停止請求', async () => {
      const mockResponse = {
        StatusCode: HTTP_STATUS.OK,
        data: {
          recipeId: 1,
          recipeName: '食譜 1',
          video: '/videos/111',
          steps: [],
        },
        msg: '成功',
      };

      (fetchRecipeTeaching as jest.Mock).mockResolvedValue(mockResponse);

      const { result, rerender } = renderHook(
        ({ recipeId }) => useRecipeTeaching(recipeId),
        { initialProps: { recipeId: 1 } },
      );

      // 等待第一次請求完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchRecipeTeaching).toHaveBeenCalledWith(1);
      expect(fetchRecipeTeaching).toHaveBeenCalledTimes(1);

      // 變更為無效的 recipeId
      rerender({ recipeId: 0 });

      // 不應該發送新的請求
      expect(fetchRecipeTeaching).toHaveBeenCalledTimes(1);
      // 當 recipeId 為 0 時，fetchData 會直接返回，不會執行任何狀態更新
      // 所以載入狀態會保持之前成功請求後的 false 狀態
      expect(result.current.loading).toBe(false);
    });
  });

  describe('載入狀態管理', () => {
    // 測試載入狀態的正確設置和清除
    test('應該正確設置和清除載入狀態', async () => {
      const mockResponse = {
        StatusCode: HTTP_STATUS.OK,
        data: {
          recipeId: 1,
          recipeName: '測試食譜',
          video: '/videos/123',
          steps: [],
        },
        msg: '成功',
      };

      // 模擬延遲響應
      (fetchRecipeTeaching as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 100);
          }),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      // 初始載入狀態
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);

      // 等待請求完成
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 200 },
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.teachingData).toEqual(mockResponse.data);
    });

    // 測試錯誤時載入狀態的清除
    test('應該在錯誤發生時清除載入狀態', async () => {
      (fetchRecipeTeaching as jest.Mock).mockRejectedValue(
        new Error('Test Error'),
      );

      const { result } = renderHook(() => useRecipeTeaching(1));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('無法加載教學資訊，請稍後再試');
    });
  });
});
