import { renderHook, act } from '@testing-library/react';
import {
  useVideoEditStore,
  type Segment,
} from '@/stores/video/useVideoEditStore';
import { generateId } from '@/lib/utils/id';

// Mock generateId 工具函式
jest.mock('@/lib/utils/id');
const mockGenerateId = generateId as jest.MockedFunction<typeof generateId>;

// Mock 測試資料
const mockFile = new File(['video content'], 'test-video.mp4', {
  type: 'video/mp4',
});

const mockSegment: Segment = {
  id: 'test-segment-1',
  startTime: 10,
  endTime: 20,
  startPercent: 10,
  endPercent: 20,
  description: '測試片段',
};

describe('useVideoEditStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateId.mockReturnValue('test-id');

    // 重置 store 狀態
    const { result } = renderHook(() => useVideoEditStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('初始狀態', () => {
    test('應該返回正確的初始狀態', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 上傳狀態
      expect(result.current.upload.videoFile).toBe(null);
      expect(result.current.upload.videoUrl).toBe('');
      expect(result.current.upload.fileName).toBe('videoexample.avi');
      expect(result.current.upload.uploadProgress).toBe(0);
      expect(result.current.upload.isUploading).toBe(false);
      expect(result.current.upload.apiError).toBe(null);

      // 播放狀態
      expect(result.current.player.isPlaying).toBe(false);
      expect(result.current.player.currentTime).toBe(0);
      expect(result.current.player.duration).toBe(134.63);
      expect(result.current.player.thumbnails).toEqual([]);

      // 片段狀態
      expect(result.current.segments.segments).toEqual([]);
      expect(result.current.segments.currentSegmentIndex).toBe(0);
      expect(result.current.segments.trimValues).toEqual([0, 100]);

      // 表單狀態
      expect(result.current.form.errors).toEqual({});
      expect(result.current.form.isSubmitting).toBe(false);
    });
  });

  describe('上傳狀態管理', () => {
    test('應該正確設置視頻檔案', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setVideoFile(mockFile);
      });

      expect(result.current.upload.videoFile).toBe(mockFile);
    });

    test('應該正確設置視頻 URL', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setVideoUrl('https://example.com/video.mp4');
      });

      expect(result.current.upload.videoUrl).toBe(
        'https://example.com/video.mp4',
      );
    });

    test('應該正確設置檔案名稱', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setFileName('custom-video.mp4');
      });

      expect(result.current.upload.fileName).toBe('custom-video.mp4');
    });

    test('應該正確設置上傳進度', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setUploadProgress(50);
      });

      expect(result.current.upload.uploadProgress).toBe(50);
    });

    test('應該正確設置函式形式的上傳進度', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置初始進度
      act(() => {
        result.current.setUploadProgress(30);
      });

      // 使用函式更新進度
      act(() => {
        result.current.setUploadProgress((prev) => prev + 20);
      });

      expect(result.current.upload.uploadProgress).toBe(50);
    });

    test('應該正確設置上傳狀態', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setIsUploading(true);
      });

      expect(result.current.upload.isUploading).toBe(true);
    });

    test('應該正確設置 API 錯誤', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setApiError('上傳失敗');
      });

      expect(result.current.upload.apiError).toBe('上傳失敗');
    });

    test('應該正確清除 API 錯誤', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 先設置錯誤
      act(() => {
        result.current.setApiError('測試錯誤');
      });

      // 清除錯誤
      act(() => {
        result.current.setApiError(null);
      });

      expect(result.current.upload.apiError).toBe(null);
    });
  });

  describe('播放狀態管理', () => {
    test('應該正確設置播放狀態', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(result.current.player.isPlaying).toBe(true);
    });

    test('應該正確設置當前時間', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setCurrentTime(45.5);
      });

      expect(result.current.player.currentTime).toBe(45.5);
    });

    test('應該正確設置視頻長度', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setDuration(300);
      });

      expect(result.current.player.duration).toBe(300);
    });

    test('應該正確設置縮圖', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const thumbnails = ['thumb1.jpg', 'thumb2.jpg', 'thumb3.jpg'];

      act(() => {
        result.current.setThumbnails(thumbnails);
      });

      expect(result.current.player.thumbnails).toEqual(thumbnails);
    });
  });

  describe('片段管理', () => {
    test('應該正確設置片段列表', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const segments = [mockSegment];

      act(() => {
        result.current.setSegments(segments);
      });

      expect(result.current.segments.segments).toEqual(segments);
    });

    test('應該正確更新當前片段描述', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 先設置片段
      act(() => {
        result.current.setSegments([mockSegment]);
      });

      // 更新描述
      act(() => {
        result.current.updateCurrentSegmentDescription('更新的描述');
      });

      expect(result.current.segments.segments[0].description).toBe(
        '更新的描述',
      );
    });

    test('應該在沒有片段時不更新描述', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 嘗試更新描述但沒有片段
      act(() => {
        result.current.updateCurrentSegmentDescription('測試描述');
      });

      expect(result.current.segments.segments).toEqual([]);
    });

    test('應該正確設置當前片段索引', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const segments = [
        mockSegment,
        { ...mockSegment, id: 'segment-2', startPercent: 30, endPercent: 40 },
      ];
      const mockCallback = jest.fn();

      // 設置片段
      act(() => {
        result.current.setSegments(segments);
      });

      // 設置索引並測試回調
      act(() => {
        result.current.setCurrentSegmentIndex(1, mockCallback);
      });

      expect(result.current.segments.currentSegmentIndex).toBe(1);
      expect(result.current.segments.trimValues).toEqual([30, 40]);
      expect(mockCallback).toHaveBeenCalledWith(mockSegment.startTime);
    });

    test('應該在索引超出範圍時不改變狀態', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const segments = [mockSegment];

      act(() => {
        result.current.setSegments(segments);
      });

      // 嘗試設置超出範圍的索引
      act(() => {
        result.current.setCurrentSegmentIndex(5);
      });

      expect(result.current.segments.currentSegmentIndex).toBe(0);
    });

    test('應該正確設置修剪值', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置視頻長度和片段
      act(() => {
        result.current.setDuration(100);
        result.current.setSegments([mockSegment]);
      });

      // 設置修剪值
      act(() => {
        result.current.setTrimValues([25, 75]);
      });

      expect(result.current.segments.trimValues).toEqual([25, 75]);
      expect(result.current.segments.segments[0].startTime).toBe(25);
      expect(result.current.segments.segments[0].endTime).toBe(75);
      expect(result.current.segments.segments[0].startPercent).toBe(25);
      expect(result.current.segments.segments[0].endPercent).toBe(75);
    });

    test('應該在沒有片段時不設置修剪值', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setTrimValues([25, 75]);
      });

      expect(result.current.segments.trimValues).toEqual([0, 100]);
    });
  });

  describe('片段操作', () => {
    test('應該正確添加新片段', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const mockCallback = jest.fn();

      // 設置視頻長度
      act(() => {
        result.current.setDuration(100);
      });

      // 添加片段
      act(() => {
        result.current.addSegment(mockCallback);
      });

      expect(result.current.segments.segments).toHaveLength(1);
      expect(result.current.segments.currentSegmentIndex).toBe(0);
      expect(mockCallback).toHaveBeenCalledWith(50); // 中間時間點
      expect(mockGenerateId).toHaveBeenCalled();
    });

    test('應該在視頻長度為 0 時不添加片段', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 確保 duration 為 0
      act(() => {
        result.current.setDuration(0);
      });

      act(() => {
        result.current.addSegment();
      });

      expect(result.current.segments.segments).toHaveLength(0);
    });

    test('應該正確刪除當前片段', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const segments = [
        mockSegment,
        { ...mockSegment, id: 'segment-2' },
        { ...mockSegment, id: 'segment-3' },
      ];
      const mockCallback = jest.fn();

      // 設置多個片段
      act(() => {
        result.current.setSegments(segments);
        result.current.setCurrentSegmentIndex(1);
      });

      // 刪除當前片段
      act(() => {
        result.current.deleteCurrentSegment(mockCallback);
      });

      expect(result.current.segments.segments).toHaveLength(2);
      expect(result.current.segments.currentSegmentIndex).toBe(1);
      expect(mockCallback).toHaveBeenCalled();
    });

    test('應該在只有一個片段時不刪除', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setSegments([mockSegment]);
      });

      act(() => {
        result.current.deleteCurrentSegment();
      });

      expect(result.current.segments.segments).toHaveLength(1);
    });

    test('應該正確前往上一個片段', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const segments = [mockSegment, { ...mockSegment, id: 'segment-2' }];
      const mockCallback = jest.fn();

      act(() => {
        result.current.setSegments(segments);
        result.current.setCurrentSegmentIndex(1);
      });

      act(() => {
        result.current.goToPreviousSegment(mockCallback);
      });

      expect(result.current.segments.currentSegmentIndex).toBe(0);
      expect(mockCallback).toHaveBeenCalledWith(mockSegment.startTime);
    });

    test('應該在第一個片段時不能前往上一個', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setSegments([mockSegment]);
      });

      act(() => {
        result.current.goToPreviousSegment();
      });

      expect(result.current.segments.currentSegmentIndex).toBe(0);
    });

    test('應該正確前往下一個片段', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const segments = [mockSegment, { ...mockSegment, id: 'segment-2' }];
      const mockCallback = jest.fn();

      act(() => {
        result.current.setSegments(segments);
      });

      act(() => {
        result.current.goToNextSegment(mockCallback);
      });

      expect(result.current.segments.currentSegmentIndex).toBe(1);
      expect(mockCallback).toHaveBeenCalledWith(mockSegment.startTime);
    });

    test('應該在最後一個片段時不能前往下一個', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setSegments([mockSegment]);
      });

      act(() => {
        result.current.goToNextSegment();
      });

      expect(result.current.segments.currentSegmentIndex).toBe(0);
    });
  });

  describe('時間點標記', () => {
    test('應該正確標記開始時間點', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置視頻長度和片段
      act(() => {
        result.current.setDuration(100);
        result.current.setSegments([mockSegment]);
      });

      // 標記開始點
      act(() => {
        result.current.markStartPoint(15);
      });

      expect(result.current.segments.segments[0].startTime).toBe(15);
      expect(result.current.segments.segments[0].startPercent).toBe(15);
      expect(result.current.segments.trimValues[0]).toBe(15);
    });

    test('應該正確標記結束時間點', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置視頻長度和片段
      act(() => {
        result.current.setDuration(100);
        result.current.setSegments([mockSegment]);
      });

      // 標記結束點
      act(() => {
        result.current.markEndPoint(85);
      });

      expect(result.current.segments.segments[0].endTime).toBe(85);
      expect(result.current.segments.segments[0].endPercent).toBe(85);
      expect(result.current.segments.trimValues[1]).toBe(85);
    });

    test('應該在沒有片段時不標記時間點', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.markStartPoint(15);
        result.current.markEndPoint(85);
      });

      expect(result.current.segments.segments).toEqual([]);
    });

    test('應該正確重置當前片段', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置視頻長度和片段
      act(() => {
        result.current.setDuration(100);
        result.current.setSegments([mockSegment]);
      });

      // 重置當前片段
      act(() => {
        result.current.resetCurrentSegment();
      });

      expect(result.current.segments.segments[0].startTime).toBe(0);
      expect(result.current.segments.segments[0].endTime).toBe(100);
      expect(result.current.segments.segments[0].startPercent).toBe(0);
      expect(result.current.segments.segments[0].endPercent).toBe(100);
      expect(result.current.segments.trimValues).toEqual([0, 100]);
    });
  });

  describe('表單狀態管理', () => {
    test('應該正確設置錯誤狀態', () => {
      const { result } = renderHook(() => useVideoEditStore());
      const errors = {
        video: '視頻格式不正確',
        description: '描述不能為空',
      };

      act(() => {
        result.current.setErrors(errors);
      });

      expect(result.current.form.errors).toEqual(errors);
    });

    test('應該正確設置提交狀態', () => {
      const { result } = renderHook(() => useVideoEditStore());

      act(() => {
        result.current.setIsSubmitting(true);
      });

      expect(result.current.form.isSubmitting).toBe(true);
    });
  });

  describe('綜合場景測試', () => {
    test('應該正確處理完整的視頻編輯流程', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 1. 上傳視頻
      act(() => {
        result.current.setVideoFile(mockFile);
        result.current.setIsUploading(true);
        result.current.setUploadProgress(0);
      });

      // 2. 上傳完成，設置視頻資訊
      act(() => {
        result.current.setIsUploading(false);
        result.current.setUploadProgress(100);
        result.current.setVideoUrl('https://example.com/video.mp4');
        result.current.setDuration(120);
      });

      // 3. 添加片段
      act(() => {
        result.current.addSegment();
      });

      // 4. 編輯片段
      act(() => {
        result.current.updateCurrentSegmentDescription('第一個片段');
        result.current.markStartPoint(10);
        result.current.markEndPoint(30);
      });

      // 5. 添加更多片段
      act(() => {
        result.current.addSegment();
      });

      act(() => {
        result.current.updateCurrentSegmentDescription('第二個片段');
      });

      // 驗證最終狀態
      expect(result.current.upload.videoFile).toBe(mockFile);
      expect(result.current.upload.isUploading).toBe(false);
      expect(result.current.upload.uploadProgress).toBe(100);
      expect(result.current.player.duration).toBe(120);
      expect(result.current.segments.segments).toHaveLength(2);
      expect(result.current.segments.segments[0].description).toBe(
        '第一個片段',
      );
      expect(result.current.segments.segments[1].description).toBe(
        '第二個片段',
      );
      expect(result.current.segments.currentSegmentIndex).toBe(1);
    });

    test('應該正確處理錯誤情況', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置錯誤狀態
      act(() => {
        result.current.setApiError('上傳失敗');
        result.current.setErrors({
          video: '視頻格式不支援',
          description: '描述太短',
        });
      });

      expect(result.current.upload.apiError).toBe('上傳失敗');
      expect(result.current.form.errors.video).toBe('視頻格式不支援');
      expect(result.current.form.errors.description).toBe('描述太短');

      // 清除錯誤
      act(() => {
        result.current.setApiError(null);
        result.current.setErrors({});
      });

      expect(result.current.upload.apiError).toBe(null);
      expect(result.current.form.errors).toEqual({});
    });
  });

  describe('重置狀態', () => {
    test('應該重置所有狀態到初始值', () => {
      const { result } = renderHook(() => useVideoEditStore());

      // 設置一些非初始值
      act(() => {
        result.current.setVideoFile(mockFile);
        result.current.setVideoUrl('https://example.com/test.mp4');
        result.current.setUploadProgress(50);
        result.current.setIsUploading(true);
        result.current.setApiError('測試錯誤');
        result.current.setIsPlaying(true);
        result.current.setCurrentTime(30);
        result.current.setDuration(200);
        result.current.setThumbnails(['thumb1.jpg']);
        result.current.setSegments([mockSegment]);
        result.current.setErrors({ video: '錯誤' });
        result.current.setIsSubmitting(true);
      });

      // 重置狀態
      act(() => {
        result.current.reset();
      });

      // 驗證所有狀態回到初始值
      expect(result.current.upload.videoFile).toBe(null);
      expect(result.current.upload.videoUrl).toBe('');
      expect(result.current.upload.fileName).toBe('videoexample.avi');
      expect(result.current.upload.uploadProgress).toBe(0);
      expect(result.current.upload.isUploading).toBe(false);
      expect(result.current.upload.apiError).toBe(null);
      expect(result.current.player.isPlaying).toBe(false);
      expect(result.current.player.currentTime).toBe(0);
      expect(result.current.player.duration).toBe(134.63);
      expect(result.current.player.thumbnails).toEqual([]);
      expect(result.current.segments.segments).toEqual([]);
      expect(result.current.segments.currentSegmentIndex).toBe(0);
      expect(result.current.segments.trimValues).toEqual([0, 100]);
      expect(result.current.form.errors).toEqual({});
      expect(result.current.form.isSubmitting).toBe(false);
    });
  });
});
