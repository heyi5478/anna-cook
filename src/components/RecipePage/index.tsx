import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Clock, Star, MessageSquare, Share2, ThumbsUp } from 'lucide-react';

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

/**
 * 食譜詳情頁面元件，顯示食譜的完整資訊、社交互動和評論
 */
export default function RecipePage() {
  // 狀態管理
  const [liked, setLiked] = useState(false);
  const [showReview, setShowReview] = useState(false);

  /**
   * 處理按讚事件
   */
  const atLikeClick = () => {
    setLiked(!liked);
  };

  /**
   * 處理留言事件
   */
  const atCommentClick = () => {
    setShowReview(!showReview);
  };

  /**
   * 處理分享事件，使用 Web Share API
   */
  const atShareClick = async () => {
    const recipeTitle = '家傳滷五花肉';
    const recipeDesc =
      '這是我家傳的五花肉滷肉食譜，香氣四溢，肉質軟嫩多汁。醬汁經過多年改良，滋味濃郁！';

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
    const tags = ['五花肉', '滷味', '家常菜', '醬油', '簡單'];

    return (
      <div className={tagsContainerStyles}>
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="rounded-lg py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {tag}
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
        <span className="text-gray-700">家傳滷五花肉</span>
      </div>

      <main className="flex-1">
        {/* 食譜主圖 */}
        <div className={mainImageStyles}>
          <Image
            src="/placeholder.svg?height=500&width=500"
            alt="家傳滷五花肉"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 食譜標題 */}
        <div className={cardStyles({ spacing: 'none' })}>
          <h1 className={headingStyles({ size: 'large' })}>家傳滷五花肉</h1>

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
              <span className="text-sm text-gray-600">2人份</span>
            </div>

            <div className={recipeInfoItemStyles}>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">25分鐘</span>
            </div>

            <div className={recipeInfoItemStyles}>
              <Star className="w-4 h-4 text-[#FF5722] fill-[#FF5722]" />
              <span className="text-sm text-gray-600">4.5</span>
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
                alt="作者頭像"
              />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">料理達人</p>
              <p className="text-xs text-gray-500">10,000 粉絲</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">
              關注
            </Button>
          </div>
        </div>

        {/* 食譜描述 */}
        <div className={cardStyles()}>
          <p className="text-sm text-gray-700 leading-relaxed">
            這是我家傳的五花肉滷肉食譜，香氣四溢，肉質軟嫩多汁。醬汁經過多年改良，滋味濃郁，搭配白飯絕配！這道料理簡單易做，但口味卻非常豐富。醬汁可以保存起來重複使用，越滷越香。希望大家喜歡這道家常美味！
          </p>
        </div>

        {/* 食譜標籤 */}
        <div className={cardStyles()}>
          <h3 className={headingStyles()}>料理標籤</h3>
          {renderRecipeTags()}
        </div>

        {/* 食材清單 */}
        <div className={cardStyles()}>
          <h3 className={headingStyles({ size: 'small' })}>食材清單</h3>
          <div className={ingredientListStyles}>
            <div className={separatedItemStyles()}>
              <span className="text-sm">五花肉</span>
              <span className="text-sm text-gray-500">500 克</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">大蒜</span>
              <span className="text-sm text-gray-500">4 粒</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">薑片</span>
              <span className="text-sm text-gray-500">2 片</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">紅蔥頭</span>
              <span className="text-sm text-gray-500">2 個</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">蔥段</span>
              <span className="text-sm text-gray-500">2 根</span>
            </div>
          </div>
        </div>

        {/* 調味料 */}
        <div className={cardStyles()}>
          <h3 className={headingStyles({ size: 'small' })}>調味料</h3>
          <div className={ingredientListStyles}>
            <div className={separatedItemStyles()}>
              <span className="text-sm">醬油</span>
              <span className="text-sm text-gray-500">3 大匙</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">冰糖</span>
              <span className="text-sm text-gray-500">2 大匙</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">料酒</span>
              <span className="text-sm text-gray-500">2 大匙</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">五香粉</span>
              <span className="text-sm text-gray-500">1/2 小匙</span>
            </div>
            <Separator />
            <div className={separatedItemStyles()}>
              <span className="text-sm">清水</span>
              <span className="text-sm text-gray-500">400 毫升</span>
            </div>
          </div>
        </div>

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
              aria-label="點讚"
            >
              <ThumbsUp
                className={`w-5 h-5 ${liked ? 'fill-[#FF5722] text-[#FF5722]' : ''}`}
              />
              <span>讚</span>
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
              stroke="#FF5722"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="text-xs text-[#FF5722]">收藏</span>
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
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
            </svg>
            <span className="text-xs text-gray-500">我的</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
