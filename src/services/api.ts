import { apiConfig, authConfig } from '@/config';
import {
  Recipe,
  RecipeFormData,
  ApiResponse,
  GoogleAuthResponse,
  RecipeCreateResponse,
  RecipeStep2Data,
  VideoUploadResponse,
  RecipeDraftResponse,
  // RecipeDraftStep,
  UpdateStepsRequest,
  UpdateStepsResponse,
  SubmitDraftResponse,
  SubmitDraftDetail,
  SubmitDraftStep,
  RegisterResponse,
  LoginResponse,
  CheckAuthResponse,
  UserProfileResponse,
  CurrentUserProfileResponse,
  UpdateUserProfileResponse,
  AuthorRecipesResponse,
  DeleteMultipleResponse,
  TogglePublishResponse,
  UserFavoriteFollowResponse,
  UserRecipesResponse,
  FollowResponse,
  FavoriteRecipeResponse,
  RecipeRatingCommentResponse,
} from '@/types/api';

/**
 * 從 Cookie 獲取 JWT Token
 */
export const getAuthToken = (): string | null => {
  // 開發環境下使用測試 token
  if (process.env.NODE_ENV === 'development') {
    console.log('開發環境：使用測試 token');
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6MjksIkRpc3BsYXlJZCI6Ik0wMDAwMDIiLCJBY2NvdW50RW1haWwiOiJhMTIzQGdtYWlsLmNvbSIsIkFjY291bnROYW1lIjoiQWxpY2UiLCJSb2xlIjowLCJMb2dpblByb3ZpZGVyIjowLCJFeHAiOiIyMDI1LTA0LTI3VDEyOjM4OjA0LjIyNDg3OTlaIn0.MjTGyLcMjwBKq_BkySyPk2aIjfKmx_SzY8O3cLcRNYfY5ksh4oPbAXCTwYRTJTAANAzyGwC3F1siYfXh5FYl5g';
  }

  // 在伺服器端 document 不存在
  if (typeof document === 'undefined') return null;

  // 客戶端從 Cookie 獲取 Token
  const cookies = document.cookie.split(';');
  const authCookie = cookies
    .map((cookie) => cookie.trim().split('='))
    .find(([name]) => name === authConfig.tokenCookieName);

  if (authCookie) {
    return decodeURIComponent(authCookie[1]);
  }

  return null;
};

/**
 * 更新 Cookie 中的 JWT Token
 */
export const updateAuthToken = (token: string): void => {
  if (typeof document === 'undefined') return;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + authConfig.tokenExpiryDays);

  document.cookie = `${authConfig.tokenCookieName}=${encodeURIComponent(
    token,
  )}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
};

/**
 * 獲取 Google 登入 URL
 */
export const fetchGoogleAuthUrl = async (): Promise<string> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/auth/google/auth`);
    const res = await fetch(`${apiConfig.baseUrl}/auth/google/auth`);
    console.log('回應狀態:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: GoogleAuthResponse = await res.json();
    console.log('回應資料:', data);
    return data.redirectUri;
  } catch (error) {
    console.error('獲取 Google 登入 URL 失敗:', error);
    throw error;
  }
};

/**
 * 獲取首頁顯示的食譜列表
 */
export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/recipes`);
    const res = await fetch(`${apiConfig.baseUrl}/recipes`);
    console.log('回應狀態:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse<Recipe[]> = await res.json();
    console.log('回應資料:', data);
    return data.data;
  } catch (error) {
    console.error('獲取食譜失敗:', error);
    throw error;
  }
};

/**
 * 根據 ID 獲取食譜詳情
 */
export const fetchRecipeById = async (id: number): Promise<Recipe> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/recipes/${id}`);
    const res = await fetch(`${apiConfig.baseUrl}/recipes/${id}`);
    console.log('回應狀態:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse<Recipe> = await res.json();
    console.log('回應資料:', data);
    return data.data;
  } catch (error) {
    console.error(`獲取食譜 ID:${id} 失敗:`, error);
    throw error;
  }
};

/**
 * 上傳食譜基本資料
 */
