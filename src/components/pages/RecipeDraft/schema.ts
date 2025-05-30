import * as z from 'zod';

// 表單驗證 Schema
export const recipeFormSchema = z.object({
  name: z.string().min(1, '請輸入食譜名稱'),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, '請輸入食材名稱'),
      amount: z.string(),
      id: z.string().optional(),
    }),
  ),
  seasonings: z.array(
    z.object({
      name: z.string().min(1, '請輸入調味料名稱'),
      amount: z.string(),
      id: z.string().optional(),
    }),
  ),
  tags: z.array(z.string()),
  cookingTimeValue: z.string().regex(/^\d*$/, '請輸入數字'),
  cookingTimeUnit: z.string(),
  servingsValue: z.string().regex(/^\d*$/, '請輸入數字'),
  servingsUnit: z.string(),
});

// 表單值型別
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
