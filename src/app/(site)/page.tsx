import type { Metadata } from 'next';
import {
  fetchHomeFeatures,
  fetchHomeRecipes,
  type HomeFeatureResponse,
  type HomeRecipesResponse,
} from '@/services/server-api';
import { SORT_TYPES } from '@/lib/constants';
import type { StructuredData } from '@/types/seo';
import {
  organizationStructuredData,
  websiteStructuredData,
} from '@/config/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { HomeClient } from './home-client';

// 首頁每小時重新產生（對應原 getStaticProps 的 revalidate）
export const revalidate = 3600;

// 首頁 Metadata（取代原 PageSEO）
export const metadata: Metadata = {
  title: { absolute: '安那煮 | 家傳好菜－Anna Cook' },
  description:
    '安那煮是一個專為行動裝置設計的食譜教學平台，讓做菜變簡單。提供分段播放的影片食譜，手機一鍵切換教學步驟，減少操作中斷，家常食譜一次學會不手忙腳亂，讓你輕鬆依照每步食譜完成美味料理。',
  keywords: '食譜教學, 行動裝置, 影片食譜, 分段播放, 家常料理, 手機食譜',
  alternates: { canonical: '/' },
};

/**
 * 網站首頁（Server Component）
 * 資料抓取搬至 server：於 server 端抓取特色區塊與最新食譜作為初始資料（static + ISR）；
 * 標籤切換 / 載入更多的後續資料仍由 client 端（HomeClient）自行抓取。
 */
export default async function HomePage() {
  let featureSections: HomeFeatureResponse['data'] = [];
  let latestRecipes: HomeRecipesResponse['data'] = [];
  let latestHasMore = false;

  try {
    const [featuresData, latestRecipesData] = await Promise.all([
      fetchHomeFeatures(),
      fetchHomeRecipes(SORT_TYPES.LATEST, 1),
    ]);
    featureSections = featuresData.data || [];
    latestRecipes = latestRecipesData.data || [];
    latestHasMore = latestRecipesData.hasMore || false;
  } catch (error) {
    console.error('獲取首頁資料失敗:', error);
  }

  // 網站層級結構化資料（對應原 PageSEO 的 organization / website）
  const structuredData: StructuredData[] = [
    organizationStructuredData,
    websiteStructuredData,
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <HomeClient
        featureSections={featureSections}
        latestRecipes={latestRecipes}
        hasMoreRecipes={{
          latest: latestHasMore,
          popular: true,
          classic: true,
        }}
      />
    </>
  );
}
