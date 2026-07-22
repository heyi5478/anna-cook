import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import SegmentNavigation from './SegmentNavigation';

/**
 * Mock 片段資料 - 單一片段
 */
const mockSingleSegment = [
  {
    id: '1',
    description: '準備食材：洗淨蔬菜並切成適當大小',
  },
];

/**
 * Mock 片段資料 - 多個片段
 */
const mockMultipleSegments = [
  {
    id: '1',
    description: '準備食材：洗淨蔬菜並切成適當大小',
  },
  {
    id: '2',
    description: '熱鍋下油，爆香蔥薑蒜',
  },
  {
    id: '3',
    description: '加入蔬菜拌炒，調味起鍋',
  },
  {
    id: '4',
    description: '最後擺盤裝飾',
  },
];

/**
 * Mock 片段資料 - 空片段
 */
const mockEmptySegments: Array<{
  id: string;
  description: string;
}> = [];

/**
 * Mock 片段資料 - 大量片段
 */
const mockManySegments = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  description: `料理步驟 ${i + 1}：詳細的步驟說明內容`,
}));

/**
 * SegmentNavigation 元件的 Storybook meta 配置
 */
const meta: Meta<typeof SegmentNavigation> = {
  title: 'VideoUpload/SegmentNavigation',
  component: SegmentNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    segments: {
      control: { type: 'object' },
      description: '片段資料陣列',
    },
    currentSegmentIndex: {
      control: { type: 'number', min: 0, max: 10 },
      description: '當前片段索引',
    },
    isPlaying: {
      control: { type: 'boolean' },
      description: '是否正在播放',
    },
    atGoPreviousSegment: {
      action: 'previous-segment',
      description: '前往上一個片段',
    },
    atGoNextSegment: {
      action: 'next-segment',
      description: '前往下一個片段',
    },
    atTogglePlayPause: {
      action: 'toggle-play-pause',
      description: '播放/暫停切換',
    },
    atAddSegment: {
      action: 'add-segment',
      description: '新增片段',
    },
    atDeleteCurrentSegment: {
      action: 'delete-segment',
      description: '刪除當前片段',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-96 p-4 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本導航 - 第一個片段
export const Default: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 0,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
};

// 播放中狀態
export const Playing: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 1,
    isPlaying: true,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
};

// 暫停狀態
export const Paused: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 2,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
};

// 第一個片段（上一個按鈕禁用）
export const FirstSegment: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 0,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '在第一個片段時，上一個按鈕會被禁用',
      },
    },
  },
};

// 最後一個片段（下一個按鈕禁用）
export const LastSegment: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 3, // 最後一個片段
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '在最後一個片段時，下一個按鈕會被禁用',
      },
    },
  },
};

// 單一片段（導航按鈕和刪除按鈕都禁用）
export const SingleSegment: Story = {
  args: {
    segments: mockSingleSegment,
    currentSegmentIndex: 0,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '只有一個片段時，導航按鈕和刪除按鈕都會被禁用',
      },
    },
  },
};

// 空片段狀態
export const EmptySegments: Story = {
  args: {
    segments: mockEmptySegments,
    currentSegmentIndex: 0,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '沒有片段時的狀態',
      },
    },
  },
};

// 中間片段
export const MiddleSegment: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 2, // 第三個片段
    isPlaying: true,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '在中間片段時，所有導航按鈕都可用',
      },
    },
  },
};

// 大量片段
export const ManySegments: Story = {
  args: {
    segments: mockManySegments,
    currentSegmentIndex: 5, // 第六個片段
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '大量片段時的顯示效果',
      },
    },
  },
};

// 長描述片段
export const LongDescriptionSegments: Story = {
  args: {
    segments: [
      {
        id: '1',
        description:
          '這是一個非常長的片段描述，用來測試當描述文字很長時的顯示效果和排版是否正常',
      },
      {
        id: '2',
        description:
          '準備各種食材：包括新鮮蔬菜、優質肉類、調味料等，並進行清洗和切片處理',
      },
      {
        id: '3',
        description:
          '複雜的烹飪步驟：先將鍋子加熱，然後依序加入各種食材，注意火候控制和時間掌握',
      },
    ],
    currentSegmentIndex: 1,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '測試長描述文字的顯示效果',
      },
    },
  },
};

// 播放控制聚焦
export const PlayControlFocus: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 1,
    isPlaying: true,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '播放按鈕處於活動狀態',
      },
    },
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 1,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full p-2 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

// 平板檢視
export const TabletView: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 2,
    isPlaying: true,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full max-w-lg p-4 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    segments: mockMultipleSegments,
    currentSegmentIndex: 1,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
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
            id: 'keyboard',
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
    segments: mockMultipleSegments,
    currentSegmentIndex: 1,
    isPlaying: false,
    atGoPreviousSegment: fn(),
    atGoNextSegment: fn(),
    atTogglePlayPause: fn(),
    atAddSegment: fn(),
    atDeleteCurrentSegment: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '點擊各種控制按鈕來測試導航功能',
      },
    },
  },
};

// 狀態比較展示
export const StateComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-lg font-bold text-center">
        SegmentNavigation 狀態比較
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-blue-600">
            第一個片段（暫停）
          </h3>
          <SegmentNavigation
            segments={mockMultipleSegments}
            currentSegmentIndex={0}
            isPlaying={false}
            atGoPreviousSegment={fn()}
            atGoNextSegment={fn()}
            atTogglePlayPause={fn()}
            atAddSegment={fn()}
            atDeleteCurrentSegment={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-green-600">
            中間片段（播放中）
          </h3>
          <SegmentNavigation
            segments={mockMultipleSegments}
            currentSegmentIndex={1}
            isPlaying
            atGoPreviousSegment={fn()}
            atGoNextSegment={fn()}
            atTogglePlayPause={fn()}
            atAddSegment={fn()}
            atDeleteCurrentSegment={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-orange-600">
            最後片段（暫停）
          </h3>
          <SegmentNavigation
            segments={mockMultipleSegments}
            currentSegmentIndex={3}
            isPlaying={false}
            atGoPreviousSegment={fn()}
            atGoNextSegment={fn()}
            atTogglePlayPause={fn()}
            atAddSegment={fn()}
            atDeleteCurrentSegment={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-red-600">
            單一片段（禁用狀態）
          </h3>
          <SegmentNavigation
            segments={mockSingleSegment}
            currentSegmentIndex={0}
            isPlaying={false}
            atGoPreviousSegment={fn()}
            atGoNextSegment={fn()}
            atTogglePlayPause={fn()}
            atAddSegment={fn()}
            atDeleteCurrentSegment={fn()}
          />
        </div>
      </div>
    </div>
  ),
};
