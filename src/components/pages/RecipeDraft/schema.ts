import * as z from 'zod';
import {
  VALIDATION_MESSAGES,
  TEXT_LIMITS,
  REGEX_PATTERNS,
} from '@/lib/constants';

// 表單驗證 Schema
export const recipeFormSchema = z.object({
  name: z
    .string()
    .min(
      TEXT_LIMITS.MIN_RECIPE_TITLE_LENGTH,
      VALIDATION_MESSAGES.REQUIRED_RECIPE_NAME,
    ),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z
        .string()
        .min(
          TEXT_LIMITS.MIN_INGREDIENT_NAME_LENGTH,
          VALIDATION_MESSAGES.REQUIRED_INGREDIENT_NAME,
        ),
      amount: z.string(),
      id: z.string().optional(),
    }),
  ),
  seasonings: z.array(
    z.object({
      name: z
        .string()
        .min(
          TEXT_LIMITS.MIN_SEASONING_NAME_LENGTH,
          VALIDATION_MESSAGES.REQUIRED_SEASONING_NAME,
        ),
      amount: z.string(),
      id: z.string().optional(),
    }),
  ),
  tags: z.array(z.string()),
  cookingTimeValue: z
    .string()
    .regex(REGEX_PATTERNS.NUMERIC_ONLY, VALIDATION_MESSAGES.NUMERIC_INPUT_ONLY),
  cookingTimeUnit: z.string(),
  servingsValue: z
    .string()
    .regex(REGEX_PATTERNS.NUMERIC_ONLY, VALIDATION_MESSAGES.NUMERIC_INPUT_ONLY),
  servingsUnit: z.string(),
});

// 表單值型別
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
