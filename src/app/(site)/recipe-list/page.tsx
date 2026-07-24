import type { Metadata } from 'next';
import { searchRecipesServer } from '@/services/server-api';
import type { Recipe as RecipeCardType } from '@/types/recipe';
import { SORT_TYPES } from '@/lib/constants';
import { getImageUrl } from '@/lib/utils/media';
import { RecipeListClient } from './recipe-list-client';

type SearchParams = { [key: string]: string | string[] | undefined };

// 取 searchParams 的第一個值（相容陣列型別）
const firstParam = (v: string | string[] | undefined): string =>
  (Array.isArray(v) ? v[0] : v) ?? '';

// 依 searchParams 解析出後端 API 需要的排序值與頁碼
function parseParams(sp: SearchParams) {
  const query = firstParam(sp.q).trim();
  const apiSortType =
    firstParam(sp.type) === SORT_TYPES.POPULAR
      ? SORT_TYPES.POPULAR
      : SORT_TYPES.CREATED_AT;
  const pageNum = Number.parseInt(firstParam(sp.page) || '1', 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  return { query, apiSortType, page };
}

// 動態 SEO（取代原 PageSEO + generateSEOContent；用 absolute 避免與 root title template 重複套用）
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const keyword = firstParam((await searchParams).q).trim();
  const keywords = '食譜搜尋, 手機食譜, 影片教學, 分段播放, 家常料理, 美味食譜';

  if (keyword) {
    return {
      title: {
        absolute: `${keyword}相關美味食譜｜安那煮 | 家傳好菜－Anna Cook`,
      },
      description: `所有${keyword}相關美味食譜，都在安那煮Anna Cook。安那煮手機食譜教學，讓做菜變簡單。分段播放影片食譜，手機一鍵教學步驟，家常食譜一次學會不手忙腳亂，讓你輕鬆依照每步食譜完成美味料理。`,
      keywords,
      alternates: {
        canonical: `/recipe-list?search=${encodeURIComponent(keyword)}`,
      },
    };
  }

  return {
    title: { absolute: '食譜搜尋｜安那煮 | 家傳好菜－Anna Cook' },
    description:
      '探索安那煮Anna Cook的豐富食譜庫。安那煮手機食譜教學，讓做菜變簡單。分段播放影片食譜，手機一鍵教學步驟，家常食譜一次學會不手忙腳亂，讓你輕鬆依照每步食譜完成美味料理。',
    keywords,
    alternates: { canonical: '/recipe-list' },
  };
}

/**
 * 食譜列表頁（Server Component）
 * 資料抓取搬至伺服器：依 searchParams（q/type/page）於 server 端抓取；
 * 排序/分頁由 client 以 router.push 更新 URL → 觸發本 Server Component 重新抓取（RSC）。
 */
export default async function RecipeListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query, apiSortType, page } = parseParams(await searchParams);

  const result = await searchRecipesServer(query, apiSortType, page);

  // 將後端資料轉為前端卡片格式（與原 getStaticProps 相同）
  const recipes: RecipeCardType[] = (result.data ?? []).map((item) => ({
    id: String(item.id),
    title: item.recipeName,
    image: getImageUrl(item.coverPhoto, '/images/recipe-placeholder.jpg'),
    category: '',
    time: item.cookingTime,
    cookingTime: item.cookingTime,
    servings: item.portion,
    rating: item.rating,
    description: item.description,
  }));

  // 內部 sortBy（LATEST/POPULAR）供 UI 高亮
  const sortBy =
    apiSortType === SORT_TYPES.POPULAR ? SORT_TYPES.POPULAR : SORT_TYPES.LATEST;

  return (
    <RecipeListClient
      recipes={recipes}
      totalCount={result.totalCount ?? 0}
      hasMore={result.hasMore ?? false}
      query={query}
      sortBy={sortBy}
      currentPage={page}
    />
  );
}
