import type React from 'react';
import { useState } from 'react';
import { Plus, ChevronDown, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { RecipeCard } from '@/components/ui/RecipeCard';
import useEmblaCarousel from 'embla-carousel-react';
import { cva } from 'class-variance-authority';

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

// 定義輪播容器樣式
const carouselContainerVariants = cva('relative group', {
  variants: {
    size: {
      default: 'w-full',
      compact: 'max-w-screen-lg mx-auto',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

// 定義輪播軌道樣式
const carouselTrackVariants = cva('flex', {
  variants: {
    spacing: {
      default: '-ml-4',
      tight: '-ml-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

// 定義輪播導航按鈕樣式
const carouselButtonVariants = cva(
  'absolute top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity',
  {
    variants: {
      position: {
        left: 'left-0',
        right: 'right-0',
      },
    },
    defaultVariants: {
      position: 'left',
    },
  },
);

// Netflix風格輪播元件
function CarouselSection({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  // 處理向前滾動
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  // 處理向後滾動
  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className={carouselContainerVariants()}>
      <h2 className="text-xl font-bold mb-3 px-4">{title}</h2>

      {/* 前滾按鈕 */}
      <button
        className={carouselButtonVariants({ position: 'left' })}
        onClick={scrollPrev}
        aria-label="查看上一頁"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 輪播區域 */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={carouselTrackVariants()}>
          {items.map((item) => renderItem(item))}
        </div>
      </div>

      {/* 後滾按鈕 */}
      <button
        className={carouselButtonVariants({ position: 'right' })}
        onClick={scrollNext}
        aria-label="查看下一頁"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

/**
 * 網站首頁組件
 */
export default function HomePage() {
  // 設定當前選中的標籤
  const [activeTab, setActiveTab] = useState('latest');
  // 控制浮動按鈕選單的顯示
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // 切換浮動選單顯示狀態
  const toggleFloatingMenu = () => {
    setShowFloatingMenu(!showFloatingMenu);
  };

  // 季節食譜分類
  const seasonalCategories: Category[] = [
    {
      id: '1',
      title: '馬鈴薯烤蛋',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '2',
      title: '馬鈴薯烤蛋',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '3',
      title: '番茄燉湯',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '4',
      title: '香煎鱈魚',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '5',
      title: '蘑菇燉飯',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '6',
      title: '花椰菜燉湯',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
  ];

  // 特色食譜分類
  const specialCategories: Category[] = [
    {
      id: '7',
      title: '馬鈴薯烤蛋',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '8',
      title: '滷肉飯',
      image: '/placeholder.svg?height=150&width=150',
      description: '台式料理',
    },
    {
      id: '9',
      title: '泡菜鍋',
      image: '/placeholder.svg?height=150&width=150',
      description: '韓式料理',
    },
    {
      id: '10',
      title: '牛肉麵',
      image: '/placeholder.svg?height=150&width=150',
      description: '家常創意',
    },
    {
      id: '11',
      title: '壽司捲',
      image: '/placeholder.svg?height=150&width=150',
      description: '日式料理',
    },
    {
      id: '12',
      title: '蒜蓉蝦',
      image: '/placeholder.svg?height=150&width=150',
      description: '粵式料理',
    },
  ];

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
   * 處理登入按鈕點擊事件
   */
  const atLoginClick = () => {
    console.log('Login clicked');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        logoText="Logo"
        atMenuClick={atMenuClick}
        atSearchSubmit={atSearchSubmit}
        atLoginClick={atLoginClick}
      />

      {/* 頁面其他內容將在這裡 */}
      <main className="flex-1 p-4">
        <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-4">
          <div className="text-gray-400">圖片區域</div>
        </div>

        {/* 季節食譜區塊 */}
        {/* 季節食譜區塊 - Netflix風格輪播 */}
        <section className="py-3">
          <CarouselSection
            title="季節食譜"
            items={seasonalCategories}
            renderItem={(category) => (
              <CategoryCard key={category.id} category={category} />
            )}
          />
        </section>

        {/* 特色食譜區塊 */}
        <section className="py-3">
          <CarouselSection
            title="特色食譜"
            items={specialCategories}
            renderItem={(category) => (
              <CategoryCard key={category.id} category={category} />
            )}
          />
        </section>

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
        <div className="px-4 py-2">
          {recipes.map((recipe, index) => {
            // 根據索引決定顯示風格
            let intent: 'default' | 'featured' | 'new' = 'default';
            if (index === 0) intent = 'featured';
            else if (index === 1) intent = 'new';

            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                intent={intent}
                variant={index % 2 === 0 ? 'default' : 'primary'}
              />
            );
          })}
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

      <Footer companyName="商標" studioName="Creative studio" />
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
