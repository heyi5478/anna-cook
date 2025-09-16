/* eslint-disable jsx-a11y/label-has-associated-control */
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Input, InputProps } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // CVA 變體自動生成控制項
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'CVA 變體選項',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'CVA 尺寸選項',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: '輸入類型',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用輸入框',
    },
    placeholder: {
      control: 'text',
      description: '佔位符文字',
    },
    onChange: {
      action: 'changed',
      description: '值變更事件處理函數',
    },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// 所有變體展示
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {['default', 'outline', 'ghost'].map((variant) => (
        <div key={variant} className="space-y-2">
          <label htmlFor={`input-${variant}`} className="text-sm font-medium">
            {variant}
          </label>
          <Input
            id={`input-${variant}`}
            variant={variant as InputProps['variant']}
            placeholder={`${variant} 輸入框`}
          />
        </div>
      ))}
    </div>
  ),
};

// 所有尺寸展示
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {['sm', 'default', 'lg'].map((size) => (
        <div key={size} className="space-y-2">
          <label htmlFor={`input-size-${size}`} className="text-sm font-medium">
            {size} 尺寸
          </label>
          <Input
            id={`input-size-${size}`}
            size={size as InputProps['size']}
            placeholder={`${size} 尺寸輸入框`}
          />
        </div>
      ))}
    </div>
  ),
};

// 基本範例
export const Default: Story = {
  args: {
    placeholder: '請輸入內容',
  },
};

// 預設變體
export const DefaultVariant: Story = {
  args: {
    variant: 'default',
    placeholder: 'Default variant',
  },
};

// 外框變體
export const Outline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Outline variant',
  },
};

// 幽靈變體
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
};

// 小尺寸
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

// 大尺寸
export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// 不同輸入類型
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="space-y-2">
        <label htmlFor="input-text" className="text-sm font-medium">
          文字輸入
        </label>
        <Input id="input-text" type="text" placeholder="輸入文字" />
      </div>
      <div className="space-y-2">
        <label htmlFor="input-email" className="text-sm font-medium">
          Email
        </label>
        <Input id="input-email" type="email" placeholder="輸入 email" />
      </div>
      <div className="space-y-2">
        <label htmlFor="input-password" className="text-sm font-medium">
          密碼
        </label>
        <Input id="input-password" type="password" placeholder="輸入密碼" />
      </div>
      <div className="space-y-2">
        <label htmlFor="input-number" className="text-sm font-medium">
          數字
        </label>
        <Input id="input-number" type="number" placeholder="輸入數字" />
      </div>
      <div className="space-y-2">
        <label htmlFor="input-tel" className="text-sm font-medium">
          電話
        </label>
        <Input id="input-tel" type="tel" placeholder="輸入電話號碼" />
      </div>
      <div className="space-y-2">
        <label htmlFor="input-search" className="text-sm font-medium">
          搜尋
        </label>
        <Input id="input-search" type="search" placeholder="搜尋內容" />
      </div>
    </div>
  ),
};

// 禁用狀態
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '禁用的輸入框',
    value: '無法編輯的內容',
  },
};

// 有值的狀態
export const WithValue: Story = {
  args: {
    value: '已填入的內容',
    placeholder: '這裡不會顯示',
  },
};

// 錯誤狀態
export const ErrorState: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <label htmlFor="error-email" className="text-sm font-medium">
        Email
      </label>
      <Input
        id="error-email"
        type="email"
        placeholder="輸入 email"
        className="border-red-500 focus-visible:ring-red-500"
        defaultValue="invalid-email"
      />
      <p className="text-sm text-red-500">請輸入正確的 email 格式</p>
    </div>
  ),
};

// 成功狀態
export const SuccessState: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <label htmlFor="success-username" className="text-sm font-medium">
        Username
      </label>
      <Input
        id="success-username"
        placeholder="輸入用戶名"
        className="border-green-500 focus-visible:ring-green-500"
        defaultValue="valid_username"
      />
      <p className="text-sm text-green-500">用戶名可以使用</p>
    </div>
  ),
};

// 帶圖示的輸入框
export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <label htmlFor="search-with-icon" className="text-sm font-medium">
          搜尋（左側圖示）
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            🔍
          </div>
          <Input
            id="search-with-icon"
            className="pl-10"
            placeholder="搜尋內容"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="password-with-icon" className="text-sm font-medium">
          密碼（右側圖示）
        </label>
        <div className="relative">
          <Input
            id="password-with-icon"
            type="password"
            className="pr-10"
            placeholder="輸入密碼"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            👁️
          </div>
        </div>
      </div>
    </div>
  ),
};

// 文件上傳
export const FileUpload: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <label htmlFor="file-upload" className="text-sm font-medium">
        文件上傳
      </label>
      <Input
        id="file-upload"
        type="file"
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
    </div>
  ),
};

// 互動測試範例：測試輸入功能
export const InteractiveTyping: Story = {
  args: {
    placeholder: '輸入測試文字',
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    // 測試輸入框存在
    await expect(input).toBeInTheDocument();

    // 測試輸入文字
    await userEvent.type(input, 'Hello World');
    await expect(input).toHaveValue('Hello World');

    // 確認 onChange 被調用
    await expect(args.onChange).toHaveBeenCalled();
  },
};

// 互動測試範例：測試清空功能
export const InteractiveClear: Story = {
  args: {
    placeholder: '輸入並清空',
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    // 輸入文字
    await userEvent.type(input, 'Test content');
    await expect(input).toHaveValue('Test content');

    // 全選並刪除
    await userEvent.keyboard('{Control>}a{/Control}');
    await userEvent.keyboard('{Delete}');
    await expect(input).toHaveValue('');

    // 確認 onChange 被調用
    await expect(args.onChange).toHaveBeenCalled();
  },
};

// 互動測試範例：測試禁用狀態
export const InteractiveDisabled: Story = {
  args: {
    disabled: true,
    placeholder: '禁用測試',
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    // 測試禁用狀態
    await expect(input).toBeDisabled();

    // 嘗試輸入（應該無效）
    await userEvent.type(input, 'Should not work');
    await expect(input).toHaveValue('');

    // 確認 onChange 未被調用
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

// 互動測試範例：測試鍵盤導航
export const InteractiveKeyboard: Story = {
  args: {
    placeholder: '鍵盤導航測試',
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    // 測試 Tab 鍵聚焦
    await userEvent.tab();
    await expect(input).toHaveFocus();

    // 測試 Escape 鍵失焦
    await userEvent.keyboard('{Escape}');
    // 注意：Escape 可能不會移除焦點，這取決於瀏覽器實作

    // 重新聚焦並測試方向鍵
    await userEvent.click(input);
    await userEvent.type(input, 'test');

    // 測試 Home 和 End 鍵
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard('{End}');
  },
};