export const uploadRecipeBasic = async (
  formData: RecipeFormData,
): Promise<RecipeCreateResponse> => {
  try {
    console.log(`發送請求: POST ${apiConfig.baseUrl}/recipes`);
    console.log('請求資料:', formData);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 創建 FormData 物件
    const multipartFormData = new FormData();

    // 添加食譜名稱
    multipartFormData.append('recipeName', formData.recipeName);

    // 如果有封面圖片，添加到表單中 - 使用 'photo' 作為欄位名稱（根據新文件）
    if (formData.coverImage && formData.coverImage instanceof File) {
      console.log(
        '添加圖片到 FormData:',
        formData.coverImage.name,
        formData.coverImage.type,
        formData.coverImage.size,
      );
      multipartFormData.append('photo', formData.coverImage);
    } else {
      console.error('請上傳圖片：圖片為必填欄位');
      throw new Error('請上傳圖片：圖片為必填欄位');
    }

    // 遍歷 FormData 檢查內容 (僅用於調試)
    console.log('FormData 內容驗證:');
    console.log('- recipeName:', formData.recipeName);
    console.log('- photo:', formData.coverImage.name);
    console.log('- Authorization: Bearer [token 已設置]');

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/recipes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: multipartFormData,
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 無論回應是否成功，嘗試解析 JSON
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('解析後的回應資料:', data);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (data.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(data.newToken);
    }

    // 如果回應狀態不是成功，但我們有 JSON 回應，返回該回應
    if (!res.ok) {
      return (
        data || {
          StatusCode: res.status,
          msg: res.statusText || '伺服器錯誤',
          Id: 0,
        }
      );
    }

    return data;
  } catch (error) {
    console.error('上傳食譜失敗:', error);
    throw error;
  }
};

/**
 * 使用 Google 授權碼換取 token
 */
export const exchangeGoogleCodeForToken = async (
  code: string,
): Promise<any> => {
  try {
    // 直接調用後端 API，而不是 Next.js API 路由
    const res = await fetch(
      `${apiConfig.baseUrl}/auth/google/callback?code=${encodeURIComponent(code)}`,
      {
        method: 'GET',
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('回應資料:', data);
    return data;
  } catch (error) {
    console.error('Google code 換取 token 失敗:', error);
    throw error;
  }
};

/**
 * 更新食譜詳細資訊（第二步）
 */
export const updateRecipeStep2 = async (
  recipeId: number,
  data: RecipeStep2Data,
): Promise<RecipeCreateResponse> => {
  try {
    console.log(`發送請求: PUT ${apiConfig.baseUrl}/recipes/step2/${recipeId}`);
    console.log('請求資料:', data);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/recipes/step2/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 如果回應狀態不是成功，但我們有 JSON 回應，返回該回應
    if (!res.ok) {
      return (
        responseData || {
          StatusCode: res.status,
          msg: res.statusText || '伺服器錯誤',
          Id: 0,
        }
      );
    }

    return responseData;
  } catch (error) {
    console.error('更新食譜詳細資訊失敗:', error);
    throw error;
  }
};

/**
 * 獲取尚未發佈的草稿食譜詳細資訊
 */
export const fetchRecipeDraft = async (
  recipeId: number,
): Promise<RecipeDraftResponse> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/recipes/${recipeId}/draft`);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/recipes/${recipeId}/draft`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 如果回應狀態不是成功
    if (responseData.StatusCode !== 200) {
      return responseData;
    }

    return responseData;
  } catch (error) {
    console.error('獲取草稿食譜失敗:', error);
    throw error;
  }
};

/**
 * 批次更新食譜步驟（含影片起訖時間）
 */
export const updateRecipeSteps = async (
  recipeId: number,
  steps: UpdateStepsRequest,
): Promise<UpdateStepsResponse> => {
  try {
    console.log(
      `發送請求: PUT ${apiConfig.baseUrl}/recipes/${recipeId}/steps/bulk`,
    );
    console.log('請求資料:', steps);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/steps/bulk`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(steps),
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    return responseData;
  } catch (error) {
    console.error('更新食譜步驟失敗:', error);
    throw error;
  }
};

/**
 * 上傳影片至指定食譜
 */
export const uploadRecipeVideo = async (
  recipeId: number,
  videoFile: File,
): Promise<VideoUploadResponse> => {
  try {
    console.log(`發送請求: PUT ${apiConfig.baseUrl}/recipes/${recipeId}/video`);
    console.log('上傳影片:', videoFile.name, videoFile.size, videoFile.type);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 創建 FormData 物件
    const formData = new FormData();
    // 添加影片檔案 - 使用 'video' 作為欄位名稱（根據 API 文件要求）
    formData.append('video', videoFile);

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/recipes/${recipeId}/video`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 如果回應狀態不是成功
    if (!res.ok) {
      return {
        message: responseData?.message || res.statusText || '上傳失敗',
      };
    }

    return responseData;
  } catch (error) {
    console.error('上傳影片失敗:', error);
    return {
      message:
        error instanceof Error ? error.message : '上傳影片過程中發生錯誤',
    };
  }
};

