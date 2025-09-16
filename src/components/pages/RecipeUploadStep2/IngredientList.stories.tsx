import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/test';
import { useFieldArray, useForm, FormProvider } from 'react-hook-form';
import IngredientList from './IngredientList';

// 表單預設值類型
type FormValues = {
  ingredients: Array<{
    id: string;
    name: string;
    amount: string;
    unit?: string;
    isFlavoring?: boolean;
  }>;
  seasonings: Array<{
    id: string;
    name: string;
    amount: string;
    unit?: string;
  }>;
};

// 包裝元件，提供必要的 react-hook-form context
function IngredientListWrapper({
  isSeasoningMode = false,
  initialValues,
  ...props
}: any) {
  const form = useForm<FormValues>({
    defaultValues: initialValues || {
      ingredients: [
        { id: '1', name: '', amount: '', unit: '', isFlavoring: false },
      ],
      seasonings: [{ id: '1', name: '', amount: '', unit: '' }],
    },
  });

  const fieldArrayName = isSeasoningMode ? 'seasonings' : 'ingredients';

  const fieldArray = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto p-4">
        <IngredientList
          fields={fieldArray.fields}
          onAdd={() => {
            const newItem = isSeasoningMode
              ? {
                  id: Date.now().toString(),
                  name: '',
                  amount: '',
                  unit: '',
                }
              : {
                  id: Date.now().toString(),
                  name: '',
                  amount: '',
                  unit: '',
                  isFlavoring: false,
                };
            fieldArray.append(newItem);
          }}
          onRemove={fieldArray.remove}
          register={form.register}
          errors={form.formState.errors}
          isSeasoningMode={isSeasoningMode}
          {...props}
        />
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof IngredientList> = {
  title: 'RecipeUploadStep2/IngredientList',
  component: IngredientListWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '動態食材/調料列表元件，支援新增、刪除和編輯功能。',
      },
    },
  },
  argTypes: {
    isSeasoningMode: {
      control: 'boolean',
      description: '是否為調料模式',
      defaultValue: false,
    },
    title: {
      control: 'text',
      description: '標題文字',
    },
    addButtonText: {
      control: 'text',
      description: '新增按鈕文字',
    },
    itemPlaceholder: {
      control: 'text',
      description: '輸入框 placeholder',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IngredientListWrapper>;

// 基本食材列表
export const Default: Story = {
  args: {
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
  },
  parameters: {
    docs: {
      description: {
        story: '基本的食材列表，包含一個空的輸入項目。',
      },
    },
  },
};

// 調料列表
export const SeasoningMode: Story = {
  args: {
    isSeasoningMode: true,
    title: '所需調料',
    addButtonText: '調料',
    itemPlaceholder: '調料',
  },
  parameters: {
    docs: {
      description: {
        story: '調料模式的列表，用於管理調料項目。',
      },
    },
  },
};

// 已填寫資料的狀態
export const WithData: Story = {
  args: {
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
    initialValues: {
      ingredients: [
        { id: '1', name: '豬肉', amount: '500', unit: 'g', isFlavoring: false },
        {
          id: '2',
          name: '馬鈴薯',
          amount: '300',
          unit: 'g',
          isFlavoring: false,
        },
        {
          id: '3',
          name: '紅蘿蔔',
          amount: '150',
          unit: 'g',
          isFlavoring: false,
        },
      ],
      seasonings: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '已填寫多個食材的狀態展示。',
      },
    },
  },
};

// 調料已填寫資料的狀態
export const SeasoningWithData: Story = {
  args: {
    isSeasoningMode: true,
    title: '所需調料',
    addButtonText: '調料',
    itemPlaceholder: '調料',
    initialValues: {
      ingredients: [],
      seasonings: [
        { id: '1', name: '醬油', amount: '2', unit: '大匙' },
        { id: '2', name: '鹽', amount: '1', unit: '小匙' },
        { id: '3', name: '糖', amount: '1', unit: '小匙' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '已填寫多個調料的狀態展示。',
      },
    },
  },
};

// 互動測試 - 新增項目
export const InteractiveAddItem: Story = {
  args: {
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示新增食材項目的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 填寫第一個食材
    const firstNameInput = canvas.getAllByPlaceholderText('食材')[0];
    const firstAmountInput = canvas.getAllByPlaceholderText('份量')[0];

    await userEvent.type(firstNameInput, '雞胸肉');
    await userEvent.type(firstAmountInput, '300');

    // 新增第二個食材
    const addButton = canvas.getByRole('button', { name: /食材/ });
    await userEvent.click(addButton);

    // 填寫第二個食材
    const secondNameInput = canvas.getAllByPlaceholderText('食材')[1];
    const secondAmountInput = canvas.getAllByPlaceholderText('份量')[1];

    await userEvent.type(secondNameInput, '青椒');
    await userEvent.type(secondAmountInput, '2');
  },
};

// 互動測試 - 刪除項目
export const InteractiveRemoveItem: Story = {
  args: {
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
    initialValues: {
      ingredients: [
        { id: '1', name: '豬肉', amount: '500', unit: 'g', isFlavoring: false },
        {
          id: '2',
          name: '馬鈴薯',
          amount: '300',
          unit: 'g',
          isFlavoring: false,
        },
        {
          id: '3',
          name: '紅蘿蔔',
          amount: '150',
          unit: 'g',
          isFlavoring: false,
        },
      ],
      seasonings: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示刪除食材項目的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待元件載入
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // 找到第二個項目的刪除按鈕並點擊
    const deleteButtons = canvas.getAllByLabelText(/刪除食材/);
    if (deleteButtons[1]) {
      await userEvent.click(deleteButtons[1]);
    }
  },
};

// 空狀態
export const Empty: Story = {
  args: {
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
    initialValues: {
      ingredients: [],
      seasonings: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '完全空的狀態，只顯示新增按鈕。',
      },
    },
  },
};

// 響應式設計測試 - 行動裝置
export const MobileView: Story = {
  args: {
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
    initialValues: {
      ingredients: [
        { id: '1', name: '豬肉', amount: '500', unit: 'g', isFlavoring: false },
        {
          id: '2',
          name: '馬鈴薯',
          amount: '300',
          unit: 'g',
          isFlavoring: false,
        },
      ],
      seasonings: [],
    },
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
    isSeasoningMode: false,
    title: '所需食材',
    addButtonText: '食材',
    itemPlaceholder: '食材',
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
    const firstInput = canvas.getAllByPlaceholderText('食材')[0];
    firstInput.focus();

    // 使用 Tab 鍵在欄位間導航
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');

    // 測試新增按鈕的鍵盤操作
    const addButton = canvas.getByRole('button', { name: /食材/ });
    addButton.focus();
    await userEvent.keyboard('{Enter}');
  },
};
