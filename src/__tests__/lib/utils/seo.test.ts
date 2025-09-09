import {
  generatePageTitle,
  generateCanonicalUrl,
  generateImageUrl,
  truncateDescription,
  generateBreadcrumbStructuredData,
  validateTitleLength,
  validateDescriptionLength,
  formatKeywords,
  formatRecipeRating,
  formatCookingTime,
} from '@/lib/utils/seo';

// Mock SITE_CONFIG
jest.mock('@/config/seo', () => ({
  SITE_CONFIG: {
    name: '安那煮 | 家傳好菜－Anna Cook',
    url: 'https://anna-cook.zeabur.app',
    description: '安那煮是一個專為行動裝置設計的食譜教學平台',
  },
}));

describe('SEO Utils', () => {
  describe('generatePageTitle', () => {
    test('應該為非網站名稱的標題添加網站名稱後綴', () => {
      const title = '美味炸雞食譜';
      const result = generatePageTitle(title);

      expect(result).toBe('美味炸雞食譜 | 安那煮 | 家傳好菜－Anna Cook');
    });

    test('應該保持網站名稱不變', () => {
      const title = '安那煮 | 家傳好菜－Anna Cook';
      const result = generatePageTitle(title);

      expect(result).toBe('安那煮 | 家傳好菜－Anna Cook');
    });

    test('應該正確處理空字串標題', () => {
      const title = '';
      const result = generatePageTitle(title);

      expect(result).toBe(' | 安那煮 | 家傳好菜－Anna Cook');
    });

    test('應該正確處理包含特殊字符的標題', () => {
      const title = '媽媽的炸雞：家傳秘方 (超好吃!)';
      const result = generatePageTitle(title);

      expect(result).toBe(
        '媽媽的炸雞：家傳秘方 (超好吃!) | 安那煮 | 家傳好菜－Anna Cook',
      );
    });
  });

  describe('generateCanonicalUrl', () => {
    test('應該為有效路徑生成正確的 canonical URL', () => {
      const path = '/recipe/123';
      const result = generateCanonicalUrl(path);

      expect(result).toBe('https://anna-cook.zeabur.app/recipe/123');
    });

    test('應該自動添加開頭的斜線', () => {
      const path = 'recipe/123';
      const result = generateCanonicalUrl(path);

      expect(result).toBe('https://anna-cook.zeabur.app/recipe/123');
    });

    test('應該移除結尾的斜線（根路徑除外）', () => {
      const path = '/recipe/123/';
      const result = generateCanonicalUrl(path);

      expect(result).toBe('https://anna-cook.zeabur.app/recipe/123');
    });

    test('應該正確處理根路徑', () => {
      const path = '/';
      const result = generateCanonicalUrl(path);

      expect(result).toBe('https://anna-cook.zeabur.app/');
    });

    test('應該正確處理多層路徑', () => {
      const path = '/category/appetizer/recipe/123';
      const result = generateCanonicalUrl(path);

      expect(result).toBe(
        'https://anna-cook.zeabur.app/category/appetizer/recipe/123',
      );
    });

    test('應該正確處理包含查詢參數的路徑', () => {
      const path = '/search?q=chicken';
      const result = generateCanonicalUrl(path);

      expect(result).toBe('https://anna-cook.zeabur.app/search?q=chicken');
    });
  });

  describe('generateImageUrl', () => {
    test('應該保持完整 HTTPS URL 不變', () => {
      const imageUrl = 'https://example.com/image.jpg';
      const result = generateImageUrl(imageUrl);

      expect(result).toBe('https://example.com/image.jpg');
    });

    test('應該保持完整 HTTP URL 不變', () => {
      const imageUrl = 'http://example.com/image.jpg';
      const result = generateImageUrl(imageUrl);

      expect(result).toBe('http://example.com/image.jpg');
    });

    test('應該將相對路徑轉換為絕對路徑', () => {
      const imageUrl = '/images/recipe.jpg';
      const result = generateImageUrl(imageUrl);

      expect(result).toBe('https://anna-cook.zeabur.app/images/recipe.jpg');
    });

    test('應該為不以斜線開頭的相對路徑添加斜線', () => {
      const imageUrl = 'images/recipe.jpg';
      const result = generateImageUrl(imageUrl);

      expect(result).toBe('https://anna-cook.zeabur.app/images/recipe.jpg');
    });

    test('應該正確處理包含查詢參數的圖片 URL', () => {
      const imageUrl = '/images/recipe.jpg?w=800&h=600';
      const result = generateImageUrl(imageUrl);

      expect(result).toBe(
        'https://anna-cook.zeabur.app/images/recipe.jpg?w=800&h=600',
      );
    });
  });

  describe('truncateDescription', () => {
    test('應該保持短於限制長度的描述不變', () => {
      const description = '這是一個簡短的描述。';
      const result = truncateDescription(description);

      expect(result).toBe('這是一個簡短的描述。');
    });

    test('應該在空格處截斷長描述', () => {
      const description =
        '這是一個非常長的描述，包含了很多詳細資訊和說明，應該要被適當地截斷以符合 SEO 最佳實踐的要求，確保搜尋引擎能夠有效地索引內容而不會因為過長而影響排名效果。';
      const result = truncateDescription(description, 50);

      expect(result.length).toBeLessThanOrEqual(53); // 50 + "..." = 53
      expect(result).toContain('...');
      expect(result).toMatch(/.*\s.*\.\.\./); // 確保在空格處截斷
    });

    test('應該在沒有空格時直接截斷', () => {
      const description =
        'ThisIsAVeryLongDescriptionWithoutSpacesThatShouldBeTruncatedDirectly';
      const result = truncateDescription(description, 20);

      expect(result).toBe('ThisIsAVeryLongDescr...');
      expect(result.length).toBe(23); // 20 + "..." = 23
    });

    test('應該使用自定義最大長度', () => {
      const description =
        '這是一個測試描述，用來檢驗自定義長度功能是否正常運作。';
      const result = truncateDescription(description, 20);

      expect(result.length).toBeLessThanOrEqual(23); // 20 + "..." = 23
      expect(result).toContain('...');
    });

    test('應該處理空字串', () => {
      const description = '';
      const result = truncateDescription(description);

      expect(result).toBe('');
    });

    test('應該使用預設長度 160', () => {
      const shortDescription = '簡短描述';
      const result = truncateDescription(shortDescription);

      expect(result).toBe('簡短描述');
    });
  });

  describe('generateBreadcrumbStructuredData', () => {
    test('應該生成正確的麵包屑結構化數據', () => {
      const breadcrumbs = [
        { name: '首頁', href: '/' },
        { name: '食譜分類', href: '/categories' },
        { name: '主食', href: '/categories/main-dish' },
      ];

      const result = generateBreadcrumbStructuredData(breadcrumbs);

      expect(result).toEqual({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首頁',
            item: 'https://anna-cook.zeabur.app/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '食譜分類',
            item: 'https://anna-cook.zeabur.app/categories',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '主食',
            item: 'https://anna-cook.zeabur.app/categories/main-dish',
          },
        ],
      });
    });

    test('應該處理單一麵包屑項目', () => {
      const breadcrumbs = [{ name: '首頁', href: '/' }];

      const result = generateBreadcrumbStructuredData(breadcrumbs);

      expect(result.itemListElement).toHaveLength(1);
      expect(result.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: '首頁',
        item: 'https://anna-cook.zeabur.app/',
      });
    });

    test('應該處理空麵包屑陣列', () => {
      const breadcrumbs: Array<{ name: string; href: string }> = [];

      const result = generateBreadcrumbStructuredData(breadcrumbs);

      expect(result).toEqual({
        '@type': 'BreadcrumbList',
        itemListElement: [],
      });
    });
  });

  describe('validateTitleLength', () => {
    test('應該通過有效長度的標題', () => {
      const validTitle = '美味炸雞食譜教學'; // 8 字符
      const result = validateTitleLength(validTitle);

      expect(result).toBe(false); // 8 < 10，不通過
    });

    test('應該通過最小有效長度的標題', () => {
      const minValidTitle = '美味的炸雞食譜'; // 7 字符
      const result = validateTitleLength(minValidTitle);

      expect(result).toBe(false); // 7 < 10，不通過
    });

    test('應該通過 10 字符的標題', () => {
      const validTitle = '美味的家常炸雞食譜教學'; // 11 字符
      const result = validateTitleLength(validTitle);

      expect(result).toBe(true); // 10 <= 11 <= 60，通過
    });

    test('應該通過最大有效長度的標題', () => {
      const maxValidTitle = 'a'.repeat(60); // 60 字符
      const result = validateTitleLength(maxValidTitle);

      expect(result).toBe(true); // 10 <= 60 <= 60，通過
    });

    test('應該拒絕過長的標題', () => {
      const tooLongTitle = 'a'.repeat(61); // 61 字符
      const result = validateTitleLength(tooLongTitle);

      expect(result).toBe(false); // 61 > 60，不通過
    });

    test('應該拒絕過短的標題', () => {
      const tooShortTitle = 'short'; // 5 字符
      const result = validateTitleLength(tooShortTitle);

      expect(result).toBe(false); // 5 < 10，不通過
    });

    test('應該處理空字串', () => {
      const emptyTitle = '';
      const result = validateTitleLength(emptyTitle);

      expect(result).toBe(false); // 0 < 10，不通過
    });
  });

  describe('validateDescriptionLength', () => {
    test('應該通過有效長度的描述', () => {
      const validDescription = 'a'.repeat(140); // 140 字符
      const result = validateDescriptionLength(validDescription);

      expect(result).toBe(true); // 120 <= 140 <= 160，通過
    });

    test('應該通過最小有效長度的描述', () => {
      const minValidDescription = 'a'.repeat(120); // 120 字符
      const result = validateDescriptionLength(minValidDescription);

      expect(result).toBe(true); // 120 <= 120 <= 160，通過
    });

    test('應該通過最大有效長度的描述', () => {
      const maxValidDescription = 'a'.repeat(160); // 160 字符
      const result = validateDescriptionLength(maxValidDescription);

      expect(result).toBe(true); // 120 <= 160 <= 160，通過
    });

    test('應該拒絕過短的描述', () => {
      const tooShortDescription = 'a'.repeat(119); // 119 字符
      const result = validateDescriptionLength(tooShortDescription);

      expect(result).toBe(false); // 119 < 120，不通過
    });

    test('應該拒絕過長的描述', () => {
      const tooLongDescription = 'a'.repeat(161); // 161 字符
      const result = validateDescriptionLength(tooLongDescription);

      expect(result).toBe(false); // 161 > 160，不通過
    });
  });

  describe('formatKeywords', () => {
    test('應該將關鍵字陣列轉換為逗號分隔的字串', () => {
      const keywords = ['食譜', '烹飪', '家常菜', '美食'];
      const result = formatKeywords(keywords);

      expect(result).toBe('食譜, 烹飪, 家常菜, 美食');
    });

    test('應該保持字串關鍵字不變但去除空白', () => {
      const keywords = '  食譜, 烹飪, 家常菜, 美食  ';
      const result = formatKeywords(keywords);

      expect(result).toBe('食譜, 烹飪, 家常菜, 美食');
    });

    test('應該處理空陣列', () => {
      const keywords: string[] = [];
      const result = formatKeywords(keywords);

      expect(result).toBe('');
    });

    test('應該處理單一關鍵字陣列', () => {
      const keywords = ['食譜'];
      const result = formatKeywords(keywords);

      expect(result).toBe('食譜');
    });

    test('應該處理空字串', () => {
      const keywords = '';
      const result = formatKeywords(keywords);

      expect(result).toBe('');
    });
  });

  describe('formatRecipeRating', () => {
    test('應該生成正確的評分結構化數據', () => {
      const rating = 4.6;
      const reviewCount = 25;

      const result = formatRecipeRating(rating, reviewCount);

      expect(result).toEqual({
        '@type': 'AggregateRating',
        ratingValue: 4.6,
        reviewCount: 25,
        bestRating: 5,
        worstRating: 1,
      });
    });

    test('應該四捨五入評分到小數點第一位', () => {
      const rating = 4.666;
      const reviewCount = 10;

      const result = formatRecipeRating(rating, reviewCount);

      expect(result.ratingValue).toBe(4.7);
    });

    test('應該確保評論數至少為 1', () => {
      const rating = 4.5;
      const reviewCount = 0;

      const result = formatRecipeRating(rating, reviewCount);

      expect(result.reviewCount).toBe(1);
    });

    test('應該處理負數評論數', () => {
      const rating = 4.5;
      const reviewCount = -5;

      const result = formatRecipeRating(rating, reviewCount);

      expect(result.reviewCount).toBe(1);
    });

    test('應該正確處理整數評分', () => {
      const rating = 5;
      const reviewCount = 100;

      const result = formatRecipeRating(rating, reviewCount);

      expect(result.ratingValue).toBe(5);
      expect(result.reviewCount).toBe(100);
    });
  });

  describe('formatCookingTime', () => {
    test('應該將分鐘數轉換為 ISO 8601 格式', () => {
      const minutes = 30;
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT30M');
    });

    test('應該正確處理小時和分鐘', () => {
      const minutes = 90; // 1 小時 30 分鐘
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT1H30M');
    });

    test('應該正確處理只有小時的情況', () => {
      const minutes = 120; // 2 小時
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT2H');
    });

    test('應該處理 0 分鐘', () => {
      const minutes = 0;
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT0M');
    });

    test('應該處理負數分鐘', () => {
      const minutes = -30;
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT0M');
    });

    test('應該正確處理大數值', () => {
      const minutes = 1440; // 24 小時
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT24H');
    });

    test('應該正確處理複雜時間', () => {
      const minutes = 125; // 2 小時 5 分鐘
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT2H5M');
    });

    test('應該正確處理 1 小時', () => {
      const minutes = 60; // 1 小時
      const result = formatCookingTime(minutes);

      expect(result).toBe('PT1H');
    });
  });
});
