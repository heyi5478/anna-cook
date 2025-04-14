const API_BASE_URL = 'http://13.71.34.213/api';

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

/**
 * 獲取 Google 登入 URL
 */
export const fetchGoogleAuthUrl = async (): Promise<string> => {
  try {
    console.log(`發送請求: GET ${API_BASE_URL}/auth/google/auth`);
    const res = await fetch(`${API_BASE_URL}/auth/google/auth`);
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
    console.log(`發送請求: GET ${API_BASE_URL}/recipes`);
    const res = await fetch(`${API_BASE_URL}/recipes`);
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
    console.log(`發送請求: GET ${API_BASE_URL}/recipes/${id}`);
    const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
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
 * 從 Cookie 獲取 JWT Token
 */
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const authCookie = cookies
    .map((cookie) => cookie.trim().split('='))
    .find(([name]) => name === 'token');

  if (authCookie) {
    return decodeURIComponent(authCookie[1]);
  }

  // 開發環境下使用測試 token
  if (process.env.NODE_ENV === 'development') {
    console.log('開發環境：使用測試 token');
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6MiwiRGlzcGxheUlkIjoiTTAwMDAwMSIsIkFjY291bnRFbWFpbCI6ImpvYnMuc3RldmU1NEBnbWFpbC5jb20iLCJBY2NvdW50TmFtZSI6IkhvIFN0ZXZlIiwiUm9sZSI6MCwiTG9naW5Qcm92aWRlciI6MCwiRXhwIjoiMjAyNS0wNC0xMVQwODo0MTowMy44NDM1NjcwWiJ9.PGu7Rc_kTZBU2RtzhPL7aRJeKVOCzTK2s_L1LfP3atgAGRaxdvvtbOeejNU5CUGzLGkXvIr4gUZJ0nIjq9ejyA';
  }

  return null;
};

/**
 * 更新 Cookie 中的 JWT Token
 */
export const updateAuthToken = (token: string, expiresInDays = 7): void => {
  if (typeof document === 'undefined') return;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expiresInDays);

  document.cookie = `token=${encodeURIComponent(
    token,
  )}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
};

/**
 * 上傳食譜基本資料
 */
export const uploadRecipeBasic = async (
  formData: RecipeFormData,
): Promise<RecipeCreateResponse> => {
  try {
    console.log(`發送請求: POST ${API_BASE_URL}/recipes`);
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
    const res = await fetch(`${API_BASE_URL}/recipes`, {
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
    console.log(
      `發送請求: GET ${API_BASE_URL}/auth/google/callback?code=${code}`,
    );

    const res = await fetch(
      `${API_BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}`,
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
    console.log(`發送請求: PUT ${API_BASE_URL}/recipes/step2/${recipeId}`);
    console.log('請求資料:', data);

    // 取得 JWT Token
    const token = getAuthToken();
    if (!token) {
      console.error('認證錯誤: 未登入或 Token 不存在');
      throw new Error('未登入或 Token 不存在');
    }

    // 發送請求
    const res = await fetch(`${API_BASE_URL}/recipes/step2/${recipeId}`, {
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
 * 上傳影片至指定食譜
 */
export const uploadRecipeVideo = async (
  recipeId: number,
  videoFile: File,
): Promise<VideoUploadResponse> => {
  try {
    console.log(`發送請求: PUT ${API_BASE_URL}/recipes/${recipeId}/video`);
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
    const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/video`, {
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
