import { apiConfig } from '@/config';
import {
  Recipe,
  ApiResponse,
  RecipeFormData,
  RecipeCreateResponse,
  RecipeStep2Data,
  VideoUploadResponse,
  RecipeDraftResponse,
  UpdateStepsRequest,
  UpdateStepsResponse,
  SubmitDraftResponse,
  SubmitDraftDetail,
  SubmitDraftStep,
  AuthorRecipesResponse,
  DeleteMultipleResponse,
  TogglePublishResponse,
  UserFavoriteFollowResponse,
  FavoriteRecipeResponse,
  RecipeRatingCommentResponse,
  RecipeTeachingResponse,
} from '@/types/api';
import { getAuthToken } from '../utils/http';

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
    console.log(`發送請求: POST /api/recipes/create`);
    console.log('請求資料:', formData);

    // 創建 FormData 物件
    const multipartFormData = new FormData();

    // 添加食譜名稱
    multipartFormData.append('recipeName', formData.recipeName);

    // 如果有封面圖片，添加到表單中
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

    // 發送請求到 Next.js API 路由，由其代理到後端 API
    const res = await fetch(`/api/recipes/create`, {
      method: 'POST',
      credentials: 'include', // 包含 Cookie
      body: multipartFormData,
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
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
 * 更新食譜詳細資訊（第二步）
 */
export const updateRecipeStep2 = async (
  recipeId: number,
  data: RecipeStep2Data,
): Promise<RecipeCreateResponse> => {
  try {
    console.log(`發送請求: PUT /api/recipes/step2/${recipeId}`);
    console.log('請求資料:', data);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/step2/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
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
    console.log(`發送請求: GET /api/recipes/${recipeId}/draft`);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/draft`, {
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
      console.log('解析後的回應資料:', responseData);
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
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
    console.log(`發送請求: PUT /api/recipes/${recipeId}/steps/bulk`);
    console.log('請求資料:', steps);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/steps/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
      body: JSON.stringify(steps),
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

    // 創建 FormData 物件
    const formData = new FormData();
    // 添加影片檔案 - 使用 'video' 作為欄位名稱（根據 API 文件要求）
    formData.append('video', videoFile);

    // 從 cookie 取得 token，因為 httpOnly 已被移除，可直接讀取
    const token = getAuthToken();
    if (!token) {
      throw new Error('未取得授權 token，請先登入');
    }

    // 直接向後端 API 發送請求，不經過 Next.js API route
    const res = await fetch(`${apiConfig.baseUrl}/recipes/${recipeId}/video`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`, // 添加授權標頭
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
    console.log(`發送請求: POST /api/recipes/${recipeId}/submit-draft`);
    console.log('請求資料:', data);

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

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/submit-draft`, {
      method: 'POST',
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
      `發送請求: GET /api/user/${displayId}/author-recipes?isPublished=${isPublished}`,
    );

    // 發送請求到 Next.js API 路由
    const res = await fetch(
      `/api/user/${displayId}/author-recipes?isPublished=${isPublished}`,
      {
        method: 'GET',
        credentials: 'include', // 包含 Cookie
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
    console.log(`發送請求: PATCH /api/recipes/delete-multiple`);
    console.log('請求資料 (食譜 ID):', recipeIds);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/delete-multiple`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
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
    console.log(`發送請求: PATCH /api/recipes/${recipeId}/publish`);
    console.log('請求資料:', { isPublished });

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // 包含 Cookie
      body: JSON.stringify({ isPublished }),
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
      `發送請求: GET /api/user/${displayId}/author-favorite-follow?table=${table}&page=${page}`,
    );

    // 發送請求到 Next.js API 路由
    const res = await fetch(
      `/api/user/${displayId}/author-favorite-follow?table=${table}&page=${page}`,
      {
        method: 'GET',
        credentials: 'include', // 包含 Cookie
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
 * 收藏食譜
 */
export const favoriteRecipe = async (
  recipeId: number,
): Promise<FavoriteRecipeResponse> => {
  try {
    console.log(`發送請求: POST /api/recipes/${recipeId}/favorite`);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/favorite`, {
      method: 'POST',
      credentials: 'include', // 包含 Cookie
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
    console.log(`發送請求: DELETE /api/recipes/${recipeId}/favorite`);

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/favorite`, {
      method: 'DELETE',
      credentials: 'include', // 包含 Cookie
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
): Promise<RecipeRatingCommentResponse> => {
  try {
    console.log(`發送請求: POST /api/recipes/${recipeId}/rating-comment`);
    console.log('請求資料:', { rating, commentContent });

    // 發送請求到 Next.js API 路由
    const res = await fetch(`/api/recipes/${recipeId}/rating-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
      body: JSON.stringify({ rating, commentContent }),
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
    console.error('提交評分與留言失敗:', error);
    throw error;
  }
};

/**
 * 獲取食譜教學資訊
 */
export const fetchRecipeTeaching = async (
  recipeId: number,
): Promise<RecipeTeachingResponse> => {
  try {
    console.log(
      `發送請求: GET ${apiConfig.baseUrl}/recipes/${recipeId}/teaching`,
    );

    // 直接使用 apiConfig.baseUrl 發起請求，而不是經過 Next.js API 路由
    // 因為根據 API 文檔，公開食譜不需要授權，所以不要直接添加 credentials
    const response = await fetch(
      `${apiConfig.baseUrl}/recipes/${recipeId}/teaching`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          StatusCode: 404,
          msg: '找不到該食譜的教學資訊',
        };
      }
      if (response.status === 401) {
        return {
          StatusCode: 401,
          msg: '尚未公開的食譜無法觀看教學',
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
