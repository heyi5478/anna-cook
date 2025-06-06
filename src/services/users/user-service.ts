import { apiConfig } from '@/config';
import { HTTP_STATUS } from '@/lib/constants';
import {
  UserProfileResponse,
  CurrentUserProfileResponse,
  UpdateUserProfileResponse,
  FollowResponse,
  UserRecipesResponse,
} from '@/types/api';

/**
 * 取得使用者個人檔案資料
 */
export const fetchUserProfile = async (
  displayId: string,
): Promise<UserProfileResponse> => {
  try {
    console.log(`發送請求: GET /api/user/${displayId}/profile`);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/user/${displayId}/profile`, {
      method: 'GET',
      credentials: 'include', // 包含 Cookie
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
      if (responseData.StatusCode !== HTTP_STATUS.OK) {
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
    console.log(`發送請求: PUT /api/user/profile`);
    console.log('請求資料:', { ...data, profilePhoto: profilePhoto?.name });

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

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/user/profile`, {
      method: 'PUT',
      credentials: 'include', // 包含 Cookie
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

    // 處理錯誤狀態碼
    if (responseData.StatusCode !== HTTP_STATUS.OK) {
      throw new Error(responseData.msg || '更新用戶資料失敗');
    }

    return responseData;
  } catch (error) {
    console.error('更新用戶資料失敗:', error);
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
      if (res.status === HTTP_STATUS.NOT_FOUND) {
        console.warn(`找不到使用者 ${displayId} 的食譜資料`);
        // 返回空資料而非拋出錯誤
        return {
          statusCode: HTTP_STATUS.NOT_FOUND,
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
        statusCode: HTTP_STATUS.OK,
        hasMore: false,
        recipeCount: 0,
        recipes: [],
      };
    }

    // 解析回應資料
    try {
      const data = JSON.parse(responseText);
      console.log('回應資料:', data);

      return data;
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
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
    console.log(`發送請求: POST /api/users/${userId}/follow`);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/users/${userId}/follow`, {
      method: 'POST',
      credentials: 'include', // 包含 Cookie
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const data = await res.json();
    console.log('回應資料:', data);

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
    console.log(`發送請求: DELETE /api/users/${userId}/follow`);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/users/${userId}/follow`, {
      method: 'DELETE',
      credentials: 'include', // 包含 Cookie
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const data = await res.json();
    console.log('回應資料:', data);

    return data;
  } catch (error) {
    console.error('取消追蹤使用者失敗:', error);
    throw error;
  }
};
