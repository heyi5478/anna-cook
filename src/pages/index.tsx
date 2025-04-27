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
import {
  fetchHomeFeatures,
  HomeFeatureResponse,
  fetchHomeRecipes,
  HomeRecipesResponse,
} from '@/services/server-api';

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
  latestRecipes: HomeRecipesResponse['data'];
  popularRecipes: HomeRecipesResponse['data'];
  classicRecipes: HomeRecipesResponse['data'];
  hasMoreRecipes: {
    latest: boolean;
    popular: boolean;
    classic: boolean;
  };
}

/**
 * 獲取首頁靜態資料 (SSG)
 */
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    // 獲取特色區塊資料
    const featuresData = await fetchHomeFeatures();

    // 獲取不同類型的食譜列表
    const latestRecipesData = await fetchHomeRecipes('latest', 1);
    const popularRecipesData = await fetchHomeRecipes('popular', 1);
    const classicRecipesData = await fetchHomeRecipes('classic', 1);

    return {
      props: {
        featureSections: featuresData.data || [],
        latestRecipes: latestRecipesData.data || [],
        popularRecipes: popularRecipesData.data || [],
        classicRecipes: classicRecipesData.data || [],
        hasMoreRecipes: {
          latest: latestRecipesData.hasMore || false,
          popular: popularRecipesData.hasMore || false,
          classic: classicRecipesData.hasMore || false,
        },
      },
      // 每小時重新產生頁面
      revalidate: 3600,
    };
  } catch (error) {
    console.error('獲取首頁資料失敗:', error);
    return {
      props: {
        featureSections: [],
        latestRecipes: [],
        popularRecipes: [],
        classicRecipes: [],
        hasMoreRecipes: {
          latest: false,
          popular: false,
          classic: false,
        },
      },
      // 出錯時，每5分鐘重試
      revalidate: 300,
    };
  }
};

/**
 * 網站首頁組件
 */
export default function HomePage({
  featureSections,
  latestRecipes,
  popularRecipes,
  classicRecipes,
  hasMoreRecipes,
}: HomePageProps) {
  const router = useRouter();
  // 設定當前選中的標籤
  const [activeTab, setActiveTab] = useState('latest');
  // 控制浮動按鈕選單的顯示
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  // 各種類型的食譜頁碼
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    latest: 1,
    popular: 1,
    classic: 1,
  });
  // 存儲已加載的食譜列表
  const [loadedRecipes, setLoadedRecipes] = useState<
    Record<string, HomeRecipesResponse['data']>
  >({
    latest: latestRecipes,
    popular: popularRecipes,
    classic: classicRecipes,
  });
  // 加載狀態
  const [isLoading, setIsLoading] = useState(false);
  // 是否還有更多
  const [hasMoreState, setHasMoreState] = useState<Record<string, boolean>>({
    latest: hasMoreRecipes.latest,
    popular: hasMoreRecipes.popular,
    classic: hasMoreRecipes.classic,
  });

  // 切換浮動選單顯示狀態
  const toggleFloatingMenu = () => {
    setShowFloatingMenu(!showFloatingMenu);
  };

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

  /**
   * 將 API 返回的食譜資料轉換為 RecipeCard 所需格式
   */
  const mapToRecipeCardData = (
    recipe: HomeRecipesResponse['data'][0],
  ): Recipe => {
    return {
      id: recipe.id.toString(),
      title: recipe.recipeName,
      image: recipe.coverPhoto
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}${recipe.coverPhoto}`
        : '/placeholder.svg?height=80&width=80',
      category: '',
      time: recipe.cookingTime,
      servings: recipe.portion,
      rating: recipe.rating,
      description: recipe.description || '',
    };
  };

  /**
   * 根據當前活動標籤獲取對應的食譜列表
   */
  const getCurrentRecipes = () => {
    const type = activeTab === 'convenience' ? 'classic' : activeTab;
    return loadedRecipes[type].map(mapToRecipeCardData);
  };

  /**
   * 獲取當前標籤的更多按鈕狀態
   */
  const hasMore = () => {
    const type = activeTab === 'convenience' ? 'classic' : activeTab;
    return hasMoreState[type];
  };

  /**
   * 處理載入更多按鈕點擊事件
   */
  const onLoadMore = async () => {
    const type = activeTab === 'convenience' ? 'classic' : activeTab;
    const nextPage = currentPage[type] + 1;

    // 設置加載狀態
    setIsLoading(true);

    try {
      // 獲取下一頁數據
      const newRecipesData = await fetchHomeRecipes(type, nextPage);

      // 更新頁碼
      setCurrentPage({
        ...currentPage,
        [type]: nextPage,
      });

      // 更新是否還有更多
      setHasMoreState({
        ...hasMoreState,
        [type]: newRecipesData.hasMore,
      });

      // 合併已加載的數據並去除重複項
      const existingIds = new Set(
        loadedRecipes[type].map((recipe) => recipe.id),
      );
      const uniqueNewRecipes = newRecipesData.data.filter(
        (recipe) => !existingIds.has(recipe.id),
      );

      setLoadedRecipes({
        ...loadedRecipes,
        [type]: [...loadedRecipes[type], ...uniqueNewRecipes],
      });
    } catch (error) {
      console.error(`載入更多${type}食譜失敗:`, error);
    } finally {
      setIsLoading(false);
    }
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

        {/* 食譜列表 - 根據選中的標籤顯示不同的食譜 */}
        <div className="py-2">
          {getCurrentRecipes().map((recipe) => (
            <RecipeCard key={`${recipe.id}-${activeTab}`} recipe={recipe} />
          ))}
        </div>

        {/* 載入更多按鈕 - 只在有更多資料時顯示 */}
        {hasMore() && (
          <div className="flex justify-center py-4">
            <Button
              variant="ghost"
              className="text-gray-500 flex items-center gap-1"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? '載入中...' : '更多食譜'}{' '}
              {!isLoading && <ChevronDown size={16} />}
            </Button>
          </div>
        )}
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
