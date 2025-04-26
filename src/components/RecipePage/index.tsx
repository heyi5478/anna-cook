import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Clock, Star, MessageSquare, Share2, Bookmark } from 'lucide-react';

// 引入 UI 元件
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// 引入自定義元件
import { ReviewDisplay } from '@/components/RecipePage/ReviewDisplay';
import Review from '@/components/RecipePage/Review';
import { ProductCard } from '@/components/ui/adCard';

// 引入樣式
import {
  cardStyles,
  interactionButtonStyles,
  headingStyles,
  separatedItemStyles,
  pageContainerStyles,
  breadcrumbStyles,
  mainImageStyles,
  interactionContainerStyles,
  footerNavItemStyles,
  recipeInfoItemStyles,
  reviewListStyles,
  authorContainerStyles,
  ingredientListStyles,
  tagsContainerStyles,
} from './styles';

interface RecipePageProps {
  recipeData: {
    isAuthor: boolean;
    author: {
      id: number;
      displayId: string;
      name: string;
      followersCount: number;
    };
    isFavorite: boolean;
    isFollowing: boolean;
    recipe: {
      id: number;
      displayId: string;
      isPublished: boolean;
      viewCount: number;
      recipeName: string;
      coverPhoto: string | null;
      description: string;
      cookingTime: number;
      portion: number;
      rating: number;
      videoId: string | null;
    };
    ingredients: {
      ingredientId: number;
      ingredientName: string;
      amount: number;
      unit: string;
      isFlavoring: boolean;
    }[];
    tags: {
      id: number;
      tag: string;
    }[];
  };
}

/**
 * 處理圖片URL，如果不是絕對URL則加上API基礎URL
 */
