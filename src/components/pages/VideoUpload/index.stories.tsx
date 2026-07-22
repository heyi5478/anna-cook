import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import VideoTrimmer from './index';

// Mock useVideoEditor hook 的返回值
const createMockUseVideoEditor = (overrides = {}) => ({
  // 影片資料
  videoFile: null,
  videoUrl: '',
  fileName: '',
  uploadProgress: 0,
  isUploading: false,
  apiError: null,

  // 播放器狀態
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  thumbnails: [],

  // 片段資料
  segments: [],
  currentSegmentIndex: 0,
  trimValues: { start: 0, end: 0 },

  // 表單狀態
  errors: {},
  isSubmitting: false,

  // DOM 參考
  videoRef: { current: null },

  // 事件處理函式
  atFileUpload: fn(),
  atDescriptionChange: fn(),
  atVideoLoaded: fn(),
  atTimeUpdate: fn(),
  atTogglePlayPause: fn(),
  atTrimChange: fn(),
  atMarkStartPoint: fn(),
  atMarkEndPoint: fn(),
  atSubmit: fn(),
  validateForm: fn(),
  atAddSegment: fn(),
  atDeleteCurrentSegment: fn(),
  atGoPreviousSegment: fn(),
  atGoNextSegment: fn(),
  resetCurrentSegment: fn(),

  ...overrides,
});

// Mock useVideoEditor hook
jest.mock('@/hooks/useVideoEditor', () => ({
  useVideoEditor: () => mockUseVideoEditorReturn,
}));

let mockUseVideoEditorReturn = createMockUseVideoEditor();

/**
 * VideoTrimmer 元件的 Storybook meta 配置
 */
const meta: Meta<typeof VideoTrimmer> = {
  title: 'VideoUpload/VideoTrimmer',
  component: VideoTrimmer,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/upload',
        query: { recipeId: '123' },
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSave: {
      action: 'save',
      description: '儲存剪輯完成影片的回調函式',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <StoryComponent />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 初始上傳狀態
export const InitialState: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: null,
      videoUrl: '',
      fileName: '',
      segments: [],
    });
  },
  parameters: {
    docs: {
      description: {
        story: '初始狀態，顯示檔案上傳區域',
      },
    },
  },
};

// 上傳進行中狀態
export const UploadingState: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      fileName: 'cooking-tutorial.mp4',
      isUploading: true,
      uploadProgress: 65,
    });
  },
  parameters: {
    docs: {
      description: {
        story: '影片上傳進行中，顯示進度條',
      },
    },
  },
};

// 已載入影片狀態
export const VideoLoaded: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'cooking-demo.mp4',
      duration: 120, // 2分鐘
      currentTime: 0,
      segments: [
        {
          id: '1',
          start: 0,
          end: 30,
          description: '',
        },
      ],
      currentSegmentIndex: 0,
      trimValues: { start: 0, end: 30 },
    });
  },
  parameters: {
    docs: {
      description: {
        story: '影片載入完成，顯示播放器和編輯控制項',
      },
    },
  },
};

// 包含片段的狀態
export const WithSegments: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'recipe-steps.mp4',
      duration: 180,
      currentTime: 45,
      segments: [
        {
          id: '1',
          start: 0,
          end: 30,
          description: '準備食材：洗淨蔬菜並切成適當大小',
        },
        {
          id: '2',
          start: 30,
          end: 60,
          description: '熱鍋下油，爆香蔥薑蒜',
        },
        {
          id: '3',
          start: 60,
          end: 90,
          description: '加入蔬菜拌炒，調味起鍋',
        },
      ],
      currentSegmentIndex: 1,
      trimValues: { start: 30, end: 60 },
    });
  },
  parameters: {
    docs: {
      description: {
        story: '包含多個片段的完整編輯狀態',
      },
    },
  },
};

// 有錯誤的狀態
export const WithErrors: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'error-video.mp4',
      duration: 120,
      segments: [
        {
          id: '1',
          start: 0,
          end: 30,
          description: '太短',
        },
      ],
      currentSegmentIndex: 0,
      errors: {
        description: '描述文字過短，至少需要 10 個字符',
        video: '影片格式不正確',
      },
      apiError: '上傳失敗，請重試',
    });
  },
  parameters: {
    docs: {
      description: {
        story: '顯示各種錯誤狀態的處理',
      },
    },
  },
};

// 提交中狀態
export const SubmittingState: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'final-video.mp4',
      duration: 120,
      segments: [
        {
          id: '1',
          start: 0,
          end: 30,
          description: '這是一段完整的描述文字，符合最小字數要求',
        },
      ],
      currentSegmentIndex: 0,
      isSubmitting: true,
    });
  },
  parameters: {
    docs: {
      description: {
        story: '正在提交影片處理請求',
      },
    },
  },
};

// 播放中狀態
export const PlayingState: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'playing-video.mp4',
      duration: 120,
      currentTime: 45,
      isPlaying: true,
      segments: [
        {
          id: '1',
          start: 0,
          end: 60,
          description: '正在播放的片段內容',
        },
      ],
      currentSegmentIndex: 0,
      trimValues: { start: 0, end: 60 },
    });
  },
  parameters: {
    docs: {
      description: {
        story: '影片正在播放中的狀態',
      },
    },
  },
};

// 網路錯誤狀態
export const NetworkError: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      fileName: 'network-error.mp4',
      apiError: '網路連線不穩定，請檢查網路後重試',
      errors: {
        video: '影片上傳失敗',
      },
    });
  },
  parameters: {
    docs: {
      description: {
        story: '網路錯誤導致上傳失敗的狀態',
      },
    },
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'mobile-video.mp4',
      duration: 120,
      segments: [
        {
          id: '1',
          start: 0,
          end: 30,
          description: '行動裝置上的影片編輯測試',
        },
      ],
      currentSegmentIndex: 0,
    });
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="max-w-full mx-auto">
          <StoryComponent />
        </div>
      </div>
    ),
  ],
};

// 互動示範
export const InteractiveDemo: Story = {
  args: {
    onSave: fn(),
  },
  beforeEach: () => {
    mockUseVideoEditorReturn = createMockUseVideoEditor({
      videoFile: new File([''], 'test-video.mp4', { type: 'video/mp4' }),
      videoUrl:
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'interactive-demo.mp4',
      duration: 120,
      segments: [
        {
          id: '1',
          start: 0,
          end: 30,
          description: '點擊播放按鈕來測試互動功能',
        },
      ],
      currentSegmentIndex: 0,
    });
  },
  parameters: {
    docs: {
      description: {
        story: '完整的互動示範，可以測試所有功能',
      },
    },
  },
};
