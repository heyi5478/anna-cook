/**
 * 訊息文字常數
 */

// 錯誤訊息
export const ERROR_MESSAGES = {
  // 通用錯誤
  SERVER_ERROR: '伺服器錯誤',
  INVALID_REQUEST: '無效的請求',
  LOGIN_REQUIRED: '請先登入',

  // 用戶相關錯誤
  FETCH_USER_PROFILE_FAILED: '獲取使用者資料失敗',
  USER_NOT_FOUND: '查無此使用者',
  LOAD_USER_DATA_FAILED: '載入用戶資料失敗',

  // 食譜相關錯誤
  FETCH_RECIPE_FAILED: '獲取食譜資料失敗',
  RECIPE_NOT_FOUND: '找不到該食譜',
  SEARCH_RECIPE_FAILED: '搜尋食譜失敗',
  LOAD_RECIPE_DRAFT_FAILED: '載入食譜草稿失敗',
  LOAD_RECIPE_DRAFT_ERROR: '載入食譜草稿時發生錯誤',

  // 上傳相關錯誤
  UPLOAD_FAILED: '上傳失敗',

  // API 相關錯誤
  API_REQUEST_FAILED: '處理請求失敗',
  FETCH_HOME_RECIPES_FAILED: '獲取首頁推薦食譜失敗',
  SEARCH_RECIPES_SERVER_FAILED: '伺服器端搜尋食譜失敗',
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
