import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import SegmentDescription from './SegmentDescription';

/**
 * Mock 片段資料 - 空描述
 */
const mockEmptySegments = [
  {
    id: '1',
    description: '',
  },
  {
    id: '2',
    description: '',
  },
];

/**
 * Mock 片段資料 - 短描述（不符合最小字數）
 */
const mockShortDescriptionSegments = [
  {
    id: '1',
    description: '太短了',
  },
  {
    id: '2',
    description: '不夠十字',
  },
];

/**
 * Mock 片段資料 - 有效描述
 */
const mockValidSegments = [
  {
    id: '1',
    description: '準備食材：洗淨蔬菜並切成適當大小',
  },
  {
    id: '2',
    description: '熱鍋下油，爆香蔥薑蒜，讓香味充分釋放',
  },
  {
    id: '3',
    description: '加入蔬菜拌炒，調味起鍋，最後擺盤裝飾',
  },
];

/**
 * Mock 片段資料 - 長描述
 */
const mockLongDescriptionSegments = [
  {
    id: '1',
    description:
      '這是一段非常詳細的料理步驟描述，包含了許多細節和注意事項，用來測試長文字的顯示效果和排版是否正常運作',
  },
  {
    id: '2',
    description:
      '準備各種新鮮食材：包括當季蔬菜、優質肉類、天然調味料等，並進行仔細的清洗、切片、醃製等預處理工作，確保每個步驟都達到最佳狀態',
  },
];

/**
 * Mock 片段資料 - 剛好 10 字符
 */
const mockExactLengthSegments = [
  {
    id: '1',
    description: '1234567890', // 剛好 10 字符
  },
];

/**
 * SegmentDescription 元件的 Storybook meta 配置
 */
const meta: Meta<typeof SegmentDescription> = {
  title: 'VideoUpload/SegmentDescription',
  component: SegmentDescription,
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
    error: {
      control: { type: 'text' },
      description: '錯誤訊息',
    },
    atDescriptionChange: {
      action: 'description-change',
      description: '描述變更回調',
    },
    validateForm: {
      action: 'validate-form',
      description: '表單驗證回調',
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

// 基本空描述
export const Default: Story = {
  args: {
    segments: mockEmptySegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
};

// 空描述狀態
export const EmptyDescription: Story = {
  args: {
    segments: mockEmptySegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '描述欄位為空的初始狀態',
      },
    },
  },
};

// 短描述（正常狀態但未達到最小字數）
export const ShortDescription: Story = {
  args: {
    segments: mockShortDescriptionSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '描述文字少於 10 字符，但尚未顯示錯誤',
      },
    },
  },
};

// 有錯誤狀態
export const WithError: Story = {
  args: {
    segments: mockShortDescriptionSegments,
    currentSegmentIndex: 0,
    error: '描述文字過短，至少需要 10 個字符',
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '顯示錯誤訊息時的狀態',
      },
    },
  },
};

// 有效描述（達到最小字數）
export const ValidDescription: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '描述文字達到最小字數要求的有效狀態',
      },
    },
  },
};

// 長描述測試
export const LongDescription: Story = {
  args: {
    segments: mockLongDescriptionSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '長描述文字的顯示效果',
      },
    },
  },
};

// 剛好 10 字符的邊界測試
export const ExactMinimumLength: Story = {
  args: {
    segments: mockExactLengthSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '剛好達到最小字數要求（10 字符）的邊界測試',
      },
    },
  },
};

// 第二個片段
export const SecondSegment: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 1,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '顯示第二個片段的描述編輯',
      },
    },
  },
};

// 第三個片段
export const ThirdSegment: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 2,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '顯示第三個片段的描述編輯',
      },
    },
  },
};

// 驗證錯誤（API 錯誤）
export const ApiError: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: '伺服器錯誤，請稍後再試',
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'API 相關錯誤的顯示狀態',
      },
    },
  },
};

// 網路錯誤
export const NetworkError: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: '網路連線失敗，請檢查網路連接',
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '網路錯誤時的狀態顯示',
      },
    },
  },
};

// 格式錯誤
export const FormatError: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: '描述內容包含不允許的字符',
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '格式驗證錯誤的狀態',
      },
    },
  },
};

// 長錯誤訊息
export const LongErrorMessage: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error:
      '這是一個很長的錯誤訊息，用來測試當錯誤文字很長時的顯示效果和排版是否正常，確保不會影響整體佈局',
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '長錯誤訊息的顯示效果',
      },
    },
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
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
    segments: mockLongDescriptionSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-full max-w-md p-4 bg-white border rounded-lg shadow-sm">
        <StoryComponent />
      </div>
    ),
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: '描述文字過短，至少需要 10 個字符',
    atDescriptionChange: fn(),
    validateForm: fn(),
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
            id: 'label',
            enabled: true,
          },
          {
            id: 'aria-input-field-name',
            enabled: true,
          },
          {
            id: 'aria-describedby',
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
    segments: mockValidSegments,
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '在文字區域中輸入文字來測試字符計數和驗證功能',
      },
    },
  },
};

// 字符計數測試
export const CharacterCountTest: Story = {
  args: {
    segments: [
      {
        id: '1',
        description: '12345', // 5 字符
      },
    ],
    currentSegmentIndex: 0,
    error: undefined,
    atDescriptionChange: fn(),
    validateForm: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '測試字符計數功能（5/10 字符）',
      },
    },
  },
};

// 狀態比較展示
export const StateComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-lg font-bold text-center">
        SegmentDescription 狀態比較
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-gray-600">
            空描述（正常狀態）
          </h3>
          <SegmentDescription
            segments={mockEmptySegments}
            currentSegmentIndex={0}
            error={undefined}
            atDescriptionChange={fn()}
            validateForm={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-green-600">
            有效描述（成功狀態）
          </h3>
          <SegmentDescription
            segments={mockValidSegments}
            currentSegmentIndex={0}
            error={undefined}
            atDescriptionChange={fn()}
            validateForm={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-red-600">錯誤狀態</h3>
          <SegmentDescription
            segments={mockShortDescriptionSegments}
            currentSegmentIndex={0}
            error="描述文字過短，至少需要 10 個字符"
            atDescriptionChange={fn()}
            validateForm={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-blue-600">長描述</h3>
          <SegmentDescription
            segments={mockLongDescriptionSegments}
            currentSegmentIndex={0}
            error={undefined}
            atDescriptionChange={fn()}
            validateForm={fn()}
          />
        </div>
      </div>
    </div>
  ),
};
