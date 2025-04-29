import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  RecipeCard,
  Recipe as RecipeCardType,
} from '@/components/ui/RecipeCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Settings2 } from 'lucide-react';
// import { Layout } from '@/components/layout';
import { searchRecipesServer } from '@/services/server-api';
import { GetStaticProps } from 'next';

// 定義頁面 props 介面
interface RecipeListPageProps {
  initialRecipes: RecipeCardType[];
  searchQuery: string;
  totalCount: number;
  hasMore: boolean;
  pageNumber: number;
}

export default function RecipeListPage({
  initialRecipes,
  searchQuery,
  totalCount: initialTotalCount,
  hasMore,
  pageNumber,
}: RecipeListPageProps) {
  const router = useRouter();
  const { q: queryParam, type: sortType, page } = router.query;
  const [query, setQuery] = useState<string>(searchQuery);
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(
    sortType ? String(sortType) : 'latest',
  );
  const [recipes, setRecipes] = useState<RecipeCardType[]>(initialRecipes);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);

  // 當路由參數變化時，動態加載對應的數據
  const loadRecipesByQuery = useCallback(
    async (q: string, sort: string, pg: number) => {
      if (router.isReady) {
        setLoading(true);
        try {
          // 轉換為API需要的參數格式
          const apiSortType = sort === 'latest' ? 'createdAt' : 'popular';

          // 獲取新的搜尋結果
          const response = await fetch(
            `/api/recipes/search?searchData=${encodeURIComponent(q)}&type=${apiSortType}&number=${pg}`,
          );
          const data = await response.json();

          // 轉換為前端使用的格式
          const newRecipes = data.data.map((item: any) => ({
            id: String(item.id),
            title: item.recipeName,
            image: item.coverPhoto
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}${item.coverPhoto}`
              : '/images/recipe-placeholder.jpg',
            category: '',
            time: item.cookingTime,
            servings: item.portion,
            rating: item.rating,
            description: item.description,
          }));

          // 更新食譜列表和總筆數
          setRecipes(newRecipes);
          // 從 API 回應更新總筆數
          setTotalCount(data.totalCount);
        } catch (error) {
          console.error('獲取食譜數據失敗:', error);
          setRecipes([]);
          setTotalCount(0); // 出錯時重置筆數
        } finally {
          setLoading(false);
        }
      }
    },
    [router.isReady],
  );

  // 當 URL 查詢參數變化時更新狀態
  useEffect(() => {
    if (queryParam) {
      const newQuery = Array.isArray(queryParam) ? queryParam[0] : queryParam;
      if (newQuery !== query) {
        setQuery(newQuery);

        // 重新導向到新的 URL，保留排序方式但重置頁碼
        router.push(
          {
            pathname: '/recipe-list',
            query: {
              q: newQuery,
              type: sortBy === 'latest' ? 'createdAt' : 'popular',
              page: 1,
            },
          },
          undefined,
          { shallow: true },
        );

        // 加載新的食譜數據
        loadRecipesByQuery(newQuery, sortBy, 1);
      }
    }

    if (sortType) {
      const newSortType = Array.isArray(sortType) ? sortType[0] : sortType;
      const mappedSortType = newSortType === 'createdAt' ? 'latest' : 'popular';

      if (mappedSortType !== sortBy) {
        setSortBy(mappedSortType);

        // 加載新的食譜數據
        const newQuery = Array.isArray(queryParam)
          ? queryParam[0]
          : queryParam || '';
        loadRecipesByQuery(newQuery, mappedSortType, currentPage);
      }
    }

    if (page) {
      const newPage = parseInt(Array.isArray(page) ? page[0] : page, 10);
      if (newPage !== currentPage) {
        setCurrentPage(newPage || 1);

        // 加載新的食譜數據
        const newQuery = Array.isArray(queryParam)
          ? queryParam[0]
          : queryParam || '';
        loadRecipesByQuery(newQuery, sortBy, newPage || 1);
      }
    }
  }, [
    queryParam,
    sortType,
    page,
    router,
    query,
    sortBy,
    currentPage,
    loadRecipesByQuery,
  ]);

  /**
   * 處理搜尋結果排序的函數
   */
  function handleSortChange(newSortBy: string) {
    setSortBy(newSortBy);
    setShowSortOptions(false);

    // 重新導向到新的 URL，保留搜尋詞但更新排序方式並重置頁碼
    router.push(
      {
        pathname: '/recipe-list',
        query: {
          q: query,
          type: newSortBy === 'latest' ? 'createdAt' : 'popular',
          page: 1,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  /**
   * 處理頁碼變更
   */
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);

    // 重新導向到新的 URL，保留搜尋詞和排序方式但更新頁碼
    router.push(
      {
        pathname: '/recipe-list',
        query: {
          q: query,
          type: sortBy === 'latest' ? 'createdAt' : 'popular',
          page: newPage,
        },
      },
      undefined,
      { shallow: true },
    );
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
          <p className="text-gray-500 mb-8">查詢「{query}」無結果</p>
        </div>
      );
    }

    /**
     * 渲染廣告區塊
     */
    const renderAdBlock = () => (
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
    );

    return (
      <>
        {renderSortOptions()}

        {/* 前4個食譜 */}
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {/* 在第4和第5個食譜之間插入廣告 */}
        {recipes.length > 4 && renderAdBlock()}

        {/* 剩餘食譜 */}
        {recipes.slice(4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {/* 分頁控制 */}
        {totalCount > 0 && (
          <div className="flex justify-center items-center gap-2 my-4">
            {Array.from({
              length: Math.min(5, Math.ceil(totalCount / 10)),
            }).map((_, i) => (
              <Button
                key={`page-${i + 1}`}
                variant={i + 1 === currentPage ? 'default' : 'outline'}
                size="sm"
                className={
                  i + 1 === currentPage
                    ? 'bg-orange-500 hover:bg-orange-600 w-8 h-8 p-0'
                    : 'w-8 h-8 p-0'
                }
                onClick={() => handlePageChange(i + 1)}
                disabled={i + 1 === currentPage}
              >
                {i + 1}
              </Button>
            ))}

            {Math.ceil(totalCount / 10) > 5 && (
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasMore}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${query ? `${query} - 搜尋結果` : '食譜搜尋'} | Anna Cook`}</title>
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
          <span className="text-gray-500 text-sm">{totalCount} 道食譜</span>
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
      </main>
    </>
  );
}

/**
 * 獲取靜態生成的數據
 */
export const getStaticProps: GetStaticProps = async () => {
  try {
    // 從搜尋參數中獲取資料，或使用預設值
    const searchQuery = '';
    const sortType = 'createdAt';
    const page = 1;

    // 呼叫 API 獲取食譜搜尋結果
    const searchResults = await searchRecipesServer(
      searchQuery,
      sortType,
      page,
    );

    // 將 API 資料轉換為前端可用的格式
    const recipes: RecipeCardType[] = searchResults.data.map((item) => ({
      id: String(item.id),
      title: item.recipeName,
      image: item.coverPhoto
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}${item.coverPhoto}`
        : '/images/recipe-placeholder.jpg',
      category: '', // 填入空字串，因為這個欄位是必須的
      time: item.cookingTime,
      servings: item.portion,
      rating: item.rating,
      description: item.description,
    }));

    return {
      props: {
        initialRecipes: recipes,
        searchQuery,
        totalCount: searchResults.totalCount,
        hasMore: searchResults.hasMore,
        pageNumber: page,
      },
      // 每 1 小時重新生成頁面
      revalidate: 3600,
    };
  } catch (error) {
    console.error('獲取靜態資料失敗:', error);
    return {
      props: {
        initialRecipes: [],
        searchQuery: '',
        totalCount: 0,
        hasMore: false,
        pageNumber: 1,
      },
      revalidate: 3600,
    };
  }
};
