import type React from 'react';
import { useState } from 'react';
import { Plus, ChevronDown, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryCard } from '@/components/common/CategoryCard';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Carousel } from '@/components/ui/carousel';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { fetchHomeFeatures, HomeFeatureResponse } from '@/services/server-api';

// 定義食譜類型
type Recipe = {
  id: string;
  title: string;
  image: string;
  category: string;
  time: number;
  servings: number;
  rating: number;
  description: string;
};

// 定義分類類型
type Category = {
  id: string;
  title: string;
  image: string;
  description: string;
};

// 首頁 props 介面
interface HomePageProps {
  featureSections: HomeFeatureResponse['data'];
}

/**
 * 獲取首頁靜態資料 (SSG)
 */
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const featuresData = await fetchHomeFeatures();

    return {
      props: {
        featureSections: featuresData.data || [],
      },
      // 每小時重新產生頁面
      revalidate: 3600,
    };
  } catch (error) {
    console.error('獲取首頁資料失敗:', error);
    return {
      props: {
        featureSections: [],
      },
      // 出錯時，每5分鐘重試
      revalidate: 300,
    };
  }
};

/**
 * 網站首頁組件
 */
export default function HomePage({ featureSections }: HomePageProps) {
  const router = useRouter();
  // 設定當前選中的標籤
  const [activeTab, setActiveTab] = useState('latest');
  // 控制浮動按鈕選單的顯示
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // 切換浮動選單顯示狀態
  const toggleFloatingMenu = () => {
    setShowFloatingMenu(!showFloatingMenu);
  };

  // 食譜列表
  const recipes: Recipe[] = [
    {
      id: '1',
      title: '家傳滷五花',
      image: '/placeholder.svg?height=80&width=80',
      category: 'meat',
      time: 30,
      servings: 2,
      rating: 4.5,
      description: '使用五香和和柱頭油等調味料料，讓豬肉一...',
    },
    {
      id: '2',
      title: '家傳滷五花',
      image: '/placeholder.svg?height=80&width=80',
      category: 'meat',
      time: 30,
      servings: 2,
      rating: 4.5,
      description: '使用五香和和柱頭油等調味料料，讓豬肉一...',
    },
    {
      id: '3',
      title: '家傳滷五花',
      image: '/placeholder.svg?height=80&width=80',
      category: 'meat',
      time: 30,
      servings: 2,
      rating: 4.5,
      description: '使用五香和和柱頭油等調味料料，讓豬肉一...',
    },
    {
      id: '4',
      title: '家傳滷五花',
      image: '/placeholder.svg?height=80&width=80',
      category: 'meat',
      time: 30,
      servings: 2,
      rating: 4.5,
      description: '使用五香和和柱頭油等調味料料，讓豬肉一...',
    },
    {
      id: '5',
      title: '家傳滷五花',
      image: '/placeholder.svg?height=80&width=80',
      category: 'meat',
      time: 30,
      servings: 2,
      rating: 4.5,
      description: '使用五香和和柱頭油等調味料料，讓豬肉一...',
    },
  ];

  /**
   * 處理選單按鈕點擊事件
   */
  const atMenuClick = () => {
    console.log('Menu clicked');
  };

  /**
   * 處理搜尋提交事件
   */
  const atSearchSubmit = (query: string) => {
    console.log('Search submitted:', query);
  };

  /**
   * 將 API 資料轉換為 CategoryCard 所需格式
   */
  const mapToCategoryCard = (recipe: {
    id: number;
    recipeName: string;
    rating: number;
    coverPhoto: string;
    author: string;
  }): Category => {
    return {
      id: recipe.id.toString(),
      title: recipe.recipeName,
      image: recipe.coverPhoto
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}${recipe.coverPhoto}`
        : '/placeholder.svg?height=150&width=150',
      description: recipe.author,
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        variant="default"
        size="lg"
        atMenuClick={atMenuClick}
        atSearchSubmit={atSearchSubmit}
      />

      {/* 頁面其他內容將在這裡 */}
      <main className="flex-1 p-4">
        <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-4">
          <div className="text-gray-400">圖片區域</div>
        </div>

        {/* 特色區塊 - 使用 API 資料渲染 */}
        {featureSections.map((section) => (
          <section key={section.sectionPos} className="py-3">
            <Carousel
              title={section.sectionName}
              items={section.recipes.map(mapToCategoryCard)}
              renderItem={(category) => (
                <CategoryCard key={category.id} category={category} />
              )}
            />
          </section>
        ))}

        {/* 標籤欄 */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full border-b"
        >
          <TabsList className="w-full justify-start bg-transparent h-auto p-0">
            <TabsTrigger
              value="latest"
              className="flex-1 py-2 data-[active=true]:border-b-2 data-[active=true]:border-orange-500 data-[active=true]:text-orange-500 rounded-none"
            >
              最新食譜
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="flex-1 py-2 data-[active=true]:border-b-2 data-[active=true]:border-orange-500 data-[active=true]:text-orange-500 rounded-none"
            >
              人氣食譜
            </TabsTrigger>
            <TabsTrigger
              value="convenience"
              className="flex-1 py-2 data-[active=true]:border-b-2 data-[active=true]:border-orange-500 data-[active=true]:text-orange-500 rounded-none"
            >
              超商食譜
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 食譜列表 */}
        <div className="py-2">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* 載入更多按鈕 */}
        <div className="flex justify-center py-4">
          <Button
            variant="ghost"
            className="text-gray-500 flex items-center gap-1"
          >
            更多食譜 <ChevronDown size={16} />
          </Button>
        </div>
      </main>

      <Footer companyName="版權所有" studioName="來自安那煮 Anna Cook" />
      {/* 浮動按鈕和選單 */}
      <div className="fixed bottom-20 right-4 flex flex-col items-end gap-3 z-20">
        {/* 浮動選單 */}
        {showFloatingMenu && (
          <div className="flex flex-col gap-3 mb-3 items-end">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md shadow-md w-32">
              搜尋食譜
            </Button>
            <Button
              variant="outline"
              className="bg-white text-gray-800 border-orange-500 border hover:bg-orange-50 font-medium px-4 py-2 rounded-md shadow-md w-32"
              onClick={() => router.push('/upload-recipe-step1')}
            >
              新增食譜
            </Button>
          </div>
        )}

        {/* 主浮動按鈕 */}
        <Button
          size="icon"
          onClick={toggleFloatingMenu}
          className={`h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${
            showFloatingMenu
              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              : 'bg-orange-200 text-orange-600 hover:bg-orange-300'
          }`}
        >
          {showFloatingMenu ? <X size={24} /> : <Plus size={24} />}
        </Button>
      </div>
    </div>
  );
}
