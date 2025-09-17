import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { useRef } from 'react';
import VideoPlayer from './VideoPlayer';

/**
 * Mock 影片 URL - 使用公開的測試影片
 */
const mockVideoUrl =
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';

/**
 * VideoPlayer 元件的 Storybook meta 配置
 */
const meta: Meta<typeof VideoPlayer> = {
  title: 'VideoUpload/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    videoUrl: {
      control: { type: 'text' },
      description: '影片 URL',
    },
    isPlaying: {
      control: { type: 'boolean' },
      description: '是否正在播放',
    },
    currentTime: {
      control: { type: 'number', min: 0, max: 120, step: 1 },
      description: '當前播放時間（秒）',
    },
    duration: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: '影片總長度（秒）',
    },
    atTogglePlayPause: {
      action: 'toggle-play-pause',
      description: '播放/暫停切換函式',
    },
    atTimeUpdate: {
      action: 'time-update',
      description: '時間更新函式',
    },
    atVideoLoaded: {
      action: 'video-loaded',
      description: '影片載入完成函式',
    },
  },
  decorators: [
    (StoryComponent, { args }) => {
      const videoRef = useRef<HTMLVideoElement | null>(null);
      return (
        <div className="w-96 p-4 bg-gray-50 rounded-lg">
          <StoryComponent args={{ ...args, videoRef }} />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本播放器
export const Default: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 0,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 播放狀態
export const Playing: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: true,
    currentTime: 45,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 暫停狀態
export const Paused: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 30,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 顯示進度（播放中）
export const WithProgress: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: true,
    currentTime: 75,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 載入中狀態
export const LoadingState: Story = {
  args: {
    videoUrl: '',
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 長影片
export const LongVideo: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 180,
    duration: 600, // 10分鐘
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 短影片
export const ShortVideo: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: true,
    currentTime: 15,
    duration: 30,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 影片結束
export const VideoEnded: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 120,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 影片開始
export const VideoStart: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: true,
    currentTime: 0,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 30,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent, { args }) => {
      const videoRef = useRef<HTMLVideoElement | null>(null);
      return (
        <div className="w-72 p-2 bg-gray-50 rounded-lg">
          <StoryComponent args={{ ...args, videoRef }} />
        </div>
      );
    },
  ],
};

// 大螢幕檢視
export const LargeScreenView: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 60,
    duration: 180,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
  decorators: [
    (StoryComponent, { args }) => {
      const videoRef = useRef<HTMLVideoElement | null>(null);
      return (
        <div className="w-[600px] p-6 bg-gray-50 rounded-lg">
          <StoryComponent args={{ ...args, videoRef }} />
        </div>
      );
    },
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 45,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
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
            id: 'media-caption',
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
    videoUrl: mockVideoUrl,
    isPlaying: false,
    currentTime: 0,
    duration: 120,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '點擊播放按鈕或影片區域來測試播放控制功能',
      },
    },
  },
};

// 錯誤狀態（無效 URL）
export const ErrorState: Story = {
  args: {
    videoUrl: 'invalid-url',
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    atTogglePlayPause: fn(),
    atTimeUpdate: fn(),
    atVideoLoaded: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '無效影片 URL 的錯誤處理狀態',
      },
    },
  },
};

// 狀態比較展示
export const StateComparison: Story = {
  render: () => {
    const videoRef1 = useRef<HTMLVideoElement | null>(null);
    const videoRef2 = useRef<HTMLVideoElement | null>(null);
    const videoRef3 = useRef<HTMLVideoElement | null>(null);
    const videoRef4 = useRef<HTMLVideoElement | null>(null);

    return (
      <div className="space-y-6">
        <div className="text-lg font-bold">VideoPlayer 狀態比較</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">載入中</h3>
            <VideoPlayer
              videoUrl=""
              isPlaying={false}
              currentTime={0}
              duration={0}
              videoRef={videoRef1}
              atTogglePlayPause={fn()}
              atTimeUpdate={fn()}
              atVideoLoaded={fn()}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">暫停狀態</h3>
            <VideoPlayer
              videoUrl={mockVideoUrl}
              isPlaying={false}
              currentTime={30}
              duration={120}
              videoRef={videoRef2}
              atTogglePlayPause={fn()}
              atTimeUpdate={fn()}
              atVideoLoaded={fn()}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">播放中</h3>
            <VideoPlayer
              videoUrl={mockVideoUrl}
              isPlaying
              currentTime={45}
              duration={120}
              videoRef={videoRef3}
              atTogglePlayPause={fn()}
              atTimeUpdate={fn()}
              atVideoLoaded={fn()}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">接近結束</h3>
            <VideoPlayer
              videoUrl={mockVideoUrl}
              isPlaying={false}
              currentTime={115}
              duration={120}
              videoRef={videoRef4}
              atTogglePlayPause={fn()}
              atTimeUpdate={fn()}
              atVideoLoaded={fn()}
            />
          </div>
        </div>
      </div>
    );
  },
};
