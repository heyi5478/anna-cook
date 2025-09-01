import type {
  SEOConfig,
  PageSEOProps,
  OrganizationStructuredData,
  WebSiteStructuredData,
} from '@/types/seo';

// 網站基本資訊
const SITE_CONFIG = {
  name: '安那煮 Anna Cook',
  description:
    '安那煮 Anna Cook 提供阿公阿嬤的經典食譜，透過沉浸式影音教學，讓您輕鬆學會傳統家鄉味。探索台灣傳統料理的溫暖記憶。',
  url: 'https://annacook.com',
  author: '安那煮 Anna Cook',
  keywords: '台灣料理, 傳統食譜, 家鄉味, 影音教學, 阿公阿嬤食譜',
  locale: 'zh_TW',
} as const;

// 預設 Open Graph 配置
const DEFAULT_OPEN_GRAPH = {
  siteName: SITE_CONFIG.name,
  type: 'website' as const,
  locale: SITE_CONFIG.locale,
};

// 預設 Twitter Card 配置
const DEFAULT_TWITTER_CARD = {
  card: 'summary_large_image' as const,
  site: '@annacook',
  creator: '@annacook',
};

// 組織結構化數據
const organizationStructuredData: OrganizationStructuredData = {
  '@type': 'Organization',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/images/logo.png`,
  description: SITE_CONFIG.description,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@annacook.com',
  },
  sameAs: [
    'https://www.facebook.com/annacook',
    'https://www.instagram.com/annacook',
    'https://www.youtube.com/annacook',
  ],
};

// 網站結構化數據
const websiteStructuredData: WebSiteStructuredData = {
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_CONFIG.url}/recipe-list?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// 生成頁面 SEO 配置的工具函數
const generatePageSEO = (props: PageSEOProps): SEOConfig => {
  const {
    title,
    description,
    keywords = SITE_CONFIG.keywords,
    canonical = SITE_CONFIG.url,
    image = `${SITE_CONFIG.url}/images/og-default.jpg`,
    imageAlt = SITE_CONFIG.description,
    robots = 'index,follow',
    structuredData = [],
  } = props;

  return {
    baseMeta: {
      title,
      description,
      keywords,
      author: SITE_CONFIG.author,
      robots,
      canonical,
    },
    openGraph: {
      ...DEFAULT_OPEN_GRAPH,
      title,
      description,
      image,
      imageAlt,
      url: canonical,
    },
    twitterCard: {
      ...DEFAULT_TWITTER_CARD,
      title,
      description,
      image,
      imageAlt,
    },
    structuredData: [
      organizationStructuredData,
      websiteStructuredData,
      ...structuredData,
    ],
  };
};

// 預設首頁 SEO 配置
const homepageSEOConfig = generatePageSEO({
  title: `${SITE_CONFIG.name} | 傳承家鄉味的食譜分享平台`,
  description: SITE_CONFIG.description,
  canonical: SITE_CONFIG.url,
});

export {
  SITE_CONFIG,
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER_CARD,
  organizationStructuredData,
  websiteStructuredData,
  generatePageSEO,
  homepageSEOConfig,
};
