import { IncomingMessage } from 'http';
import { getApiConfig, authConfig } from '@/config';
import { getServerToken as getNextApiServerToken } from '@/lib/auth-middleware';
import type { NextApiRequest } from 'next';
import {
  DEV_TEST_TOKEN,
  COMMON_TEXTS,
  HTTP_STATUS,
  SORT_TYPES,
} from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * 從 IncomingMessage 請求 Cookie 中獲取 JWT Token
 * @param req 伺服器端請求物件
 * @returns JWT Token 或 null
 */
export const getServerToken = (req: IncomingMessage): string | null => {
  // 判斷是否為 NextApiRequest
  if ('cookies' in req) {
    // 如果是 NextApiRequest，直接使用 cookies 屬性
    return getNextApiServerToken(req as unknown as NextApiRequest);
  }

  // 否則從請求標頭中獲取 cookie 字串
  const cookies = req.headers.cookie || '';

  // 使用正則表達式尋找 token
  const tokenMatch = cookies.match(
    new RegExp(`${authConfig.tokenCookieName}=([^;]+)`),
  );

  // 解碼並返回 token，如果沒有找到則返回 null
  return tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
};

/**
 * 獲取用於 API 請求的授權 token
 * @param req 伺服器端請求物件
 * @returns 用於 API 請求的有效 token 或 null
 */
export const getAuthTokenForServer = (req: IncomingMessage): string | null => {
  // 先從請求 Cookie 中獲取 token
  const tokenFromCookie = getServerToken(req);

  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // 在開發環境中使用測試 token
  if (process.env.NODE_ENV === 'development') {
    console.log(COMMON_TEXTS.DEV_SERVER_TOKEN);
    return DEV_TEST_TOKEN;
  }

  // 生產環境中沒有 token，返回 null
  return null;
};

/**
 * API 回應：使用者個人檔案
 */
export interface UserProfileResponse {
  StatusCode: number;
  isMe: boolean;
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
}

/**
 * 伺服器端獲取使用者個人檔案資料
 * @param displayId 使用者顯示 ID
 * @param req 伺服器端請求物件
 * @returns 使用者資料回應
 */
export const fetchUserProfileServer = async (
  displayId: string,
  req: IncomingMessage,
): Promise<UserProfileResponse> => {
  try {
    console.log(
      `伺服器端發送請求: GET ${getApiConfig().baseUrl}/user/${displayId}`,
    );

    // 獲取 token (若有)
    const token = getAuthTokenForServer(req);

    // 準備請求標頭
    const headers: HeadersInit = {};
    if (token) {
      // 如果有 token，加入授權標頭
      headers.Authorization = `Bearer ${token}`;
    }

    // 發送請求 (token 為選填)
    const response = await fetch(
      `${getApiConfig().baseUrl}/user/${displayId}`,
      {
        method: 'GET',
        headers,
      },
    );

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        isMe: false,
        msg:
          response.status === HTTP_STATUS.BAD_REQUEST
            ? ERROR_MESSAGES.USER_NOT_FOUND
            : ERROR_MESSAGES.FETCH_USER_PROFILE_FAILED,
      };
    }

    // 解析回應資料
    const data = await response.json();

    // 伺服器端不處理更新 Cookie，這部分會在客戶端處理
    return data;
  } catch (error) {
    console.error('伺服器端獲取使用者資料失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      isMe: false,
      msg: ERROR_MESSAGES.FETCH_USER_PROFILE_FAILED,
    };
  }
};

/**
 * API 回應：使用者食譜列表
 */
export interface UserRecipesResponse {
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
}

/**
 * 伺服器端獲取使用者食譜列表
 * @param displayId 使用者顯示 ID
 * @param page 頁碼
 * @returns 食譜列表回應
 */
