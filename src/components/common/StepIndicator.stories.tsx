import type { Meta, StoryObj } from '@storybook/nextjs';
import StepIndicator from './StepIndicator';

/**
 * StepIndicator 元件的 Storybook meta 配置
 */
const meta: Meta<typeof StepIndicator> = {
  title: 'Common/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 10 },
      description: '當前步驟數（1-10）',
    },
    totalSteps: {
      control: { type: 'number', min: 2, max: 10 },
      description: '總步驟數（2-10）',
    },
    labels: {
      control: { type: 'object' },
      description: '步驟標籤陣列',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: '元件尺寸',
    },
    spacing: {
      control: { type: 'select' },
      options: ['compact', 'default', 'relaxed'],
      description: '間距設定',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本預設狀態 - 3步驟，當前第2步
export const Default: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    labels: ['選擇檔案', '編輯內容', '完成上傳'],
  },
};

// 第一步狀態
export const FirstStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    labels: ['開始', '進行中', '完成'],
  },
};

// 最後步驟
export const LastStep: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
    labels: ['準備', '處理', '完成'],
  },
};

// 五步驟展示
export const FiveSteps: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    labels: ['基本資料', '上傳檔案', '設定參數', '預覽確認', '完成發布'],
  },
};

// 小尺寸
export const SmallSize: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    labels: ['步驟1', '步驟2', '步驟3', '步驟4'],
    size: 'sm',
  },
};

// 大尺寸
export const LargeSize: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    labels: ['開始', '處理', '檢查', '完成'],
    size: 'lg',
  },
};

// 緊湊間距
export const CompactSpacing: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    labels: ['上傳', '編輯', '發布'],
    spacing: 'compact',
  },
};

// 寬鬆間距
export const RelaxedSpacing: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    labels: ['選擇檔案', '編輯內容', '發布成功'],
    spacing: 'relaxed',
  },
};

// 行動裝置檢視（響應式測試）
export const MobileView: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    labels: ['上傳', '編輯', '完成'],
    size: 'sm',
    spacing: 'compact',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 無障礙測試 - 長標籤
export const AccessibilityTest: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    labels: ['上傳影片檔案', '編輯影片內容', '設定發布參數', '完成發布流程'],
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

// 所有步驟完成
export const AllCompleted: Story = {
  args: {
    currentStep: 4,
    totalSteps: 3,
    labels: ['上傳', '編輯', '完成'],
  },
};

// 長標籤測試
export const LongLabels: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    labels: ['選擇並上傳影片檔案', '編輯影片內容和描述', '發布到平台並分享'],
    spacing: 'relaxed',
  },
};
