import { NextPage } from 'next';
import Head from 'next/head';
import RecipePageComponent from '@/components/RecipePage';

const RecipePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>家傳滷五花肉 - 食譜詳情</title>
        <meta
          name="description"
          content="美味的家傳滷五花肉食譜，簡單易做，香氣四溢"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecipePageComponent />
    </>
  );
};

export default RecipePage;
