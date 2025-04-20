import { NextPage } from 'next';
import Head from 'next/head';
import UserCenter from '@/components/UserCenter';
import { useAuth } from '@/hooks/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const UserCenterPage: NextPage = () => {
  // 使用身份驗證 hook，未授權時自動導向登入頁
  const { isAuthenticated, isLoading } = useAuth('/login');

  // 當驗證中或未授權時不渲染
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>個人中心 | Anna Cook</title>
        <meta name="description" content="查看您的食譜、追蹤者和收藏內容" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* 頂部導航 */}
        <Header isLoggedIn userName="古早味研究社" />

        {/* 主內容區域 */}
        <main className="flex-1">
          <UserCenter />
        </main>

        {/* 底部區域 */}
        <Footer />
      </div>
    </>
  );
};

export default UserCenterPage;
