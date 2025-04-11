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
 * 上傳食譜基本資料
 */
export const uploadRecipeBasic = async (
  formData: RecipeFormData,
): Promise<ApiResponse<any>> => {
  try {
    console.log(`發送請求: POST ${API_BASE_URL}/recipes`);
    console.log('請求資料:', formData);

    // 創建 FormData 物件
    const multipartFormData = new FormData();

    // 添加食譜名稱 - 注意使用小寫 r (recipeName)
    multipartFormData.append('recipeName', formData.recipeName);

    // 如果有封面圖片，添加到表單中 - 使用 'file' 作為欄位名稱
    if (formData.coverImage && formData.coverImage instanceof File) {
      console.log(
        '添加圖片到 FormData:',
        formData.coverImage.name,
        formData.coverImage.type,
        formData.coverImage.size,
      );
      multipartFormData.append('file', formData.coverImage);
    } else {
      console.log('沒有圖片或圖片無效，跳過');
    }

    // 遍歷 FormData 檢查內容 (僅用於調試)
    console.log('FormData 內容驗證:');
    // 使用 Array.from 替代 for...of 迭代
    Array.from(multipartFormData.entries()).forEach((pair) => {
      const [key, value] = pair;
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    });

    const res = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      // 使用 multipart/form-data，不需要手動設定 Content-Type，瀏覽器會自動設定
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

    // 如果回應狀態不是成功，但我們有 JSON 回應，返回該回應
    if (!res.ok) {
      return (
        data || {
          StatusCode: res.status,
          msg: res.statusText || '伺服器錯誤',
          data: null,
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