const getImageUrl = (coverPhoto: string | null | undefined): string => {
  if (!coverPhoto) {
    return '/placeholder.svg?height=500&width=500';
  }

  // 檢查是否已經是絕對URL (以 http:// 或 https:// 開頭)
  if (coverPhoto.startsWith('http://') || coverPhoto.startsWith('https://')) {
    return coverPhoto;
  }

  // 檢查是否已經是完整的相對路徑 (以 / 開頭)
  if (coverPhoto.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}${coverPhoto}`;
  }

  // 其他情況，確保路徑前有 /
  return `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}/${coverPhoto}`;
};

/**
 * 食譜詳情頁面元件，顯示食譜的完整資訊、社交互動和評論
 */
export default function RecipePageComponent({ recipeData }: RecipePageProps) {
  // 從 props 獲取食譜資料
  const { recipe, author, ingredients, tags, isFavorite, isFollowing } =
    recipeData;

  // 分離普通食材和調味料
  const regularIngredients = ingredients.filter((item) => !item.isFlavoring);
  const flavorings = ingredients.filter((item) => item.isFlavoring);

  // 狀態管理
  const [liked, setLiked] = useState(isFavorite);
  const [following, setFollowing] = useState(isFollowing);
  const [showReview, setShowReview] = useState(false);

  /**
   * 處理收藏事件
   */
  const atLikeClick = () => {
    setLiked(!liked);
    // 此處可添加 API 呼叫來更新收藏狀態
  };

  /**
   * 處理留言事件
   */
  const atCommentClick = () => {
    setShowReview(!showReview);
  };

  /**
   * 處理追蹤/取消追蹤事件
   */
  const atFollowClick = () => {
    setFollowing(!following);
    // 此處可添加 API 呼叫來更新追蹤狀態
  };

  /**
   * 處理分享事件，使用 Web Share API
   */
  const atShareClick = async () => {
    const recipeTitle = recipe.recipeName;
    const recipeDesc = recipe.description;

    // 檢查瀏覽器是否支援 Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: recipeTitle,
          text: recipeDesc,
          url: window.location.href,
        });

        alert('分享成功');
      } catch (error: unknown) {
        // 用戶取消分享不需要顯示錯誤
        if (error instanceof Error && error.name !== 'AbortError') {
          alert('分享失敗：請稍後再試');
          console.error('分享錯誤:', error);
        }
      }
    } else {
      // 瀏覽器不支援 Web Share API
      alert('您的瀏覽器不支援分享功能，已將連結複製到剪貼簿');

      // 回退方案：複製 URL 到剪貼簿
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
          console.error('複製連結失敗:', err);
        }
      }
    }
  };

  /**
   * 渲染食譜標籤列表
   */
  const renderRecipeTags = () => {
    return (
      <div className={tagsContainerStyles}>
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="rounded-lg py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {tag.tag}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className={pageContainerStyles}>
      {/* 麵包屑導航 */}
      <div className={breadcrumbStyles}>
        <Link href="/" className="hover:text-[#FF5722]">
          首頁
        </Link>
        <span className="mx-1">&gt;</span>
        <Link href="/category" className="hover:text-[#FF5722]">
          經典食譜
        </Link>
        <span className="mx-1">&gt;</span>
        <span className="text-gray-700">{recipe.recipeName}</span>
      </div>

      <main className="flex-1">
        {/* 食譜主圖 */}
        <div className={mainImageStyles}>
          <Image
            src={getImageUrl(recipe.coverPhoto)}
            alt={recipe.recipeName}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 食譜標題 */}
        <div className={cardStyles({ spacing: 'none' })}>
          <h1 className={headingStyles({ size: 'large' })}>
            {recipe.recipeName}
          </h1>

          <div className="flex items-center justify-between mb-3">
            <div className={recipeInfoItemStyles}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-sm text-gray-600">
                {recipe.portion}人份
              </span>
            </div>

            <div className={recipeInfoItemStyles}>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {recipe.cookingTime}分鐘
              </span>
            </div>

            <div className={recipeInfoItemStyles}>
              <Star className="w-4 h-4 text-[#FF5722] fill-[#FF5722]" />
              <span className="text-sm text-gray-600">
                {recipe.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              className="flex-1 bg-[#E64300] text-[#FAFAFA] border-[#E64300] hover:bg-[#FFE0D9]"
            >
              教學開始
            </Button>
          </div>
        </div>

        {/* 作者資訊 */}
        <div className={cardStyles()}>
          <div className={authorContainerStyles}>
            <Avatar className="w-10 h-10">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt={`${author.name}的頭像`}
              />
              <AvatarFallback>
                {author.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{author.name}</p>
              <p className="text-xs text-gray-500">
                {author.followersCount} 粉絲
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-8 ${following ? 'bg-gray-100' : ''}`}
              onClick={atFollowClick}
            >
              {following ? '取消追蹤' : '追蹤'}
            </Button>
          </div>
        </div>

        {/* 食譜描述 */}
        <div className={cardStyles()}>
          <p className="text-sm text-gray-700 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* 食譜標籤 */}
        {tags.length > 0 && (
          <div className={cardStyles()}>
            <h3 className={headingStyles()}>料理標籤</h3>
            {renderRecipeTags()}
          </div>
        )}

        {/* 食材清單 */}
        {regularIngredients.length > 0 && (
          <div className={cardStyles()}>
            <h3 className={headingStyles({ size: 'small' })}>食材清單</h3>
            <div className={ingredientListStyles}>
              {regularIngredients.map((ingredient, index) => (
                <div key={ingredient.ingredientId}>
                  <div className={separatedItemStyles()}>
                    <span className="text-sm">{ingredient.ingredientName}</span>
                    <span className="text-sm text-gray-500">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                  {index < regularIngredients.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 調味料 */}
        {flavorings.length > 0 && (
          <div className={cardStyles()}>
            <h3 className={headingStyles({ size: 'small' })}>調味料</h3>
            <div className={ingredientListStyles}>
              {flavorings.map((flavor, index) => (
                <div key={flavor.ingredientId}>
                  <div className={separatedItemStyles()}>
                    <span className="text-sm">{flavor.ingredientName}</span>
                    <span className="text-sm text-gray-500">
                      {flavor.amount} {flavor.unit}
                    </span>
                  </div>
                  {index < flavorings.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 推薦產品 */}
        <div className={cardStyles()}>
          <div className="space-y-4">
            <ProductCard
              id="1"
              name="金醬醬油"
              description="經典釀造，香氣濃郁，適合各種料理使用"
              price={120}
              imageUrl="/Rectangle 70.png"
            />
            <ProductCard
              id="2"
              name="金醬醬油"
              description="經典釀造，香氣濃郁，適合各種料理使用"
              price={120}
              imageUrl="/Rectangle 70.png"
            />
            <ProductCard
              id="3"
              name="金醬醬油"
              description="經典釀造，香氣濃郁，適合各種料理使用"
              price={120}
              imageUrl="/Rectangle 70.png"
            />
            <ProductCard
              id="4"
              name="金醬醬油"
              description="經典釀造，香氣濃郁，適合各種料理使用"
              price={120}
              imageUrl="/Rectangle 70.png"
            />
          </div>
        </div>

        {/* 社交互動區塊 */}
        <div className={cardStyles()}>
          <div className={interactionContainerStyles}>
            <button
              className={cn(
                interactionButtonStyles(),
                liked && interactionButtonStyles({ state: 'active' }),
              )}
              onClick={atLikeClick}
              aria-label="點收藏"
            >
              <Bookmark
                className={`w-5 h-5 ${liked ? 'fill-[#FF5722] text-[#FF5722]' : ''}`}
              />
              <span>收藏</span>
            </button>
            <button
              className={cn(
                interactionButtonStyles(),
                showReview && interactionButtonStyles({ state: 'active' }),
              )}
              onClick={atCommentClick}
              aria-label="留言"
            >
              <MessageSquare
                className={`w-5 h-5 ${showReview ? 'fill-[#FF5722] text-[#FF5722]' : ''}`}
              />
              <span>留言</span>
              <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                24
              </span>
            </button>
            <button
              className={interactionButtonStyles()}
              onClick={atShareClick}
              aria-label="分享"
            >
              <Share2 className="w-5 h-5" />
              <span>分享</span>
            </button>
          </div>

          {showReview && (
            <div className="mt-4">
              <Review />
            </div>
          )}
        </div>

        {/* 評論區 */}
        <div className={cardStyles()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={headingStyles()}>用戶評論</h3>
          </div>

          <div className={reviewListStyles}>
            <ReviewDisplay
              comment="我嘗試了這個食譜，真的非常美味！肉質軟嫩，醬汁香濃，全家人都很喜歡！我會再做一次，100%！"
              username="料理愛好者"
              userRating={4.5}
            />

            <ReviewDisplay
              comment="這個食譜很棒，但我建議多加一點五香粉，會讓味道更豐富。整體來說非常推薦！"
              username="美食探險家"
              userRating={4.0}
            />

            <ReviewDisplay
              comment="步驟清晰明瞭，即使是新手也能輕鬆完成。成品美味可口，朋友們都讚不絕口！"
              username="烹飪新手"
              userRating={5.0}
            />

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-gray-500"
            >
              查看更多
            </Button>
          </div>
        </div>
      </main>

      {/* 底部導航 */}
      <footer className="bg-white border-t">
        <div className="flex justify-around py-3">
          <button className={footerNavItemStyles} aria-label="首頁">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs text-gray-500">首頁</span>
          </button>
          <button className={footerNavItemStyles} aria-label="分類">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <span className="text-xs text-gray-500">分類</span>
          </button>
          <button className={footerNavItemStyles} aria-label="收藏">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs text-gray-500">收藏</span>
          </button>
          <button className={footerNavItemStyles} aria-label="我的">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs text-gray-500">我的</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
