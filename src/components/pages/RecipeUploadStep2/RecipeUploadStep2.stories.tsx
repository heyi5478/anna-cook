import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/test';
import RecipeUploadStep2 from './index';

// 模擬 Next.js router
const mockRouter = {
  push: () => {},
  query: { recipeId: '123' },
  pathname: '/upload-recipe-step2',
  asPath: '/upload-recipe-step2?recipeId=123',
  replace: () => {},
  reload: () => {},
  back: () => {},
  prefetch: () => Promise.resolve(),
  beforePopState: () => {},
  events: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
  route: '/upload-recipe-step2',
};

// Mock localStorage
const mockLocalStorage = {
  getItem: () => '馬鈴薯燉肉',
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

// 確保 localStorage 在 Storybook 環境中可用
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
}

const meta: Meta<typeof RecipeUploadStep2> = {
  title: 'Pages/RecipeUploadStep2',
  component: RecipeUploadStep2,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: false,
      router: {
        ...mockRouter,
        push: async () => {},
        replace: async () => {},
      },
    },
    docs: {
      description: {
        component:
          '食譜上傳第二步主頁面，包含食譜介紹、食材列表、標籤管理和烹調資訊等功能模組。',
      },
    },
    // Mock API 調用
    msw: {
      handlers: [
        // 這裡可以添加 MSW handlers 如果需要的話
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecipeUploadStep2>;

// 基本預設狀態
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '頁面的基本預設狀態，包含一個空的食材項目和預設的表單值。',
      },
    },
  },
};

// 已填寫部分資料的狀態
export const PartiallyFilled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '模擬使用者已經填寫部分資料的狀態，包含食譜介紹、部分食材和標籤。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待元件載入
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // 填寫食譜介紹
    const description = canvas.getByRole('textbox', { name: /輸入食譜介紹/i });
    await userEvent.clear(description);
    await userEvent.type(
      description,
      '這是一道經典的日式家常菜，醬汁香濃，口感豐富。',
    );

    // 填寫第一個食材
    const ingredientInputs = canvas.getAllByPlaceholderText('食材');
    if (ingredientInputs[0]) {
      await userEvent.clear(ingredientInputs[0]);
      await userEvent.type(ingredientInputs[0], '豬肉');
    }

    const amountInputs = canvas.getAllByPlaceholderText('份量');
    if (amountInputs[0]) {
      await userEvent.clear(amountInputs[0]);
      await userEvent.type(amountInputs[0], '500');
    }

    // 新增標籤
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');
    await userEvent.type(tagInput, '日式');
    const addTagBtn = canvas.getByRole('button', { name: /新增/ });
    await userEvent.click(addTagBtn);
  },
};

// 表單驗證錯誤狀態
export const WithValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: '展示各種表單驗證錯誤狀態，包含必填欄位錯誤和格式驗證錯誤。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待元件載入
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // 清空食譜介紹以觸發驗證錯誤
    const description = canvas.getByRole('textbox', { name: /輸入食譜介紹/i });
    await userEvent.clear(description);

    // 清空食材名稱
    const ingredientInputs = canvas.getAllByPlaceholderText('食材');
    if (ingredientInputs[0]) {
      await userEvent.clear(ingredientInputs[0]);
    }

    // 提交表單以觸發驗證
    const submitBtn = canvas.getByRole('button', { name: /下一步/ });
    await userEvent.click(submitBtn);
  },
};

// 多個食材的狀態
export const WithMultipleIngredients: Story = {
  parameters: {
    docs: {
      description: {
        story: '展示包含多個食材項目的狀態。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待元件載入
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // 新增多個食材
    const addIngredientBtn = canvas.getByRole('button', { name: /^食材$/ });
    await userEvent.click(addIngredientBtn);
    await userEvent.click(addIngredientBtn);

    // 填寫食材
    const ingredientInputs = canvas.getAllByPlaceholderText('食材');
    const amountInputs = canvas.getAllByPlaceholderText('份量');

    if (ingredientInputs[0]) {
      await userEvent.clear(ingredientInputs[0]);
      await userEvent.type(ingredientInputs[0], '豬肉');
    }
    if (amountInputs[0]) {
      await userEvent.clear(amountInputs[0]);
      await userEvent.type(amountInputs[0], '500');
    }

    if (ingredientInputs[1]) {
      await userEvent.type(ingredientInputs[1], '馬鈴薯');
    }
    if (amountInputs[1]) {
      await userEvent.type(amountInputs[1], '300');
    }

    if (ingredientInputs[2]) {
      await userEvent.type(ingredientInputs[2], '紅蘿蔔');
    }
    if (amountInputs[2]) {
      await userEvent.type(amountInputs[2], '150');
    }
  },
};

// 響應式設計測試 - 行動裝置
export const MobileView: Story = {
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

// 響應式設計測試 - 平板
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: '平板裝置上的響應式設計展示。',
      },
    },
  },
};

// 無障礙測試
export const AccessibilityTest: Story = {
  parameters: {
    docs: {
      description: {
        story: '無障礙功能測試，包含鍵盤導航和螢幕閱讀器支援。',
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
    const description = canvas.getByRole('textbox', { name: /輸入食譜介紹/i });
    description.focus();

    // 測試 Tab 鍵導航
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');

    // 測試 Enter 鍵操作
    const tagInput = canvas.getByPlaceholderText('輸入自訂標籤');
    tagInput.focus();
    await userEvent.type(tagInput, '無障礙測試');
    await userEvent.keyboard('{Enter}');
  },
};
