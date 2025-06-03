import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  fetchRecipeDetailServer,
  RecipeDetailResponse,
} from '@/services/server-api';
import RecipePageComponent from '@/components/pages/RecipePage';
import { HTTP_STATUS, REVALIDATE_INTERVALS } from '@/lib/constants';

interface RecipePageProps {
  recipeData: RecipeDetailResponse;
}

const RecipePage: NextPage<RecipePageProps> = ({ recipeData }) => {
  const router = useRouter();

  // 如果頁面正在建立，顯示載入中狀態
  if (router.isFallback) {
    return <div className="container mx-auto py-10 text-center">載入中...</div>;
  }

  // 如果沒有成功獲取食譜資料
  if (recipeData.StatusCode !== HTTP_STATUS.OK || !recipeData.data) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">找不到該食譜</h2>
        <p className="text-gray-600">
          {recipeData.msg || '食譜可能已被刪除或尚未發布'}
        </p>
      </div>
    );
  }

  const { recipe } = recipeData.data;
  console.log('食譜資料:', recipeData.data);

  return (
    <>
      <Head>
        <title>{`${recipe.recipeName} - 食譜詳情`}</title>
        <meta
          name="description"
          content={recipe.description || '美味食譜詳情'}
        />
        <link rel="icon" href="/login-small-logo.svg" />
      </Head>
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
          msg: '獲取食譜資料失敗',
        },
      },
      revalidate: REVALIDATE_INTERVALS.SHORT, // 1分鐘後重新驗證
    };
  }
};

export default RecipePage;
