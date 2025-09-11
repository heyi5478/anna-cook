import Head from 'next/head';
import type { StructuredData } from '@/types/seo';

type StructuredDataProps = {
  data: StructuredData[];
};

// 結構化數據組件
const StructuredData = ({ data }: StructuredDataProps) => {
  // 安全地生成 JSON-LD 字符串
  const generateJsonLd = (structuredData: StructuredData[]): string => {
    try {
      // 如果只有一個結構化數據，直接返回對象
      if (structuredData.length === 1) {
        return JSON.stringify({
          '@context': 'https://schema.org',
          ...structuredData[0],
        });
      }

      // 如果有多個結構化數據，返回數組
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': structuredData,
      });
    } catch (error) {
      console.error('Error generating structured data JSON-LD:', error);
      return '';
    }
  };

  // 驗證結構化數據
  const validateStructuredData = (
    structuredDataList: StructuredData[],
  ): boolean => {
    if (!Array.isArray(structuredDataList) || structuredDataList.length === 0) {
      return false;
    }

    // 檢查每個數據是否有必要的 @type 屬性
    return structuredDataList.every((item) => {
      return (
        item && typeof item === 'object' && '@type' in item && item['@type']
      );
    });
  };

  // 如果數據無效，返回 null
  if (!validateStructuredData(data)) {
    return null;
  }

  const jsonLdString = generateJsonLd(data);

  // 如果生成失敗，返回 null
  if (!jsonLdString) {
    return null;
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString,
        }}
      />
    </Head>
  );
};

export { StructuredData };
