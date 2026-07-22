import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { UserProfileCard } from './UserProfileCard';

/**
 * Mock 統計資料 - 基本數據
 */
const mockStatsBasic = [
  { label: '食譜', value: 12 },
  { label: '粉絲', value: 1234 },
  { label: '追蹤', value: 567 },
];

/**
 * Mock 統計資料 - 大數據
 */
const mockStatsLarge = [
  { label: '食譜', value: 156 },
  { label: '粉絲', value: 12345 },
  { label: '追蹤', value: 2567 },
];

/**
 * Mock 統計資料 - 新用戶
 */
const mockStatsNew = [
  { label: '食譜', value: 0 },
  { label: '粉絲', value: 5 },
  { label: '追蹤', value: 12 },
];

/**
 * Mock 操作按鈕
 */
const mockActionButton = {
  text: '追蹤',
  onClick: fn(),
};

/**
 * Mock 其他操作按鈕
 */
const mockEditButton = {
  text: '編輯資料',
  onClick: fn(),
};

const mockUnfollowButton = {
  text: '取消追蹤',
  onClick: fn(),
};

/**
 * UserProfileCard 元件的 Storybook meta 配置
 */
const meta: Meta<typeof UserProfileCard> = {
  title: 'Common/UserProfileCard',
  component: UserProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    userName: {
      control: { type: 'text' },
      description: '用戶名稱',
    },
    userAvatar: {
      control: { type: 'text' },
      description: '用戶頭像 URL',
    },
    stats: {
      control: { type: 'object' },
      description: '統計資料陣列',
    },
    actionButton: {
      control: { type: 'object' },
      description: '可選的操作按鈕',
    },
    size: {
      control: { type: 'select' },
      options: ['default'],
      description: '元件尺寸',
    },
    avatarSize: {
      control: { type: 'select' },
      options: ['default'],
      description: '頭像尺寸',
    },
    layout: {
      control: { type: 'select' },
      options: ['default'],
      description: '佈局樣式',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-80 p-6 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本資料卡
export const Default: Story = {
  args: {
    userName: '料理達人小王',
    userAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
  },
};

// 包含頭像的資料卡
export const WithAvatar: Story = {
  args: {
    userName: '美食家 Sarah',
    userAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
  },
};

// 預設頭像（無頭像）
export const WithoutAvatar: Story = {
  args: {
    userName: '新手廚師',
    userAvatar: '',
    stats: mockStatsNew,
  },
};

// 包含操作按鈕
export const WithActionButton: Story = {
  args: {
    userName: '大廚阿明',
    userAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
    actionButton: mockActionButton,
  },
};

// 編輯按鈕
export const WithEditButton: Story = {
  args: {
    userName: '我的個人資料',
    userAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
    actionButton: mockEditButton,
  },
};

// 取消追蹤按鈕
export const WithUnfollowButton: Story = {
  args: {
    userName: '知名料理師',
    userAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsLarge,
    actionButton: mockUnfollowButton,
  },
};

// 長用戶名測試
export const LongUserName: Story = {
  args: {
    userName: '這是一個很長很長的用戶名稱測試顯示效果',
    userAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
    actionButton: mockActionButton,
  },
};

// 大數據統計
export const WithLargeStats: Story = {
  args: {
    userName: '知名美食博主',
    userAvatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsLarge,
    actionButton: mockActionButton,
  },
};

// 新用戶數據
export const NewUser: Story = {
  args: {
    userName: '料理新手',
    userAvatar:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsNew,
    actionButton: mockActionButton,
  },
};

// 無統計資料
export const WithoutStats: Story = {
  args: {
    userName: '簡單用戶',
    userAvatar:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop&crop=face',
    stats: [],
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    userName: '手機用戶',
    userAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
    actionButton: mockActionButton,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-72 p-4 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    userName: '無障礙測試用戶',
    userAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
    actionButton: mockActionButton,
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
            id: 'image-alt',
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
    userName: '互動測試',
    userAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    stats: mockStatsBasic,
    actionButton: mockActionButton,
  },
  parameters: {
    docs: {
      description: {
        story: '點擊追蹤按鈕來測試互動功能',
      },
    },
  },
};

// 狀態比較展示
export const StateComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-lg font-bold">UserProfileCard 狀態比較</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">基本狀態</h3>
          <UserProfileCard
            userName="基本用戶"
            userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
            stats={mockStatsBasic}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">有操作按鈕</h3>
          <UserProfileCard
            userName="可追蹤用戶"
            userAvatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
            stats={mockStatsBasic}
            actionButton={mockActionButton}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">新用戶</h3>
          <UserProfileCard
            userName="新手料理師"
            userAvatar=""
            stats={mockStatsNew}
            actionButton={mockActionButton}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">知名用戶</h3>
          <UserProfileCard
            userName="料理大師"
            userAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
            stats={mockStatsLarge}
            actionButton={mockUnfollowButton}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">長名稱</h3>
          <UserProfileCard
            userName="這是超級長的用戶名稱測試"
            userAvatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face"
            stats={mockStatsBasic}
            actionButton={mockEditButton}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">無統計數據</h3>
          <UserProfileCard
            userName="簡潔用戶"
            userAvatar="https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop&crop=face"
            stats={[]}
          />
        </div>
      </div>
    </div>
  ),
};