/**
 * 提交食譜草稿到後端並發布
 */
export const submitRecipeDraft = async (
  recipeId: number,
  data: {
    recipeName: string;
    coverImage?: File;
    recipeIntro: string;
    cookingTime: number;
    portion: number;
    ingredients: {
      name: string;
      amount: string;
      isFlavoring: boolean;
    }[];
    tags: string[];
    steps: {
      description: string;
      startTime: string;
      endTime: string;
    }[];
  },
): Promise<SubmitDraftResponse> => {
  try {
    console.log(
      `發送請求: POST ${apiConfig.baseUrl}/recipes/${recipeId}/submit-draft`,
    );
    console.log('請求資料:', data);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 準備 detail JSON 內容
    const detail: SubmitDraftDetail = {
      RecipeIntro: data.recipeIntro,
      CookingTime: data.cookingTime,
      Portion: data.portion,
      Ingredients: data.ingredients.map((item) => {
        // 從格式 "100 g" 中提取數量和單位
        const amountStr = item.amount.trim();
        let amount = 0;
        let unit = '';

        // 嘗試解析數字和單位
        const match = amountStr.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
        if (match) {
          amount = parseFloat(match[1]);
          unit = match[2].trim();
        }

        return {
          IngredientName: item.name,
          IngredientAmount: amount,
          IngredientUnit: unit || '個',
          IsFlavoring: item.isFlavoring,
        };
      }),
      Tags: data.tags,
    };

    // 準備 steps JSON 內容
    const steps: SubmitDraftStep[] = data.steps.map((step) => {
      // 從格式 "1:30" 轉換為秒數
      const convertTimeToSeconds = (timeStr: string): number => {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
          const minutes = parseInt(parts[0], 10);
          const seconds = parseInt(parts[1], 10);
          return minutes * 60 + seconds;
        }
        return 0;
      };

      return {
        Description: step.description,
        StartTime: convertTimeToSeconds(step.startTime),
        EndTime: convertTimeToSeconds(step.endTime),
      };
    });

    // 創建 FormData 物件
    const formData = new FormData();
    formData.append('recipeName', data.recipeName);
    formData.append('detail', JSON.stringify(detail));
    formData.append('steps', JSON.stringify(steps));

    // 如果有封面圖片，添加到表單中
    if (data.coverImage && data.coverImage instanceof File) {
      formData.append('photo', data.coverImage);
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/submit-draft`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    return responseData;
  } catch (error) {
    console.error('提交食譜草稿失敗:', error);
    return {
      StatusCode: 500,
      msg: error instanceof Error ? error.message : '提交草稿時發生未知錯誤',
    };
  }
};

/**
 * 檢查使用者認證狀態並取得新的 Token 與使用者資料
 * @returns 包含新 Token 和使用者資料的回應，若未授權則回傳錯誤
 */
export const checkAuth = async (): Promise<CheckAuthResponse> => {
  try {
    console.log('發送請求: GET /api/auth/check');

    // 使用 Next.js API 路由而不是直接呼叫後端 API
    const res = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include', // 包含 Cookie
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseData = await res.json();
    console.log('解析後的回應資料:', responseData);

    // 檢查回應是否成功
    if (responseData.Status === false) {
      throw new Error(responseData.Message || '身份驗證失敗');
    }

    return responseData;
  } catch (error) {
    console.error('檢查使用者認證狀態失敗:', error);
    throw error;
  }
};

/**
 * 使用電子郵件註冊新帳號
 */
export const registerWithEmail = async (
  email: string,
  name: string,
  password: string,
): Promise<RegisterResponse> => {
  try {
    console.log(`發送請求: POST ${apiConfig.baseUrl}/auth/register`);

    const requestData = {
      AccountEmail: email,
      AccountName: name,
      Password: password,
    };

    console.log('請求資料:', { ...requestData, Password: '***' });

    const res = await fetch(`${apiConfig.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    return responseData;
  } catch (error) {
    console.error('註冊失敗:', error);
    return {
      StatusCode: 500,
      msg: error instanceof Error ? error.message : '註冊過程中發生未知錯誤',
    };
  }
};

/**
 * 使用電子郵件與密碼登入帳號
 */
export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    console.log(`發送請求: POST ${apiConfig.baseUrl}/auth/login`);

    const requestData = {
      AccountEmail: email,
      Password: password,
    };

    console.log('請求資料:', { ...requestData, Password: '***' });

    const res = await fetch(`${apiConfig.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    return responseData;
  } catch (error) {
    console.error('登入失敗:', error);
    return {
      StatusCode: 500,
      msg: error instanceof Error ? error.message : '登入過程中發生未知錯誤',
    };
  }
};

/**
 * 取得使用者個人檔案資料
 */
export const fetchUserProfile = async (
  displayId: string,
): Promise<UserProfileResponse> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/user/${displayId}`);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      return {
        StatusCode: 12345,
        msg: 'token不見啦!!!!!!',
      };
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/user/${displayId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    return responseData;
  } catch (error) {
    console.error('獲取使用者資料失敗:', error);
    throw error;
  }
};

