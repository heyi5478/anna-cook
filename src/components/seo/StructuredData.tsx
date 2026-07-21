import Head from 'next/head';
import type { StructuredData } from '@/types/seo';

type StructuredDataProps = {
  data: StructuredData[];
};

// 結構化數據組件
const StructuredData = ({ data }: StructuredDataProps) => {
  // 跳脫會提前關閉 <script> 標籤或破壞 JSON 的字元，避免 JSON-LD 內容突破標籤造成 XSS
  const escapeForScriptTag = (json: string): string =>
    json.replace(
      /[<>&\u2028\u2029]/g,
      (ch) => `\\u${`000${ch.charCodeAt(0).toString(16)}`.slice(-4)}`,
    );

  // 安全地生成 JSON-LD 字符串（輸出前跳脫 HTML 敏感字元）
  const generateJsonLd = (structuredData: StructuredData[]): string => {
    try {
      // 單筆直接展開物件，多筆則包成 @graph 陣列
      const payload =
        structuredData.length === 1
          ? { '@context': 'https://schema.org', ...structuredData[0] }
          : { '@context': 'https://schema.org', '@graph': structuredData };

      return escapeForScriptTag(JSON.stringify(payload));
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
