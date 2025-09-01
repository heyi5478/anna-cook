import type { BreadcrumbStructuredData } from '@/types/seo';
import { SITE_CONFIG } from '@/config/seo';

// 生成頁面標題
const generatePageTitle = (title: string): string => {
  if (title === SITE_CONFIG.name) {
    return title;
  }
  return `${title} | ${SITE_CONFIG.name}`;
};

// 生成 canonical URL
const generateCanonicalUrl = (path: string): string => {
  // 確保路徑以 / 開頭
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // 移除結尾的 /
  const trimmedPath =
    cleanPath.endsWith('/') && cleanPath !== '/'
      ? cleanPath.slice(0, -1)
      : cleanPath;

  return `${SITE_CONFIG.url}${trimmedPath}`;
};

// 處理圖片 URL (相對路徑轉絕對路徑)
const generateImageUrl = (imageUrl: string): string => {
  // 如果已經是完整 URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // 如果是相對路徑，轉換為絕對路徑
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
};

// 限制描述長度
const truncateDescription = (
  description: string,
  maxLength: number = 160,
): string => {
  if (description.length <= maxLength) {
    return description;
  }

  // 在最後一個空格處截斷，避免截斷單詞
  const truncated = description.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return `${truncated.slice(0, lastSpaceIndex)}...`;
  }

  return `${truncated}...`;
};

// 生成麵包屑結構化數據
const generateBreadcrumbStructuredData = (
  breadcrumbs: Array<{ name: string; href: string }>,
): BreadcrumbStructuredData => {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: generateCanonicalUrl(crumb.href),
    })),
  };
};

// 驗證 SEO 標題長度
const validateTitleLength = (title: string): boolean => {
  return title.length >= 10 && title.length <= 60;
};

// 驗證 SEO 描述長度
const validateDescriptionLength = (description: string): boolean => {
  return description.length >= 120 && description.length <= 160;
};

// 清理和格式化關鍵字
const formatKeywords = (keywords: string | string[]): string => {
  if (Array.isArray(keywords)) {
    return keywords.join(', ');
  }
  return keywords.trim();
};

// 生成食譜評分的結構化數據格式
const formatRecipeRating = (rating: number, reviewCount: number) => {
  return {
    '@type': 'AggregateRating' as const,
    ratingValue: Math.round(rating * 10) / 10, // 四捨五入到小數點第一位
    reviewCount: Math.max(1, reviewCount), // 至少要有 1 個評論
    bestRating: 5,
    worstRating: 1,
  };
};

// 格式化烹飪時間為 ISO 8601 格式
const formatCookingTime = (minutes: number): string => {
  if (minutes <= 0) return 'PT0M';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (remainingMinutes > 0) duration += `${remainingMinutes}M`;

  return duration;
};

export {
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
};