/**
 * 獲取當前登入使用者的個人資料
 * 只有登入的用戶可以使用此 API 查詢自身資料
 */
export const fetchCurrentUserProfile =
  async (): Promise<CurrentUserProfileResponse> => {
    try {
      console.log('發送請求: GET /api/user/profile');

      // 使用 Next.js API 路由而不是直接呼叫後端 API
      const res = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include', // 包含 Cookie
      });

      console.log('回應狀態:', res.status, res.statusText);

      // 解析回應資料
      const responseData = await res.json();
      console.log('解析後的回應資料:', responseData);

      // 處理錯誤狀態碼
      if (responseData.StatusCode !== 200) {
        throw new Error(responseData.msg || '獲取用戶資料失敗');
      }

      return responseData;
    } catch (error) {
      console.error('獲取當前用戶資料失敗:', error);
      throw error;
    }
  };

/**
 * 更新當前登入使用者的個人資料
 * @param data 要更新的用戶資料
 * @param profilePhoto 頭像照片檔案 (可選)
 */
export const updateUserProfile = async (
  data: {
    accountName?: string;
    description?: string;
  },
  profilePhoto?: File,
): Promise<UpdateUserProfileResponse> => {
  try {
    console.log(`發送請求: PUT ${apiConfig.baseUrl}/user/profile`);
    console.log('請求資料:', { ...data, profilePhoto: profilePhoto?.name });

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 創建 FormData 物件
    const formData = new FormData();

    // 添加資料
    if (data.accountName) {
      formData.append('accountName', data.accountName);
    }

    if (data.description) {
      formData.append('description', data.description);
    }

    // 添加頭像照片，如果有
    if (profilePhoto instanceof File) {
      formData.append('profilePhoto', profilePhoto);
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/user/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 處理錯誤狀態碼
    if (responseData.StatusCode !== 200) {
      throw new Error(responseData.msg || '更新用戶資料失敗');
    }

    return responseData;
  } catch (error) {
    console.error('更新用戶資料失敗:', error);
    throw error;
  }
};

/**
 * 取得作者食譜列表
 * @param displayId 作者的顯示 ID (例如 U000001)
 * @param isPublished 是否只查詢已發布的食譜，false 為草稿
 * @returns 包含作者食譜列表的回應
 */
export const fetchAuthorRecipes = async (
  displayId: string,
  isPublished: boolean = true,
): Promise<AuthorRecipesResponse> => {
  try {
    console.log(
      `發送請求: GET ${apiConfig.baseUrl}/user/${displayId}/author-recipes?isPublished=${isPublished}`,
    );

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/user/${displayId}/author-recipes?isPublished=${isPublished}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 如果回應狀態不是成功
    if (responseData.statusCode !== 200) {
      throw new Error(responseData.msg || '獲取作者食譜失敗');
    }

    return responseData;
  } catch (error) {
    console.error('獲取作者食譜失敗:', error);
    throw error;
  }
};

/**
 * 批量刪除食譜（軟刪除）
 * @param recipeIds 要刪除的食譜 ID 陣列
 * @returns 包含刪除結果的回應
 */
export const deleteMultipleRecipes = async (
  recipeIds: number[],
): Promise<DeleteMultipleResponse> => {
  try {
    console.log(`發送請求: PATCH ${apiConfig.baseUrl}/recipes/delete-multiple`);
    console.log('請求資料 (食譜 ID):', recipeIds);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/recipes/delete-multiple`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipeIds),
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 如果回應狀態不是成功
    if (responseData.StatusCode !== 200) {
      throw new Error(responseData.msg || '刪除食譜失敗');
    }

    return responseData;
  } catch (error) {
    console.error('批量刪除食譜失敗:', error);
    throw error;
  }
};

/**
 * 切換食譜發佈狀態
 * @param recipeId 食譜 ID
 * @param isPublished 是否發佈 (true 為發佈，false 為取消發佈)
 * @returns 包含切換結果的回應
 */
export const toggleRecipePublishStatus = async (
  recipeId: number,
  isPublished: boolean,
): Promise<TogglePublishResponse> => {
  try {
    console.log(
      `發送請求: PATCH ${apiConfig.baseUrl}/recipes/${recipeId}/publish`,
    );
    console.log('請求資料:', { isPublished });

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/publish`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished }),
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.token) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.token);
    }

    // 如果回應狀態不是成功
    if (responseData.StatusCode !== 200) {
      throw new Error(responseData.msg || '更新食譜發佈狀態失敗');
    }

    return responseData;
  } catch (error) {
    console.error('切換食譜發佈狀態失敗:', error);
    throw error;
  }
};