export const fetchUserRecipesServer = async (
  displayId: string,
  page: number = 1,
): Promise<UserRecipesResponse> => {
  try {
    console.log(
      `伺服器端發送請求: GET ${getApiConfig().baseUrl}/user/${displayId}/recipes?page=${page}`,
    );

    // 發送請求 (不需要 token)
    const response = await fetch(
      `${getApiConfig().baseUrl}/user/${displayId}/recipes?page=${page}`,
    );

    console.log('伺服器端回應狀態:', response.status);

    // 處理 404 或其他錯誤狀態
    if (!response.ok) {
      if (response.status === HTTP_STATUS.NOT_FOUND) {
        console.warn(`伺服器端找不到使用者 ${displayId} 的食譜資料`);
        return {
          statusCode: HTTP_STATUS.NOT_FOUND,
          hasMore: false,
          recipeCount: 0,
          recipes: [],
        };
      }

      return {
        statusCode: response.status,
        hasMore: false,
        recipeCount: 0,
        recipes: [],
        message: ERROR_MESSAGES.FETCH_USER_RECIPES_FAILED,
      };
    }

    // 解析回應資料
    const data = await response.json();
    console.log('伺服器端回應資料:', data);

    return data;
  } catch (error) {
    console.error('伺服器端獲取使用者食譜失敗:', error);
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      hasMore: false,
      recipeCount: 0,
      recipes: [],
      message: ERROR_MESSAGES.FETCH_USER_RECIPES_FAILED,
    };
  }
};

/**
 * API 回應：作者食譜列表
 */
export interface AuthorRecipesResponse {
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
}

/**
 * 伺服器端獲取作者食譜列表
 * @param displayId 作者顯示 ID
 * @param req 伺服器端請求物件
 * @param isPublished 是否只顯示已發佈的食譜
 * @returns 作者食譜列表回應
 */
