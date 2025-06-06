/**
 * 表單驗證相關常數
 */

// 表單驗證訊息
export const VALIDATION_MESSAGES = {
  // 通用驗證訊息
  REQUIRED_NAME: '請輸入姓名',
  REQUIRED_YOUR_NAME: '請輸入您的姓名',
  REQUIRED_EMAIL: '請輸入有效的電子信箱',
  INVALID_EMAIL: '請輸入有效的電子郵件地址',
  REQUIRED_PASSWORD: '請輸入密碼',

  // 聯絡表單
  REQUIRED_ISSUE_TYPE: '請選擇問題類型',
  SELECT_ISSUE_TYPE: '請選擇問題類型',
  MIN_MESSAGE_LENGTH: '留言內容至少需要10個字元',

  // 個人資料表單
  MIN_NICKNAME_LENGTH: '暱稱至少需要 2 個字元',
  MAX_NICKNAME_LENGTH: '暱稱不能超過 30 個字元',
  MAX_BIO_LENGTH: '簡介不能超過 500 個字元',

  // 食譜表單
  REQUIRED_RECIPE_NAME: '請輸入食譜名稱',
  REQUIRED_INGREDIENT_NAME: '請輸入食材名稱',
  REQUIRED_SEASONING_NAME: '請輸入調味料名稱',
  REQUIRED_SEASONING_NAME_ALT: '請輸入調料名稱',
  REQUIRED_AMOUNT: '請輸入數量',
  REQUIRED_COOKING_TIME: '請輸入烹調時間',
  REQUIRED_SERVINGS: '請輸入人份數',
  NUMERIC_INPUT_ONLY: '請輸入數字',

  // 評論相關
  MIN_COMMENT_LENGTH: '評論內容至少需要 10 個字',
  MAX_COMMENT_LENGTH: '評論內容不可超過 500 個字',
  REQUIRED_RATING: '請選擇評分',

  // 食譜上傳
  MIN_RECIPE_TITLE_LENGTH: '食譜名稱至少需要 2 個字元',
  MIN_RECIPE_INTRO_LENGTH: '食譜介紹至少需要 10 個字元',
  MIN_VIDEO_DESCRIPTION_LENGTH: '說明文字至少需要10個字',
  REQUIRED_COVER_IMAGE: '請上傳封面圖片',
  SELECT_VALID_IMAGE: '請選擇有效的圖片檔案',
  AGREE_TERMS: '請同意條款才能繼續',
  MIN_INGREDIENTS: '至少需要一項食材',
  MIN_TAGS: '至少需要一個標籤',

  // 上傳相關
  UPLOAD_COVER_IMAGE: '請上傳封面圖片',
  UPLOAD_VALID_VIDEO: '請上傳有效的影片檔案',
  UPLOAD_VIDEO: '請上傳影片',
  UPLOAD_IMAGE_REQUIRED: '請上傳圖片：圖片為必填欄位',
  UPLOAD_VIDEO_REQUIRED: '請上傳影片：影片為必填欄位',
} as const;

// 問題類型選項
export const ISSUE_TYPES = [
  '1. 檢舉會員',
  '2. 檢舉餐廳',
  '3. 檢舉留言',
  '4. 會員操作問題',
  '5. 廣告/行銷合作',
  '6. 其他',
] as const;

// 文字長度限制
export const TEXT_LIMITS = {
  // 最小長度
  MIN_NAME_LENGTH: 1,
  MIN_NICKNAME_LENGTH: 2,
  MIN_MESSAGE_LENGTH: 10,
  MIN_RECIPE_TITLE_LENGTH: 1,
  MIN_INGREDIENT_NAME_LENGTH: 1,
  MIN_SEASONING_NAME_LENGTH: 1,
  MIN_COMMENT_LENGTH: 10,
  MIN_RECIPE_INTRO_LENGTH: 10,
  MIN_VIDEO_DESCRIPTION_LENGTH: 10,

  // 最大長度
  MAX_NICKNAME_LENGTH: 30,
  MAX_BIO_LENGTH: 500,
  MAX_COMMENT_LENGTH: 500,
} as const;
