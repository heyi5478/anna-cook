import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { RecipeCard, Recipe } from '@/components/ui/RecipeCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Settings2 } from 'lucide-react';
import { Layout } from '@/components/layout';

// 模擬的食譜資料
const MOCK_RECIPES: Recipe[] = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: `recipe-${i + 1}`,
    title: '家傳滷五花',
    image: '/images/recipes/pork-belly.jpg',
    category: '豬肉',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，燉煮肉質鮮嫩多汁的五花肉',
  }));

/**
 * 處理搜尋結果排序的函數
 */
function sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
  const sorted = [...recipes];

  switch (sortBy) {
    case 'latest':
      return sorted; // 已經按照最新排序
    case 'popular':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export default function RecipeListPage() {
  const router = useRouter();
  const { q: queryParam } = router.query;
  const [query, setQuery] = useState<string>('');
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('latest');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化搜尋查詢
  useEffect(() => {
    if (queryParam) {
      setQuery(Array.isArray(queryParam) ? queryParam[0] : queryParam);
    }
  }, [queryParam]);

  // 模擬搜尋 API 呼叫
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (query) {
        // 過濾模擬資料，標題包含查詢詞的食譜
        if (query === '塑膠') {
          setRecipes([]); // 模擬無結果
        } else {
          setRecipes(
            MOCK_RECIPES.filter(
              (recipe) =>
                recipe.category.includes(query) ||
                recipe.title.includes(query) ||
                recipe.description.includes(query),
            ),
          );
        }
      } else {
        setRecipes(MOCK_RECIPES);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * 處理排序變更
   */
  function handleSortChange(newSortBy: string) {
    setSortBy(newSortBy);
    setShowSortOptions(false);
  }

  /**
   * 渲染排序選項
   */
  function renderSortOptions() {
    if (!showSortOptions) return null;

    return (
      <div className="flex gap-2 mb-4">
        <Button
          variant={sortBy === 'latest' ? 'default' : 'outline'}
          className="rounded-full text-sm px-4"
          onClick={() => handleSortChange('latest')}
        >
          依上傳日期排序
        </Button>
        <Button
          variant={sortBy === 'popular' ? 'default' : 'outline'}
          className="rounded-full text-sm px-4"
          onClick={() => handleSortChange('popular')}
        >
          依人氣排序
        </Button>
      </div>
    );
  }

  /**
   * 渲染搜尋結果
   */
  function renderSearchResults() {
    if (loading) {
      return <div className="text-center py-8">載入中...</div>;
    }

    if (recipes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl mb-4">查無相關食譜</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 mb-4"
            onClick={() => router.push('/')}
          >
            <Search className="w-4 h-4" />
            回首頁重新搜尋
          </Button>
          <p className="text-gray-500 mb-8">或者參考以下食譜</p>

          {MOCK_RECIPES.slice(0, 5).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      );
    }

    return (
      <>
        {renderSortOptions()}

        {sortRecipes(recipes, sortBy).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        <div className="flex justify-center items-center gap-2 my-4">
          <Button
            variant="default"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 w-8 h-8 p-0"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            3
          </Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{query ? `${query} - 搜尋結果` : '食譜搜尋'} | Anna Cook</title>
      </Head>

      {/* 次導覽列 */}
      <div className="bg-white p-3 flex items-center text-sm">
        <Link href="/" className="text-gray-600">
          首頁
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
        <span className="text-gray-900">搜尋食譜</span>
      </div>

      {/* 搜尋類別與數量 */}
      <div className="border-b p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{query || '全部食譜'}</h1>
          <span className="text-gray-500 text-sm">{recipes.length} 道食譜</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>

      {/* 主要內容 */}
      <main className="flex-1 container mx-auto px-4 py-2">
        {renderSearchResults()}

        {/* 廣告區塊 */}
        {recipes.length > 0 && (
          <div className="my-4 h-20 bg-gray-100 flex items-center justify-between px-4 rounded-md">
            <div>
              <p className="text-gray-900 font-medium">廚房攪拌機</p>
              <p className="text-gray-900 font-bold">$3,490</p>
            </div>
            <Image
              src="/images/kitchen-mixer.jpg"
              alt="廚房攪拌機"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        )}
      </main>
    </Layout>
  );
}
