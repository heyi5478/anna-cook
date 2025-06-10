/**
 * 食材類型 - 統一版本
 */
export type Ingredient = {
  id?: string | number;
  name: string;
  amount: string | number;
  unit?: string;
  isFlavoring?: boolean;
  // API 相容性屬性
  ingredientName?: string;
  ingredientAmount?: number;
  ingredientUnit?: string;
  ingredientId?: number;
};

/**
 * 步驟類型 - 統一版本
 */
export type Step = {
  id?: number | string;
  description: string;
  startTime?: string | number;
  endTime?: string | number;
  video?: string;
  vimeoId?: string;
  // API 相容性屬性
  stepId?: number;
  stepOrder?: number;
  stepDescription?: string;
  videoStart?: number;
  videoEnd?: number;
};

/**
 * 食譜類型 - 統一版本
 */
export type Recipe = {
  id: number | string;
  title?: string;
  recipeName?: string; // API 相容性
  description?: string;
  recipeIntro?: string; // API 相容性
  image?: string;
  coverPhoto?: string; // API 相容性
  cookingTime: number;
  servings?: number;
  portion?: number; // API 相容性
  rating?: number;
  category?: string;
  isPublished?: boolean;
  viewCount?: number;
  displayId?: string;
  videoId?: string;
  author?: Author;
  time?: number; // 前端顯示用的時間別名
};

/**
 * 作者類型 - 統一版本
 */
export type Author = {
  id: string | number;
  name: string;
  avatar?: string;
  profilePhoto?: string; // API 相容性
  bio?: string;
  description?: string; // API 相容性
  recipeCount?: number;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  // API 相容性屬性
  displayId?: string;
  accountName?: string;
  accountEmail?: string;
  userId?: number;
  authorPhoto?: string;
  followersCount?: number;
  favoritedTotal?: number;
  myFavoriteCount?: number;
  averageRating?: number;
  totalViewCount?: number;
};

/**
 * 調味料類型 (繼承 Ingredient)
 */
export type Seasoning = Ingredient;

/**
 * 標籤類型
 */
export type Tag = {
  id?: number;
  name?: string;
  tagName?: string; // API 相容性
  tag?: string; // API 相容性
  tagId?: number; // API 相容性
};

/**
 * 食譜提交資料類型
 */
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
