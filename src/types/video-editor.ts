export type Step = {
  id: number;
  startTime: number;
  endTime: number;
  description: string;
};

/**
 * Video Editor 元件的 Props 型別
 */
export type VideoEditorProps = {
  videoId?: number | string;
  totalDuration?: number;
  recipeId?: number;
};

/**
 * 食材型別
 */
export type Ingredient = {
  ingredientName: string;
  ingredientAmount: number;
  ingredientUnit: string;
  isFlavoring: boolean;
};

/**
 * 標籤型別
 */
export type Tag = {
  tagName: string;
};

/**
 * 提交草稿的資料結構型別
 */
export type SubmitData = {
  recipeName: string;
  recipeIntro: string;
  cookingTime: number;
  portion: number;
  ingredients: Array<{
    name: string;
    amount: string;
    isFlavoring: boolean;
  }>;
  tags: string[];
  steps: Array<{
    description: string;
    startTime: string;
    endTime: string;
  }>;
};

/**
 * 時間標記按鈕的 Props 型別
 */
export type TimeMarkButtonsProps = {
  onMarkStart: () => void;
  onMarkEnd: () => void;
  onResetAll: () => void;
  onDeleteStep: () => void;
};
