import { Share2, ChevronDown } from 'lucide-react';
import { NextPage } from 'next';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/ui/RecipeCard';

// 定義作者資料類型
type Author = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  recipeCount: number;
  followerCount: number;
  isFollowing: boolean;
};

// 模擬食譜資料
const mockRecipes = [
  {
    id: '1',
    title: '家傳滷五花',
    image: '/images/recipe1.jpg',
    category: '主菜',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，讓豬肉入味...',
  },
  {
    id: '2',
    title: '家傳滷五花',
    image: '/images/recipe2.jpg',
    category: '主菜',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，讓豬肉入味...',
  },
  {
    id: '3',
    title: '家傳滷五花',
    image: '/images/recipe3.jpg',
    category: '主菜',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，讓豬肉入味...',
  },
];

// 模擬作者資料
const mockAuthor: Author = {
  id: '123',
  name: '古早味研究社',
  avatar: '/images/author-avatar.jpg',
  bio: '"我們專注把挖掘那些平常被遺忘的家常滋味，從長輩傳下來的過去，到街角小吃攤的香氣，都值得被留下。每一道料理不只講究味道，更是一種記憶的承載。用最簡單的食材，還原最動人的味道，讓每個人都能在餐桌上找到熟悉的感動。"',
  recipeCount: 8,
  followerCount: 2,
  isFollowing: false,
};

const AuthorProfilePage: NextPage = () => {
  /**
   * 處理追蹤按鈕點擊事件
   */
  const atFollowClick = () => {
    console.log('Follow clicked');
    // 實際應用中會呼叫API進行追蹤/取消追蹤
  };

  /**
   * 處理分享按鈕點擊事件
   */
  const atShareClick = () => {
    console.log('Share clicked');
    // 實際應用中會開啟分享選單
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pb-8">
        {/* 麵包屑導航 */}
        <div className="bg-white p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">首頁</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/authors">查看用戶</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* 作者資料區塊 */}
        <div className="bg-white p-4">
          <div className="flex flex-col items-center relative mb-4">
            {/* 分享按鈕 */}
            <button
              className="absolute right-0 top-4"
              onClick={atShareClick}
              aria-label="分享"
            >
              <Share2 className="h-6 w-6 text-gray-500" />
              <span className="sr-only">分享</span>
            </button>

            {/* 作者頭像 */}
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={mockAuthor.avatar} alt={mockAuthor.name} />
              <AvatarFallback>{mockAuthor.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* 作者名稱 */}
            <h1 className="text-xl font-bold mb-3">{mockAuthor.name}</h1>

            {/* 食譜和粉絲數量 */}
            <div className="flex gap-4 mb-4 text-sm text-gray-500">
              <span>{mockAuthor.recipeCount} 食譜</span>
              <span>{mockAuthor.followerCount} 粉絲</span>
            </div>

            {/* 追蹤按鈕 */}
            <Button
              variant="outline"
              className="w-28 rounded-sm bg-gray-800 text-white hover:bg-gray-700"
              onClick={atFollowClick}
            >
              追蹤
            </Button>
          </div>

          {/* 作者簡介 */}
          <div className="mt-8 text-gray-700 text-sm px-4">
            <p className="leading-6">{mockAuthor.bio}</p>
          </div>
        </div>

        {/* 食譜區塊 */}
        <div className="mt-6">
          <div className="bg-white px-4 py-3 mb-2">
            <h2 className="text-lg font-medium">個人食譜</h2>
          </div>

          <div className="px-4">
            <p className="text-sm text-gray-500 mb-2">
              共{mockAuthor.recipeCount}篇食譜
            </p>

            {/* 食譜列表 */}
            <div className="space-y-3">
              {mockRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* 更多食譜按鈕 */}
            <div className="mt-4 flex justify-center">
              <button className="flex items-center text-gray-500 py-2">
                <span className="mr-1">更多食譜</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AuthorProfilePage;
