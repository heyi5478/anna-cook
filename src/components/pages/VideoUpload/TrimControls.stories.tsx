import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import TrimControls from './TrimControls';

/**
 * Mock 縮圖資料
 */
const mockThumbnails = Array.from(
  { length: 10 },
  (_, i) => `https://via.placeholder.com/80x60/6366f1/ffffff?text=${i + 1}`,
);

/**
 * Mock 空片段資料
 */
const mockEmptySegments: Array<{
  id: string;
  startTime: number;
  endTime: number;
  startPercent: number;
  endPercent: number;
  description: string;
}> = [];

/**
 * Mock 單一片段資料
 */
const mockSingleSegment = [
  {
    id: '1',
    startTime: 5,
    endTime: 15,
    startPercent: 20,
    endPercent: 60,
    description: '第一個料理步驟：準備食材',
  },
];

/**
 * Mock 多個片段資料
 */
const mockMultipleSegments = [
  {
    id: '1',
    startTime: 0,
    endTime: 10,
    startPercent: 0,
    endPercent: 25,
    description: '準備食材：洗淨蔬菜並切成適當大小',
  },
  {
    id: '2',
    startTime: 10,
    endTime: 20,
    startPercent: 25,
    endPercent: 50,
    description: '熱鍋下油，爆香蔥薑蒜',
  },
  {
    id: '3',
    startTime: 20,
    endTime: 30,
    startPercent: 50,
    endPercent: 75,
    description: '加入蔬菜拌炒，調味起鍋',
  },
  {
    id: '4',
    startTime: 30,
    endTime: 40,
    startPercent: 75,
    endPercent: 100,
    description: '最後擺盤裝飾',
  },
];

/**
 * Mock 錯誤長度的片段（太短）
 */
const mockTooShortSegment = [
  {
    id: '1',
    startTime: 5,
    endTime: 7, // 只有2秒，低於最小限制5秒
    startPercent: 20,
    endPercent: 28,
    description: '太短的片段測試',
  },
];

/**
 * Mock 錯誤長度的片段（太長）
 */
const mockTooLongSegment = [
  {
    id: '1',
    startTime: 5,
    endTime: 40, // 35秒，超過最大限制30秒
    startPercent: 12.5,
    endPercent: 100,
    description: '太長的片段測試',
  },
];

/**
 * Mock 理想長度的片段
 */
const mockIdealSegment = [
  {
    id: '1',
    startTime: 5,
    endTime: 20, // 15秒，在理想範圍內
    startPercent: 12.5,
    endPercent: 50,
    description: '理想長度的片段：展示完整的料理步驟',
  },
];

/**
 * TrimControls 元件的 Storybook meta 配置
 */
const meta: Meta<typeof TrimControls> = {
  title: 'VideoUpload/TrimControls',
  component: TrimControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'number', min: 10, max: 300, step: 5 },
      description: '影片總長度（秒）',
    },
    currentTime: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: '當前播放時間（秒）',
    },
    trimValues: {
      control: { type: 'object' },
      description: '剪輯範圍值 [起點%, 終點%]',
    },
    thumbnails: {
      control: { type: 'object' },
      description: '縮圖陣列',
    },
    segments: {
      control: { type: 'object' },
      description: '片段資料陣列',
    },
    currentSegmentIndex: {
      control: { type: 'number', min: 0, max: 10 },
      description: '當前選中的片段索引',
    },
    atTrimChange: {
      action: 'trim-change',
      description: '剪輯範圍變更回調',
    },
    atMarkStartPoint: {
      action: 'mark-start',
      description: '標記起點回調',
    },
    atMarkEndPoint: {
      action: 'mark-end',
      description: '標記終點回調',
    },
    atResetCurrentSegment: {
      action: 'reset-segment',
      description: '重置當前片段回調',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full max-w-2xl p-6 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本控制器
export const Default: Story = {
  args: {
    duration: 120,
    currentTime: 15,
    trimValues: [20, 60],
    thumbnails: mockThumbnails,
    segments: mockSingleSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
};

// 空片段狀態
export const EmptySegments: Story = {
  args: {
    duration: 120,
    currentTime: 0,
    trimValues: [0, 100],
    thumbnails: mockThumbnails,
    segments: mockEmptySegments,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '尚未建立任何片段的初始狀態',
      },
    },
  },
};

// 多個片段
export const MultipleSegments: Story = {
  args: {
    duration: 120,
    currentTime: 15,
    trimValues: [25, 50],
    thumbnails: mockThumbnails,
    segments: mockMultipleSegments,
    currentSegmentIndex: 1,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '包含多個片段，第二個片段為當前選中狀態',
      },
    },
  },
};

// 片段太短（錯誤狀態）
export const TooShortSegment: Story = {
  args: {
    duration: 120,
    currentTime: 6,
    trimValues: [20, 28],
    thumbnails: mockThumbnails,
    segments: mockTooShortSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '片段長度太短（少於5秒），顯示紅色錯誤狀態',
      },
    },
  },
};

// 片段太長（錯誤狀態）
export const TooLongSegment: Story = {
  args: {
    duration: 120,
    currentTime: 20,
    trimValues: [12.5, 100],
    thumbnails: mockThumbnails,
    segments: mockTooLongSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '片段長度太長（超過30秒），顯示紅色錯誤狀態',
      },
    },
  },
};

