import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchRecipeDetailServer } from '@/services/server-api';
import { HTTP_STATUS } from '@/lib/constants';
import {
  truncateDescription,
  generateImageUrl,
  formatCookingTime,
  formatRecipeRating,
} from '@/lib/utils/seo';
import { getImageUrl } from '@/lib/utils/media';
import type { RecipeStructuredData } from '@/types/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { RecipePageClient } from './recipe-page-client';

// 成功資料每小時重新驗證（對應原 getStaticProps 的 MEDIUM revalidate）
export const revalidate = 3600;

// 不預先生成任何路徑，採按需 ISR（對應原 getStaticPaths fallback: true）
export function generateStaticParams() {
  return [] as { id: string[] }[];
}

type PageParams = { id: string[] };

// 解析 catch-all 第一段為食譜 id
const parseRecipeId = (id: string[]): number =>
  Number.parseInt(id?.[0] ?? '', 10);

// 動態 SEO（取代原 RecipeSEO 的 meta 部分）
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const recipeId = parseRecipeId((await params).id);
  if (Number.isNaN(recipeId)) return {};

  const data = await fetchRecipeDetailServer(recipeId);
  if (data.StatusCode !== HTTP_STATUS.OK || !data.data) {
    return { title: { absolute: '找不到該食譜｜安那煮 Anna Cook' } };
  }

  const { recipe } = data.data;
  const title = `${recipe.recipeName}｜安那煮 | 家傳好菜－Anna Cook`;
  const description = truncateDescription(
    `${recipe.description || `學習製作 ${recipe.recipeName}`}。安那煮Anna Cook食譜教學，讓做菜變簡單。影片食譜一鍵教學，家常食譜一次學會，輕鬆完成美味料理。`,
    160,
  );
  const ogImage = recipe.coverPhoto
    ? getImageUrl(recipe.coverPhoto, '/images/og-default.jpg')
    : '/images/og-default.jpg';

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/recipe-page/${recipe.id}` },
    openGraph: { title, description, images: [ogImage] },
  };
}

/**
 * 食譜頁（Server Component）
 * 依 catch-all id 於 server 端抓取食譜；按需 ISR；煮菜時的 Wake Lock 由 client 包裝處理。
 */
export default async function RecipePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const recipeId = parseRecipeId((await params).id);
  if (Number.isNaN(recipeId)) notFound();

  const recipeData = await fetchRecipeDetailServer(recipeId);

  // 找不到食譜：沿用原本的內嵌提示（非 404 頁）
  if (recipeData.StatusCode !== HTTP_STATUS.OK || !recipeData.data) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">找不到該食譜</h2>
        <p className="text-neutral-600">
          {recipeData.msg || '食譜可能已被刪除或尚未發布'}
        </p>
      </div>
    );
  }

  const { recipe } = recipeData.data;

  // 食譜 Recipe 結構化資料（對應原 RecipeSEO 產生的 JSON-LD）
  const recipeImages = recipe.coverPhoto
    ? [getImageUrl(recipe.coverPhoto, '/images/og-default.jpg')]
    : ['/images/og-default.jpg'];
  const recipeSchema: RecipeStructuredData = {
    '@type': 'Recipe',
    name: recipe.recipeName,
    description:
      recipe.description ||
      `學習製作 ${recipe.recipeName}，安那煮提供詳細的食譜步驟和影音教學。`,
    image: recipeImages.map((img) => generateImageUrl(img)),
    author: { '@type': 'Person', name: '安那煮 Anna Cook' },
    datePublished: new Date().toISOString(),
    recipeCategory: '台灣料理',
    recipeCuisine: '台灣菜',
  };
  if (recipe.cookingTime) {
    recipeSchema.cookTime = formatCookingTime(recipe.cookingTime);
  }
  if (recipe.portion) {
    recipeSchema.recipeYield = String(recipe.portion);
  }
  if (recipe.rating) {
    recipeSchema.aggregateRating = formatRecipeRating(recipe.rating, 1);
  }

  return (
    <>
      <JsonLd data={[recipeSchema]} />
      <RecipePageClient recipeData={recipeData.data} />
    </>
  );
}
