import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { VimeoPlayer } from './VimeoPlayer';

/**
 * Mock Vimeo 影片 ID - 使用公開的測試影片
 * 這些都是測試用的公開 Vimeo 影片
 */
const TEST_VIDEO_IDS = {
  short: 125287395, // 短片測試
  medium: 148751763, // 中等長度影片
  cooking: 76979871, // 料理相關影片
  demo: 90312869, // 示範影片
};

/**
 * VimeoPlayer 元件的 Storybook meta 配置
 */
const meta: Meta<typeof VimeoPlayer> = {
  title: 'Common/VimeoPlayer',
  component: VimeoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    videoId: {
      control: { type: 'number' },
      description: 'Vimeo 影片 ID',
    },
    width: {
      control: { type: 'number', min: 200, max: 1200, step: 50 },
      description: '播放器寬度',
    },
    height: {
      control: { type: 'number', min: 150, max: 800, step: 50 },
      description: '播放器高度',
    },
    startTime: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: '開始播放時間（秒）',
    },
    endTime: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: '結束播放時間（秒）',
    },
    muted: {
      control: { type: 'boolean' },
      description: '是否靜音',
    },
    loop: {
      control: { type: 'boolean' },
      description: '是否循環播放',
    },
    responsive: {
      control: { type: 'boolean' },
      description: '是否響應式',
    },
    isPlaying: {
      control: { type: 'boolean' },
      description: '是否正在播放',
    },
    onTimeUpdate: {
      action: 'time-update',
      description: '時間更新回調',
    },
    onDurationChange: {
      action: 'duration-change',
      description: '時長變更回調',
    },
    onLoaded: {
      action: 'loaded',
      description: '載入完成回調',
    },
    onPlay: {
      action: 'play',
      description: '播放回調',
    },
    onPause: {
      action: 'pause',
      description: '暫停回調',
    },
    onEnded: {
      action: 'ended',
      description: '播放結束回調',
    },
    onError: {
      action: 'error',
      description: '錯誤回調',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full max-w-2xl p-4 bg-gray-50 rounded-lg">
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本播放器
export const Default: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.demo,
    width: 640,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
};

// 時間範圍播放
export const WithTimeRange: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.medium,
    width: 640,
    startTime: 30,
    endTime: 60,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '設定影片播放範圍，從第 30 秒播放到第 60 秒',
      },
    },
  },
};

// 靜音模式
export const Muted: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.cooking,
    width: 640,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
};

// 非靜音模式
export const Unmuted: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.cooking,
    width: 640,
    muted: false,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
};

// 循環播放模式
export const LoopMode: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.short,
    width: 640,
    startTime: 10,
    endTime: 20,
    muted: true,
    loop: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '設定時間範圍循環播放，從第 10 秒到第 20 秒循環',
      },
    },
  },
};

// 自動播放
export const AutoPlay: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.demo,
    width: 640,
    muted: true,
    isPlaying: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '載入後自動開始播放',
      },
    },
  },
};

// 載入失敗狀態
export const ErrorState: Story = {
  args: {
    videoId: 999999999, // 無效的影片 ID
    width: 640,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '無效影片 ID 導致的載入失敗狀態',
      },
    },
  },
};

// 不同尺寸 - 小型
export const SmallSize: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.demo,
    width: 320,
    height: 180,
    muted: true,
    responsive: false,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
};

// 不同尺寸 - 大型
export const LargeSize: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.cooking,
    width: 800,
    height: 450,
    muted: true,
    responsive: false,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full max-w-4xl p-4 bg-gray-50 rounded-lg">
        <StoryComponent />
      </div>
    ),
  ],
};

// 響應式設計
export const ResponsiveDesign: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.medium,
    width: 640,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full p-4 bg-gray-50 rounded-lg">
        <div className="w-full max-w-md mx-auto">
          <StoryComponent />
        </div>
      </div>
    ),
  ],
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.short,
    width: 320,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full p-2 bg-gray-50 rounded-lg">
        <StoryComponent />
      </div>
    ),
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    videoId: TEST_VIDEO_IDS.demo,
    width: 640,
    muted: true,
    responsive: true,
    className: 'focus:outline-2 focus:outline-blue-500',
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
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
    videoId: TEST_VIDEO_IDS.cooking,
    width: 640,
    startTime: 0,
    muted: true,
    responsive: true,
    onTimeUpdate: fn(),
    onDurationChange: fn(),
    onLoaded: fn(),
    onPlay: fn(),
    onPause: fn(),
    onEnded: fn(),
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '完整的互動示範，可以測試所有播放控制功能',
      },
    },
  },
};

// 多個播放器比較
export const MultiplePlayersComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-lg font-bold">VimeoPlayer 功能比較</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">基本播放器</h3>
          <VimeoPlayer
            videoId={TEST_VIDEO_IDS.demo}
            width={300}
            muted
            responsive
            onTimeUpdate={fn()}
            onDurationChange={fn()}
            onLoaded={fn()}
            onPlay={fn()}
            onPause={fn()}
            onEnded={fn()}
            onError={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">時間範圍播放</h3>
          <VimeoPlayer
            videoId={TEST_VIDEO_IDS.medium}
            width={300}
            startTime={15}
            endTime={45}
            muted
            responsive
            onTimeUpdate={fn()}
            onDurationChange={fn()}
            onLoaded={fn()}
            onPlay={fn()}
            onPause={fn()}
            onEnded={fn()}
            onError={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">循環播放</h3>
          <VimeoPlayer
            videoId={TEST_VIDEO_IDS.short}
            width={300}
            startTime={5}
            endTime={15}
            muted
            loop
            responsive
            onTimeUpdate={fn()}
            onDurationChange={fn()}
            onLoaded={fn()}
            onPlay={fn()}
            onPause={fn()}
            onEnded={fn()}
            onError={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">小尺寸播放器</h3>
          <VimeoPlayer
            videoId={TEST_VIDEO_IDS.cooking}
            width={250}
            height={140}
            muted
            responsive={false}
            onTimeUpdate={fn()}
            onDurationChange={fn()}
            onLoaded={fn()}
            onPlay={fn()}
            onPause={fn()}
            onEnded={fn()}
            onError={fn()}
          />
        </div>
      </div>
    </div>
  ),
};
