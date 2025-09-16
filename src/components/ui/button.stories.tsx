import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Button, ButtonProps } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // CVA 變體自動生成控制項
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'CVA 變體選項',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'CVA 尺寸選項',
    },
    asChild: {
      control: 'boolean',
      description: '是否將樣式應用於子元素',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用按鈕',
    },
    onClick: {
      action: 'clicked',
      description: '點擊事件處理函數',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 所有變體展示
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].map(
        (variant) => (
          <Button key={variant} variant={variant as ButtonProps['variant']}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
};

// 所有尺寸展示
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {['sm', 'default', 'lg', 'icon'].map((size) => (
        <Button key={size} size={size as ButtonProps['size']}>
          {size === 'icon' ? '🚀' : size}
        </Button>
      ))}
    </div>
  ),
};

// 基本範例
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// 主要按鈕
export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Primary Button',
  },
};

// 次要按鈕
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// 外框按鈕
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

// 危險操作按鈕
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

// 幽靈按鈕
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

// 連結樣式按鈕
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// 小尺寸按鈕
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

// 大尺寸按鈕
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// 圖示按鈕
export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🚀',
  },
};

// 禁用狀態
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// 載入狀態範例
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        載入中...
      </div>
    ),
  },
};

// 使用 asChild 屬性的範例
export const AsChild: Story = {
  args: {
    asChild: true,
    variant: 'outline',
    children: (
      <a href="https://example.com" className="no-underline">
        作為連結
      </a>
    ),
  },
};

// 互動測試範例：測試按鈕點擊
export const InteractiveClick: Story = {
  args: {
    children: '點擊我測試',
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // 測試按鈕是否存在且可見
    await expect(button).toBeInTheDocument();
    await expect(button).toBeVisible();

    // 測試點擊事件
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// 互動測試範例：測試禁用狀態
export const InteractiveDisabled: Story = {
  args: {
    children: '禁用按鈕測試',
    disabled: true,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // 測試按鈕處於禁用狀態
    await expect(button).toBeDisabled();

    // 嘗試點擊禁用的按鈕
    await userEvent.click(button);

    // 確認 onClick 未被調用
    await expect(args.onClick).toHaveBeenCalledTimes(0);
  },
};

// 互動測試範例：測試鍵盤操作
export const InteractiveKeyboard: Story = {
  args: {
    children: '鍵盤測試',
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // 測試 Tab 鍵聚焦
    await userEvent.tab();
    await expect(button).toHaveFocus();

    // 測試 Enter 鍵觸發點擊
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    // 測試 Space 鍵觸發點擊
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

// 互動測試範例：測試多種變體
export const InteractiveVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Button
        variant="default"
        onClick={args.onClick}
        data-testid="default-btn"
      >
        Default
      </Button>
      <Button
        variant="destructive"
        onClick={args.onClick}
        data-testid="destructive-btn"
      >
        Destructive
      </Button>
      <Button
        variant="outline"
        onClick={args.onClick}
        data-testid="outline-btn"
      >
        Outline
      </Button>
    </div>
  ),
  args: {
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // 測試每個變體按鈕
    const defaultBtn = canvas.getByTestId('default-btn');
    const destructiveBtn = canvas.getByTestId('destructive-btn');
    const outlineBtn = canvas.getByTestId('outline-btn');

    // 測試所有按鈕存在
    await expect(defaultBtn).toBeInTheDocument();
    await expect(destructiveBtn).toBeInTheDocument();
    await expect(outlineBtn).toBeInTheDocument();

    // 依序點擊每個按鈕
    await userEvent.click(defaultBtn);
    await userEvent.click(destructiveBtn);
    await userEvent.click(outlineBtn);

    // 確認所有按鈕都被點擊了
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};
