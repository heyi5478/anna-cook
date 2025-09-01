import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import {
  fetchRecipeDetailServer,
  RecipeDetailResponse,
} from '@/services/server-api';
import RecipePageComponent from '@/components/pages/RecipePage';
import { HTTP_STATUS, REVALIDATE_INTERVALS } from '@/lib/constants';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';
import { RecipeSEO } from '@/components/seo/RecipeSEO';
import { truncateDescription } from '@/lib/utils/seo';

interface RecipePageProps {
  recipeData: RecipeDetailResponse;
}

const RecipePage: NextPage<RecipePageProps> = ({ recipeData }) => {
  const router = useRouter();

  // 如果頁面正在建立，顯示載入中狀態
  if (router.isFallback) {
    return (
      <div className="container mx-auto py-10 text-center">
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  // 如果沒有成功獲取食譜資料
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
  console.log('食譜資料:', recipeData.data);

  // 準備食譜 SEO 資料
  const recipeTitle = `${recipe.recipeName}｜安那煮 | 家傳好菜－Anna Cook`;
  const recipeDescription = truncateDescription(
    `${recipe.description || `學習製作 ${recipe.recipeName}`}。安那煮Anna Cook食譜教學，讓做菜變簡單。影片食譜一鍵教學，家常食譜一次學會，輕鬆完成美味料理。`,
    160,
  );

  // 構建食譜圖片陣列
  const recipeImages: string[] = [];
  if (recipe.coverPhoto) {
    recipeImages.push(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}${recipe.coverPhoto}`,
    );
  }

  // 由於 API 回傳的資料結構中沒有 recipeSteps，這裡暫時註解掉
  // 未來如果 API 有提供步驟資料，可以取消註解
  // const recipeInstructions = recipeData.data.steps?.map((step, index) => ({
  //   name: `步驟 ${index + 1}`,
  //   text: step.content,
  //   image: step.image ? generateImageUrl(step.image) : undefined
  // })) || [];

  const recipeInstructions: Array<{
    name?: string;
    text: string;
    image?: string;
  }> = [];

  return (
    <>
      <RecipeSEO
        title={recipeTitle}
        description={recipeDescription}
        canonical={`/recipe-page/${recipe.id}`}
        recipe={{
          name: recipe.recipeName,
          description:
            recipe.description ||
            `學習製作 ${recipe.recipeName}，安那煮提供詳細的食譜步驟和影音教學。`,
          image:
            recipeImages.length > 0 ? recipeImages : ['/images/og-default.jpg'],
          author: '安那煮 Anna Cook', // API 中沒有 author 欄位
          datePublished: new Date().toISOString(), // API 中沒有 createdAt 欄位
          cookTime: recipe.cookingTime?.toString(),
          recipeYield: recipe.portion?.toString(),
          recipeCategory: '台灣料理', // API 中沒有 recipeCategory 欄位
          recipeCuisine: '台灣菜',
          recipeInstructions,
          aggregateRating: recipe.rating
            ? {
                ratingValue: recipe.rating,
                reviewCount: 1, // API 中沒有 reviewCount 欄位，使用預設值
              }
            : undefined,
        }}
      />
      <RecipePageComponent recipeData={recipeData.data} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // 在建構時不預先生成任何路徑，採用按需生成
  return {
    paths: [],
    fallback: true, // 使用 fallback: true 實現 ISR
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params as { id: string[] };
  const recipeId = Number.parseInt(params.id[0], 10);

  if (Number.isNaN(recipeId)) {
    return {
      notFound: true,
    };
  }

  try {
    const recipeData = await fetchRecipeDetailServer(recipeId);

    if (recipeData.StatusCode !== HTTP_STATUS.OK || !recipeData.data) {
      return {
        props: {
          recipeData,
        },
        revalidate: REVALIDATE_INTERVALS.SHORT, // 1分鐘後重新驗證
      };
    }

    return {
      props: {
        recipeData,
      },
      revalidate: REVALIDATE_INTERVALS.MEDIUM, // 每小時重新驗證一次成功的資料
    };
  } catch (error) {
    console.error('獲取食譜資料失敗:', error);
    return {
      props: {
        recipeData: {
          StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          msg: ERROR_MESSAGES.FETCH_RECIPE_FAILED,
        },
      },
      revalidate: REVALIDATE_INTERVALS.SHORT, // 1分鐘後重新驗證
    };
  }
};

export default RecipePage;
