/**
 * 預設值常數
 */

import type { Step } from '@/types/recipe';

// 預設食譜步驟
export const DEFAULT_RECIPE_STEPS: Step[] = [
  {
    id: 1,
    startTime: 0.12,
    endTime: 0.3,
    description: '步驟一：加入花生醬燒煮，醬汁香濃醇厚',
  },
  {
    id: 2,
    startTime: 10,
    endTime: 20,
    description: '步驟二：混合調味料，增添風味',
  },
  {
    id: 3,
    startTime: 23,
    endTime: 30,
    description: '步驟三：完成料理，裝盤即可享用',
  },
];

// 預設表單值
export const DEFAULT_FORM_VALUES = {
  RECIPE_FORM: {
    name: '',
    description: '',
    ingredients: [] as { name: string; amount: string; id?: string }[],
    seasonings: [] as { name: string; amount: string; id?: string }[],
    tags: [] as string[],
    cookingTimeValue: '',
    cookingTimeUnit: '分鐘',
    servingsValue: '',
    servingsUnit: '人份',
  },
  PROFILE_FORM: {
    nickname: '',
    email: '',
    bio: '',
  },
} as const;
