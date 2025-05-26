import type React from 'react';
import { useState } from 'react';
import { Plus, ChevronDown, X } from 'lucide-react';
// import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryCard } from '@/components/features/CategoryCard';
import { RecipeCard } from '@/components/features/RecipeCard';
import { Carousel } from '@/components/ui/carousel';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import Image from 'next/image';
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
  rating: number;
};

// 首頁 props 介面
interface HomePageProps {
  featureSections: HomeFeatureResponse['data'];
  latestRecipes: HomeRecipesResponse['data'];
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

    // 獲取最新食譜
    const latestRecipesData = await fetchHomeRecipes('latest', 1);

    // 檢查其他類型是否有更多
    const hasMorePopular = true; // 假設有更多人氣食譜
    const hasMoreClassic = true; // 假設有更多超商食譜

    return {
      props: {
        featureSections: featuresData.data || [],
        latestRecipes: latestRecipesData.data || [],
        hasMoreRecipes: {
          latest: latestRecipesData.hasMore || false,
          popular: hasMorePopular,
          classic: hasMoreClassic,
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
    popular: [], // 延遲載入
    classic: [], // 延遲載入
  });
  // 加載狀態
  const [isLoading, setIsLoading] = useState(false);
  // 標籤頁是否已初始化過
  const [tabInitialized, setTabInitialized] = useState<Record<string, boolean>>(
    {
      latest: true, // 初始頁簽預載入了
      popular: false,
      classic: false,
    },
  );
  // 是否還有更多
  const [hasMoreState, setHasMoreState] = useState<Record<string, boolean>>({
    latest: hasMoreRecipes.latest,
    popular: hasMoreRecipes.popular,
    classic: hasMoreRecipes.classic,
  });

  // 在標籤切換時檢查是否需要載入數據
  const handleTabChange = async (value: string) => {
    setActiveTab(value);

    // 將convenience對應到classic
    const type = value === 'convenience' ? 'classic' : value;

    // 如果標籤頁尚未初始化，則載入數據
    if (!tabInitialized[type]) {
      setIsLoading(true);
      try {
        // 獲取該標籤的初始數據
        const data = await fetchHomeRecipes(type, 1);

        // 更新已載入的食譜列表
        setLoadedRecipes((prev) => ({
          ...prev,
          [type]: data.data || [],
        }));

        // 更新更多按鈕狀態
        setHasMoreState((prev) => ({
          ...prev,
          [type]: data.hasMore || false,
        }));

        // 標記標籤頁已初始化
        setTabInitialized((prev) => ({
          ...prev,
          [type]: true,
        }));
      } catch (error) {
        console.error(`載入${type}食譜失敗:`, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 切換浮動選單顯示狀態
  const toggleFloatingMenu = () => {
    setShowFloatingMenu(!showFloatingMenu);
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
      rating: recipe.rating,
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* 主要內容 */}
      <main className="flex-1">
        {/* 橫幅廣告區域 */}
        <div className="relative w-full h-[240px] bg-orange-500">
          <div className="absolute inset-0">
            <Image
              src="/ad_home_02.png"
              alt="香麻辣到心坎裡"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* 特色區塊 - 使用 API 資料渲染 */}
        {featureSections.map((section) => (
          <section key={section.sectionPos} className="py-4">
            <Carousel
              title={section.sectionName}
              items={section.recipes.map(mapToCategoryCard)}
              renderItem={(category: Category, index: number) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  className="bg-white shadow-sm"
                  index={index + 1}
                />
              )}
            />
          </section>
        ))}

        {/* 標籤欄 */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="flex justify-between mb-0 w-full rounded-none border-b bg-white p-0 h-auto">
              <TabsTrigger
                value="latest"
                className="flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal"
              >
                最新食譜
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal"
              >
                人氣食譜
              </TabsTrigger>
              <TabsTrigger
                value="convenience"
                className="flex-1 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-orange-500 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-orange-500 font-normal data-[state=active]:font-normal"
              >
                經典食譜
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 食譜列表載入中狀態 */}
        {isLoading && (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-gray-500">載入中...</p>
          </div>
        )}

        {/* 食譜列表 - 根據選中的標籤顯示不同的食譜 */}
        {!isLoading && (
          <div className="px-4">
            {getCurrentRecipes().map((recipe) => (
              <RecipeCard
                key={`${recipe.id}-${activeTab}`}
                recipe={recipe}
                className="shadow-sm mt-8"
              />
            ))}
          </div>
        )}

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
