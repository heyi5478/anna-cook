import { apiConfig, authConfig } from '@/config';

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

export type ApiResponse<T> = {
  StatusCode: number;
  msg: string;
  data: T;
};

export type GoogleAuthResponse = {
  StatusCode: number;
  msg: string;
  redirectUri: string;
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

type SubmitDraftDetail = {
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

type SubmitDraftStep = {
  Description: string;
  StartTime: number;
  EndTime: number;
};

// 定義註冊返回型別
export type RegisterResponse = {
  StatusCode: number;
  msg: string;
};

// 定義登入回應型別
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

/**
 * 從 Cookie 獲取 JWT Token
 */
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const authCookie = cookies
    .map((cookie) => cookie.trim().split('='))
    .find(([name]) => name === authConfig.tokenCookieName);

  if (authCookie) {
    return decodeURIComponent(authCookie[1]);
  }

  // 開發環境下使用測試 token
  if (process.env.NODE_ENV === 'development') {
    console.log('開發環境：使用測試 token');
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6MjksIkRpc3BsYXlJZCI6Ik0wMDAwMDIiLCJBY2NvdW50RW1haWwiOiJhMTIzQGdtYWlsLmNvbSIsIkFjY291bnROYW1lIjoiQWxpY2UiLCJSb2xlIjowLCJMb2dpblByb3ZpZGVyIjowLCJFeHAiOiIyMDI1LTA0LTI1VDEwOjI5OjM1LjM2OTQzMDBaIn0.PZBJtVEdjUxp-F1fJVCZbuPOxJkLSMACwPovzo1CA0NG9oIRO4lTlfWOQIANxb6berouUIcdorqdzZGdCXstDQ';
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
    console.log(`發送請求: GET ${apiConfig.baseUrl}/check`);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/check`, {
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

    // 檢查回應是否成功
    if (responseData.Status === false) {
      throw new Error(responseData.Message || '身份驗證失敗');
    }

    // 如果有新的 Token，更新 Cookie
    if (responseData.token) {
      console.log('收到新的 Token，更新 Cookie');
      updateAuthToken(responseData.token);
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
 * 取得使用者個人頁資料
 */
export const fetchUserProfile = async (displayId: string): Promise<any> => {
  try {
    console.log(`發送請求: GET ${apiConfig.baseUrl}/user/${displayId}`);

    // 取得 JWT Token (如果有)
    const token = getAuthToken();

    // 設定請求頭，如果有 token 則加入授權資訊
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 發送請求
    const res = await fetch(`${apiConfig.baseUrl}/user/${displayId}`, {
      method: 'GET',
      headers,
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 處理 404 等錯誤
    if (!res.ok) {
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          return {
            StatusCode: res.status,
            message: errorData.Message || '獲取使用者資料失敗',
          };
        }
        return {
          StatusCode: res.status,
          message: '伺服器回應格式錯誤',
        };
      } catch (e) {
        return {
          StatusCode: res.status,
          message: '處理錯誤回應時發生問題',
        };
      }
    }

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
    console.error('獲取使用者資料失敗:', error);
    throw error;
  }
};

/**
 * 取得作者食譜列表
 * @param displayId 作者的顯示 ID (例如 U000001)
 * @param isPublished 是否只查詢已發布的食譜，false 為草稿
 * @returns 包含作者食譜列表的回應
 */
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
export type DeleteMultipleResponse = {
  StatusCode: number;
  msg: string;
  deletedIds: number[];
  newToken?: string;
};

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
export type TogglePublishResponse = {
  StatusCode: number;
  msg: string;
  id: number;
  isPublished: boolean;
  token?: string;
};

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
 * API 回應：使用者個人資料
 */
export type UserProfileResponse = {
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

/**
 * 獲取當前登入使用者的個人資料
 * 只有登入的用戶可以使用此 API 查詢自身資料
 */
export const fetchCurrentUserProfile =
  async (): Promise<UserProfileResponse> => {
    try {
      console.log(`發送請求: GET ${apiConfig.baseUrl}/user/profile`);

      // 取得 JWT Token
      const token = getAuthToken();
      if (!token) {
        console.error('認證錯誤: 未登入或 Token 不存在');
        throw new Error('未登入或 Token 不存在');
      }

      // 發送請求
      const res = await fetch(`${apiConfig.baseUrl}/user/profile`, {
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
 * API 回應：更新使用者個人資料
 */
export type UpdateUserProfileResponse = {
  StatusCode: number;
  msg: string;
  data: {
    accountName: string;
    userIntro: string;
    profilePhoto: string;
  };
  newToken?: string;
};

/**
 * 更新當前登入使用者的個人資料
 * @param data 要更新的用戶資料
 * @param profilePhoto 頭像照片檔案 (可選)
 */
export const updateUserProfile = async (
  data: {
    accountName?: string;
    userIntro?: string;
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

    if (data.userIntro) {
      formData.append('userIntro', data.userIntro);
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
 * API 回應：使用者食譜列表
 */
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
