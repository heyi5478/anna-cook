export type Recipe = {
  id: string;
  title: string;
  description: string;
  image: 'noodles' | 'chicken';
  author: string;
  minutes: number;
  servings: number;
  rating: string;
  popularity: number;
  classic: boolean;
  tags: string[];
  ingredients: string[];
  steps: string[];
};

// 教學展示專用的固定資料；圖片沿用專案橫幅，並非食譜的實際成品照。
export const recipes: Recipe[] = [
  {
    id: 'mushroom-chicken',
    title: '家常香菇燉雞',
    description: '一鍋暖呼呼的家常味，讓香菇的鮮甜慢慢煮進雞湯裡。',
    image: 'chicken',
    author: '安那的家常廚房',
    minutes: 45,
    servings: 4,
    rating: '4.9',
    popularity: 96,
    classic: true,
    tags: ['雞肉', '香菇', '湯品'],
    ingredients: [
      '雞腿肉 600 公克',
      '乾香菇 6 朵',
      '薑片 4 片',
      '水 1,200 毫升',
      '鹽 適量',
    ],
    steps: [
      '香菇泡軟，雞肉切塊；準備薑片。',
      '將雞肉、香菇與薑片放入鍋中，加水煮滾後轉小火燉煮。',
      '確認雞肉熟透後調味，即可盛碗享用。',
    ],
  },
  {
    id: 'egg-noodles',
    title: '滑蛋蔬菜炒河粉',
    description: '蛋香、青菜和河粉一起快炒，簡單備料就能端出的一餐。',
    image: 'noodles',
    author: '小安的晚餐提案',
    minutes: 20,
    servings: 2,
    rating: '4.8',
    popularity: 88,
    classic: false,
    tags: ['河粉', '雞蛋', '快手料理'],
    ingredients: [
      '河粉 300 公克',
      '雞蛋 2 顆',
      '青菜 1 把',
      '蒜末 1 小匙',
      '醬油 1 大匙',
    ],
    steps: [
      '青菜切段，雞蛋打散，河粉輕輕撥開。',
      '熱鍋炒香蒜末，加入雞蛋與青菜拌炒。',
      '放入河粉與醬油，拌炒均勻至食材熟透。',
    ],
  },
  {
    id: 'garlic-chicken',
    title: '蒜香菇菇雞湯',
    description: '用一鍋清甜雞湯，替忙碌的一天慢慢收尾。',
    image: 'chicken',
    author: '安那的家常廚房',
    minutes: 40,
    servings: 3,
    rating: '4.7',
    popularity: 72,
    classic: true,
    tags: ['雞湯', '雞肉', '蒜頭', '香菇'],
    ingredients: [
      '雞腿肉 500 公克',
      '蒜頭 8 瓣',
      '鮮香菇 5 朵',
      '水 1,000 毫升',
      '鹽 適量',
    ],
    steps: [
      '雞肉切塊，蒜頭剝皮，香菇切半。',
      '所有食材加水煮滾，轉小火燉煮至雞肉熟透。',
      '起鍋前以少許鹽調味，依喜好加入蔥花。',
    ],
  },
  {
    id: 'spicy-noodles',
    title: '香辣雞肉炒河粉',
    description: '加一點辣、添一點香，下班後也想認真吃飯。',
    image: 'noodles',
    author: '小安的晚餐提案',
    minutes: 25,
    servings: 2,
    rating: '4.9',
    popularity: 99,
    classic: false,
    tags: ['河粉', '雞肉', '香辣', '快手料理'],
    ingredients: [
      '河粉 300 公克',
      '雞腿肉 200 公克',
      '青菜 1 把',
      '辣椒 1 根',
      '醬油 1 大匙',
    ],
    steps: [
      '雞腿肉切小塊，青菜與辣椒切段。',
      '將雞肉炒至熟透，加入辣椒與青菜拌炒。',
      '放入河粉與醬油，大火拌炒均勻後盛盤。',
    ],
  },
  {
    id: 'ginger-chicken',
    title: '老薑暖心雞湯',
    description: '薑香搭配雞湯的甘甜，是餐桌上熟悉的安心滋味。',
    image: 'chicken',
    author: '安那的家常廚房',
    minutes: 50,
    servings: 4,
    rating: '4.8',
    popularity: 84,
    classic: true,
    tags: ['雞肉', '老薑', '湯品'],
    ingredients: [
      '雞腿肉 600 公克',
      '老薑 6 片',
      '香菇 4 朵',
      '水 1,200 毫升',
      '鹽 適量',
    ],
    steps: [
      '雞肉切塊，老薑切片，香菇洗淨。',
      '以少許油炒香薑片，加入雞肉拌炒後加水。',
      '加入香菇燉煮至雞肉熟透，再以鹽調味。',
    ],
  },
  {
    id: 'classic-noodles',
    title: '經典家常炒河粉',
    description: '把冰箱裡的蔬菜變成主角，每一口都是剛剛好的家常。',
    image: 'noodles',
    author: '小安的晚餐提案',
    minutes: 15,
    servings: 2,
    rating: '4.6',
    popularity: 68,
    classic: true,
    tags: ['河粉', '蔬菜', '快手料理'],
    ingredients: [
      '河粉 300 公克',
      '雞蛋 1 顆',
      '當季青菜 1 把',
      '蒜末 1 小匙',
      '醬油 1 大匙',
    ],
    steps: [
      '青菜切段，河粉撥開，雞蛋打散。',
      '熱鍋炒蛋，加入蒜末與青菜拌炒。',
      '加入河粉與醬油，炒至均勻上色且食材熟透。',
    ],
  },
];
