/**
 * 訊息文字常數
 */

// 錯誤訊息
export const ERROR_MESSAGES = {
  // 通用錯誤
  SERVER_ERROR: '伺服器錯誤',
  INVALID_REQUEST: '無效的請求',
  LOGIN_REQUIRED: '請先登入',
  LOAD_FAILED: '載入失敗',

  // 用戶相關錯誤
  FETCH_USER_PROFILE_FAILED: '獲取使用者資料失敗',
  USER_NOT_FOUND: '查無此使用者',
  LOAD_USER_DATA_FAILED: '載入用戶資料失敗',

  // 食譜相關錯誤
  FETCH_RECIPE_FAILED: '獲取食譜資料失敗',
  RECIPE_NOT_FOUND: '找不到該食譜',
  SEARCH_RECIPE_FAILED: '搜尋食譜失敗',
  LOAD_RECIPE_FAILED: '載入食譜失敗',
  LOAD_RECIPE_DRAFT_FAILED: '載入食譜草稿失敗',
  LOAD_RECIPE_DRAFT_ERROR: '載入食譜草稿時發生錯誤',
  FETCH_RECIPE_DRAFT_FAILED: '獲取食譜草稿失敗',
  LOAD_PUBLISHED_RECIPES_FAILED: '載入已發佈食譜失敗',
  LOAD_DRAFT_RECIPES_FAILED: '載入草稿食譜失敗',
  SUBMIT_DRAFT_FAILED: '提交草稿失敗',
  FETCH_AUTHOR_RECIPES_FAILED: '獲取作者食譜失敗',
  DELETE_MULTIPLE_RECIPES_FAILED: '刪除食譜失敗',
  UPDATE_PUBLISH_STATUS_FAILED: '更新食譜發佈狀態失敗',
  RECIPE_TEACHING_NOT_FOUND: '找不到該食譜的教學資訊',
  RECIPE_NOT_PUBLISHED: '尚未公開的食譜無法觀看教學',
  FETCH_RECIPE_TEACHING_FAILED: '獲取食譜教學資訊失敗',
  UPDATE_RECIPE_FAILED: '更新失敗',

  // 評論相關錯誤
  FETCH_COMMENTS_FAILED: '獲取評論失敗',
  LOAD_MORE_COMMENTS_FAILED: '載入更多評論失敗',
  FETCH_RECIPE_RATING_COMMENTS_FAILED: '獲取食譜留言與評分失敗',
  NO_COMMENT_FOUND: '未找到任何留言',
  SUBMIT_COMMENT_FAILED: '提交評論失敗',

  // 追蹤和收藏相關錯誤
  LOAD_FOLLOWED_USERS_FAILED: '載入追蹤的用戶失敗',
  LOAD_FAVORITE_RECIPES_FAILED: '載入收藏的食譜失敗',
  FETCH_USER_FAVORITE_FOLLOW_FAILED: '獲取使用者的收藏或追蹤清單失敗',

  // 上傳相關錯誤
  UPLOAD_FAILED: '上傳失敗',
  VIDEO_UPLOAD_FAILED: '影片上傳失敗',

  // API 相關錯誤
  API_REQUEST_FAILED: '處理請求失敗',
  FETCH_HOME_RECIPES_FAILED: '獲取首頁推薦食譜失敗',
  SEARCH_RECIPES_SERVER_FAILED: '伺服器端搜尋食譜失敗',
  FETCH_HOME_FEATURES_FAILED: '獲取首頁特色內容失敗',
  FETCH_RECIPE_DETAIL_FAILED: '獲取食譜詳細資料失敗',
  FETCH_USER_RECIPES_FAILED: '獲取使用者食譜失敗',
} as const;

// 成功訊息
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: '個人資料已更新',
  RECIPE_SAVED: '食譜已儲存',
  UPLOAD_COMPLETE: '上傳完成',
  DRAFT_SUBMITTED: '草稿提交成功',
} as const;

// 常用文字
export const COMMON_TEXTS = {
  // 狀態文字
  LOADING: '載入中...',
  SUBMITTING: '提交中...',
  UPLOADING: '上傳中...',
  SAVING: '儲存中...',

  // 操作按鈕
  CANCEL: '取消',
  CONFIRM: '確認',
  SAVE: '儲存',
  DELETE: '刪除',
  COMPLETE: '完成',
  SUBMIT: '提交',

  // 佔位符文字
  PLACEHOLDER_STEP: '請輸入步驟說明',

  // 開發環境提示
  DEV_ENVIRONMENT_TOKEN: '開發環境：使用測試 token',
  DEV_SERVER_TOKEN: '伺服器端開發環境：使用測試 token',
} as const;
