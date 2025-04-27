// API 響應通用類型
export type ApiResponse<T> = {
  StatusCode: number;
  msg: string;
  data: T;
};

// 食譜相關類型
export type Recipe = {
  Id: number;
  RecipeName: string;
  RecipeIntro: string;
  Portion: number;
  CookingTime: number;
  Rating: number;
};

export type RecipeFormData = {
  recipeName: string;
  coverImage?: File;
};

export type RecipeCreateResponse = {
  StatusCode: number;
  msg: string;
  Id: number;
  newToken?: string;
};

export type IngredientInput = {
  ingredientName: string;
  ingredientAmount: number;
  ingredientUnit: string;
  isFlavoring: boolean;
};

export type RecipeStep2Data = {
  recipeIntro: string;
  cookingTime: number;
  portion: number;
  ingredients: IngredientInput[];
  tags?: string[];
};

export type VideoUploadResponse = {
  message: string;
  videoUri?: string;
  status?: string;
  newToken?: string;
};

export type RecipeDraftIngredient = {
  ingredientId: number;
  ingredientName: string;
  ingredientAmount: number;
  ingredientUnit: string;
  isFlavoring: boolean;
};

export type RecipeDraftTag = {
  tagId: number;
  tagName: string;
};

export type RecipeDraftStep = {
  stepId: number;
  stepOrder: number;
  stepDescription: string;
  videoStart: number;
  videoEnd: number;
};

export type RecipeDraft = {
  id: number;
  displayId: string;
  recipeName: string;
  isPublished: boolean;
  coverPhoto: string;
  description: string;
  cookingTime: number;
  portion: number;
  videoId?: string;
};

export type RecipeDraftResponse = {
  StatusCode: number;
  msg: string;
  recipe: RecipeDraft;
  ingredients: RecipeDraftIngredient[];
  tags: RecipeDraftTag[];
  steps: RecipeDraftStep[];
  newToken?: string;
};

export type UpdateStepsRequest = {
  description: string;
  startTime: number;
  endTime: number;
}[];

export type UpdateStepsResponse = {
  StatusCode: number;
  msg: string;
  stepCount: number;
  newToken?: string;
};

export type SubmitDraftResponse = {
  StatusCode: number;
  msg: string;
  recipeId?: number;
  newToken?: string;
  error?: string;
};

export type SubmitDraftDetail = {
  RecipeIntro: string;
  CookingTime: number;
  Portion: number;
  Ingredients: {
    IngredientName: string;
    IngredientAmount: number;
    IngredientUnit: string;
    IsFlavoring: boolean;
  }[];
  Tags: string[];
};

export type SubmitDraftStep = {
  Description: string;
  StartTime: number;
  EndTime: number;
};

// 認證相關類型
export type GoogleAuthResponse = {
  StatusCode: number;
  msg: string;
  redirectUri: string;
};

export type RegisterResponse = {
  StatusCode: number;
  msg: string;
};

export type LoginResponse = {
  StatusCode: number;
  msg: string;
  token?: string;
  userData?: {
    userId: number;
    userDisplayId: string;
    accountEmail: string;
    accountName: string;
    profilePhoto: string;
    role: number;
    roleName: string;
  };
};

export type CheckAuthResponse = {
  message: string;
  token: string;
  userData: {
    id: number;
    displayId: string;
    accountEmail: string;
    accountName: string;
    profilePhoto: string;
    role: number;
    loginProvider: number;
  };
};

// 使用者相關類型
export type UserProfileResponse = {
  StatusCode: number;
  isMe?: boolean;
  userData?: {
    userId: number;
    displayId: string;
    isFollowing: boolean;
    accountName: string;
    profilePhoto: string;
    description: string;
    recipeCount: number;
    followerCount: number;
  } | null;
  authorData?: {
    userId: number;
    displayId: string;
    accountName: string;
    accountEmail: string;
    profilePhoto: string;
    description: string;
    followingCount: number;
    followerCount: number;
    favoritedTotal: number;
    myFavoriteCount: number;
    averageRating: number;
    totalViewCount: number;
  } | null;
  msg?: string;
  newToken?: string;
};

export type CurrentUserProfileResponse = {
  StatusCode: number;
  msg: string;
  data: {
    userId: number;
    displayId: string;
    accountName: string;
    accountEmail: string;
    profilePhoto: string;
    description: string;
  };
  newToken?: string;
};

export type UpdateUserProfileResponse = {
  StatusCode: number;
  msg: string;
  data: {
    accountName: string;
    description: string;
    profilePhoto: string;
  };
  newToken?: string;
};

// 作者相關類型
export type AuthorRecipesResponse = {
  statusCode: number;
  totalCount: number;
  data: {
    recipeId: number;
    title: string;
    description: string;
    isPublished: boolean;
    sharedCount: number;
    rating: number;
    viewCount: number;
    averageRating: number;
    commentCount: number;
    favoritedCount: number;
    coverPhoto: string;
  }[];
  newToken?: string;
};

export type DeleteMultipleResponse = {
  StatusCode: number;
  msg: string;
  deletedIds: number[];
  newToken?: string;
};

export type TogglePublishResponse = {
  StatusCode: number;
  msg: string;
  id: number;
  isPublished: boolean;
  token?: string;
};

// 收藏和追蹤相關類型
export type UserFavoriteResponse = {
  StatusCode: number;
  hasMore: boolean;
  msg: string;
  totalCount: number;
  data: {
    id: number;
    displayId: string;
    recipeName: string;
    description: string;
    portion: number;
    cookingTime: string;
    rating: number;
    coverPhoto: string;
  }[];
  newToken?: string;
};

export type UserFollowResponse = {
  StatusCode: number;
  hasMore: boolean;
  msg: string;
  totalCount: number;
  data: {
    id: number;
    displayId: string;
    name: string;
    profilePhoto: string;
    description: string;
    followedUserRecipeCount: number;
    followedUserFollowerCount: number;
  }[];
  newToken?: string;
};

export type UserFavoriteFollowResponse =
  | UserFavoriteResponse
  | UserFollowResponse;

export type UserRecipesResponse = {
  statusCode: number;
  hasMore: boolean;
  recipeCount: number;
  recipes: {
    recipeId: number;
    title: string;
    description: string;
    portion: number;
    cookTime: number;
    rating: number;
    coverPhoto: string | null;
  }[];
  message?: string;
};

export type FollowResponse = {
  StatusCode: number;
  msg: string;
  Id: number;
  newToken?: string;
};

export type FavoriteRecipeResponse = {
  StatusCode: number;
  msg: string;
  Id?: number;
  id?: number;
  newToken?: string;
};

// 評論相關類型
export type RecipeRatingCommentResponse = {
  StatusCode: number;
  msg: string;
  totalCount: number;
  hasMore: boolean;
  data: {
    commentId: number;
    displayId: string;
    authorName: string;
    authorPhoto: string | null;
    comment: string;
    rating: number;
  }[];
};
