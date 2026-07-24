'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RecipeCard } from '@/components/features/RecipeCard';
import type { Recipe as RecipeCardType } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Settings2 } from 'lucide-react';
import { SORT_TYPES, PAGINATION_DEFAULTS } from '@/lib/constants';
import { COMMON_TEXTS } from '@/lib/constants/messages';

type RecipeListClientProps = {
  recipes: RecipeCardType[];
  totalCount: number;
  hasMore: boolean;
  query: string;
  sortBy: string;
  currentPage: number;
};

/**
 * 食譜列表頁互動層（client）
 * 排序/分頁以 router.push 更新 URL → 由 Server Component 依新 searchParams 重新抓取
 */
export function RecipeListClient({
  recipes,
  totalCount,
  hasMore,
  query,
  sortBy,
  currentPage,
}: RecipeListClientProps) {
  const router = useRouter();
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // 導頁到新的查詢參數；useTransition 讓導頁期間顯示載入狀態
  const navigate = (nextSort: string, nextPage: number) => {
    const type =
      nextSort === SORT_TYPES.LATEST
        ? SORT_TYPES.CREATED_AT
        : SORT_TYPES.POPULAR;
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('type', type);
    params.set('page', String(nextPage));
    startTransition(() => {
      router.push(`/recipe-list?${params.toString()}`);
    });
  };

  // 處理排序變更（重置頁碼為 1）
  const handleSortChange = (newSortBy: string) => {
    setShowSortOptions(false);
    navigate(newSortBy, 1);
  };

  // 處理頁碼變更
  const handlePageChange = (newPage: number) => {
    navigate(sortBy, newPage);
  };

  // 渲染排序選項
  const renderSortOptions = () => {
    if (!showSortOptions) return null;

    return (
      <div className="flex gap-2 mb-4">
        <Button
          variant={sortBy === SORT_TYPES.LATEST ? 'default' : 'outline'}
          className="rounded-full text-sm px-4"
          onClick={() => handleSortChange(SORT_TYPES.LATEST)}
        >
          依上傳日期排序
        </Button>
        <Button
          variant={sortBy === SORT_TYPES.POPULAR ? 'default' : 'outline'}
          className="rounded-full text-sm px-4"
          onClick={() => handleSortChange(SORT_TYPES.POPULAR)}
        >
          依人氣排序
        </Button>
      </div>
    );
  };

  // 渲染搜尋結果
  const renderSearchResults = () => {
    if (isPending) {
      return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
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
          <p className="text-neutral-500 mb-8">查詢「{query}」無結果</p>
        </div>
      );
    }

    // 渲染廣告區塊
    const renderAdBlock = () => (
      <div className="my-4">
        <Image
          src="/ad_list_01.png"
          alt="推廣廣告"
          width={1200}
          height={200}
          className="w-full rounded-md"
        />
      </div>
    );

    return (
      <>
        {renderSortOptions()}

        {/* 前 4 個食譜 */}
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {/* 在第 4 和第 5 個食譜之間插入廣告 */}
        {recipes.length > 4 && renderAdBlock()}

        {/* 剩餘食譜 */}
        {recipes.slice(4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {/* 分頁控制 */}
        {totalCount > 0 && (
          <div className="flex justify-center items-center gap-2 my-4">
            {Array.from({
              length: Math.min(
                5,
                Math.ceil(totalCount / PAGINATION_DEFAULTS.PAGE_SIZE),
              ),
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

            {Math.ceil(totalCount / PAGINATION_DEFAULTS.PAGE_SIZE) > 5 && (
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
  };

  return (
    <>
      {/* 次導覽列 */}
      <div className="bg-white p-3 flex items-center text-sm">
        <Link href="/" className="text-neutral-600">
          首頁
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-neutral-400" />
        <span className="text-neutral-900">搜尋食譜</span>
      </div>

      {/* 搜尋類別與數量 */}
      <div className="border-b p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{query || '全部食譜'}</h1>
          <span className="text-neutral-500 text-sm">{totalCount} 道食譜</span>
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
