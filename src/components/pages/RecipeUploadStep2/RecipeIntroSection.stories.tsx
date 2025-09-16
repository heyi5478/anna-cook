import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/test';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RecipeIntroSection from './RecipeIntroSection';

// 表單 schema 定義
const recipeIntroSchema = z.object({
  recipeDescription: z
    .string()
    .min(10, '食譜介紹至少需要 10 個字元')
    .max(1000, '食譜介紹不可超過 1000 個字元'),
});

type RecipeIntroFormData = z.infer<typeof recipeIntroSchema>;

// 包裝元件，提供必要的 react-hook-form context
function RecipeIntroSectionWrapper({
  recipeName = '馬鈴薯燉肉',
  defaultValues = { recipeDescription: '' },
  hasErrors = false,
  ...props
}: {
  recipeName?: string;
  defaultValues?: Partial<RecipeIntroFormData>;
  hasErrors?: boolean;
}) {
  const form = useForm<RecipeIntroFormData>({
    resolver: zodResolver(recipeIntroSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <div className="max-w-4xl mx-auto p-4">
        <RecipeIntroSection
          recipeName={recipeName}
          register={form.register}
          errors={hasErrors ? form.formState.errors : undefined}
          {...props}
        />
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof RecipeIntroSectionWrapper> = {
  title: 'RecipeUploadStep2/RecipeIntroSection',
  component: RecipeIntroSectionWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '食譜介紹區塊元件，包含食譜標題顯示和介紹文字輸入功能，支援表單驗證。',
      },
    },
  },
  argTypes: {
    recipeName: {
      control: 'text',
      description: '食譜名稱',
    },
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
type Story = StoryObj<typeof RecipeIntroSectionWrapper>;

// 基本預設狀態
export const Default: Story = {
  args: {
    recipeName: '馬鈴薯燉肉',
    defaultValues: { recipeDescription: '' },
  },
  parameters: {
    docs: {
      description: {
        story: '基本的食譜介紹區塊，包含預設的食譜名稱和空的介紹欄位。',
      },
    },
  },
};

// 自訂食譜名稱
export const CustomRecipeName: Story = {
  args: {
    recipeName: '日式親子丼',
    defaultValues: { recipeDescription: '' },
  },
  parameters: {
    docs: {
      description: {
        story: '自訂食譜名稱的狀態展示。',
      },
    },
  },
};

// 已填寫介紹的狀態
export const WithDescription: Story = {
  args: {
    recipeName: '義式番茄義大利麵',
    defaultValues: {
      recipeDescription:
        '經典的義式番茄義大利麵，使用新鮮的番茄醬汁，搭配香草和帕馬森起司，口味層次豐富。這道菜簡單易做，適合平日晚餐或招待朋友。',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '已經填寫食譜介紹內容的狀態展示。',
      },
    },
  },
};

// 表單驗證錯誤狀態
export const WithValidationErrors: Story = {
  args: {
    recipeName: '測試食譜',
    defaultValues: { recipeDescription: '太短' },
    hasErrors: true,
  },
  parameters: {
    docs: {
      description: {
        story: '展示表單驗證錯誤狀態，當介紹文字過短時的錯誤顯示。',
      },
    },
  },
};

// 長食譜名稱測試
export const LongRecipeName: Story = {
  args: {
    recipeName: '奶奶的祕傳紅燒獅子頭配香菇青江菜湯',
    defaultValues: { recipeDescription: '' },
  },
  parameters: {
    docs: {
      description: {
        story: '測試較長的食譜名稱顯示效果。',
      },
    },
  },
};

// 互動測試 - 填寫介紹
export const InteractiveFillDescription: Story = {
  args: {
    recipeName: '台式滷肉飯',
    defaultValues: { recipeDescription: '' },
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：展示填寫食譜介紹的功能。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 找到食譜介紹文字區域
    const descriptionTextarea = canvas.getByPlaceholderText(/食譜簡介料理/);

    // 填寫食譜介紹
    await userEvent.clear(descriptionTextarea);
    await userEvent.type(
      descriptionTextarea,
      '經典台式滷肉飯，香濃的滷汁搭配Q彈的白飯，是台灣人最愛的家常美食。使用五花肉慢燉而成，口感豐富，香氣四溢。',
    );
  },
};

// 互動測試 - 清空內容觸發錯誤
export const InteractiveClearContent: Story = {
  args: {
    recipeName: '測試食譜',
    defaultValues: {
      recipeDescription: '這是一個測試用的食譜介紹內容。',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '互動測試：清空介紹內容以觸發驗證錯誤。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 找到並清空文字區域
    const descriptionTextarea = canvas.getByPlaceholderText(/食譜簡介料理/);
    await userEvent.clear(descriptionTextarea);

    // 點擊其他地方觸發驗證
    await userEvent.click(canvas.getByText('輸入食譜介紹'));
  },
};

// 字數限制測試 - 最大長度
export const MaxLengthTest: Story = {
  args: {
    recipeName: '長篇介紹測試',
    defaultValues: {
      recipeDescription: '這是一個測試超長食譜介紹的範例。'.repeat(30),
    },
  },
  parameters: {
    docs: {
      description: {
        story: '測試接近字數上限的介紹內容顯示效果。',
      },
    },
  },
};

// 響應式設計測試 - 行動裝置
export const MobileView: Story = {
  args: {
    recipeName: '手機版測試食譜',
    defaultValues: {
      recipeDescription:
        '在手機上查看的食譜介紹，需要確保文字區域和標題都能正常顯示和編輯。',
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
    recipeName: '無障礙測試食譜',
    defaultValues: { recipeDescription: '' },
  },
  parameters: {
    docs: {
      description: {
        story: '無障礙功能測試，包含 ARIA 標籤和鍵盤導航。',
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

    // 測試 ARIA 標籤關聯
    const descriptionLabel = canvas.getByText('輸入食譜介紹');
    const descriptionTextarea = canvas.getByPlaceholderText(/食譜簡介料理/);

    // 點擊標籤應該 focus 到對應的文字區域
    await userEvent.click(descriptionLabel);

    // 測試鍵盤導航
    await userEvent.keyboard('{Tab}');

    // 測試文字輸入
    await userEvent.type(descriptionTextarea, '測試無障礙功能的食譜介紹內容。');
  },
};

// 空食譜名稱測試
export const EmptyRecipeName: Story = {
  args: {
    recipeName: '',
    defaultValues: { recipeDescription: '' },
  },
  parameters: {
    docs: {
      description: {
        story: '測試空食譜名稱時的顯示效果，應該顯示預設名稱。',
      },
    },
  },
};

// 自訂樣式測試
export const CustomStyling: Story = {
  args: {
    recipeName: '自訂樣式測試',
    defaultValues: { recipeDescription: '測試自訂樣式的食譜介紹。' },
  },
  parameters: {
    docs: {
      description: {
        story: '自訂樣式測試，展示元件的預設樣式效果。',
      },
    },
  },
};