/**
 * 取得使用者的收藏或追蹤清單
 * @param displayId 使用者公開 ID
 * @param table 要獲取的表格類型 (favorite: 收藏, follow: 追蹤)
 * @param page 頁數，每頁固定 3 筆
 * @returns 包含收藏或追蹤清單的回應
 */
export const fetchUserFavoriteFollow = async (
  displayId: string,
  table: 'favorite' | 'follow' = 'favorite',
  page: number = 1,
): Promise<UserFavoriteFollowResponse> => {
  try {
    console.log(
      `發送請求: GET ${apiConfig.baseUrl}/user/${displayId}/author-favorite-follow?table=${table}&page=${page}`,
    );

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/user/${displayId}/author-favorite-follow?table=${table}&page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    // 如果回應狀態不是成功
    if (responseData.StatusCode !== 200) {
      throw new Error(responseData.msg || '獲取使用者的收藏或追蹤清單失敗');
    }

    return responseData;
  } catch (error) {
    console.error('獲取使用者的收藏或追蹤清單失敗:', error);
    throw error;
  }
};

/**
 * 取得使用者的公開食譜列表
 */
export const fetchUserRecipes = async (
  displayId: string,
  page: number = 1,
): Promise<UserRecipesResponse> => {
  try {
    console.log(
      `發送請求: GET ${apiConfig.baseUrl}/user/${displayId}/recipes?page=${page}`,
    );

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/user/${displayId}/recipes?page=${page}`,
      {
        method: 'GET',
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 處理 404 或其他錯誤狀態
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`找不到使用者 ${displayId} 的食譜資料`);
        // 返回空資料而非拋出錯誤
        return {
          statusCode: 404,
          hasMore: false,
          recipeCount: 0,
          recipes: [],
        };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 讀取回應文字以便檢查和除錯
    const responseText = await res.text();
    if (!responseText.trim()) {
      console.warn('API 回應內容為空');
      return {
        statusCode: 200,
        hasMore: false,
        recipeCount: 0,
        recipes: [],
      };
    }

    // 解析回應資料
    try {
      const data = JSON.parse(responseText);
      console.log('回應資料:', data);

      // 如果回應狀態不是成功
      if (data.statusCode !== 200) {
        console.warn(`API 回應狀態碼非 200: ${data.statusCode}`);
        return {
          statusCode: data.statusCode,
          hasMore: false,
          recipeCount: 0,
          recipes: [],
          message: data.msg || '獲取使用者食譜失敗',
        };
      }

      return data;
    } catch (parseError) {
      console.error('解析 JSON 失敗:', parseError, '原始文本:', responseText);
      throw new Error('解析回應資料失敗');
    }
  } catch (error) {
    console.error('獲取使用者食譜失敗:', error);
    throw error;
  }
};

/**
 * 追蹤指定使用者
 */
export const followUser = async (userId: number): Promise<FollowResponse> => {
  try {
    console.log(`發送請求: POST ${apiConfig.baseUrl}/users/${userId}/follow`);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/users/${userId}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const data = await res.json();
    console.log('回應資料:', data);

    // 如果有新的 Token，更新 Cookie
    if (data.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(data.newToken);
    }

    return data;
  } catch (error) {
    console.error('追蹤使用者失敗:', error);
    throw error;
  }
};

/**
 * 取消追蹤指定使用者
 */
export const unfollowUser = async (userId: number): Promise<FollowResponse> => {
  try {
    console.log(`發送請求: DELETE ${apiConfig.baseUrl}/users/${userId}/follow`);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/users/${userId}/follow`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const data = await res.json();
    console.log('回應資料:', data);

    // 如果有新的 Token，更新 Cookie
    if (data.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(data.newToken);
    }

    return data;
  } catch (error) {
    console.error('取消追蹤使用者失敗:', error);
    throw error;
  }
};

