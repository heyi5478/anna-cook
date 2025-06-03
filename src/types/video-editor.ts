export type VideoEditorProps = {
  recipeId?: string | number;
  videoId?: string | number;
  totalDuration?: number;
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
