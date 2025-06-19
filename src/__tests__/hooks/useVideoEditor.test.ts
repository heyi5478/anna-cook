import { renderHook, act } from '@testing-library/react';
import { useVideoEditor } from '@/hooks/useVideoEditor';
import { uploadRecipeVideo, updateRecipeSteps } from '@/services/recipes';
import { isMobileDevice } from '@/lib/utils';

// Mock 外部依賴
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { recipeId: '123' },
    push: jest.fn(),
  }),
}));

jest.mock('@/services/recipes', () => ({
  uploadRecipeVideo: jest.fn(),
  updateRecipeSteps: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  isMobileDevice: jest.fn(),
}));

jest.mock('@/lib/constants', () => ({
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

jest.mock('@/lib/constants/messages', () => ({
  ERROR_MESSAGES: {
    UPLOAD_FAILED: '上傳失敗',
    VIDEO_UPLOAD_FAILED: '影片上傳失敗',
  },
}));

jest.mock('@/lib/constants/validation', () => ({
  VALIDATION_MESSAGES: {
    UPLOAD_VALID_VIDEO: '請上傳有效的影片檔案',
    MIN_VIDEO_DESCRIPTION_LENGTH: '說明文字至少需要10個字',
    UPLOAD_VIDEO: '請上傳影片',
  },
}));

// 定義 Segment 型別 (複製自 store)
type Segment = {
  id: string;
  startTime: number;
  endTime: number;
  startPercent: number;
  endPercent: number;
  description: string;
};

// Mock Zustand store
const mockStoreState = {
  upload: {
    videoFile: null as File | null,
    videoUrl: '',
    fileName: '',
    uploadProgress: 0,
    isUploading: false,
    apiError: null,
  },
  player: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    thumbnails: [] as string[],
  },
  segments: {
    segments: [] as Segment[],
    currentSegmentIndex: 0,
    trimValues: [0, 100] as [number, number],
  },
  form: {
    errors: {} as Record<string, string>,
    isSubmitting: false,
  },
};

const mockStoreActions = {
  setVideoFile: jest.fn(),
  setVideoUrl: jest.fn(),
  setFileName: jest.fn(),
  setUploadProgress: jest.fn(),
  setIsUploading: jest.fn(),
  setApiError: jest.fn(),
  setIsPlaying: jest.fn(),
  setCurrentTime: jest.fn(),
  setDuration: jest.fn(),
  setThumbnails: jest.fn(),
  setSegments: jest.fn(),
  updateCurrentSegmentDescription: jest.fn(),
  setCurrentSegmentIndex: jest.fn(),
  setTrimValues: jest.fn(),
  addSegment: jest.fn(),
  deleteCurrentSegment: jest.fn(),
  goToPreviousSegment: jest.fn(),
  goToNextSegment: jest.fn(),
  markStartPoint: jest.fn(),
  markEndPoint: jest.fn(),
  resetCurrentSegment: jest.fn(),
  setErrors: jest.fn(),
  setIsSubmitting: jest.fn(),
  reset: jest.fn(),
};

jest.mock('@/stores/video/useVideoEditStore', () => ({
  useVideoEditStore: () => ({
    ...mockStoreState,
    ...mockStoreActions,
  }),
}));

// Mock URL.createObjectURL 和 URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

// Mock console 方法
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock setTimeout 和 setInterval
jest.useFakeTimers();

describe('useVideoEditor', () => {
  const mockUploadRecipeVideo = uploadRecipeVideo as jest.Mock;
  const mockUpdateRecipeSteps = updateRecipeSteps as jest.Mock;
  const mockIsMobileDevice = isMobileDevice as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockIsMobileDevice.mockReturnValue(false);

    // 重置 store state
    Object.assign(mockStoreState, {
      upload: {
        videoFile: null,
        videoUrl: '',
        fileName: '',
        uploadProgress: 0,
        isUploading: false,
        apiError: null,
      },
      player: {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        thumbnails: [],
      },
      segments: {
        segments: [],
        currentSegmentIndex: 0,
        trimValues: [0, 100] as [number, number],
      },
      form: {
        errors: {},
        isSubmitting: false,
      },
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  // 測試 hook 初始化
  test('應該正確初始化 hook', () => {
    const { result } = renderHook(() => useVideoEditor());

    expect(result.current).toMatchObject({
      videoFile: null,
      videoUrl: '',
      fileName: '',
      uploadProgress: 0,
      isUploading: false,
      apiError: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      thumbnails: [],
      segments: [],
      currentSegmentIndex: 0,
      trimValues: [0, 100],
      errors: {},
      isSubmitting: false,
    });

    expect(result.current.videoRef).toBeDefined();
    expect(typeof result.current.atFileUpload).toBe('function');
    expect(typeof result.current.atDescriptionChange).toBe('function');
    expect(typeof result.current.atVideoLoaded).toBe('function');
    expect(typeof result.current.atSubmit).toBe('function');
  });

  // 測試文件上傳功能
  describe('atFileUpload', () => {
    // 測試有效視頻文件上傳
    test('應該成功上傳有效的視頻文件', async () => {
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
      });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      mockUploadRecipeVideo.mockResolvedValue({
        videoUri: 'http://example.com/video.mp4',
      });

      const { result } = renderHook(() => useVideoEditor());

      await act(async () => {
        await result.current.atFileUpload(mockEvent);
      });

      expect(mockStoreActions.setVideoFile).toHaveBeenCalledWith(mockFile);
      expect(mockStoreActions.setFileName).toHaveBeenCalledWith(
        'test-video.mp4',
      );
      expect(mockStoreActions.setIsUploading).toHaveBeenCalledWith(true);
      expect(mockStoreActions.setUploadProgress).toHaveBeenCalledWith(0);
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({});
      expect(mockUploadRecipeVideo).toHaveBeenCalledWith(123, mockFile);
    });

    // 測試無效文件類型
    test('應該拒絕非視頻文件', async () => {
      const mockFile = new File(['image content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const { result } = renderHook(() => useVideoEditor());

      await act(async () => {
        await result.current.atFileUpload(mockEvent);
      });

      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({
        video: '請上傳有效的影片檔案',
      });
      expect(mockUploadRecipeVideo).not.toHaveBeenCalled();
    });

    // 測試沒有選擇文件
    test('應該處理沒有選擇文件的情況', async () => {
      const mockEvent = {
        target: { files: [] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const { result } = renderHook(() => useVideoEditor());

      await act(async () => {
        await result.current.atFileUpload(mockEvent);
      });

      expect(mockUploadRecipeVideo).not.toHaveBeenCalled();
    });

    // 測試上傳失敗
    test('應該處理上傳失敗', async () => {
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
      });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      mockUploadRecipeVideo.mockRejectedValue(new Error('上傳失敗'));

      const { result } = renderHook(() => useVideoEditor());

      await act(async () => {
        await result.current.atFileUpload(mockEvent);
      });

      expect(mockStoreActions.setApiError).toHaveBeenCalledWith('上傳失敗');
    });
  });

  // 測試說明文字變更
  describe('atDescriptionChange', () => {
    // 測試有效說明文字
    test('應該處理有效的說明文字變更', () => {
      const mockEvent = {
        target: { value: '這是一個有效的說明文字，超過10個字元' },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      // 設置初始錯誤狀態
      mockStoreState.form.errors = { description: '說明文字至少需要10個字' };

      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atDescriptionChange(mockEvent);
      });

      expect(
        mockStoreActions.updateCurrentSegmentDescription,
      ).toHaveBeenCalledWith('這是一個有效的說明文字，超過10個字元');

      // 應該清除錯誤
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({});
    });

    // 測試無效說明文字
    test('應該處理無效的說明文字變更', () => {
      const mockEvent = {
        target: { value: '短' },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atDescriptionChange(mockEvent);
      });

      expect(
        mockStoreActions.updateCurrentSegmentDescription,
      ).toHaveBeenCalledWith('短');
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({
        description: '說明文字至少需要10個字',
      });
    });
  });

  // 測試視頻載入
  describe('atVideoLoaded', () => {
    // 測試桌面環境視頻載入
    test('應該在桌面環境正確處理視頻載入', () => {
      mockIsMobileDevice.mockReturnValue(false);
      mockStoreState.upload.videoUrl = 'mock-video-url';

      // Mock video element
      const mockVideoElement = {
        duration: 120.5,
        currentTime: 0,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as HTMLVideoElement;

      const { result } = renderHook(() => useVideoEditor());

      // 設置 videoRef
      result.current.videoRef.current = mockVideoElement;

      act(() => {
        result.current.atVideoLoaded();
      });

      expect(mockStoreActions.setDuration).toHaveBeenCalledWith(120.5);
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({});
      expect(mockStoreActions.setSegments).toHaveBeenCalledWith([
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 120.5,
          startPercent: 0,
          endPercent: 100,
          description: '',
        },
      ]);
      expect(mockStoreActions.setCurrentSegmentIndex).toHaveBeenCalledWith(0);
      expect(mockStoreActions.setTrimValues).toHaveBeenCalledWith([0, 100]);
    });

    // 測試行動裝置環境
    test('應該在行動裝置環境使用簡化縮圖', () => {
      mockIsMobileDevice.mockReturnValue(true);
      mockStoreState.upload.videoUrl = 'mock-video-url';

      const mockVideoElement = {
        duration: 120.5,
        currentTime: 0,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as HTMLVideoElement;

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement;

      act(() => {
        result.current.atVideoLoaded();
      });

      expect(mockStoreActions.setDuration).toHaveBeenCalledWith(120.5);
    });

    // 測試沒有視頻 URL
    test('應該處理沒有視頻 URL 的情況', () => {
      mockStoreState.upload.videoUrl = '';

      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atVideoLoaded();
      });

      expect(mockStoreActions.setDuration).not.toHaveBeenCalled();
    });
  });

  // 測試播放控制
  describe('atTogglePlayPause', () => {
    let mockVideoElement: Partial<HTMLVideoElement>;

    beforeEach(() => {
      mockVideoElement = {
        currentTime: 0,
        play: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    });

    // 測試播放功能
    test('應該正確切換到播放狀態', async () => {
      mockStoreState.player.isPlaying = false;
      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 100,
          description: '',
        },
      ];

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement;

      await act(async () => {
        result.current.atTogglePlayPause();
      });

      expect(mockVideoElement.play).toHaveBeenCalled();
      expect(mockStoreActions.setIsPlaying).toHaveBeenCalledWith(true);
    });

    // 測試暫停功能
    test('應該正確切換到暫停狀態', () => {
      mockStoreState.player.isPlaying = true;

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement;

      act(() => {
        result.current.atTogglePlayPause();
      });

      expect(mockVideoElement.pause).toHaveBeenCalled();
      expect(mockStoreActions.setIsPlaying).toHaveBeenCalledWith(false);
    });

    // 測試播放失敗處理
    test('應該處理播放失敗', async () => {
      mockStoreState.player.isPlaying = false;
      mockVideoElement.play = jest
        .fn()
        .mockRejectedValue(new Error('播放失敗'));

      // Mock alert
      global.alert = jest.fn();

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement;

      await act(async () => {
        result.current.atTogglePlayPause();
      });

      expect(global.alert).toHaveBeenCalledWith('請再次點擊播放按鈕開始播放');
    });
  });

  // 測試時間更新
  describe('atTimeUpdate', () => {
    // 測試正常時間更新
    test('應該更新當前時間', () => {
      const mockVideoElement = {
        currentTime: 30.5,
      } as HTMLVideoElement;

      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 100,
          description: '',
        },
      ];

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement;

      act(() => {
        result.current.atTimeUpdate();
      });

      expect(mockStoreActions.setCurrentTime).toHaveBeenCalledWith(30.5);
    });

    // 測試片段結束時的跳轉
    test('應該在片段結束時跳到下一個片段', () => {
      const mockVideoElement = {
        currentTime: 61,
      } as HTMLVideoElement;

      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 50,
          description: '',
        },
        {
          id: 'segment-2',
          startTime: 60,
          endTime: 120,
          startPercent: 50,
          endPercent: 100,
          description: '',
        },
      ];
      mockStoreState.segments.currentSegmentIndex = 0;

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement;

      act(() => {
        result.current.atTimeUpdate();
      });

      expect(mockVideoElement.currentTime).toBe(60);
      expect(mockStoreActions.setCurrentSegmentIndex).toHaveBeenCalledWith(1);
    });
  });

  // 測試修剪功能
  describe('atTrimChange', () => {
    // 測試修剪值變更
    test('應該正確處理修剪值變更', () => {
      const mockVideoElement = {
        currentTime: 0,
      } as HTMLVideoElement;

      mockStoreState.player.duration = 120;

      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement;

      act(() => {
        result.current.atTrimChange([25, 75]);
      });

      expect(mockStoreActions.setTrimValues).toHaveBeenCalledWith([25, 75]);
      expect(mockVideoElement.currentTime).toBe(30); // 25% of 120 seconds
    });

    // 測試無效修剪值
    test('應該處理無效的修剪值', () => {
      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atTrimChange([50]); // 只有一個值
      });

      expect(mockStoreActions.setTrimValues).not.toHaveBeenCalled();
    });
  });

  // 測試標記功能
  describe('mark points', () => {
    let mockVideoElement: Partial<HTMLVideoElement>;

    beforeEach(() => {
      mockVideoElement = {
        currentTime: 30,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    });

    // 測試標記起點
    test('應該標記當前時間為起點', () => {
      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement;

      act(() => {
        result.current.atMarkStartPoint();
      });

      expect(mockStoreActions.markStartPoint).toHaveBeenCalledWith(30);
    });

    // 測試標記終點
    test('應該標記當前時間為終點', () => {
      const { result } = renderHook(() => useVideoEditor());
      result.current.videoRef.current = mockVideoElement as HTMLVideoElement;

      act(() => {
        result.current.atMarkEndPoint();
      });

      expect(mockStoreActions.markEndPoint).toHaveBeenCalledWith(30);
    });
  });

  // 測試表單驗證
  describe('validateForm', () => {
    // 測試有效表單
    test('應該驗證有效的表單', () => {
      mockStoreState.upload.videoFile = new File(['content'], 'video.mp4', {
        type: 'video/mp4',
      });
      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 100,
          description: '這是一個有效的說明文字，超過10個字元',
        },
      ];

      const { result } = renderHook(() => useVideoEditor());

      let isValid: boolean;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid!).toBe(true);
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({});
    });

    // 測試缺少視頻文件
    test('應該驗證缺少視頻文件', () => {
      mockStoreState.upload.videoFile = null;

      const { result } = renderHook(() => useVideoEditor());

      let isValid: boolean;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid!).toBe(false);
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({
        video: '請上傳影片',
      });
    });

    // 測試說明文字太短
    test('應該驗證說明文字長度', () => {
      mockStoreState.upload.videoFile = new File(['content'], 'video.mp4', {
        type: 'video/mp4',
      });
      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 100,
          description: '短',
        },
      ];

      const { result } = renderHook(() => useVideoEditor());

      let isValid: boolean;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid!).toBe(false);
      expect(mockStoreActions.setErrors).toHaveBeenCalledWith({
        description: '說明文字至少需要10個字',
      });
    });
  });

  // 測試提交功能
  describe('atSubmit', () => {
    // 測試成功提交
    test('應該成功提交表單', async () => {
      const mockOnSave = jest.fn();

      mockStoreState.upload.videoFile = new File(['content'], 'video.mp4', {
        type: 'video/mp4',
      });
      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 100,
          description: '這是一個有效的說明文字，超過10個字元',
        },
      ];

      mockUpdateRecipeSteps.mockResolvedValue({ StatusCode: 200 });
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify({ displayId: 'user123' }),
      );

      const { result } = renderHook(() => useVideoEditor());

      await act(async () => {
        await result.current.atSubmit(mockOnSave);
      });

      expect(mockStoreActions.setIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockOnSave).toHaveBeenCalledWith({
        file: expect.any(File),
        segments: expect.any(Array),
        description: '這是一個有效的說明文字，超過10個字元',
      });
      expect(mockUpdateRecipeSteps).toHaveBeenCalledWith(123, [
        {
          description: '這是一個有效的說明文字，超過10個字元',
          startTime: 0,
          endTime: 60,
        },
      ]);
    });

    // 測試提交失敗
    test('應該處理提交失敗', async () => {
      const mockOnSave = jest.fn();
      mockStoreState.upload.videoFile = null; // 無效狀態

      const { result } = renderHook(() => useVideoEditor());

      await act(async () => {
        await result.current.atSubmit(mockOnSave);
      });

      expect(mockStoreActions.setIsSubmitting).toHaveBeenCalledWith(false);
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  // 測試取消功能
  describe('atCancel', () => {
    // 測試取消操作
    test('應該正確處理取消操作', () => {
      const mockOnCancel = jest.fn();
      mockStoreState.upload.videoUrl = 'mock-video-url';

      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atCancel(mockOnCancel);
      });

      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-video-url');
      expect(mockStoreActions.reset).toHaveBeenCalled();
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  // 測試獲取當前描述
  describe('getCurrentDescription', () => {
    // 測試獲取當前片段描述
    test('應該返回當前片段的描述', () => {
      mockStoreState.segments.segments = [
        {
          id: 'segment-1',
          startTime: 0,
          endTime: 60,
          startPercent: 0,
          endPercent: 100,
          description: '第一段描述',
        },
        {
          id: 'segment-2',
          startTime: 60,
          endTime: 120,
          startPercent: 50,
          endPercent: 100,
          description: '第二段描述',
        },
      ];
      mockStoreState.segments.currentSegmentIndex = 1;

      const { result } = renderHook(() => useVideoEditor());

      const description = result.current.getCurrentDescription();
      expect(description).toBe('第二段描述');
    });

    // 測試沒有片段時的描述
    test('應該在沒有片段時返回空字串', () => {
      mockStoreState.segments.segments = [];

      const { result } = renderHook(() => useVideoEditor());

      const description = result.current.getCurrentDescription();
      expect(description).toBe('');
    });
  });

  // 測試導航功能
  describe('navigation functions', () => {
    // 測試添加片段
    test('應該呼叫 addSegment', () => {
      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.addSegment();
      });

      expect(mockStoreActions.addSegment).toHaveBeenCalled();
    });

    // 測試刪除當前片段
    test('應該呼叫 deleteCurrentSegment', () => {
      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.deleteCurrentSegment();
      });

      expect(mockStoreActions.deleteCurrentSegment).toHaveBeenCalled();
    });

    // 測試前一個片段
    test('應該呼叫 goToPreviousSegment', () => {
      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atGoPreviousSegment();
      });

      expect(mockStoreActions.goToPreviousSegment).toHaveBeenCalled();
    });

    // 測試下一個片段
    test('應該呼叫 goToNextSegment', () => {
      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.atGoNextSegment();
      });

      expect(mockStoreActions.goToNextSegment).toHaveBeenCalled();
    });

    // 測試重置當前片段
    test('應該呼叫 resetCurrentSegment', () => {
      const { result } = renderHook(() => useVideoEditor());

      act(() => {
        result.current.resetCurrentSegment();
      });

      expect(mockStoreActions.resetCurrentSegment).toHaveBeenCalled();
    });
  });
});