/**
 * 收藏食譜
 */
export const favoriteRecipe = async (
  recipeId: number,
): Promise<FavoriteRecipeResponse> => {
  try {
    console.log(
      `發送請求: POST ${apiConfig.baseUrl}/recipes/${recipeId}/favorite`,
    );

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/favorite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    return responseData;
  } catch (error) {
    console.error('收藏食譜失敗:', error);
    throw error;
  }
};

/**
 * 取消收藏食譜
 */
export const unfavoriteRecipe = async (
  recipeId: number,
): Promise<FavoriteRecipeResponse> => {
  try {
    console.log(
      `發送請求: DELETE ${apiConfig.baseUrl}/recipes/${recipeId}/favorite`,
    );

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/favorite`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.newToken);
    }

    return responseData;
  } catch (error) {
    console.error('取消收藏食譜失敗:', error);
    throw error;
  }
};

/**
 * 獲取食譜留言與評分
 * @param recipeId 食譜ID
 * @param page 頁碼，預設為1
 * @returns 包含留言和評分的回應
 */
export const fetchRecipeRatingComments = async (
  recipeId: number,
  page: number = 1,
): Promise<RecipeRatingCommentResponse> => {
  try {
    console.log(
      `發送請求: GET ${apiConfig.baseUrl}/recipes/${recipeId}/rating-comment?number=${page}`,
    );

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/rating-comment?number=${page}`,
      {
        method: 'GET',
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 如果回應狀態不是成功
    if (!res.ok) {
      if (res.status === 400) {
        return {
          StatusCode: 400,
          msg: '未找到任何留言',
          totalCount: 0,
          hasMore: false,
          data: [],
        };
      }
      if (res.status === 404) {
        return {
          StatusCode: 404,
          msg: '找不到該食譜或無法進行此操作',
          totalCount: 0,
          hasMore: false,
          data: [],
        };
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 解析回應資料
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('獲取食譜留言與評分失敗:', error);
    return {
      StatusCode: 500,
      msg: '獲取食譜留言與評分失敗',
      totalCount: 0,
      hasMore: false,
      data: [],
    };
  }
};

/**
 * 提交食譜評分與留言
 */
export const submitRecipeRatingComment = async (
  recipeId: number,
  rating: number,
  commentContent: string,
): Promise<any> => {
  try {
    console.log(
      `發送請求: POST ${apiConfig.baseUrl}/recipes/${recipeId}/rating-comment`,
    );
    console.log('請求資料:', { rating, commentContent });

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/rating-comment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, commentContent }),
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();
    console.log('回應原始文本:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.data?.newToken) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.data.newToken);
    }

    return responseData;
  } catch (error) {
    console.error('提交評分與留言失敗:', error);
    throw error;
  }
};

export interface RecipeTeachingResponse {
  StatusCode: number;
  msg: string;
  data?: {
    recipeId: number;
    recipeName: string;
    video: string | null;
    steps: {
      id: number;
      description: string;
      stepOrder: number;
      startTime: number;
      endTime: number;
    }[];
  };
}

export const fetchRecipeTeaching = async (
  recipeId: number,
): Promise<RecipeTeachingResponse> => {
  const url = `${apiConfig.baseUrl}/recipes/${recipeId}/teaching`;

  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          StatusCode: 404,
          msg: '找不到該食譜的教學資訊',
        };
      }

      throw new Error(`API請求失敗: ${response.status}`);
    }

    const data = await response.json();
    console.log('獲取食譜教學資訊回應:', data);
    return data;
  } catch (error) {
    console.error('獲取食譜教學資訊失敗:', error);
    return {
      StatusCode: 500,
      msg: '獲取食譜教學資訊失敗，請稍後再試',
    };
  }
};
