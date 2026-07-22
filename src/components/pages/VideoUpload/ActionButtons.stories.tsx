import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import ActionButtons from './ActionButtons';

/**
 * Mock 片段資料 - 符合 10 字符要求
 */
const mockSegmentsValid = [
  {
    id: '1',
    description: '這是一段示範文字，長度超過10字符，用於測試驗證機制',
  },
  {
    id: '2',
    description: '第二段文字描述，同樣滿足最小字數要求',
  },
];

/**
 * Mock 片段資料 - 不符合 10 字符要求
 */
const mockSegmentsShort = [
  {
    id: '1',
    description: '太短',
  },
];

/**
 * Mock 錯誤資料
 */
const mockErrors = {
  description: '描述文字過短，至少需要 10 個字符',
};

/**
 * ActionButtons 元件的 Storybook meta 配置
 */
const meta: Meta<typeof ActionButtons> = {
  title: 'VideoUpload/ActionButtons',
  component: ActionButtons,
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
    isSubmitting: {
      control: { type: 'boolean' },
      description: '是否正在提交',
    },
    errors: {
      control: { type: 'object' },
      description: '錯誤訊息物件',
    },
    apiError: {
      control: { type: 'text' },
      description: 'API 錯誤訊息',
    },
    atSubmit: {
      action: 'submit',
      description: '提交回調函式',
    },
    setErrors: {
      action: 'setErrors',
      description: '設定錯誤函式',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-96 p-4 bg-gray-50 rounded-lg">
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本預設狀態
export const Default: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 有錯誤狀態（按鈕禁用）
export const WithErrors: Story = {
  args: {
    segments: mockSegmentsShort,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: mockErrors,
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 提交中狀態
export const Submitting: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: true,
    errors: {},
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 顯示強制提交按鈕
export const ForceSubmitVisible: Story = {
  args: {
    segments: [
      {
        id: '1',
        description: '這段文字其實已經超過10個字符了，但系統仍然顯示錯誤',
      },
    ],
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: mockErrors,
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 有 API 錯誤顯示
export const WithApiError: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: '網路連線失敗，請檢查網路設定後重試',
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 伺服器錯誤
export const ServerError: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: '伺服器暫時無法處理請求，請稍後再試（錯誤代碼：500）',
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 驗證錯誤
export const ValidationError: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: '影片檔案格式不符合要求，請上傳 MP4 或 MOV 格式',
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 多重錯誤狀態
export const MultipleErrors: Story = {
  args: {
    segments: mockSegmentsShort,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {
      description: '描述文字過短',
      title: '標題不能為空',
      duration: '影片長度不符合要求',
    },
    apiError: '同時發生多個錯誤，請檢查所有欄位',
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 無片段資料
export const NoSegments: Story = {
  args: {
    segments: [],
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-72 p-2 bg-gray-50 rounded-lg">
        <StoryComponent />
      </div>
    ),
  ],
};

// 無障礙功能測試
export const AccessibilityTest: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
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
        ],
      },
    },
  },
};

// 互動示範
export const InteractiveDemo: Story = {
  args: {
    segments: mockSegmentsValid,
    currentSegmentIndex: 0,
    isSubmitting: false,
    errors: {},
    apiError: null,
    atSubmit: fn(),
    setErrors: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '點擊完成按鈕來模擬提交流程',
      },
    },
  },
};

// 狀態比較展示
export const StateComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-lg font-bold">ActionButtons 狀態比較</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">正常狀態</h3>
          <ActionButtons
            segments={mockSegmentsValid}
            currentSegmentIndex={0}
            isSubmitting={false}
            errors={{}}
            apiError={null}
            atSubmit={fn()}
            setErrors={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">提交中</h3>
          <ActionButtons
            segments={mockSegmentsValid}
            currentSegmentIndex={0}
            isSubmitting
            errors={{}}
            apiError={null}
            atSubmit={fn()}
            setErrors={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">有錯誤</h3>
          <ActionButtons
            segments={mockSegmentsShort}
            currentSegmentIndex={0}
            isSubmitting={false}
            errors={mockErrors}
            apiError={null}
            atSubmit={fn()}
            setErrors={fn()}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">API 錯誤</h3>
          <ActionButtons
            segments={mockSegmentsValid}
            currentSegmentIndex={0}
            isSubmitting={false}
            errors={{}}
            apiError="上傳失敗，請重試"
            atSubmit={fn()}
            setErrors={fn()}
          />
        </div>
      </div>
    </div>
  ),
};
