import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/test';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CookingInfo from './CookingInfo';

// 表單 schema 定義
const cookingInfoSchema = z.object({
  cookingTime: z
    .number()
    .min(1, '烹調時間至少需要 1 分鐘')
    .max(1440, '烹調時間不可超過 24 小時'),
  servings: z
    .number()
    .min(1, '人份至少需要 1 人份')
    .max(50, '人份不可超過 50 人份'),
});

type CookingInfoFormData = z.infer<typeof cookingInfoSchema>;

// 包裝元件，提供必要的 react-hook-form context
function CookingInfoWrapper({
  defaultValues = { cookingTime: undefined, servings: undefined },
  hasErrors = false,
  ...props
}: {
  defaultValues?: Partial<CookingInfoFormData>;
  hasErrors?: boolean;
}) {
  const form = useForm<CookingInfoFormData>({
    resolver: zodResolver(cookingInfoSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto p-4">
        <CookingInfo
          register={form.register}
          errors={hasErrors ? form.formState.errors : undefined}
          {...props}
        />
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof CookingInfoWrapper> = {
  title: 'RecipeUploadStep2/CookingInfo',
  component: CookingInfoWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '烹調資訊區塊元件，包含烹調時間和人份數設定，支援表單驗證和錯誤顯示。',
      },
    },
  },
  argTypes: {
    defaultValues: {
      control: 'object',
      description: '表單預設值',
    },
    hasErrors: {
      control: 'boolean',
      description: '是否顯示錯誤狀態',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CookingInfoWrapper>;

// 基本空狀態
export const Default: Story = {
  args: {
    defaultValues: { cookingTime: undefined, servings: undefined },
  },
  parameters: {
    docs: {
      description: {
        story: '基本的烹調資訊輸入區塊，尚未填寫任何數值。',
      },
    },
  },
};

// 已填寫數值的狀態
export const WithValues: Story = {
  args: {
    defaultValues: { cookingTime: 120, servings: 4 },
  },
  parameters: {
    docs: {
      description: {
        story: '已經填寫烹調時間（120分鐘）和人份數（4人份）的狀態。',
      },
    },
  },
};

// 表單驗證錯誤狀態
export const WithValidationErrors: Story = {
  args: {
    defaultValues: { cookingTime: 0, servings: 0 },
    hasErrors: true,
  },
  parameters: {
    docs: {
      description: {
        story: '展示表單驗證錯誤狀態，包含錯誤訊息顯示。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 輸入無效的數值
    const cookingTimeInput = canvas.getByPlaceholderText('120');
    const servingsInput = canvas.getByPlaceholderText('4');

    await userEvent.clear(cookingTimeInput);
    await userEvent.type(cookingTimeInput, '0');

    await userEvent.clear(servingsInput);
    await userEvent.type(servingsInput, '0');

    // 觸發驗證
    await userEvent.tab();
  },
};

// 互動測試 - 填寫數值
export const InteractiveFillValues: Story = {
  args: {
    defaultValues: { cookingTime: undefined, servings: undefined },
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示填寫烹調時間和人份數的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 填寫烹調時間
    const cookingTimeInput = canvas.getByPlaceholderText('120');
    await userEvent.clear(cookingTimeInput);
    await userEvent.type(cookingTimeInput, '90');

    // 填寫人份數
    const servingsInput = canvas.getByPlaceholderText('4');
    await userEvent.clear(servingsInput);
    await userEvent.type(servingsInput, '6');
  },
};

// 邊界值測試 - 最小值
export const MinimumValues: Story = {
  args: {
    defaultValues: { cookingTime: 1, servings: 1 },
  },
  parameters: {
    docs: {
      description: {
        story: '邊界值測試：最小允許值（1分鐘，1人份）。',
      },
    },
  },
};

// 邊界值測試 - 大數值
export const LargeValues: Story = {
  args: {
    defaultValues: { cookingTime: 480, servings: 20 },
  },
  parameters: {
    docs: {
      description: {
        story:
          '大數值測試：較大的烹調時間（480分鐘，8小時）和人份數（20人份）。',
      },
    },
  },
};

// 響應式設計測試 - 行動裝置
export const MobileView: Story = {
  args: {
    defaultValues: { cookingTime: 120, servings: 4 },
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
    defaultValues: { cookingTime: undefined, servings: undefined },
  },
  parameters: {
    docs: {
      description: {
        story: '無障礙功能測試，包含標籤關聯性和鍵盤導航。',
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
            id: 'label-has-associated-control',
            enabled: true,
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 測試鍵盤導航
    const cookingTimeInput = canvas.getByPlaceholderText('120');
    cookingTimeInput.focus();

    // 使用 Tab 鍵導航
    await userEvent.keyboard('{Tab}');

    // 測試 label 關聯
    const servingsLabel = canvas.getByText('幾人份');

    // 點擊 label 應該 focus 到對應的 input
    await userEvent.click(servingsLabel);
  },
};

// 自訂樣式測試
export const CustomStyling: Story = {
  args: {
    defaultValues: { cookingTime: 60, servings: 2 },
  },
  parameters: {
    docs: {
      description: {
        story: '自訂樣式測試，展示元件的預設樣式。',
      },
    },
  },
};
