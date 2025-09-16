import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/test';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import TagsSection from './TagsSection';

// 表單預設值類型
type FormValues = {
  tags: string[];
};

// 包裝元件，提供必要的 react-hook-form context 和狀態管理
function TagsSectionWrapper({
  initialTags = [],
  maxTags = 5,
  title = '食譜標籤',
  ...props
}: {
  initialTags?: string[];
  maxTags?: number;
  title?: string;
}) {
  const [tags, setTags] = useState<string[]>(initialTags);

  const form = useForm<FormValues>({
    defaultValues: {
      tags: initialTags,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto p-4">
        <TagsSection
          tags={tags}
          setTags={setTags}
          setValue={form.setValue}
          errors={form.formState.errors}
          maxTags={maxTags}
          title={title}
          {...props}
        />
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof TagsSection> = {
  title: 'RecipeUploadStep2/TagsSection',
  component: TagsSectionWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '標籤管理區塊元件，支援新增、刪除標籤功能，並可設定最大標籤數量限制。',
      },
    },
  },
  argTypes: {
    maxTags: {
      control: { type: 'number', min: 1, max: 10 },
      description: '最大標籤數量',
      defaultValue: 5,
    },
    title: {
      control: 'text',
      description: '標題文字',
      defaultValue: '食譜標籤',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagsSectionWrapper>;

// 基本空狀態
export const Default: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: [],
  },
  parameters: {
    docs: {
      description: {
        story: '基本的標籤管理區塊，尚未新增任何標籤。',
      },
    },
  },
};

// 已有標籤的狀態
export const WithTags: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: ['日式', '家常菜', '燉煮'],
  },
  parameters: {
    docs: {
      description: {
        story: '已經新增了一些標籤的狀態展示。',
      },
    },
  },
};

// 達到最大標籤數量的狀態
export const MaxTagsReached: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: ['日式', '家常菜', '燉煮', '下飯', '簡單'],
  },
  parameters: {
    docs: {
      description: {
        story: '已達到最大標籤數量限制，新增功能被禁用。',
      },
    },
  },
};

// 自訂最大標籤數量
export const CustomMaxTags: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 3,
    initialTags: ['日式', '簡單'],
  },
  parameters: {
    docs: {
      description: {
        story: '自訂最大標籤數量為3個的狀態。',
      },
    },
  },
};

// 互動測試 - 新增標籤
export const InteractiveAddTag: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: [],
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示新增標籤的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 找到標籤輸入欄位
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');
    const addButton = canvas.getByRole('button', { name: /新增/ });

    // 新增第一個標籤
    await userEvent.type(tagInput, '日式料理');
    await userEvent.click(addButton);

    // 新增第二個標籤
    await userEvent.type(tagInput, '家常菜');
    await userEvent.click(addButton);

    // 新增第三個標籤
    await userEvent.type(tagInput, '簡單易做');
    await userEvent.click(addButton);
  },
};

// 互動測試 - 刪除標籤
export const InteractiveRemoveTag: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: ['日式', '家常菜', '燉煮', '下飯'],
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示刪除標籤的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待元件載入
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // 找到第二個標籤的刪除按鈕並點擊
    const removeButton = canvas.getByLabelText('移除標籤 家常菜');
    await userEvent.click(removeButton);
  },
};

// 互動測試 - Enter 鍵新增標籤
export const InteractiveEnterKey: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: [],
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示使用 Enter 鍵新增標籤的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 找到標籤輸入欄位
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');

    // 使用 Enter 鍵新增標籤
    await userEvent.type(tagInput, '快速料理');
    await userEvent.keyboard('{Enter}');

    // 再新增一個標籤
    await userEvent.type(tagInput, '營養豐富');
    await userEvent.keyboard('{Enter}');
  },
};

// 互動測試 - 重複標籤處理
export const InteractiveDuplicateTag: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: ['日式'],
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示重複標籤的處理機制。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 找到標籤輸入欄位
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');
    const addButton = canvas.getByRole('button', { name: /新增/ });

    // 嘗試新增重複的標籤
    await userEvent.type(tagInput, '日式');
    await userEvent.click(addButton);

    // 標籤應該不會被重複新增
  },
};

// 空輸入測試
export const EmptyInputTest: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: [],
  },
  parameters: {
    docs: {
      description: {
        story: '測試空輸入的處理，新增按鈕應該被禁用。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 找到標籤輸入欄位
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');

    // 清空輸入欄位
    await userEvent.clear(tagInput);

    // 新增按鈕應該被禁用
    // 可以檢查按鈕的 disabled 狀態
  },
};

// 響應式設計測試 - 行動裝置
export const MobileView: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: ['日式料理', '家常菜', '簡單易做', '營養豐富'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '行動裝置上的響應式設計展示。',
      },
    },
  },
};

// 無障礙測試
export const AccessibilityTest: Story = {
  args: {
    title: '食譜標籤',
    maxTags: 5,
    initialTags: ['日式'],
  },
  parameters: {
    docs: {
      description: {
        story: '無障礙功能測試，包含鍵盤導航和 ARIA 標籤。',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 測試鍵盤導航
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');
    tagInput.focus();

    // 使用 Tab 鍵導航到新增按鈕
    await userEvent.keyboard('{Tab}');

    // 測試刪除按鈕的鍵盤操作
    const removeButton = canvas.getByLabelText('移除標籤 日式');
    removeButton.focus();
    await userEvent.keyboard('{Enter}');
  },
};
