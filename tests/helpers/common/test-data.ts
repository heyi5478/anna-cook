/**
 * 測試用戶資料型別
 */
export type TestUser = {
  id: string;
  displayId: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
};

/**
 * 測試食譜資料型別
 */
export type TestRecipe = {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  ingredients: TestIngredient[];
  steps: TestStep[];
  tags: string[];
  coverImage?: string;
};

/**
 * 測試食材資料型別
 */
export type TestIngredient = {
  name: string;
  amount: string;
  unit?: string;
  isFlavoring: boolean;
};

/**
 * 測試步驟資料型別
 */
export type TestStep = {
  description: string;
  startTime: number;
  endTime: number;
};

/**
 * 測試影片資料型別
 */
export type TestVideo = {
  filename: string;
  duration: number;
  size: number;
  format: string;
  resolution: string;
};

/**
 * 模擬用戶資料
 */
export const MOCK_USERS: TestUser[] = [
  {
    id: 'user-001',
    displayId: 'chef-anna',
    email: 'anna@example.com',
    name: '安娜主廚',
    avatar: '/test-assets/avatars/anna.jpg',
    bio: '專業料理講師，擅長中式料理',
  },
  {
    id: 'user-002',
    displayId: 'cooking-master',
    email: 'master@example.com',
    name: '料理大師',
    avatar: '/test-assets/avatars/master.jpg',
    bio: '多年餐廳經驗，專精各國料理',
  },
  {
    id: 'user-003',
    displayId: 'home-cook',
    email: 'home@example.com',
    name: '家庭煮婦',
    bio: '分享簡單易做的家常菜',
  },
];

/**
 * 模擬食譜資料
 */
export const MOCK_RECIPES: TestRecipe[] = [
  {
    id: 'recipe-001',
    title: '麻婆豆腐',
    description: '經典川菜，麻辣鮮香的豆腐料理',
    cookingTime: 30,
    servings: 4,
    ingredients: [
      { name: '嫩豆腐', amount: '1', unit: '盒', isFlavoring: false },
      { name: '絞肉', amount: '100', unit: 'g', isFlavoring: false },
      { name: '豆瓣醬', amount: '2', unit: '大匙', isFlavoring: true },
      { name: '蔥花', amount: '適量', isFlavoring: true },
    ],
    steps: [
      { description: '將豆腐切塊，用鹽水汆燙', startTime: 0, endTime: 60 },
      { description: '熱鍋下絞肉炒散', startTime: 60, endTime: 120 },
      { description: '加入豆瓣醬炒香', startTime: 120, endTime: 180 },
      { description: '下豆腐塊輕炒', startTime: 180, endTime: 240 },
      { description: '調味並勾芡', startTime: 240, endTime: 300 },
    ],
    tags: ['川菜', '辣味', '豆腐', '下飯'],
    coverImage: '/test-assets/recipes/mapo-tofu.jpg',
  },
  {
    id: 'recipe-002',
    title: '番茄炒蛋',
    description: '家常菜經典，酸甜開胃',
    cookingTime: 15,
    servings: 2,
    ingredients: [
      { name: '雞蛋', amount: '3', unit: '個', isFlavoring: false },
      { name: '番茄', amount: '2', unit: '個', isFlavoring: false },
      { name: '糖', amount: '1', unit: '小匙', isFlavoring: true },
      { name: '鹽', amount: '適量', isFlavoring: true },
    ],
    steps: [
      { description: '雞蛋打散加鹽調味', startTime: 0, endTime: 30 },
      { description: '番茄去皮切塊', startTime: 30, endTime: 90 },
      { description: '熱鍋炒蛋盛起', startTime: 90, endTime: 150 },
      { description: '炒番茄出汁', startTime: 150, endTime: 210 },
      { description: '下炒蛋拌勻即可', startTime: 210, endTime: 270 },
    ],
    tags: ['家常菜', '簡單', '蛋類', '番茄'],
    coverImage: '/test-assets/recipes/tomato-egg.jpg',
  },
];

/**
 * 模擬影片資料
 */
export const MOCK_VIDEOS: TestVideo[] = [
  {
    filename: 'test-video-short.mp4',
    duration: 30,
    size: 5 * 1024 * 1024, // 5MB
    format: 'mp4',
    resolution: '720p',
  },
  {
    filename: 'test-video-medium.mp4',
    duration: 120,
    size: 20 * 1024 * 1024, // 20MB
    format: 'mp4',
    resolution: '1080p',
  },
  {
    filename: 'test-video-long.mp4',
    duration: 300,
    size: 50 * 1024 * 1024, // 50MB
    format: 'mp4',
    resolution: '1080p',
  },
];

/**
 * 常用標籤列表
 */
export const COMMON_TAGS = [
  '家常菜',
  '川菜',
  '粵菜',
  '湘菜',
  '魯菜',
  '簡單',
  '快手',
  '營養',
  '健康',
  '減脂',
  '辣味',
  '清淡',
  '酸甜',
  '鮮香',
  '麻辣',
  '素食',
  '葷菜',
  '湯品',
  '甜點',
  '小食',
  '早餐',
  '午餐',
  '晚餐',
  '宵夜',
  '下午茶',
];

/**
 * 常用食材列表
 */
