import Head from 'next/head';
import type { PageSEOProps } from '@/types/seo';
import {
  generatePageTitle,
  generateCanonicalUrl,
  generateImageUrl,
  truncateDescription,
} from '@/lib/utils/seo';
import { SITE_CONFIG } from '@/config/seo';
import { StructuredData } from './StructuredData';

type PageSEOComponentProps = PageSEOProps;

// 頁面 SEO 組件
const PageSEO = ({
  title,
  description,
  keywords = SITE_CONFIG.keywords,
  canonical,
  image = '/images/og-default.jpg',
  imageAlt = SITE_CONFIG.description,
  robots = 'index,follow',
  structuredData = [],
}: PageSEOComponentProps) => {
  // 生成完整標題
  const fullTitle = generatePageTitle(title);

  // 生成 canonical URL
  const canonicalUrl = canonical
    ? generateCanonicalUrl(canonical)
    : SITE_CONFIG.url;

  // 生成完整圖片 URL
  const fullImageUrl = generateImageUrl(image);

  // 限制描述長度
  const truncatedDescription = truncateDescription(description, 160);

  return (
    <>
      <Head>
        {/* 基礎 Meta 標籤 */}
        <title>{fullTitle}</title>
        <meta name="description" content={truncatedDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={SITE_CONFIG.author} />
        <meta name="robots" content={robots} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph 標籤 */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_CONFIG.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={truncatedDescription} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:image:alt" content={imageAlt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="zh_TW" />

        {/* Twitter Card 標籤 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@annacook" />
        <meta name="twitter:creator" content="@annacook" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={truncatedDescription} />
        <meta name="twitter:image" content={fullImageUrl} />
        <meta name="twitter:image:alt" content={imageAlt} />

        {/* 其他重要 Meta 標籤 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="format-detection" content="telephone=no" />

        {/* 語言相關 */}
        <meta httpEquiv="Content-Language" content="zh-TW" />
        <link rel="alternate" hrefLang="zh-TW" href={canonicalUrl} />
      </Head>

      {/* 結構化數據 */}
      {structuredData.length > 0 && <StructuredData data={structuredData} />}
    </>
  );
};

export { PageSEO };
