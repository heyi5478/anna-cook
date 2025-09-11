// 基礎 meta 配置類型
type BaseMetaConfig = {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  robots?: string;
  canonical?: string;
};

// Open Graph 配置類型
type OpenGraphConfig = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  url: string;
  type: 'website' | 'article';
  siteName: string;
  locale?: string;
};

// Twitter Card 配置類型
type TwitterCardConfig = {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  site?: string;
  creator?: string;
};

// 食譜結構化數據類型
type RecipeStructuredData = {
  '@type': 'Recipe';
  name: string;
  description: string;
  image: string[];
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  nutrition?: {
    '@type': 'NutritionInformation';
    calories?: string;
    fatContent?: string;
    carbohydrateContent?: string;
    proteinContent?: string;
  };
  recipeIngredient?: string[];
  recipeInstructions?: Array<{
    '@type': 'HowToStep';
    name?: string;
    text: string;
    image?: string;
  }>;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  video?: {
    '@type': 'VideoObject';
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    embedUrl: string;
    uploadDate: string;
    duration?: string;
  };
};

// 組織結構化數據類型
type OrganizationStructuredData = {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description?: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
};

// 網站結構化數據類型
type WebSiteStructuredData = {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
};

// 麵包屑結構化數據類型
type BreadcrumbStructuredData = {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

// 結構化數據聯合類型
type StructuredData =
  | RecipeStructuredData
  | OrganizationStructuredData
  | WebSiteStructuredData
  | BreadcrumbStructuredData;

// 完整 SEO 配置類型
type SEOConfig = {
  baseMeta: BaseMetaConfig;
  openGraph: OpenGraphConfig;
  twitterCard: TwitterCardConfig;
  structuredData?: StructuredData[];
};

// 頁面 SEO 屬性類型
type PageSEOProps = {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  robots?: string;
  structuredData?: StructuredData[];
};

// 食譜頁面 SEO 屬性類型
type RecipePageSEOProps = PageSEOProps & {
  recipe: {
    name: string;
    description: string;
    image: string[];
    author: string;
    datePublished: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeCuisine?: string;
    recipeIngredient?: string[];
    recipeInstructions?: Array<{
      name?: string;
      text: string;
      image?: string;
    }>;
    nutrition?: {
      calories?: string;
      fatContent?: string;
      carbohydrateContent?: string;
      proteinContent?: string;
    };
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
    };
    video?: {
      name: string;
      description: string;
      thumbnailUrl: string;
      contentUrl: string;
      embedUrl: string;
      uploadDate: string;
      duration?: string;
    };
  };
};

export type {
  BaseMetaConfig,
  OpenGraphConfig,
  TwitterCardConfig,
  RecipeStructuredData,
  OrganizationStructuredData,
  WebSiteStructuredData,
  BreadcrumbStructuredData,
  StructuredData,
  SEOConfig,
  PageSEOProps,
  RecipePageSEOProps,
};