// 理想片段長度（成功狀態）
export const IdealSegment: Story = {
  args: {
    duration: 120,
    currentTime: 12,
    trimValues: [12.5, 50],
    thumbnails: mockThumbnails,
    segments: mockIdealSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '片段長度理想（10-25秒），顯示綠色成功狀態',
      },
    },
  },
};

// 播放位置在片段開始
export const PlaybackAtStart: Story = {
  args: {
    duration: 120,
    currentTime: 5, // 在片段起點
    trimValues: [12.5, 50],
    thumbnails: mockThumbnails,
    segments: mockIdealSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
};

// 播放位置在片段結束
export const PlaybackAtEnd: Story = {
  args: {
    duration: 120,
    currentTime: 20, // 在片段終點
    trimValues: [12.5, 50],
    thumbnails: mockThumbnails,
    segments: mockIdealSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
};

// 播放位置在片段外
export const PlaybackOutside: Story = {
  args: {
    duration: 120,
    currentTime: 80, // 在片段之外
    trimValues: [12.5, 50],
    thumbnails: mockThumbnails,
    segments: mockIdealSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
};

// 短影片
export const ShortVideo: Story = {
  args: {
    duration: 30,
    currentTime: 10,
    trimValues: [20, 80],
    thumbnails: mockThumbnails.slice(0, 5),
    segments: [
      {
        id: '1',
        startTime: 6,
        endTime: 24,
        startPercent: 20,
        endPercent: 80,
        description: '短影片的完整片段',
      },
    ],
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
};

// 長影片
export const LongVideo: Story = {
  args: {
    duration: 600, // 10分鐘
    currentTime: 150,
    trimValues: [25, 50],
    thumbnails: Array.from(
      { length: 20 },
      (_, i) => `https://via.placeholder.com/80x60/6366f1/ffffff?text=${i + 1}`,
    ),
    segments: [
      {
        id: '1',
        startTime: 150,
        endTime: 300,
        startPercent: 25,
        endPercent: 50,
        description: '長影片中的一個片段',
      },
    ],
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
};

// 無縮圖狀態
export const NoThumbnails: Story = {
  args: {
    duration: 120,
    currentTime: 15,
    trimValues: [20, 60],
    thumbnails: [],
    segments: mockSingleSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '縮圖載入失敗或尚未生成的狀態',
      },
    },
  },
};

// 精確剪輯（小範圍）
export const PreciseTrimming: Story = {
  args: {
    duration: 120,
    currentTime: 25,
    trimValues: [20, 25], // 很小的範圍
    thumbnails: mockThumbnails,
    segments: [
      {
        id: '1',
        startTime: 24,
        endTime: 30,
        startPercent: 20,
        endPercent: 25,
        description: '精確剪輯的小片段',
      },
    ],
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '精確剪輯小範圍片段的狀態',
      },
    },
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    duration: 120,
    currentTime: 15,
    trimValues: [20, 60],
    thumbnails: mockThumbnails,
    segments: mockSingleSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full p-4 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    duration: 120,
    currentTime: 15,
    trimValues: [20, 60],
    thumbnails: mockThumbnails,
    segments: mockSingleSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'slider',
            enabled: true,
          },
        ],
      },
    },
  },
};

// 互動示範
export const InteractiveDemo: Story = {
  args: {
    duration: 120,
    currentTime: 15,
    trimValues: [20, 60],
    thumbnails: mockThumbnails,
    segments: mockSingleSegment,
    currentSegmentIndex: 0,
    atTrimChange: fn(),
    atMarkStartPoint: fn(),
    atMarkEndPoint: fn(),
    atResetCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '拖拽滑桿或點擊標記按鈕來測試剪輯功能',
      },
    },
  },
};

// 狀態比較展示
export const StateComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-lg font-bold text-center">TrimControls 狀態比較</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-green-600">
            ✓ 理想片段長度
          </h3>
          <TrimControls
            duration={120}
            currentTime={12}
            trimValues={[12.5, 50]}
            thumbnails={mockThumbnails}
            segments={mockIdealSegment}
            currentSegmentIndex={0}
            atTrimChange={fn()}
            atMarkStartPoint={fn()}
            atMarkEndPoint={fn()}
            atResetCurrentSegment={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-red-600">✗ 片段太短</h3>
          <TrimControls
            duration={120}
            currentTime={6}
            trimValues={[20, 28]}
            thumbnails={mockThumbnails}
            segments={mockTooShortSegment}
            currentSegmentIndex={0}
            atTrimChange={fn()}
            atMarkStartPoint={fn()}
            atMarkEndPoint={fn()}
            atResetCurrentSegment={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-red-600">✗ 片段太長</h3>
          <TrimControls
            duration={120}
            currentTime={20}
            trimValues={[12.5, 100]}
            thumbnails={mockThumbnails}
            segments={mockTooLongSegment}
            currentSegmentIndex={0}
            atTrimChange={fn()}
            atMarkStartPoint={fn()}
            atMarkEndPoint={fn()}
            atResetCurrentSegment={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-blue-600">多個片段</h3>
          <TrimControls
            duration={120}
            currentTime={15}
            trimValues={[25, 50]}
            thumbnails={mockThumbnails}
            segments={mockMultipleSegments}
            currentSegmentIndex={1}
            atTrimChange={fn()}
            atMarkStartPoint={fn()}
            atMarkEndPoint={fn()}
            atResetCurrentSegment={fn()}
          />
        </div>
      </div>
    </div>
  ),
};
