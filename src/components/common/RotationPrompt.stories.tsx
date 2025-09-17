import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { RotationPrompt } from './RotationPrompt';

/**
 * RotationPrompt 元件的 Storybook meta 配置
 */
const meta: Meta<typeof RotationPrompt> = {
  title: 'Common/RotationPrompt',
  component: RotationPrompt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    show: {
      control: { type: 'boolean' },
      description: '是否顯示旋轉提示',
    },
    title: {
      control: { type: 'text' },
      description: '提示標題',
    },
    description: {
      control: { type: 'text' },
      description: '提示描述文字',
    },
    theme: {
      control: { type: 'select' },
      options: ['dark', 'light', 'accent'],
      description: '主題樣式',
    },
    backdrop: {
      control: { type: 'select' },
      options: ['darkBlur', 'lightBlur', 'solid', 'gradient'],
      description: '背景樣式',
    },
    size: {
      control: { type: 'select' },
      options: ['compact', 'normal', 'large'],
      description: '內容區域大小',
    },
    animation: {
      control: { type: 'select' },
      options: ['none', 'fade', 'scale', 'slide'],
      description: '進場動畫效果',
    },
    onDismiss: {
      action: 'dismiss',
      description: '關閉回調函式',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="h-screen bg-gray-100">
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本顯示狀態
export const Default: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
};

// 隱藏狀態
export const Hidden: Story = {
  args: {
    show: false,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    onDismiss: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '隱藏狀態下不會顯示任何內容',
      },
    },
  },
};

// 淺色主題
export const LightTheme: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'light',
    backdrop: 'lightBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
};

// 強調主題
export const AccentTheme: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'accent',
    backdrop: 'blur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
};

// 不同背景樣式
export const BlurBackdrop: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'blur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
};

export const NoBackdrop: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'accent',
    backdrop: 'none',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
};

// 不同尺寸
export const CompactSize: Story = {
  args: {
    show: true,
    title: '請旋轉裝置',
    description: '轉為橫向模式以獲得更好體驗',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'compact',
    animation: 'scale',
    onDismiss: fn(),
  },
};

export const LargeSize: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description:
      '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式。這將為您提供更寬廣的視野和更好的操作體驗。',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'large',
    animation: 'scale',
    onDismiss: fn(),
  },
};

// 不同動畫效果
export const BounceAnimation: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'bounce',
    onDismiss: fn(),
  },
};

export const PulseAnimation: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'pulse',
    onDismiss: fn(),
  },
};

export const NoAnimation: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'none',
    onDismiss: fn(),
  },
};

// 無關閉按鈕
export const WithoutDismiss: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: '沒有關閉按鈕的提示，只能通過裝置旋轉自動消失',
      },
    },
  },
};

// 自訂文字內容
export const CustomContent: Story = {
  args: {
    show: true,
    title: '觀看影片時請旋轉手機',
    description: '橫向模式可以提供更好的影片觀看體驗，讓您能夠看到更多細節',
    theme: 'accent',
    backdrop: 'lightBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
};

// 長文字內容測試
export const LongContent: Story = {
  args: {
    show: true,
    title: '為了獲得最佳的食譜觀看體驗，請旋轉您的行動裝置',
    description:
      '我們建議您將手機轉為橫向模式來觀看食譜影片。這樣您可以看到更完整的畫面，更清楚地觀察料理步驟和技巧。橫向模式還能提供更好的操作體驗，讓您更容易控制影片播放。',
    theme: 'light',
    backdrop: 'lightBlur',
    size: 'large',
    animation: 'pulse',
    onDismiss: fn(),
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 平板裝置檢視
export const TabletView: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的平板轉為橫向模式',
    theme: 'light',
    backdrop: 'lightBlur',
    size: 'large',
    animation: 'bounce',
    onDismiss: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
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
            id: 'dialog-name',
            enabled: true,
          },
          {
            id: 'focus-trap',
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
    show: true,
    title: '請旋轉您的裝置',
    description: '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
    theme: 'dark',
    backdrop: 'darkBlur',
    size: 'normal',
    animation: 'scale',
    onDismiss: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '點擊關閉按鈕或暫時關閉按鈕來測試互動功能',
      },
    },
  },
};

// 主題比較展示
export const ThemeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8">
      <div className="text-lg font-bold text-center">
        RotationPrompt 主題比較
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="relative h-64 border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-sm font-medium">
            深色主題
          </div>
          <RotationPrompt
            show
            title="深色主題"
            description="深色背景的旋轉提示"
            theme="dark"
            backdrop="darkBlur"
            size="compact"
            animation="scale"
            onDismiss={fn()}
          />
        </div>

        <div className="relative h-64 border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-sm font-medium">
            淺色主題
          </div>
          <RotationPrompt
            show
            title="淺色主題"
            description="淺色背景的旋轉提示"
            theme="light"
            backdrop="lightBlur"
            size="compact"
            animation="scale"
            onDismiss={fn()}
          />
        </div>

        <div className="relative h-64 border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-sm font-medium">
            強調主題
          </div>
          <RotationPrompt
            show
            title="強調主題"
            description="強調色彩的旋轉提示"
            theme="accent"
            backdrop="blur"
            size="compact"
            animation="scale"
            onDismiss={fn()}
          />
        </div>
      </div>
    </div>
  ),
};

// 尺寸比較展示
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-lg font-bold text-center">
        RotationPrompt 尺寸比較
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="relative h-80 border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-sm font-medium z-0">
            緊湊尺寸
          </div>
          <RotationPrompt
            show
            title="緊湊尺寸"
            description="較小的提示框"
            theme="dark"
            backdrop="darkBlur"
            size="compact"
            animation="pulse"
            onDismiss={fn()}
          />
        </div>

        <div className="relative h-80 border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-sm font-medium z-0">
            標準尺寸
          </div>
          <RotationPrompt
            show
            title="標準尺寸"
            description="預設大小的提示框"
            theme="dark"
            backdrop="darkBlur"
            size="normal"
            animation="pulse"
            onDismiss={fn()}
          />
        </div>

        <div className="relative h-80 border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-sm font-medium z-0">
            大型尺寸
          </div>
          <RotationPrompt
            show
            title="大型尺寸"
            description="較大的提示框，適合更多內容"
            theme="dark"
            backdrop="darkBlur"
            size="large"
            animation="pulse"
            onDismiss={fn()}
          />
        </div>
      </div>
    </div>
  ),
};
