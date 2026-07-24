import type { StructuredData } from '@/types/seo';

type JsonLdProps = {
  data: StructuredData[];
};

// 跳脫會提前關閉 <script> 或破壞 JSON 的字元，避免 JSON-LD 突破標籤造成 XSS
// 處理 <、>、& 以及 U+2028 / U+2029（JS 字串中的非法行分隔符）
const escapeForScriptTag = (json: string): string =>
  json
    .replace(
      /[<>&]/g,
      (ch) => `\\u${`000${ch.charCodeAt(0).toString(16)}`.slice(-4)}`,
    )
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');

// 生成 JSON-LD 字串（單筆直接展開、多筆包成 @graph）
const generateJsonLd = (data: StructuredData[]): string => {
  const payload =
    data.length === 1
      ? { '@context': 'https://schema.org', ...data[0] }
      : { '@context': 'https://schema.org', '@graph': data };
  return escapeForScriptTag(JSON.stringify(payload));
};

/**
 * App Router 版結構化資料（JSON-LD）
 * 直接於元件樹輸出 <script>，取代 Pages Router 以 next/head 包裝的 StructuredData
 */
export function JsonLd({ data }: JsonLdProps) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const valid = data.every(
    (item) =>
      item && typeof item === 'object' && '@type' in item && item['@type'],
  );
  if (!valid) return null;

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: generateJsonLd(data) }}
    />
  );
}