export const fetchAuthorRecipesServer = async (
  displayId: string,
  req: IncomingMessage,
  isPublished: boolean = true,
): Promise<AuthorRecipesResponse> => {
  try {
    const token = getAuthTokenForServer(req);

    if (!token) {
      console.warn('伺服器端缺少授權 token');
      return {
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        totalCount: 0,
        data: [],
      };
    }

    const queryParam = isPublished ? '?isPublished=true' : '?isPublished=false';
    const apiUrl = `${getApiConfig().baseUrl}/user/${displayId}/management/recipe${queryParam}`;

    console.log(`伺服器端發送請求: GET ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        statusCode: response.status,
        totalCount: 0,
        data: [],
      };
    }

    const data = await response.json();
    console.log('伺服器端回應資料:', data);

    return data;
  } catch (error) {
    console.error('伺服器端獲取作者食譜失敗:', error);
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      totalCount: 0,
      data: [],
    };
  }
};

/**
 * API 回應：單筆食譜詳細資料
 */
export interface RecipeDetailResponse {
  StatusCode: number;
  msg?: string;
  data?: {
    isAuthor: boolean;
    author: {
      id: number;
      displayId: string;
      name: string;
      followersCount: number;
    };
    isFavorite: boolean;
    isFollowing: boolean;
    recipe: {
      id: number;
      displayId: string;
      isPublished: boolean;
      viewCount: number;
      recipeName: string;
      coverPhoto: string;
      description: string;
      cookingTime: number;
      portion: number;
      rating: number;
      videoId: string | null;
    };
    ingredients: {
      ingredientId: number;
      ingredientName: string;
      amount: number;
      unit: string;
      isFlavoring: boolean;
    }[];
    tags: {
      id: number;
      tag: string;
    }[];
  };
  newToken?: string;
}

/**
 * 伺服器端獲取單筆食譜詳細資料
 * @param recipeId 食譜 ID
 * @param req 伺服器端請求物件（選填）
 * @returns 食譜詳細資料回應
 */
export const fetchRecipeDetailServer = async (
  recipeId: number,
  req?: IncomingMessage,
): Promise<RecipeDetailResponse> => {
  try {
    console.log(
      `伺服器端發送請求: GET ${getApiConfig().baseUrl}/recipes/${recipeId}`,
    );

    // 準備請求標頭
    const headers: HeadersInit = {};

    // 如果有請求物件，嘗試獲取 token
    if (req) {
      const token = getAuthTokenForServer(req);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // 發送請求
    const response = await fetch(
      `${getApiConfig().baseUrl}/recipes/${recipeId}`,
      {
        method: 'GET',
        headers,
      },
    );

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        msg:
          response.status === HTTP_STATUS.NOT_FOUND
            ? ERROR_MESSAGES.RECIPE_NOT_FOUND
            : ERROR_MESSAGES.FETCH_RECIPE_DETAIL_FAILED,
      };
    }

    // 解析回應資料
    const data = await response.json();
    console.log('伺服器端回應資料:', data);

    return data;
  } catch (error) {
    console.error('伺服器端獲取食譜詳細資料失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: ERROR_MESSAGES.FETCH_RECIPE_DETAIL_FAILED,
    };
  }
};

/**
 * API 回應：首頁主題區塊與對應食譜卡片
 */
export interface HomeFeatureResponse {
  StatusCode: number;
  msg?: string;
  data: {
    sectionPos: number;
    sectionName: string;
    tags: string[];
    recipes: {
      id: number;
      recipeName: string;
      rating: number;
      coverPhoto: string;
      author: string;
    }[];
  }[];
}

/**
 * 伺服器端獲取首頁特色內容
 * @returns 首頁特色內容回應
 */
export const fetchHomeFeatures = async (): Promise<HomeFeatureResponse> => {
  try {
    console.log(
      `伺服器端發送請求: GET ${getApiConfig().baseUrl}/home/features`,
    );

    const response = await fetch(`${getApiConfig().baseUrl}/home/features`);

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        msg: ERROR_MESSAGES.FETCH_HOME_FEATURES_FAILED,
        data: [],
      };
    }

    const data = await response.json();
    console.log('伺服器端回應資料:', data);

    return data;
  } catch (error) {
    console.error('伺服器端獲取首頁特色內容失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: ERROR_MESSAGES.FETCH_HOME_FEATURES_FAILED,
      data: [],
    };
  }
};

/**
 * API 回應：首頁推薦食譜列表
 */
export interface HomeRecipesResponse {
  StatusCode: number;
  msg?: string;
  totalCount: number;
  hasMore: boolean;
  data: {
    id: number;
    recipeName: string;
    coverPhoto: string | null;
    description: string | null;
    portion: number;
    cookingTime: number;
    rating: number;
  }[];
}

/**
 * 獲取首頁推薦食譜列表
 * @param type 排序類型 (latest, popular, classic)
 * @param number 頁碼
 * @returns 首頁推薦食譜列表資料
 */
export const fetchHomeRecipes = async (
  type: string = SORT_TYPES.LATEST,
  number: number = 1,
): Promise<HomeRecipesResponse> => {
  try {
    const apiUrl = `${getApiConfig().baseUrl}/home/recipes?type=${type}&number=${number}`;
    console.log(`伺服器端發送請求: GET ${apiUrl}`);

    const response = await fetch(apiUrl);

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        msg: ERROR_MESSAGES.FETCH_HOME_RECIPES_FAILED,
        totalCount: 0,
        hasMore: false,
        data: [],
      };
    }

    const data = await response.json();
    console.log('伺服器端回應資料:', data);

    return data;
  } catch (error) {
    console.error('伺服器端獲取首頁食譜失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: ERROR_MESSAGES.FETCH_HOME_RECIPES_FAILED,
      totalCount: 0,
      hasMore: false,
      data: [],
    };
  }
};

/**
 * API 回應：食譜搜尋結果
 */
export interface RecipeSearchResponse {
  StatusCode: number;
  msg: string;
  number: string;
  hasMore: boolean;
  totalCount: number;
  data: {
    id: number;
    authorId: number;
    displayId: string;
    isPublished: boolean;
    recipeName: string;
    description: string;
    cookingTime: number;
    portion: number;
    rating: number;
    createdAt: string;
    coverPhoto: string | null;
  }[];
}

/**
 * 伺服器端搜尋食譜
 * @param searchData 搜尋關鍵字
 * @param type 排序類型
 * @param number 頁碼
 * @returns 搜尋結果回應
 */
export const searchRecipesServer = async (
  searchData: string = '',
  type: string = SORT_TYPES.CREATED_AT,
  number: number = 1,
): Promise<RecipeSearchResponse> => {
  try {
    // 構建查詢參數
    const queryParams = new URLSearchParams();
    if (searchData) {
      queryParams.append('searchData', searchData);
    }
    queryParams.append('type', type);
    queryParams.append('number', String(number));

    const apiUrl = `${getApiConfig().baseUrl}/recipes/search?${queryParams.toString()}`;
    console.log(`伺服器端發送請求: GET ${apiUrl}`);

    const response = await fetch(apiUrl);

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        msg: ERROR_MESSAGES.SEARCH_RECIPE_FAILED,
        number: `page ${number}`,
        hasMore: false,
        totalCount: 0,
        data: [],
      };
    }

    const data = await response.json();
    console.log('伺服器端回應資料:', data);

    return data;
  } catch (error) {
    console.error('伺服器端搜尋食譜失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: ERROR_MESSAGES.SEARCH_RECIPES_SERVER_FAILED,
      number: `page ${number}`,
      hasMore: false,
      totalCount: 0,
      data: [],
    };
  }
};
