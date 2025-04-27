import { IncomingMessage } from 'http';
import { apiConfig, authConfig } from '@/config';

/**
 * 從請求 Cookie 中獲取 JWT Token
 * @param req 伺服器端請求物件
 * @returns JWT Token 或 null
 */
export const getTokenFromServerRequest = (
  req: IncomingMessage,
): string | null => {
  // 從請求標頭中獲取 cookie 字串
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
  const tokenFromCookie = getTokenFromServerRequest(req);

  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // 在開發環境中使用測試 token
  if (process.env.NODE_ENV === 'development') {
    console.log('伺服器端開發環境：使用測試 token');
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6MzEsIkRpc3BsYXlJZCI6Ik0wMDAwMDQiLCJBY2NvdW50RW1haWwiOiJjMTIzQGdtYWlsLmNvbSIsIkFjY291bnROYW1lIjoiQ2F0ZSIsIlJvbGUiOjAsIkxvZ2luUHJvdmlkZXIiOjAsIkV4cCI6IjIwMjUtMDQtMjdUMDg6MDI6NTUuMDQ0MjkzNloifQ.oUdyf094IAMPbDyVIndA65r2v24fzsUbenLIxycx-D8Xyd0aLrJFhUX2TqAhRkUCWreEJF-RojQTUwLs2blXrg';
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
    console.log(`伺服器端發送請求: GET ${apiConfig.baseUrl}/user/${displayId}`);

    // 獲取 token (若有)
    const token = getAuthTokenForServer(req);

    // 準備請求標頭
    const headers: HeadersInit = {};
    if (token) {
      // 如果有 token，加入授權標頭
      headers.Authorization = `Bearer ${token}`;
    }

    // 發送請求 (token 為選填)
    const response = await fetch(`${apiConfig.baseUrl}/user/${displayId}`, {
      method: 'GET',
      headers,
    });

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        isMe: false,
        msg: response.status === 400 ? '查無此使用者' : '獲取使用者資料失敗',
      };
    }

    // 解析回應資料
    const data = await response.json();

    // 伺服器端不處理更新 Cookie，這部分會在客戶端處理
    return data;
  } catch (error) {
    console.error('伺服器端獲取使用者資料失敗:', error);
    return {
      StatusCode: 500,
      isMe: false,
      msg: '伺服器端獲取使用者資料失敗',
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
      `伺服器端發送請求: GET ${apiConfig.baseUrl}/user/${displayId}/recipes?page=${page}`,
    );

    // 發送請求 (不需要 token)
    const response = await fetch(
      `${apiConfig.baseUrl}/user/${displayId}/recipes?page=${page}`,
    );

    console.log('伺服器端回應狀態:', response.status);

    // 處理 404 或其他錯誤狀態
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`伺服器端找不到使用者 ${displayId} 的食譜資料`);
        return {
          statusCode: 404,
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
        message: '獲取使用者食譜失敗',
      };
    }

    // 解析回應資料
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('伺服器端獲取使用者食譜失敗:', error);
    return {
      statusCode: 500,
      hasMore: false,
      recipeCount: 0,
      recipes: [],
      message: '伺服器端獲取使用者食譜失敗',
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
 * @param isPublished 是否為已發布的食譜
 * @returns 作者食譜列表回應
 */
export const fetchAuthorRecipesServer = async (
  displayId: string,
  req: IncomingMessage,
  isPublished: boolean = true,
): Promise<AuthorRecipesResponse> => {
  try {
    console.log(
      `伺服器端發送請求: GET ${apiConfig.baseUrl}/user/${displayId}/author-recipes?isPublished=${isPublished}`,
    );

    // 獲取 token
    const token = getAuthTokenForServer(req);

    if (!token) {
      console.error('伺服器端認證錯誤: 未登入或 Token 不存在');
      return {
        statusCode: 401,
        totalCount: 0,
        data: [],
      };
    }

    // 發送請求
    const response = await fetch(
      `${apiConfig.baseUrl}/user/${displayId}/author-recipes?isPublished=${isPublished}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('伺服器端回應狀態:', response.status);

    // 解析回應資料
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('伺服器端獲取作者食譜失敗:', error);
    return {
      statusCode: 500,
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
 * @param recipeId 食譜ID
 * @param req 伺服器端請求物件
 * @returns 食譜詳細資料回應
 */
export const fetchRecipeDetailServer = async (
  recipeId: number,
  req?: IncomingMessage,
): Promise<RecipeDetailResponse> => {
  try {
    console.log(
      `伺服器端發送請求: GET ${apiConfig.baseUrl}/recipes/${recipeId}`,
    );

    // 獲取 token (若有)
    const token = req ? getAuthTokenForServer(req) : null;

    // 準備請求標頭
    const headers: HeadersInit = {};
    if (token) {
      // 如果有 token，加入授權標頭
      headers.Authorization = `Bearer ${token}`;
    }

    // 發送請求
    const response = await fetch(`${apiConfig.baseUrl}/recipes/${recipeId}`, {
      method: 'GET',
      headers,
    });

    console.log('伺服器端回應狀態:', response.status);

    if (!response.ok) {
      return {
        StatusCode: response.status,
        msg: response.status === 400 ? '找不到該食譜' : '獲取食譜資料失敗',
      };
    }

    // 解析回應資料
    const data = await response.json();
    console.log('伺服器端回應資料:', data);
    return data;
  } catch (error) {
    console.error('伺服器端獲取食譜資料失敗:', error);
    return {
      StatusCode: 500,
      msg: '伺服器端獲取食譜資料失敗',
    };
  }
};

/**
 * API 回應：首頁主題區塊與對應食譜卡片
 */
export interface HomeFeatureResponse {
  statusCode: number;
  msg?: string;
  data: {
    sectionPos: number;
    sectionName: string;
    tags: string[];
    recipes: {
      recipeName: string;
      rating: number;
      coverPhoto: string;
      author: string;
    }[];
  }[];
}

/**
 * 獲取首頁主題區塊與對應食譜卡片
 * @returns 首頁主題區塊與食譜卡片資料
 */
export const fetchHomeFeatures = async (): Promise<HomeFeatureResponse> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/home/features`);

    // 發送請求 (不需要 token)
    const response = await fetch(`${apiConfig.baseUrl}/home/features`);

    console.log('回應狀態:', response.status);

    if (!response.ok) {
      return {
        statusCode: response.status,
        msg: '獲取首頁特色區塊失敗',
        data: [],
      };
    }

    // 解析回應資料
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('獲取首頁特色區塊失敗:', error);
    return {
      statusCode: 500,
      msg: '獲取首頁特色區塊失敗',
      data: [],
    };
  }
};
