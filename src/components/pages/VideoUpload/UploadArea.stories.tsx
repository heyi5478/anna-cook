import type { Meta, StoryObj } from '@storybook/nextjs';
import UploadArea from './UploadArea';

/**
 * 檔案上傳事件處理器 Mock 函式
 */
const mockOnUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log('File selected:', event.target.files?.[0]);
};

/**
 * UploadArea 元件的 Storybook meta 配置
 */
const meta: Meta<typeof UploadArea> = {
  title: 'VideoUpload/UploadArea',
  component: UploadArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fileName: {
      control: { type: 'text' },
      description: '已選檔案名稱',
    },
    error: {
      control: { type: 'text' },
      description: '錯誤訊息',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '上傳進度百分比',
    },
    isUploading: {
      control: { type: 'boolean' },
      description: '是否正在上傳',
    },
    onUpload: {
      action: 'upload',
      description: '檔案選擇回調函式',
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

// 預設空白上傳區
export const Default: Story = {
  args: {
    fileName: '',
    onUpload: mockOnUpload,
  },
};

// 已選擇檔案
export const WithFileName: Story = {
  args: {
    fileName: 'sample-video.mp4',
    onUpload: mockOnUpload,
  },
};

// 上傳中狀態（含進度）
export const Uploading: Story = {
  args: {
    fileName: 'cooking-tutorial.mov',
    isUploading: true,
    progress: 65,
    onUpload: mockOnUpload,
  },
};

// 上傳開始狀態（0%）
export const UploadingStart: Story = {
  args: {
    fileName: 'recipe-demo.mp4',
    isUploading: true,
    progress: 0,
    onUpload: mockOnUpload,
  },
};

// 上傳即將完成（95%）
export const UploadingAlmostDone: Story = {
  args: {
    fileName: 'cooking-tips.mp4',
    isUploading: true,
    progress: 95,
    onUpload: mockOnUpload,
  },
};

// 錯誤狀態
export const ErrorState: Story = {
  args: {
    fileName: 'invalid-file.txt',
    error: '檔案格式不正確，請選擇有效的影片檔案',
    onUpload: mockOnUpload,
  },
};

// 檔案大小錯誤
export const FileSizeError: Story = {
  args: {
    fileName: 'large-video.mp4',
    error: '檔案大小超過限制，請選擇小於 100MB 的影片',
    onUpload: mockOnUpload,
  },
};

// 網路錯誤
export const NetworkError: Story = {
  args: {
    fileName: 'cooking-video.mp4',
    error: '網路連線不穩定，請檢查網路後重試',
    onUpload: mockOnUpload,
  },
};

// 準備完成狀態
export const ReadyState: Story = {
  args: {
    fileName: 'cooking-masterclass.mp4',
    onUpload: mockOnUpload,
  },
};

// 長檔案名稱測試
export const LongFileName: Story = {
  args: {
    fileName: '超長檔案名稱範例-烹飪教學影片-主廚示範完整製作過程-高清版本.mp4',
    onUpload: mockOnUpload,
  },
};

// 行動裝置檢視
export const MobileView: Story = {
  args: {
    fileName: 'mobile-video.mp4',
    onUpload: mockOnUpload,
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
    fileName: 'accessibility-test-video.mp4',
    onUpload: mockOnUpload,
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
        ],
      },
    },
  },
};

// 互動示範 - 上傳流程
export const InteractiveDemo: Story = {
  args: {
    fileName: '',
    onUpload: mockOnUpload,
  },
  parameters: {
    docs: {
      description: {
        story: '點擊上傳區域來模擬檔案選擇流程',
      },
    },
  },
};

// 多個狀態組合展示
export const StateComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-lg font-bold">UploadArea 狀態比較</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">空白狀態</h3>
          <UploadArea fileName="" onUpload={mockOnUpload} />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">已選檔案</h3>
          <UploadArea fileName="demo.mp4" onUpload={mockOnUpload} />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">上傳中</h3>
          <UploadArea
            fileName="uploading.mp4"
            isUploading
            progress={45}
            onUpload={mockOnUpload}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">錯誤狀態</h3>
          <UploadArea
            fileName="error.mp4"
            error="上傳失敗，請重試"
            onUpload={mockOnUpload}
          />
        </div>
      </div>
    </div>
  ),
};
