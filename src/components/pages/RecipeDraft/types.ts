// 基礎型別定義
export type Ingredient = {
  name: string;
  amount: string;
  id?: string;
};

export type Seasoning = {
  name: string;
  amount: string;
  id?: string;
};

export type Step = {
  description: string;
  startTime: string;
  endTime: string;
  video?: string;
  vimeoId?: string;
  id?: string;
};

// API 回應型別
export type RecipeDraftApiResponse = {
  StatusCode: number;
  msg: string;
  recipe: {
    recipeName: string;
    description: string;
    cookingTime: number;
    portion: number;
    videoId: string;
    coverPhoto: string;
  };
  ingredients: Array<{
    ingredientId: number;
    ingredientName: string;
    ingredientAmount: number;
    ingredientUnit: string;
    isFlavoring: boolean;
  }>;
  tags: Array<{
    tagName: string;
  }>;
  steps: Array<{
    stepId: number;
    stepDescription: string;
    videoStart: number;
    videoEnd: number;
  }>;
};

// 提交資料型別
export type RecipeSubmitData = {
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