export const COMMON_INGREDIENTS = [
  // 蛋白質
  '豬肉',
  '牛肉',
  '雞肉',
  '魚肉',
  '蝦仁',
  '雞蛋',
  '豆腐',

  // 蔬菜
  '青菜',
  '白菜',
  '高麗菜',
  '胡蘿蔔',
  '洋蔥',
  '蒜頭',
  '薑',
  '青椒',
  '番茄',
  '馬鈴薯',
  '茄子',
  '黃瓜',
  '豆芽菜',

  // 調料
  '鹽',
  '糖',
  '醬油',
  '香油',
  '米酒',
  '白胡椒',
  '黑胡椒',
  '蔥',
  '薑',
  '蒜',
  '辣椒',
  '花椒',
  '八角',
  '桂皮',
];

/**
 * 常用單位列表
 */
export const COMMON_UNITS = [
  '個',
  '片',
  '塊',
  '條',
  '根',
  '顆',
  '粒',
  'g',
  'kg',
  'ml',
  'L',
  '大匙',
  '小匙',
  '杯',
  '適量',
  '少許',
  '一些',
  '幾滴',
];

/**
 * 產生隨機用戶資料
 */
export const generateRandomUser = (): TestUser => {
  const names = [
    '小明',
    '小美',
    '阿華',
    '小芳',
    '大雄',
    '靜香',
    '胖虎',
    '小夫',
  ];
  const domains = ['example.com', 'test.com', 'demo.com'];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const randomId = Math.random().toString(36).substring(7);

  return {
    id: `user-${randomId}`,
    displayId: `user-${randomId}`,
    email: `${randomName.toLowerCase()}@${randomDomain}`,
    name: randomName,
    bio: `我是 ${randomName}，喜歡分享料理`,
  };
};

/**
 * 產生隨機食材
 */
export const generateRandomIngredient = (): TestIngredient => {
  const ingredient =
    COMMON_INGREDIENTS[Math.floor(Math.random() * COMMON_INGREDIENTS.length)];
  const unit = COMMON_UNITS[Math.floor(Math.random() * COMMON_UNITS.length)];
  const amount = Math.floor(Math.random() * 10) + 1;

  return {
    name: ingredient,
    amount: amount.toString(),
    unit,
    isFlavoring: Math.random() > 0.7, // 30% 機率是調味料
  };
};

/**
 * 產生隨機步驟
 */
export const generateRandomStep = (
  index: number,
  stepDuration: number = 60,
): TestStep => {
  const actions = ['切', '炒', '煮', '燉', '蒸', '炸', '烤', '調味'];
  const action = actions[Math.floor(Math.random() * actions.length)];

  return {
    description: `步驟 ${index + 1}: ${action}處理食材`,
    startTime: index * stepDuration,
    endTime: (index + 1) * stepDuration,
  };
};

/**
 * 產生隨機食譜
 */
export const generateRandomRecipe = (): TestRecipe => {
  const dishes = ['炒飯', '湯麵', '燉湯', '炒菜', '蒸蛋', '煎魚', '燒肉'];
  const dish = dishes[Math.floor(Math.random() * dishes.length)];
  const randomId = Math.random().toString(36).substring(7);

  const ingredientCount = Math.floor(Math.random() * 6) + 3; // 3-8 個食材
  const stepCount = Math.floor(Math.random() * 5) + 3; // 3-7 個步驟
  const tagCount = Math.floor(Math.random() * 3) + 2; // 2-4 個標籤

  const ingredients = Array.from({ length: ingredientCount }, () =>
    generateRandomIngredient(),
  );
  const steps = Array.from({ length: stepCount }, (_, index) =>
    generateRandomStep(index),
  );
  const tags = Array.from(
    { length: tagCount },
    () => COMMON_TAGS[Math.floor(Math.random() * COMMON_TAGS.length)],
  );

  return {
    id: `recipe-${randomId}`,
    title: `美味${dish}`,
    description: `這是一道美味的${dish}，簡單易做，營養豐富`,
    cookingTime: stepCount * 60, // 每步驟 60 秒
    servings: Math.floor(Math.random() * 4) + 2, // 2-5 人份
    ingredients,
    steps,
    tags: [...new Set(tags)], // 去重
  };
};

/**
 * 取得預設測試用戶
 */
export const getDefaultTestUser = (): TestUser => MOCK_USERS[0];

/**
 * 取得預設測試食譜
 */
export const getDefaultTestRecipe = (): TestRecipe => MOCK_RECIPES[0];

/**
 * 取得預設測試影片
 */
export const getDefaultTestVideo = (): TestVideo => MOCK_VIDEOS[0];

/**
 * 產生測試檔案路徑
 */
export const getTestFilePath = (
  filename: string,
  category: 'videos' | 'images' | 'documents' = 'videos',
): string => {
  return `tests/fixtures/${category}/${filename}`;
};

/**
 * 產生有效的測試 Email
 */
export const generateTestEmail = (prefix: string = 'test'): string => {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}@test.com`;
};

/**
 * 產生有效的測試密碼
 */
export const generateTestPassword = (): string => {
  return 'Test123456!';
};

/**
 * 產生測試用的 displayId
 */
export const generateTestDisplayId = (prefix: string = 'test'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}`;
};
